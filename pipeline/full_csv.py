"""Cleaned ads + per-creative Claude labels -> CSV (no Jev)."""
import csv, json, sys
from collections import OrderedDict
from joko_full_labels import G
AW = ["unaware", "problem_aware", "solution_aware", "product_aware", "most_aware"]
ads, out = sys.argv[1], sys.argv[2]
groups = OrderedDict()
for a in json.load(open(ads)):
    groups.setdefault((a["format"], a["copy"], a["headline"], a["cta"], a["video_transcript"]), []).append(a)
assert len(groups) == len(G), (len(groups), len(G))
rows = []
for (k, v), lab in zip(groups.items(), G):
    hook, angle, offer, aw, cta, ugc = lab
    for a in v:
        rows.append({"ad_id": a["ad_id"], "brand": a["brand"], "country": a["country"], "format": a["format"],
                     "start_date": a["start_date"], "days_running": a["days_running"], "likely_winner": a["days_running"] >= 30,
                     "creative_group": list(groups).index(k), "variations": a["variations"],
                     "cta": a["cta"], "headline": a["headline"], "copy": a["copy"], "video_transcript": a["video_transcript"],
                     "hook": hook, "angle": angle, "offer": offer, "awareness": AW[aw], "cta_strength": cta, "ugc": ugc,
                     "destination": a["destination"], "ad_library_url": a["ad_library_url"]})
rows.sort(key=lambda r: -r["days_running"])
with open(out, "w", newline="", encoding="utf-8-sig") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
print(len(rows), "rows,", len(groups), "creatives")
