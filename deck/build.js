const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

// Palette (validated with dataviz validate_palette.js): 10% coral, Joko violet, Ibotta teal
const C = { ten: "EF4B4B", joko: "5B5BD6", ibotta: "0E9E8C", ink: "1B1B2F", sun: "FFD93D", paper: "FFFFFF", muted: "5A5A6E", grid: "E4E4EA", note: "FFF3A8" };
const HEAD = "Bookman Old Style";
const BODY = "Calibri";

async function icon(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Cartoon "sticker": thick ink outline + hard offset shadow (fresh objects every call)
const shadow = () => ({ type: "outer", color: C.ink, blur: 0, offset: 5, angle: 45, opacity: 1 });
function sticker(slide, pres, x, y, w, h, fill = C.paper, extra = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.15, fill: { color: fill }, line: { color: C.ink, width: 2.5 }, shadow: shadow(), ...extra });
}
function bubble(slide, pres, x, y, w, h, text, opts = {}) {
  slide.addText(text, {
    shape: pres.shapes.WEDGE_ROUND_RECT_CALLOUT, x, y, w, h, isTextBox: true,
    fill: { color: opts.fill || C.paper }, line: { color: C.ink, width: 2.5 }, shadow: shadow(),
    fontFace: BODY, fontSize: opts.fontSize || 15, bold: !!opts.bold, italic: !!opts.italic, color: C.ink,
    align: "center", valign: "middle", margin: 8, rotate: opts.rotate || 0,
  });
}
function title(slide, text, color = C.ink, size = 28) {
  slide.addText(text, { x: 0.5, y: 0.3, w: 9, h: 0.9, isTextBox: true, fontFace: HEAD, fontSize: size, bold: true, color, valign: "top", margin: 0 });
}
function num(slide, pres, n, x, y, color) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: 0.55, h: 0.55, fill: { color }, line: { color: C.ink, width: 2 } });
  slide.addText(String(n), { x, y, w: 0.55, h: 0.55, isTextBox: true, fontFace: HEAD, fontSize: 20, bold: true, color: C.paper, align: "center", valign: "middle", margin: 0 });
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625
  pres.title = "the report you never asked for";

  const icSearch = await icon(fa.FaSearch, C.ink);
  const icSherlock = await icon(fa.FaUserSecret, C.ink);
  const icShrug = await icon(fa.FaRegMeh, C.ink);
  const icBox = await icon(fa.FaBoxOpen, C.ink);
  const icBaby = await icon(fa.FaBaby, C.ink);
  const icHand = await icon(fa.FaHandshake, C.ink);

  // ---------- Slide 1: title ----------
  let s = pres.addSlide();
  s.background = { color: C.sun };
  s.addText("the report you never asked for", { x: 0.5, y: 0.9, w: 6.6, h: 1.9, isTextBox: true, fontFace: HEAD, fontSize: 44, bold: true, color: C.ink, valign: "top", margin: 0 });
  bubble(s, pres, 6.7, 0.55, 2.8, 1.1, "…but pls read it", { fontSize: 20, bold: true });
  s.addText("some insights from 10%, Joko & Ibotta, scrapées le 30 septembre 2026", { x: 0.5, y: 2.85, w: 6.2, h: 0.6, isTextBox: true, fontFace: BODY, fontSize: 17, italic: true, color: C.ink, margin: 0 });
  sticker(s, pres, 0.5, 3.75, 6.2, 1.25);
  s.addText("J'ai récupéré toutes les pubs actives de 10%, Joko et Ibotta, soit 335 pubs. J'ai transcrit les vidéos et classé chaque pub par hook, angle, niveau de conscience et format.", { x: 0.7, y: 3.8, w: 5.8, h: 1.15, isTextBox: true, fontFace: BODY, fontSize: 14, color: C.ink, valign: "middle", margin: 0 });
  s.addShape(pres.shapes.OVAL, { x: 7.35, y: 2.3, w: 2.1, h: 2.1, fill: { color: C.paper }, line: { color: C.ink, width: 3 }, shadow: shadow() });
  s.addImage({ data: icSearch, x: 7.85, y: 2.8, w: 1.1, h: 1.1 });
  // brand chips
  [["10%", C.ten], ["Joko", C.joko], ["Ibotta", C.ibotta]].forEach(([t, col], i) => {
    s.addText(t, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.15, x: 7.0 + i * 0.95, y: 4.65, w: 0.85, h: 0.4, isTextBox: true, fill: { color: col }, line: { color: C.ink, width: 2 }, fontFace: BODY, fontSize: 12, bold: true, color: C.paper, align: "center", valign: "middle", margin: 0 });
  });

  // ---------- Slide 2: testing speed ----------
  s = pres.addSlide();
  s.background = { color: C.paper };
  num(s, pres, 1, 0.5, 0.35, C.ten);
  s.addText("Joko et Ibotta testent beaucoup plus vite", { x: 1.2, y: 0.35, w: 8.3, h: 0.55, isTextBox: true, fontFace: HEAD, fontSize: 23, bold: true, color: C.ink, valign: "middle", margin: 0 });
  sticker(s, pres, 0.5, 1.2, 5.6, 3.3);
  s.addChart(pres.charts.BAR, [
    { name: "10%", labels: ["6 août", "13 août", "20 août", "27 août", "3 sept", "10 sept", "17 sept", "24 sept"], values: [6, 6, 4, 1, 0, 11, 3, 2] },
    { name: "Joko", labels: ["6 août", "13 août", "20 août", "27 août", "3 sept", "10 sept", "17 sept", "24 sept"], values: [6, 0, 15, 3, 10, 13, 14, 69] },
    { name: "Ibotta", labels: ["6 août", "13 août", "20 août", "27 août", "3 sept", "10 sept", "17 sept", "24 sept"], values: [0, 4, 0, 0, 20, 4, 42, 25] },
  ], {
    x: 0.6, y: 1.3, w: 5.4, h: 3.1, barDir: "col", barGrouping: "clustered", barGapWidthPct: 60,
    chartColors: [C.ten, C.joko, C.ibotta],
    showTitle: true, title: "Pubs actives, par semaine de lancement", titleFontFace: BODY, titleFontSize: 12, titleColor: C.ink,
    showLegend: true, legendPos: "t", legendFontFace: BODY, legendFontSize: 11, legendColor: C.ink,
    catAxisLabelColor: C.muted, catAxisLabelFontSize: 9, catAxisLabelFontFace: BODY,
    valAxisLabelColor: C.muted, valAxisLabelFontSize: 9, valAxisLabelFontFace: BODY,
    valGridLine: { color: C.grid, size: 0.75 }, catGridLine: { style: "none" },
  });
  // big numbers
  [["69", "Joko", C.joko], ["25", "Ibotta", C.ibotta], ["2", "10%", C.ten]].forEach(([n, b, col], i) => {
    const y = 1.2 + i * 0.78;
    s.addText(n, { x: 6.3, y, w: 1.0, h: 0.68, isTextBox: true, fontFace: HEAD, fontSize: 36, bold: true, color: col, align: "right", valign: "middle", margin: 0 });
    s.addText([{ text: b, options: { bold: true, breakLine: true } }, { text: "nouvelles pubs en 7 jours" }], { x: 7.4, y, w: 2.2, h: 0.68, isTextBox: true, fontFace: BODY, fontSize: 12, color: C.ink, valign: "middle", margin: 0 });
  });
  s.addText("Joko en a sorti 45 le même jour. Une seule phrase, « T'as pas Joko ? Alors t'as sûrement déjà perdu 200€ », revient sur 99 de ses pubs, et ce sont les vidéos en dessous qui changent.", { x: 6.45, y: 3.6, w: 3.1, h: 1.2, isTextBox: true, fontFace: BODY, fontSize: 11.5, color: C.ink, valign: "top", margin: 0 });
  s.addImage({ data: icSherlock, x: 0.55, y: 4.72, w: 0.6, h: 0.6 });
  bubble(s, pres, 1.35, 4.72, 5.5, 0.62, "Oui, c'est évident, et c'est sûrement pour ça que vous recrutez (no shit, Sherlock).", { fontSize: 12.5, italic: true, fill: C.sun });

  // ---------- Slide 3: awareness ----------
  s = pres.addSlide();
  s.background = { color: C.paper };
  num(s, pres, 2, 0.5, 0.35, C.ten);
  s.addText("Presque toutes les pubs de 10% parlent à des gens qui cherchent déjà une appli de cashback", { x: 1.2, y: 0.3, w: 8.3, h: 0.9, isTextBox: true, fontFace: HEAD, fontSize: 21, bold: true, color: C.ink, valign: "middle", margin: 0 });
  sticker(s, pres, 0.5, 1.45, 4.5, 2.55);
  s.addChart(pres.charts.BAR, [{ name: "Pubs qui présentent l'appli", labels: ["10%", "Joko", "Ibotta"], values: [93, 33, 67] }], {
    x: 0.6, y: 1.55, w: 4.3, h: 2.35, barDir: "bar", barGapWidthPct: 45,
    chartColors: [C.ten, C.joko, C.ibotta],
    showTitle: true, title: "% des pubs qui présentent l'appli (solution-aware)", titleFontFace: BODY, titleFontSize: 11, titleColor: C.ink,
    showLegend: false, showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"', dataLabelColor: C.ink, dataLabelFontSize: 12, dataLabelFontBold: true, dataLabelFontFace: BODY,
    catAxisLabelColor: C.ink, catAxisLabelFontSize: 12, catAxisLabelFontFace: BODY, catAxisOrientation: "maxMin",
    valAxisHidden: true, valAxisMaxVal: 110, valAxisMinVal: 0,
    valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  s.addText("93% des pubs de 10% présentent l'appli, contre 33% chez Joko et 67% chez Ibotta. Leurs autres pubs parlent du problème : les courses qui coûtent trop cher, l'argent qu'on laisse en caisse.", { x: 5.35, y: 1.45, w: 4.15, h: 1.15, isTextBox: true, fontFace: BODY, fontSize: 13, color: C.ink, valign: "top", margin: 0 });
  s.addText("It's probably meant to build awareness, but it still shrinks the market: you only reach solution-aware people who are already looking for an app. What about everyone higher up the funnel?", { x: 5.35, y: 2.65, w: 4.15, h: 1.3, isTextBox: true, fontFace: BODY, fontSize: 13, bold: true, color: C.ink, valign: "top", margin: 0 });
  // sticky note disclaimer
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.3, w: 8.4, h: 0.95, fill: { color: C.note }, line: { color: C.ink, width: 2 }, shadow: shadow(), rotate: -1 });
  s.addImage({ data: icShrug, x: 1.0, y: 4.5, w: 0.55, h: 0.55 });
  s.addText("Also, the Meta algorithm seems to like having ads at different awareness levels, and uses them for retargeting. Disclaimer: I have zero proof 🤷 I heard it on Instagram, source: trust me bro.", { x: 1.75, y: 4.35, w: 7.3, h: 0.85, isTextBox: true, fontFace: BODY, fontSize: 12, italic: true, color: C.ink, valign: "middle", margin: 0, rotate: -1 });

  // ---------- Slide 4: catalog ads ----------
  s = pres.addSlide();
  s.background = { color: C.paper };
  num(s, pres, 3, 0.5, 0.35, C.ten);
  s.addText("10% a un catalogue de 1 300 produits, mais aucune pub catalogue", { x: 1.2, y: 0.35, w: 8.3, h: 0.55, isTextBox: true, fontFace: HEAD, fontSize: 24, bold: true, color: C.ink, valign: "middle", margin: 0 });
  const cards = [
    ["Ibotta", "32", "pubs catalogue", "20 tournent depuis 30+ jours, la plus ancienne depuis 483 jours", C.ibotta],
    ["Joko", "7", "pubs catalogue", "5 tournent depuis 30+ jours, jusqu'à 188 jours (sa pub la plus ancienne)", C.joko],
    ["10%", "0", "pub catalogue", "…pour 1 300 produits éligibles", C.ten],
  ];
  cards.forEach(([b, n, lbl, sub, col], i) => {
    const x = 0.5 + i * 3.1;
    sticker(s, pres, x, 1.25, 2.8, 2.75, i === 2 ? C.sun : C.paper);
    s.addText(b, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12, x: x + 0.2, y: 1.4, w: 1.1, h: 0.38, isTextBox: true, fill: { color: col }, line: { color: C.ink, width: 2 }, fontFace: BODY, fontSize: 12, bold: true, color: C.paper, align: "center", valign: "middle", margin: 0 });
    s.addText(n, { x: x + 0.2, y: 1.85, w: 2.4, h: 0.95, isTextBox: true, fontFace: HEAD, fontSize: 60, bold: true, color: i === 2 ? C.ten : col, valign: "middle", margin: 0 });
    s.addText(lbl, { x: x + 0.2, y: 2.8, w: 2.4, h: 0.3, isTextBox: true, fontFace: BODY, fontSize: 13, bold: true, color: C.ink, margin: 0 });
    s.addText(sub, { x: x + 0.2, y: 3.12, w: 2.4, h: 0.8, isTextBox: true, fontFace: BODY, fontSize: 11.5, color: C.ink, valign: "top", margin: 0 });
  });
  s.addImage({ data: icBox, x: 0.55, y: 4.4, w: 0.6, h: 0.6 });
  s.addText("Avec un flux « 10% remboursés sur [produit] », Meta peut générer des centaines de variantes à partir des visuels que vous avez déjà.", { x: 1.35, y: 4.3, w: 8.15, h: 0.8, isTextBox: true, fontFace: BODY, fontSize: 14, bold: true, color: C.ink, valign: "middle", margin: 0 });

  // ---------- Slide 5: partners + method ----------
  s = pres.addSlide();
  s.background = { color: C.paper };
  num(s, pres, 4, 0.5, 0.35, C.ten);
  s.addText("Les marques partenaires sont votre avantage, et Joko arrive sur le terrain des parents", { x: 1.2, y: 0.3, w: 8.3, h: 0.9, isTextBox: true, fontFace: HEAD, fontSize: 21, bold: true, color: C.ink, valign: "middle", margin: 0 });
  // left: partners
  sticker(s, pres, 0.5, 1.45, 4.3, 1.95);
  s.addImage({ data: icHand, x: 0.7, y: 1.6, w: 0.5, h: 0.5 });
  s.addText("Pubs avec des marques partenaires", { x: 1.35, y: 1.6, w: 3.3, h: 0.5, isTextBox: true, fontFace: BODY, fontSize: 13, bold: true, color: C.ink, valign: "middle", margin: 0 });
  ["Gallia", "Blédina", "Le Petit Basque"].forEach((t, i) => {
    const w = [0.95, 1.05, 1.75][i]; const x = [0.7, 1.75, 2.9][i];
    s.addText(t, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.15, x, y: 2.35, w, h: 0.42, isTextBox: true, fill: { color: C.sun }, line: { color: C.ink, width: 2 }, fontFace: BODY, fontSize: 12, bold: true, color: C.ink, align: "center", valign: "middle", margin: 0 });
  });
  s.addText("10% est le seul des trois à en faire.", { x: 0.7, y: 2.9, w: 3.9, h: 0.35, isTextBox: true, fontFace: BODY, fontSize: 11.5, color: C.muted, margin: 0 });
  // right: Joko moms
  sticker(s, pres, 5.2, 1.45, 4.3, 1.95);
  s.addImage({ data: icBaby, x: 5.4, y: 1.6, w: 0.5, h: 0.5 });
  s.addText([{ text: "5", options: { fontFace: HEAD, fontSize: 40, bold: true, color: C.joko } }, { text: " / 13", options: { fontFace: HEAD, fontSize: 22, bold: true, color: C.ink } }], { x: 6.05, y: 1.55, w: 3.3, h: 0.7, isTextBox: true, valign: "middle", margin: 0 });
  s.addText("nouvelles vidéos créateurs de Joko (30 septembre) racontent des histoires de mamans.", { x: 5.4, y: 2.35, w: 3.9, h: 0.9, isTextBox: true, fontFace: BODY, fontSize: 12.5, color: C.ink, valign: "top", margin: 0 });
  s.addText("Des Partnership Ads avec deux ou trois marques partenaires, financées par elles, permettraient de garder ce terrain.", { x: 0.5, y: 3.6, w: 9, h: 0.45, isTextBox: true, fontFace: BODY, fontSize: 14, bold: true, color: C.ink, valign: "middle", margin: 0 });
  // method strip
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 4.3, w: 9, h: 0.9, rectRadius: 0.12, fill: { color: "F2F2F6" }, line: { color: C.ink, width: 1.5 } });
  s.addText([
    { text: "Méthode : ", options: { bold: true } },
    { text: "scraping avec Apify, transcription avec Whisper, classification testée avec Jev (TypeSafe) puis faite avec Claude, et vérifiée à la main. ", options: {} },
    { text: "Les données sont ici : [lien Google Sheet]", options: { bold: true, color: C.ten } },
  ], { x: 0.7, y: 4.35, w: 8.6, h: 0.8, isTextBox: true, fontFace: BODY, fontSize: 12, color: C.ink, valign: "middle", margin: 0 });

  await pres.writeFile({ fileName: "10pourcent_report.pptx" });
  console.log("written");
})();
