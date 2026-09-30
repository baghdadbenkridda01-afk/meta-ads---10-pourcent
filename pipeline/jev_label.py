"""Label cleaned ads with Jev (one request per ad, five questions) via OpenRouter."""
import json, os, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

SRC, OUT = sys.argv[1], sys.argv[2]
KEY = os.environ["OPENROUTER_API_KEY"]
URL = "https://openrouter.ai/api/v1/systemone"
MODEL = "typesafe/jev-1.13"

HOOKS = {
    "pain_point": "Names a specific problem the viewer is living with right now (e.g. 'les courses coûtent trop cher', 'tu perds de l'argent') and opens on that frustration. Not just a benefit or a deal.",
    "bold_claim": "Opens with a strong, absolute or surprising statement or number that is not about the viewer's problem (e.g. 'Payer le bon prix à chaque achat', 'chaque dépense vous rapporte').",
    "curiosity": "Opens with a teaser or open loop that withholds the answer (e.g. 'N'achetez rien sur Amazon avant de voir ça', 'Il te reste combien à la fin du mois ?').",
    "question": "Opens with a direct question to the viewer that invites a yes/no or 'what if' reflection (e.g. 'Et si vos achats vous rapportaient du cashback ?', 'Pourquoi payer plus quand tu peux payer moins ?').",
    "social_proof": "Opens with other people's results, testimonials, ratings or user counts (e.g. 'Déjà 5 millions d'utilisateurs').",
    "how_to": "Opens by promising to show the viewer how to do something (e.g. 'Je te montre comment gagner de l'argent sur tes courses', 'Toi aussi tu peux...').",
    "offer": "Opens with a discount, bonus, free trial or other concrete deal stated as the very first thing.",
}
OFFERS = {
    "discount": "A percentage or amount off, or a coupon.",
    "free_trial": "Free trial or free access period.",
    "bundle": "Several products or services packaged together.",
    "guarantee": "Money-back or satisfaction guarantee.",
    "free_shipping": "Free delivery or shipping.",
    "direct_offer": "A direct, concrete deal stated plainly in the ad (e.g. cashback, a bonus amount, money back on purchases) that does not fit the other types.",
    "none": "No offer is stated.",
}
ANGLES = {
    "pain": "Leads with a problem or cost of inaction.",
    "desire": "Leads with an aspirational outcome or benefit the viewer wants.",
    "social_proof": "Leads with what other people say or do.",
    "offer": "Leads with a deal.",
    "authority": "Leads with expertise, credentials, press or official backing.",
    "curiosity": "Leads with a teaser or secret.",
    "comparison": "Leads with a comparison to alternatives or to life before/after.",
    "ugc": "Leads with an everyday person talking to camera or sharing their own experience.",
    "other": "None of the above.",
}


def questions():
    return {
        "hook": {"type": "choice", "instructions": "Which type of hook does this ad open with? Judge the first line of the copy and, for video, the first words of the spoken transcript.", "criteria": HOOKS},
        "angle": {"type": "choice", "instructions": "What is the main persuasion angle of this ad?", "criteria": ANGLES},
        "offer": {"type": "choice", "instructions": "What kind of offer does this ad make to the viewer?", "criteria": OFFERS},
        "awareness": {"type": "score", "instructions": "What is the target viewer's level of awareness (Eugene Schwartz) that this ad is written for?",
                      "criteria": [
                          "Unaware: the viewer does not know they have a problem; the ad tries to make them notice it.",
                          "Problem aware: the viewer feels the problem; the ad describes it but does not yet present a solution.",
                          "Solution aware: the viewer knows solutions of this kind exist; the ad explains why this type of solution works.",
                          "Product aware: the viewer knows this specific product; the ad shows why it beats alternatives.",
                          "Most aware: the viewer already wants this product; the ad just gives a reason or deal to act now."]},
        "cta_strength": {"type": "score", "instructions": "How strong and clear is the call to action, taking into account the ad copy and the CTA button?",
                         "criteria": ["No real call to action", "Vague or passive invitation", "Clear but generic action", "Specific action with a stated benefit", "Specific, urgent action with a concrete benefit"]},
        "landing_page": {"type": "noul", "instructions": "Does the destination point to an app store page (App Store or Google Play) rather than a website?",
                         "criteria": {"true": "The destination URL is an app store listing.", "false": "The destination is a regular website."}},
    }


def call(ad):
    state = {"copy": ad["copy"], "headline": ad["headline"], "cta_button": ad["cta"], "format": ad["format"],
             "destination": ad["destination"], "days_running": ad["days_running"]}
    if ad.get("video_transcript"):
        state["video_transcript_first_seconds"] = ad["video_transcript"]
    body = json.dumps({"model": MODEL, "state": state, "questions": questions()}).encode()
    for attempt in range(5):
        req = urllib.request.Request(URL, body, {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
        try:
            return json.load(urllib.request.urlopen(req, timeout=60))
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503):
                time.sleep(2 ** attempt); continue
            raise RuntimeError(e.read().decode())
    raise RuntimeError("retries exhausted")


def label(ad):
    r = call(ad)
    a = r["answers"]
    return {"ad_id": ad["ad_id"], "jev_hook": a["hook"]["choice"], "jev_hook_conf": round(a["hook"]["confidence"], 2),
            "jev_angle": a["angle"]["choice"], "jev_angle_conf": round(a["angle"]["confidence"], 2),
            "jev_offer": a["offer"]["choice"], "jev_offer_conf": round(a["offer"]["confidence"], 2),
            "jev_awareness_score": a["awareness"], "jev_cta_strength": a["cta_strength"],
            "jev_destination_is_app_store": a["landing_page"], "jev_model": r["model"], "jev_cost_usd": r["usage"].get("cost")}


ads = json.load(open(SRC))
with ThreadPoolExecutor(8) as ex:
    res = list(ex.map(label, ads))
json.dump(res, open(OUT, "w"), ensure_ascii=False, indent=1)
print(f"{len(res)} labeled, cost ${sum(r['jev_cost_usd'] or 0 for r in res):.5f}")
