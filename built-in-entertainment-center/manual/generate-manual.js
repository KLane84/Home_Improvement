/**
 * Generate Path A color instruction manual PDF
 * Run: node generate-manual.js
 *
 * Notes:
 * - Use hex color strings only (arrays are treated as CMYK -> black boxes).
 * - Use ASCII only with Helvetica (no curly quotes / fraction glyphs).
 * - Footer must not write inside bottom margin or it loops addPage forever.
 */
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "Path-A-Build-Manual.pdf");
const PHOTO = path.join(__dirname, "..", "mockups", "mockup-path-A-photoreal.jpg");

const MARGIN = 50;
const PAGE_W = 612;
const PAGE_H = 792;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - 56;

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: MARGIN, bottom: 64, left: MARGIN, right: MARGIN },
  autoFirstPage: false,
  info: {
    Title: "Path A Built-In Entertainment Center - Build Manual",
    Author: "Home_Improvement / KLane84",
  },
});

const stream = fs.createWriteStream(OUT);
doc.pipe(stream);

let pageNum = 0;
let paintingFooter = false;

function paintFooter() {
  if (paintingFooter) return;
  paintingFooter = true;
  pageNum += 1;

  const savedX = doc.x;
  const savedY = doc.y;
  const savedBottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc.save();
  doc.font("Helvetica").fontSize(8).fillColor("#666666");
  doc.text(
    "Path A Build Manual  |  Kreg pocket holes + face screws  |  page " + pageNum,
    MARGIN,
    PAGE_H - 36,
    { width: CONTENT_W, align: "center", lineBreak: false }
  );
  doc.restore();
  doc.page.margins.bottom = savedBottom;
  doc.x = savedX;
  doc.y = savedY;
  paintingFooter = false;
}

doc.on("pageAdded", paintFooter);
doc.addPage();

function ensureSpace(needed) {
  if (doc.y + needed > BOTTOM) doc.addPage();
}

function h1(t) {
  ensureSpace(36);
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1a1a1a").text(t, { width: CONTENT_W });
  doc.moveDown(0.45);
}
function h2(t) {
  ensureSpace(28);
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#1a5080").text(t, { width: CONTENT_W });
  doc.moveDown(0.3);
}
function p(t) {
  ensureSpace(40);
  doc.font("Helvetica").fontSize(10).fillColor("#1a1a1a").text(t, { width: CONTENT_W, lineGap: 2 });
  doc.moveDown(0.4);
}
function bullet(t) {
  ensureSpace(24);
  doc.font("Helvetica").fontSize(10).fillColor("#1a1a1a").text("-  " + t, {
    width: CONTENT_W,
    indent: 8,
    lineGap: 2,
  });
}

function callout(title, body) {
  ensureSpace(100);
  const x = MARGIN;
  const y = doc.y;
  const pad = 10;
  doc.font("Helvetica-Bold").fontSize(9);
  const titleH = doc.heightOfString(title, { width: CONTENT_W - pad * 2 });
  doc.font("Helvetica").fontSize(9);
  const bodyH = doc.heightOfString(body, { width: CONTENT_W - pad * 2 });
  const h = titleH + bodyH + pad * 2 + 6;

  doc.save();
  doc.roundedRect(x, y, CONTENT_W, h, 4).fillAndStroke("#FFF5EB", "#C45A11");
  doc.fillColor("#C45A11").font("Helvetica-Bold").fontSize(9);
  doc.text(title, x + pad, y + pad, { width: CONTENT_W - pad * 2 });
  doc.fillColor("#1a1a1a").font("Helvetica").fontSize(9);
  doc.text(body, x + pad, y + pad + titleH + 4, { width: CONTENT_W - pad * 2 });
  doc.restore();
  doc.x = MARGIN;
  doc.y = y + h + 12;
}

function step(n, title, body) {
  ensureSpace(80);
  const y = doc.y;
  doc.save();
  doc.circle(MARGIN + 10, y + 8, 9).fill("#2A6BB5");
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10);
  doc.text(String(n), MARGIN + 4, y + 3, { width: 14, align: "center", lineBreak: false });
  doc.restore();

  doc.font("Helvetica-Bold").fontSize(11).fillColor("#1a1a1a");
  doc.text(title, MARGIN + 28, y, { width: CONTENT_W - 28 });
  doc.moveDown(0.15);
  doc.font("Helvetica").fontSize(10).fillColor("#1a1a1a");
  doc.text(body, MARGIN + 28, doc.y, { width: CONTENT_W - 28, lineGap: 2 });
  doc.x = MARGIN;
  doc.moveDown(0.55);
}

