"""Raw Apify ads -> cleaned ads (placeholders dropped, days_running, format, video transcript)."""
import json, sys, datetime, subprocess, tempfile, os, urllib.request, re

RAW, OUT, COUNTRY = sys.argv[1], sys.argv[2], sys.argv[3]
LANG = COUNTRY.lower() if COUNTRY.lower() in ("fr", "en") else ("en" if COUNTRY.upper() == "US" else None)
TODAY = datetime.date.today()
PLACEHOLDER = re.compile(r"\{\{.*?\}\}")


def fmt_of(s):
    f = (s.get("displayFormat") or "").upper()
    cards = s.get("cards") or []
    if f == "VIDEO":
        return "video"
    if f == "IMAGE":
        return "static"
    return "carousel" if len(cards) > 1 else ("video" if s.get("videos") else "static")


def first_video_url(s):
    for v in (s.get("videos") or []):
        return v.get("videoHdUrl") or v.get("videoSdUrl")
    for c in (s.get("cards") or []):
        if c.get("videoHdUrl") or c.get("videoSdUrl"):
            return c.get("videoHdUrl") or c.get("videoSdUrl")


_model = None
def transcribe(url, seconds=10):
    global _model
    from faster_whisper import WhisperModel
    import imageio_ffmpeg
    if _model is None:
        _model = WhisperModel("small", compute_type="int8")
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    with tempfile.TemporaryDirectory() as t:
        mp4, wav = os.path.join(t, "v.mp4"), os.path.join(t, "v.wav")
        urllib.request.urlretrieve(url, mp4)
        subprocess.run([ff, "-y", "-loglevel", "error", "-i", mp4, "-t", str(seconds), "-ac", "1", "-ar", "16000", wav], check=True)
        segs, _ = _model.transcribe(wav, language=LANG)
        text = " ".join(x.text.strip() for x in segs).strip()
        junk = ("Sous-titres", "Musique", "Music", "Amara.org")
        return "" if len(text) < 8 or any(j in text for j in junk) and len(text) < 60 else text


out, dropped = [], []
cache = {}
for a in json.load(open(RAW)):
    s = a["snapshot"]
    cards = s.get("cards") or []
    c0 = cards[0] if cards else {}
    copy = ((s.get("body") or {}).get("text") or c0.get("body") or "").strip()
    headline = (s.get("title") or c0.get("title") or "").strip()
    if not copy:
        dropped.append((a["adArchiveID"], "no copy")); continue
    if PLACEHOLDER.search(copy) or PLACEHOLDER.search(headline):
        dropped.append((a["adArchiveID"], "template placeholder")); continue
    start = datetime.date.fromisoformat(a["startDateFormatted"][:10])
    fmt = fmt_of(s)
    vurl = first_video_url(s) if fmt == "video" else None
    transcript = ""
    if vurl:
        if vurl not in cache:
            try:
                cache[vurl] = transcribe(vurl)
            except Exception as e:
                cache[vurl] = ""
                print("transcribe failed", a["adArchiveID"], e, file=sys.stderr)
        transcript = cache[vurl]
    out.append({
        "ad_id": a["adArchiveID"],
        "brand": a["pageName"],
        "country": COUNTRY,
        "start_date": start.isoformat(),
        "days_running": (TODAY - start).days,
        "format": fmt,
        "copy": copy,
        "headline": headline,
        "cta": (s.get("ctaText") or c0.get("ctaText") or "").strip(),
        "destination": s.get("linkUrl") or c0.get("linkUrl") or s.get("caption") or "",
        "variations": a.get("collationCount"),
        "video_transcript": transcript,
        "ad_library_url": f"https://www.facebook.com/ads/library/?id={a['adArchiveID']}",
    })
json.dump(out, open(OUT, "w"), ensure_ascii=False, indent=1)
print(f"kept {len(out)}, dropped {len(dropped)}: {dropped}")
