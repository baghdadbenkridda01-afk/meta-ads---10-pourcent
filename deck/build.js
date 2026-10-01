// 10% report, restyled after the user's Canva deck "projet DV":
// cream background, black-framed whiteboards, outlined title chips with hard shadow,
// Fraunces Bold Italic titles, Poppins italic body, Architects Daughter handwriting,
// and the deck's own cartoon characters (img/ = extracted from its PPTX export).
const pptxgen = require("pptxgenjs");
const path = require("path");
const img = (n) => path.join(__dirname, "img", n);

const C = { bg: "FAF9EF", ink: "000000", text: "333132", ten: "A4193D", joko: "005B96", ibotta: "BA7A12", yellow: "F9C74F", soft: "FFF4CC", grid: "E6E4DA" };
const TITLE = "Fraunces", BODY = "Poppins", HAND = "Architects Daughter";

const hard = () => ({ type: "outer", color: C.ink, blur: 0, offset: 4, angle: 45, opacity: 1 });
function board(s, pres, x, y, w, h, fill = "FFFFFF", width = 4) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: C.ink, width } });
}
function chip(s, pres, text, x, y, w, h, size = 22) {
  s.addText(text, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12, x, y, w, h, isTextBox: true,
    fill: { color: "FFFFFF" }, line: { color: C.ink, width: 2 }, shadow: hard(),
    fontFace: TITLE, fontSize: size, bold: true, italic: true, color: C.ink, align: "left", valign: "middle", margin: [4, 12, 4, 12] });
}
function badge(s, pres, n, x, y) {
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.62, h: 0.62, fill: { color: C.yellow }, line: { color: C.ink, width: 2.5 } });
  s.addText(String(n), { x, y, w: 0.62, h: 0.62, isTextBox: true, fontFace: HAND, fontSize: 24, color: C.ink, align: "center", valign: "middle", margin: 0 });
}
function para(s, text, x, y, w, h, o = {}) {
  s.addText(text, { x, y, w, h, isTextBox: true, fontFace: BODY, fontSize: o.size || 12, italic: o.italic !== false, bold: !!o.bold, color: o.color || C.text, valign: o.valign || "top", align: o.align || "left", margin: 0 });
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "the report you never asked for";

  // ---------- 1. Title ----------
  let s = pres.addSlide(); s.background = { color: C.bg };
  board(s, pres, 0.35, 0.4, 6.9, 4.85);
  s.addText("the report you never asked for", { x: 0.7, y: 0.75, w: 6.2, h: 1.3, isTextBox: true, fontFace: TITLE, fontSize: 30, bold: true, italic: true, color: C.ink, align: "center", valign: "middle", margin: 0 });
  s.addText("…but pls read it", { x: 0.7, y: 2.0, w: 6.2, h: 0.55, isTextBox: true, fontFace: HAND, fontSize: 24, color: C.ten, align: "center", valign: "middle", margin: 0 });
  s.addImage({ path: img("image6.png"), x: 0.8, y: 2.85, w: 0.38, h: 0.38 });
  para(s, "some insights from 10%, Joko & Ibotta, scrapées le 30 septembre 2026", 1.35, 2.82, 5.6, 0.5, { size: 13, bold: true, valign: "middle" });
  s.addImage({ path: img("image6.png"), x: 0.8, y: 3.55, w: 0.38, h: 0.38 });
  para(s, "J'ai récupéré toutes les pubs actives de 10%, Joko et Ibotta, soit 335 pubs. J'ai transcrit les vidéos et classé chaque pub par hook, angle, niveau de conscience et format.", 1.35, 3.5, 5.6, 1.4, { size: 12.5 });
  s.addImage({ path: img("image3.png"), x: 6.55, y: 1.55, w: 3.15, h: 3.5 });

  // ---------- 2. Testing speed ----------
  s = pres.addSlide(); s.background = { color: C.bg };
  badge(s, pres, 1, 0.35, 0.35);
  chip(s, pres, "Joko et Ibotta testent beaucoup plus vite", 1.15, 0.33, 6.4, 0.66, 21);
  s.addImage({ path: img("image96.png"), x: 7.85, y: 0.15, w: 1.85, h: 1.12, rotate: 6 });
  board(s, pres, 0.35, 1.35, 5.75, 2.85, "FFFFFF", 3);
  const weeks = ["6 août", "13 août", "20 août", "27 août", "3 sept", "10 sept", "17 sept", "24 sept"];
  s.addChart(pres.charts.BAR, [
    { name: "10%", labels: weeks, values: [6, 6, 4, 1, 0, 11, 3, 2] },
    { name: "Joko", labels: weeks, values: [6, 0, 15, 3, 10, 13, 14, 69] },
    { name: "Ibotta", labels: weeks, values: [0, 4, 0, 0, 20, 4, 42, 25] },
  ], {
    x: 0.45, y: 1.42, w: 5.55, h: 2.7, barDir: "col", barGrouping: "clustered", barGapWidthPct: 60,
    chartColors: [C.ten, C.joko, C.ibotta],
    showTitle: true, title: "Pubs actives, par semaine de lancement", titleFontFace: BODY, titleFontSize: 11, titleColor: C.ink,
    showLegend: true, legendPos: "t", legendFontFace: BODY, legendFontSize: 10, legendColor: C.ink,
    catAxisLabelColor: C.text, catAxisLabelFontSize: 8, catAxisLabelFontFace: BODY,
    valAxisLabelColor: C.text, valAxisLabelFontSize: 8, valAxisLabelFontFace: BODY,
    valGridLine: { color: C.grid, size: 0.75 }, catGridLine: { style: "none" },
  });
  [["69", "Joko", C.joko], ["25", "Ibotta", C.ibotta], ["2", "10%", C.ten]].forEach(([n, b, col], i) => {
    const y = 1.35 + i * 0.72;
    s.addText(n, { x: 6.35, y, w: 0.95, h: 0.64, isTextBox: true, fontFace: TITLE, fontSize: 34, bold: true, italic: true, color: col, align: "right", valign: "middle", margin: 0 });
    s.addText([{ text: b, options: { bold: true, breakLine: true } }, { text: "nouvelles pubs en 7 jours" }], { x: 7.45, y, w: 2.25, h: 0.64, isTextBox: true, fontFace: BODY, fontSize: 10.5, italic: true, color: C.text, valign: "middle", margin: 0 });
  });
  para(s, "Joko en a sorti 45 le même jour. Une seule phrase, « T'as pas Joko ? Alors t'as sûrement déjà perdu 200€ », revient sur 99 de ses pubs, et ce sont les vidéos en dessous qui changent.", 6.35, 3.6, 3.3, 1.3, { size: 10.5 });
  s.addImage({ path: img("image98.png"), x: 0.4, y: 4.3, w: 0.62, h: 1.3 });
  s.addText("Oui, c'est évident, et c'est sûrement pour ça que vous recrutez (no shit, Sherlock).", { x: 1.2, y: 4.45, w: 5.0, h: 0.85, isTextBox: true, fontFace: HAND, fontSize: 15, color: C.ink, valign: "middle", margin: 0 });

  // ---------- 3. Awareness ----------
  s = pres.addSlide(); s.background = { color: C.bg };
  badge(s, pres, 2, 0.35, 0.35);
  chip(s, pres, "Presque toutes les pubs de 10% parlent à des gens qui cherchent déjà une appli de cashback", 1.15, 0.28, 8.5, 0.95, 17);
  board(s, pres, 0.35, 1.55, 4.55, 2.45, "FFFFFF", 3);
  s.addChart(pres.charts.BAR, [{ name: "Pubs qui présentent l'appli", labels: ["10%", "Joko", "Ibotta"], values: [93, 33, 67] }], {
    x: 0.45, y: 1.62, w: 4.35, h: 2.3, barDir: "bar", barGapWidthPct: 45,
    chartColors: [C.ten, C.joko, C.ibotta],
    showTitle: true, title: "% des pubs qui présentent l'appli (solution-aware)", titleFontFace: BODY, titleFontSize: 10, titleColor: C.ink,
    showLegend: false, showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"', dataLabelColor: C.ink, dataLabelFontSize: 12, dataLabelFontBold: true, dataLabelFontFace: BODY,
    catAxisLabelColor: C.ink, catAxisLabelFontSize: 11, catAxisLabelFontFace: BODY, catAxisOrientation: "maxMin",
    valAxisHidden: true, valAxisMaxVal: 115, valAxisMinVal: 0, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  para(s, "93% des pubs de 10% présentent l'appli, contre 33% chez Joko et 67% chez Ibotta. Leurs autres pubs parlent du problème : les courses qui coûtent trop cher, l'argent qu'on laisse en caisse.", 5.25, 1.55, 4.4, 1.05, { size: 11.5 });
  para(s, "It's probably meant to build awareness, but it still shrinks the market: you only reach solution-aware people who are already looking for an app. What about everyone higher up the funnel?", 5.25, 2.7, 3.4, 1.35, { size: 11.5, bold: true, color: C.ink });
  s.addImage({ path: img("image116.png"), x: 8.75, y: 2.7, w: 0.88, h: 1.24 });
  s.addImage({ path: img("image197.png"), x: 0.4, y: 4.15, w: 0.9, h: 1.35 });
  s.addText("Also, the Meta algorithm seems to like having ads at different awareness levels, and uses them for retargeting. Disclaimer: I have zero proof 🤷 I heard it on Instagram, source: trust me bro.", { x: 1.45, y: 4.25, w: 8.2, h: 1.1, isTextBox: true, fontFace: HAND, fontSize: 13.5, color: C.ink, valign: "middle", margin: 0 });

  // ---------- 4. Catalog ads ----------
  s = pres.addSlide(); s.background = { color: C.bg };
  badge(s, pres, 3, 0.35, 0.35);
  chip(s, pres, "10% a un catalogue de 1 300 produits, mais aucune pub catalogue", 1.15, 0.33, 8.5, 0.66, 18);
  [["Ibotta", "32", "pubs catalogue", "20 tournent depuis 30+ jours, la plus ancienne depuis 483 jours", C.ibotta, "FFFFFF"],
   ["Joko", "7", "pubs catalogue", "5 tournent depuis 30+ jours, jusqu'à 188 jours (sa pub la plus ancienne)", C.joko, "FFFFFF"],
   ["10%", "0", "pub catalogue", "…pour 1 300 produits éligibles", C.ten, C.soft]].forEach(([b, n, lbl, sub, col, fill], i) => {
    const x = 0.35 + i * 3.12;
    board(s, pres, x, 1.35, 2.88, 2.45, fill, 3);
    s.addText(b, { x: x + 0.22, y: 1.48, w: 2.4, h: 0.4, isTextBox: true, fontFace: HAND, fontSize: 18, color: C.ink, margin: 0 });
    s.addText(n, { x: x + 0.22, y: 1.85, w: 2.4, h: 0.85, isTextBox: true, fontFace: TITLE, fontSize: 50, bold: true, italic: true, color: col, valign: "middle", margin: 0 });
    para(s, lbl, x + 0.22, 2.72, 2.45, 0.3, { size: 12, bold: true, color: C.ink });
    para(s, sub, x + 0.22, 3.03, 2.45, 0.72, { size: 10 });
  });
  s.addImage({ path: img("image70.png"), x: 0.4, y: 3.95, w: 0.98, h: 1.6 });
  para(s, "Avec un flux « 10% remboursés sur [produit] », Meta peut générer des centaines de variantes à partir des visuels que vous avez déjà.", 1.6, 4.2, 8.0, 0.95, { size: 13.5, bold: true, color: C.ink, valign: "middle" });

  // ---------- 5. Partners & parents ----------
  s = pres.addSlide(); s.background = { color: C.bg };
  badge(s, pres, 4, 0.35, 0.35);
  chip(s, pres, "Les marques partenaires sont votre avantage, et Joko arrive sur le terrain des parents", 1.15, 0.28, 8.5, 0.95, 17);
  board(s, pres, 0.35, 1.55, 4.45, 1.75, "FFFFFF", 3);
  s.addText("Pubs avec des marques partenaires", { x: 0.55, y: 1.65, w: 4.1, h: 0.4, isTextBox: true, fontFace: HAND, fontSize: 16, color: C.ink, margin: 0 });
  [["Gallia", 0.6, 1.0], ["Blédina", 1.75, 1.15], ["Le Petit Basque", 3.05, 1.6]].forEach(([t, x, w]) => {
    s.addText(t, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.1, x, y: 2.17, w, h: 0.42, isTextBox: true, fill: { color: "FFFFFF" }, line: { color: C.ink, width: 1.5 }, shadow: hard(), fontFace: BODY, fontSize: 10.5, bold: true, italic: true, color: C.ink, align: "center", valign: "middle", margin: 0 });
  });
  s.addImage({ path: img("image6.png"), x: 0.6, y: 2.8, w: 0.3, h: 0.3 });
  para(s, "10% est le seul des trois à en faire.", 1.0, 2.78, 3.6, 0.35, { size: 11, valign: "middle" });
  board(s, pres, 5.2, 1.55, 4.45, 1.75, "FFFFFF", 3);
  s.addText([{ text: "5", options: { fontFace: TITLE, fontSize: 40, bold: true, italic: true, color: C.joko } }, { text: " / 13", options: { fontFace: TITLE, fontSize: 22, bold: true, italic: true, color: C.ink } }], { x: 5.4, y: 1.6, w: 4.0, h: 0.75, isTextBox: true, valign: "middle", margin: 0 });
  para(s, "nouvelles vidéos créateurs de Joko (30 septembre) racontent des histoires de mamans.", 5.4, 2.4, 4.05, 0.8, { size: 11.5 });
  para(s, "Des Partnership Ads avec deux ou trois marques partenaires, financées par elles, permettraient de garder ce terrain.", 0.35, 3.45, 7.9, 0.6, { size: 12.5, bold: true, color: C.ink, valign: "middle" });
  board(s, pres, 0.35, 4.2, 7.75, 1.05, "FFFFFF", 2);
  s.addText([
    { text: "Méthode : ", options: { bold: true } },
    { text: "scraping avec Apify, transcription avec Whisper, classification testée avec Jev (TypeSafe) puis faite avec Claude, et vérifiée à la main. " },
    { text: "Les données sont ici : [lien Google Sheet]", options: { bold: true, color: C.ten } },
  ], { x: 0.55, y: 4.25, w: 7.4, h: 0.95, isTextBox: true, fontFace: BODY, fontSize: 10.5, italic: true, color: C.text, valign: "middle", margin: 0 });
  s.addImage({ path: img("image10.png"), x: 8.45, y: 3.45, w: 1.2, h: 1.95 });

  await pres.writeFile({ fileName: path.join(__dirname, "10pourcent_report_dv.pptx") });
  console.log("written");
})();