function board(x, y, w, h, label, fill) {
  doc.save();
  doc.roundedRect(x, y, w, h, 2).fillAndStroke(fill, "#5C4A32");
  doc.fillColor("#1a1a1a").font("Helvetica-Bold").fontSize(8);
  doc.text(label, x + 3, y + h / 2 - 5, { width: w - 6, align: "center", lineBreak: false });
  doc.restore();
}

function sectionBar(label) {
  ensureSpace(22);
  const y = doc.y;
  doc.save();
  doc.rect(MARGIN, y, CONTENT_W, 18).fill("#1A5080");
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10);
  doc.text(label, MARGIN + 10, y + 4, { width: CONTENT_W - 20, lineBreak: false });
  doc.restore();
  doc.y = y + 26;
  doc.x = MARGIN;
}

// ---- Cover ----
doc.font("Helvetica-Bold").fontSize(22).fillColor("#1a1a1a");
doc.text("Built-In Entertainment Center", MARGIN, 70, {
  width: CONTENT_W,
  align: "center",
});
doc.moveDown(0.25);
doc.font("Helvetica-Bold").fontSize(15).fillColor("#2A6BB5");
doc.text("Path A - Build & Install Manual", { width: CONTENT_W, align: "center" });
doc.moveDown(0.4);
doc.font("Helvetica").fontSize(10).fillColor("#555555");
doc.text(
  "Colored cut guides and step-by-step assembly\nJoinery: Kreg pocket holes (primary) | face screws where noted",
  { width: CONTENT_W, align: "center", lineGap: 3 }
);
doc.moveDown(0.7);

if (fs.existsSync(PHOTO)) {
  const imgY = doc.y;
  const imgH = 260;
  doc.image(PHOTO, MARGIN + 20, imgY, { fit: [CONTENT_W - 40, imgH], align: "center" });
  doc.y = imgY + imgH + 16;
  doc.x = MARGIN;
}

{
  const boxY = doc.y;
  doc.save();
  doc.roundedRect(MARGIN, boxY, CONTENT_W, 78, 4).fill("#F4F6F8");
  doc.fillColor("#1a1a1a").font("Helvetica").fontSize(9);
  doc.text(
    "Design locks: centered 119\" carcass group | ~20-1/8\" open flanks | side risers 3-1/2\" (2x4 on edge) | 3/4\" side counters | shelf towers to crown | White Dove | beadboard behind unit only | TV stays wall-mounted.",
    MARGIN + 12,
    boxY + 10,
    { width: CONTENT_W - 24, lineGap: 2 }
  );
  doc.restore();
  doc.y = boxY + 90;
  doc.x = MARGIN;
}

// ---- Overview ----
doc.addPage();
h1("1. What you are building");
p(
  "Path A wraps three existing cabinets (27\" + 65\" + 27\") into one painted built-in. Side cabinets sit on 2x4 ladder risers (3-1/2\" tall). Side counters are 3/4\" plywood, stepped about 4-1/4\" above the center. Open shelf towers go to the crown. Outer wall flanks stay open (no cabinets to the wall)."
);
h2("Actual lumber sizes");
bullet("2x4 -> actual 1-1/2\" x 3-1/2\" (on edge = 3-1/2\" riser height)");
bullet("3/4\" plywood -> 0.75\" thick (verify; some sheets are 23/32\")");
bullet("Side stack AFF: 3-1/2\" + 30\" cabinet + 3/4\" counter = 34-1/4\"");
bullet("Center console: ~30\" AFF (no riser)");
h2("Joinery rules");
callout(
  "Kreg pocket holes (default)",
  "Use for riser frames and tower carcass joints (sides to top/bottom/shelves). Drill on the hidden face - inside of frames, underside of shelves."
);
callout(
  "Face / through screws (where it makes sense)",
  "- Counters into cabinet from below.\n- Cabinet down into riser rails from inside the cabinet.\n- Towers into wall studs (anti-tip).\n- Optional face screws through tower sides into shelf edges."
);

