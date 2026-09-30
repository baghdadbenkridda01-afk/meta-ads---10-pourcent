"""Merge cleaned ads + Jev labels + Claude labels into the final CSV."""
import csv, json, sys
ads, jev, out = sys.argv[1], sys.argv[2], sys.argv[3]
sys.path.insert(0, __file__.rsplit("/", 1)[0])
from claude_labels import L
J = {r["ad_id"]: r for r in json.load(open(jev))}
def ugc_of(a, j):
    if a["format"] == "video" and not a["video_transcript"]:
        return "unknown"
    return "yes" if j["jev_is_ugc"] >= 0.65 else "no"


rows = []
for a in json.load(open(ads)):
    j, c = J[a["ad_id"]], L[a["ad_id"]]
    aw = round(j["jev_awareness_score"]["score"])
    rows.append({
        **{k: a[k] for k in ("ad_id", "brand", "country", "format", "start_date", "days_running")},
        "likely_winner": a["days_running"] >= 30,
        **{k: a[k] for k in ("variations", "cta", "headline", "copy", "video_transcript", "destination", "ad_library_url")},
        "jev_hook": j["jev_hook"], "claude_hook": c[0], "hook_agree": j["jev_hook"] == c[0],
        "jev_ugc": ugc_of(a, j), "claude_ugc": c[5], "ugc_agree": ugc_of(a, j) == c[5],
        "jev_angle": j["jev_angle"], "claude_angle": c[1], "angle_agree": j["jev_angle"] == c[1],
        "jev_offer": j["jev_offer"], "claude_offer": c[2], "offer_agree": j["jev_offer"] == c[2],
        "jev_awareness": ["unaware", "problem_aware", "solution_aware", "product_aware", "most_aware"][aw], "jev_awareness_score": round(j["jev_awareness_score"]["score"], 2),
        "claude_awareness": ["unaware", "problem_aware", "solution_aware", "product_aware", "most_aware"][c[3]], "awareness_agree": aw == c[3],
        "jev_cta_strength": round(j["jev_cta_strength"]["score"], 2), "claude_cta_strength": c[4],
    })
with open(out, "w", newline="", encoding="utf-8-sig") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
n = len(rows)
for k in ("hook", "angle", "offer", "awareness", "ugc"):
    print(k, f"agreement {sum(r[k + '_agree'] for r in rows)}/{n}")