// ---- Tools ----
doc.addPage();
h1("2. Tools & materials");
h2("Tools");
bullet("Kreg pocket-hole jig, stepped bit, and driver");
bullet("Drill/driver, clamps, square, tape, level");
bullet("Circular / track saw (or table saw) for plywood");
bullet("Miter saw helpful for 2x4s");
bullet("Sander, caulk gun, paint supplies");
h2("Buy list (carcass work)");
bullet("2x4 x 8' - about 3 sticks (both risers)");
bullet("3/4\" plywood 4x8 - about 3 sheets (towers + counters; more later for face skins)");
bullet("Kreg screws: 1-1/4\" for 3/4\" plywood, longer for 2x4 (use jig chart)");
bullet("Wood glue; 1-1/4\" to 2\" wood screws for face/through fastening");
bullet("Edge banding, primer, Benjamin Moore White Dove");
bullet("Beadboard for upper center bay only");
h2("Kreg settings (typical)");
bullet("3/4\" plywood -> jig set to 3/4\"");
bullet("2x4 (1-1/2\") -> jig set to 1-1/2\"");
p("Confirm screw length with your jig chart - brands vary slightly.");

// ---- Cut maps ----
doc.addPage();
h1("3. Cut guides - board maps");
sectionBar("3A - Side risers (make 2)");
p(
  "Outer footprint 27\" W x 15\" D x 3-1/2\" H. Front/back rails 27\"; sides and stretchers 12\" (15 - 1-1/2 - 1-1/2)."
);
{
  const y = doc.y;
  board(MARGIN, y, 200, 22, "R1 FRONT  |  27\"  2x4", "#C4A574");
  board(MARGIN, y + 28, 200, 22, "R2 BACK  |  27\"  2x4", "#C4A574");
  board(MARGIN, y + 56, 95, 22, "R3 SIDE 12\"", "#C4A574");
  board(MARGIN + 105, y + 56, 95, 22, "R3 SIDE 12\"", "#C4A574");
  board(MARGIN, y + 84, 95, 22, "R4 STRETCH 12\"", "#C4A574");
  board(MARGIN + 105, y + 84, 95, 22, "R4 STRETCH 12\"", "#C4A574");
  doc.save();
  doc.rect(MARGIN + 240, y, 130, 12).fillAndStroke("#DCE6F0", "#333333");
  doc.rect(MARGIN + 240, y, 10, 75).fillAndStroke("#DCE6F0", "#333333");
  doc.rect(MARGIN + 360, y, 10, 75).fillAndStroke("#DCE6F0", "#333333");
  doc.rect(MARGIN + 240, y + 63, 130, 12).fillAndStroke("#DCE6F0", "#333333");
  doc.fillColor("#555555").font("Helvetica").fontSize(8);
  doc.text("Plan 27\" x 15\"", MARGIN + 240, y + 82, { lineBreak: false });
  doc.restore();
  doc.y = y + 110;
  doc.x = MARGIN;
}
p("Both risers together: 4x 27\" and 8x 12\" (~3 sticks of 8' 2x4).");

sectionBar("3B - Side counters (3/4\" plywood)");
{
  const y = doc.y;
  board(MARGIN, y, 170, 48, "C1  |  27\" x 16\" x 3/4\"", "#E6D5B8");
  board(MARGIN + 185, y, 170, 48, "C1  |  27\" x 16\" x 3/4\"", "#E6D5B8");
  doc.y = y + 60;
  doc.x = MARGIN;
}
p("Qty 2. 1\" front overhang past 15\"-deep cabinet. Edge-band exposed edges. Center stays lower.");

sectionBar("3C - Shelf towers (3/4\" plywood)");
p(
  "Outer 27\" x 12\". Horizontals between sides = 25-1/2\" x 12\". Height H = (floor to crown underside) - 34-1/4\". Placeholder ~58-1/4\" - measure before cutting sides."
);
{
  const y = doc.y;
  board(MARGIN, y, 30, 110, "T1", "#E6D5B8");
  doc.fillColor("#1a1a1a").font("Helvetica").fontSize(7);
  doc.text("side\n12xH\nx2", MARGIN + 2, y + 40, { width: 26, align: "center" });
  board(MARGIN + 45, y, 130, 18, "top 25-1/2 x 12", "#E6D5B8");
  board(MARGIN + 45, y + 22, 130, 18, "shelf", "#E6D5B8");
  board(MARGIN + 45, y + 44, 130, 18, "shelf", "#E6D5B8");
  board(MARGIN + 45, y + 66, 130, 18, "shelf", "#E6D5B8");
  board(MARGIN + 45, y + 88, 130, 18, "bottom", "#E6D5B8");
  doc.fillColor("#555555").font("Helvetica").fontSize(8);
  doc.text(
    "Per tower: 2 sides + top + bottom + 4 shelves.\nBoth towers: 4 sides + 12 horizontals.",
    MARGIN + 200,
    y + 40,
    { width: 250 }
  );
  doc.y = y + 125;
  doc.x = MARGIN;
}

// ---- Steps ----
doc.addPage();
h1("4. Step-by-step install");
step(
  1,
  "Measure crown (before tower cuts)",
  "At left and right tower locations, measure floor to underside of crown. H = that measurement - 34-1/4\". Write H on the cut list before cutting tower sides."
);
step(
  2,
  "Cut and pocket-screw the risers",
  "Cut 2x4 parts. Orient on edge (3-1/2\" tall). Dry-fit a 27x15 rectangle. Pocket-hole the 12\" sides and stretchers into the front/back rails from the inside. Glue, clamp, drive Kreg screws. Check square. Build two identical risers."
);
step(
  3,
  "Place risers and side cabinets",
  "Set risers on the floor with the 65\" center console as one 119\" group (~20-1/8\" open flank each side). Level. Set side cabinets on risers. From inside each cabinet, drive face screws down into the 2x4 rails (pilot holes)."
);
step(
  4,
  "Dry-fit the three units",
  "Keep only 1/8\"-1/2\" scribe gaps between units (no 6\" fillers). Confirm open flanks. Mark the wall for beadboard in the upper center bay only. Keep the TV as mounted."
);
step(
  5,
  "Cut and install side counters",
  "Cut two 27x16x3/4\" blanks. Edge-band. Set with ~1\" front overhang. From below, use face screws up into the plywood. Side tops should sit ~4-1/4\" above the center top."
);

doc.addPage();
h1("4. Install (continued)");
step(
  6,
  "Build shelf tower boxes",
  "Cut sides to measured H and horizontals to 25-1/2 x 12. Pocket-hole top, bottom, and shelves into the side panels from the underside/inside. Keep boxes square. Space shelves evenly (or use pins for adjustable shelves)."
);
step(
  7,
  "Set towers on side counters",
  "Align towers with the cabinets below. From inside the lowest bay, face-screw down through the tower bottom into the counter. Plumb each tower."
);
step(
  8,
  "Anchor towers to the wall",
  "Find studs. Use face/through screws into studs (through the tower side or a French cleat) for anti-tip. Prefer structural screws into studs over pocket holes alone."
);
step(
  9,
  "Beadboard + face skins",
  "Install beadboard on the wall between the towers only. Add plywood face skins/returns so the three units read as one White Dove built-in. Hide fasteners where possible; fill and paint."
);
step(
  10,
  "Finish",
  "Plug or fill pocket holes, sand, prime, paint White Dove. Caulk scribes. Reinstall doors. Route power to cabinet tops; plan outlet relocation behind the TV per local code."
);
h2("Weekend order");
bullet("Day 1: measure crown | cut/assemble risers | place cabinets | counters");
bullet("Day 2: build/set towers | anchor | start beadboard / skins");

// ---- Joinery ----
doc.addPage();
h1("5. Joinery quick reference");
h2("Use pocket holes for");
bullet("2x4 riser: ends of 12\" parts into front & back rails (inside face)");
bullet("Tower: top, bottom, shelves into side panels (pockets on underside)");
bullet("Later hidden cleats / plywood butt joints");
h2("Use face / through screws for");
bullet("Cabinet -> riser (inside cabinet, down into rails)");
bullet("Counter -> cabinet (from below)");
bullet("Tower -> wall studs (anti-tip)");
bullet("Tower bottom -> counter (inside lowest bay)");
h2("Avoid");
bullet("Visible pocket holes on finished White Dove faces (or plug and paint carefully)");
bullet("Glue-only structural joints");
callout(
  "Tip",
  "Clamp every pocket joint before driving screws. On plywood, use the screw type your Kreg chart lists for 3/4\" stock."
);
h2("Repo files");
bullet("build-guides/01-risers.md | 02-counters.md | 03-shelf-towers.md");
bullet("mockups/path-A-build-guide.svg | mockup-path-A-photoreal.jpg");
bullet("Cursor canvases: entertainment-center-mockups + path-a-*-cut-guide");
doc.moveDown(0.8);
doc.font("Helvetica-Oblique").fontSize(9).fillColor("#666666");
doc.text(
  "Re-check ceiling height before cutting tower sides. Follow local electrical code for any outlet work.",
  { width: CONTENT_W }
);

doc.end();
stream.on("finish", () => console.log("Wrote", OUT, "pages", pageNum));
