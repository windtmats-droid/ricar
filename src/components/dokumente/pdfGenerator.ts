import jsPDF from "jspdf";
import type { VerkaeuerData } from "@/pages/Dokumente";
import type { KaufvertragData } from "./KaufvertragForm";
import type { UebergabeprotokollData } from "./UebergabeprotokollForm";
import type { RechnungData } from "./RechnungForm";

const MARGIN = 20;
const PAGE_W = 210;
const COL_W = (PAGE_W - MARGIN * 2) / 2;

function euro(n: number | string): string {
  const v = typeof n === "string" ? parseFloat(n) || 0 : n;
  return v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function addLogo(doc: jsPDF) {
  try {
    const logo = localStorage.getItem("uploadedLogo");
    if (logo) {
      doc.addImage(logo, "PNG", PAGE_W - MARGIN - 40, MARGIN, 40, 15);
    }
  } catch {}
}

function heading(doc: jsPDF, y: number, text: string): number {
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(text, MARGIN, y);
  doc.setDrawColor(180);
  doc.line(MARGIN, y + 1.5, PAGE_W - MARGIN, y + 1.5);
  return y + 7;
}

function field(doc: jsPDF, x: number, y: number, label: string, value: string, w = 80): number {
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(label, x, y);
  doc.setFontSize(9);
  doc.setTextColor(30);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(value || "–", w);
  doc.text(lines, x, y + 3.5);
  return y + 3.5 + lines.length * 3.8;
}

function checkPage(doc: jsPDF, y: number, needed = 30): number {
  if (y + needed > 280) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function signatureBlock(doc: jsPDF, y: number) {
  y = checkPage(doc, y, 40);
  y += 10;
  doc.setDrawColor(150);
  doc.line(MARGIN, y + 15, MARGIN + 70, y + 15);
  doc.line(PAGE_W - MARGIN - 70, y + 15, PAGE_W - MARGIN, y + 15);
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("Ort, Datum / Verkäufer", MARGIN, y + 20);
  doc.text("Ort, Datum / Käufer", PAGE_W - MARGIN - 70, y + 20);
}

// ---------- KAUFVERTRAG ----------
export function generateKaufvertragPdf(v: VerkaeuerData, d: KaufvertragData, nr: string): string {
  const doc = new jsPDF();
  addLogo(doc);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Kaufvertrag", MARGIN, MARGIN + 5);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Nr. ${nr}`, MARGIN, MARGIN + 11);

  let y = MARGIN + 20;

  // Verkäufer
  y = heading(doc, y, "Verkäufer");
  const vY = y;
  y = field(doc, MARGIN, y, "Firma", v.autohausName);
  y = field(doc, MARGIN, y, "Adresse", `${v.strasse}, ${v.plzOrt}`);
  y = field(doc, MARGIN, y, "Tel / E-Mail", `${v.telefon} / ${v.email}`);
  y = field(doc, MARGIN, y, "Steuernr.", v.steuernummer);
  y += 3;

  // Käufer
  y = heading(doc, y, "Käufer");
  y = field(doc, MARGIN, y, "Name", `${d.vorname} ${d.nachname}`);
  y = field(doc, MARGIN, y, "Adresse", `${d.strasse} ${d.hausnummer}, ${d.plz} ${d.ort}`);
  y = field(doc, MARGIN, y, "Geburtsdatum", d.geburtsdatum);
  y = field(doc, MARGIN, y, "Tel / E-Mail", `${d.telefon} / ${d.email}`);
  y += 3;

  // Fahrzeug
  y = checkPage(doc, y, 50);
  y = heading(doc, y, "Fahrzeugdaten");
  const fLeft = MARGIN;
  const fRight = MARGIN + COL_W;
  let ly = y, ry = y;
  ly = field(doc, fLeft, ly, "Marke / Modell", `${d.marke} ${d.modell}`);
  ry = field(doc, fRight, ry, "Typ", d.typ);
  ly = field(doc, fLeft, ly, "Erstzulassung", d.erstzulassung);
  ry = field(doc, fRight, ry, "Kilometerstand", d.kilometerstand);
  ly = field(doc, fLeft, ly, "Farbe", d.farbe);
  ry = field(doc, fRight, ry, "FIN", d.fin, 75);
  ly = field(doc, fLeft, ly, "Kennzeichen", d.kennzeichen);
  ry = field(doc, fRight, ry, "HU / TÜV bis", `${d.huBis} / ${d.tuevBis}`);
  y = Math.max(ly, ry) + 3;

  // Konditionen
  y = checkPage(doc, y, 40);
  y = heading(doc, y, "Konditionen");
  y = field(doc, MARGIN, y, "Kaufpreis (brutto)", euro(d.kaufpreis));
  if (d.mwstAusweis) {
    const brutto = parseFloat(d.kaufpreis) || 0;
    const netto = Math.round(brutto / 1.19 * 100) / 100;
    const mwst = Math.round((brutto - netto) * 100) / 100;
    y = field(doc, MARGIN, y, "davon MwSt. (19%)", euro(mwst));
    y = field(doc, MARGIN, y, "Nettobetrag", euro(netto));
  }
  y = field(doc, MARGIN, y, "Zahlungsart", d.zahlungsart);
  y = field(doc, MARGIN, y, "Übergabedatum", d.uebergabedatum);
  y = field(doc, MARGIN, y, "Gewährleistung", d.gewaehrleistung);
  y += 3;

  // Rechtliches
  y = checkPage(doc, y, 30);
  y = heading(doc, y, "Erklärungen");
  doc.setFontSize(8.5);
  doc.setTextColor(50);
  if (d.besichtigt) {
    doc.text("☑ Das Fahrzeug wurde vom Käufer besichtigt und Probe gefahren.", MARGIN, y);
    y += 5;
  }
  if (d.keineMaengel) {
    doc.text("☑ Dem Verkäufer sind keine versteckten Mängel bekannt.", MARGIN, y);
    y += 5;
  }
  if (d.sondervereinbarungen) {
    y += 2;
    y = field(doc, MARGIN, y, "Sondervereinbarungen", d.sondervereinbarungen, PAGE_W - MARGIN * 2);
  }

  signatureBlock(doc, y);
  return doc.output("datauristring");
}

// ---------- ÜBERGABEPROTOKOLL ----------
export function generateUebergabeprotokollPdf(v: VerkaeuerData, d: UebergabeprotokollData, nr: string): string {
  const doc = new jsPDF();
  addLogo(doc);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Übergabeprotokoll", MARGIN, MARGIN + 5);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Nr. ${nr}`, MARGIN, MARGIN + 11);

  let y = MARGIN + 20;

  y = heading(doc, y, "Autohaus");
  y = field(doc, MARGIN, y, "Firma", v.autohausName);
  y = field(doc, MARGIN, y, "Adresse", `${v.strasse}, ${v.plzOrt}`);
  y += 3;

  y = heading(doc, y, "Fahrzeugdaten");
  const fLeft = MARGIN, fRight = MARGIN + COL_W;
  let ly = y, ry = y;
  ly = field(doc, fLeft, ly, "Marke / Modell", `${d.marke} ${d.modell}`);
  ry = field(doc, fRight, ry, "Typ", d.typ);
  ly = field(doc, fLeft, ly, "FIN", d.fin, 75);
  ry = field(doc, fRight, ry, "Kennzeichen", d.kennzeichen);
  ly = field(doc, fLeft, ly, "Erstzulassung", d.erstzulassung);
  ry = field(doc, fRight, ry, "Farbe", d.farbe);
  y = Math.max(ly, ry) + 3;

  y = checkPage(doc, y, 50);
  y = heading(doc, y, "Übergabedetails");
  ly = y; ry = y;
  ly = field(doc, fLeft, ly, "Datum / Uhrzeit", `${d.uebergabedatum} ${d.uhrzeit}`);
  ry = field(doc, fRight, ry, "KM bei Übergabe", d.kmBeiUebergabe);
  ly = field(doc, fLeft, ly, "Tankfüllung", d.tankfuellung);
  ry = field(doc, fRight, ry, "Schlüssel", d.anzahlSchluessel);
  ly = field(doc, fLeft, ly, "Bordbücher", d.anzahlBordbuecher);
  ry = field(doc, fRight, ry, "Reifenzustand", d.reifenzustand);
  ly = field(doc, fLeft, ly, "Felgentyp", d.felgentyp);
  y = Math.max(ly, ry) + 3;

  // Zubehör
  y = checkPage(doc, y, 30);
  y = heading(doc, y, "Zubehör");
  doc.setFontSize(8.5);
  doc.setTextColor(50);
  const zubehoer = [
    [d.zubehoerErsatzrad, "Ersatzrad/Notrad"],
    [d.zubehoerVerbandskasten, "Verbandskasten"],
    [d.zubehoerWarndreieck, "Warndreieck"],
    [d.zubehoerFussmatten, "Fußmatten"],
    [d.zubehoerAhk, "Anhängerkupplung"],
  ] as const;
  zubehoer.forEach(([checked, label]) => {
    doc.text(`${checked ? "☑" : "☐"} ${label}`, MARGIN, y);
    y += 4.5;
  });

  if (d.vorhandeneMaengel) {
    y += 2;
    y = field(doc, MARGIN, y, "Vorhandene Mängel", d.vorhandeneMaengel, PAGE_W - MARGIN * 2);
  }
  if (d.notizen) {
    y = field(doc, MARGIN, y, "Notizen", d.notizen, PAGE_W - MARGIN * 2);
  }

  signatureBlock(doc, y);
  return doc.output("datauristring");
}

// ---------- RECHNUNG ----------
export function generateRechnungPdf(v: VerkaeuerData, d: RechnungData & { rechnungsnummer: string; bruttobetrag: number; mwstBetrag: number }, nr: string): string {
  const doc = new jsPDF();
  addLogo(doc);

  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Rechnung", MARGIN, MARGIN + 5);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Nr. ${nr}  ·  Datum: ${d.rechnungsdatum}`, MARGIN, MARGIN + 11);

  let y = MARGIN + 22;

  // Seller + Buyer side by side
  const fLeft = MARGIN, fRight = MARGIN + COL_W + 5;
  doc.setFontSize(7.5);
  doc.setTextColor(120);
  doc.text("Verkäufer", fLeft, y);
  doc.text("Rechnungsempfänger", fRight, y);
  y += 4;
  doc.setFontSize(9);
  doc.setTextColor(30);
  doc.text(v.autohausName, fLeft, y);
  doc.text(`${d.vorname} ${d.nachname}`, fRight, y);
  y += 4;
  doc.text(`${v.strasse}`, fLeft, y);
  doc.text(`${d.strasse} ${d.hausnummer}`, fRight, y);
  y += 4;
  doc.text(v.plzOrt, fLeft, y);
  doc.text(`${d.plz} ${d.ort}`, fRight, y);
  y += 4;
  doc.setFontSize(8);
  doc.text(`St.-Nr.: ${v.steuernummer}`, fLeft, y);
  y += 8;

  // Fahrzeug
  y = heading(doc, y, "Leistungsbeschreibung / Fahrzeug");
  let ly = y, ry = y;
  ly = field(doc, fLeft, ly, "Marke / Modell", `${d.marke} ${d.modell}`);
  ry = field(doc, fRight, ry, "FIN", d.fin, 75);
  ly = field(doc, fLeft, ly, "Erstzulassung", d.erstzulassung);
  ry = field(doc, fRight, ry, "KM-Stand", d.kilometerstand);
  y = Math.max(ly, ry) + 5;

  // Amounts table
  y = checkPage(doc, y, 40);
  y = heading(doc, y, "Beträge");
  doc.setFillColor(245, 245, 245);
  doc.rect(MARGIN, y - 1, PAGE_W - MARGIN * 2, 7, "F");
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50);
  doc.text("Position", MARGIN + 2, y + 3.5);
  doc.text("Betrag", PAGE_W - MARGIN - 2, y + 3.5, { align: "right" });
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.text("Nettobetrag", MARGIN + 2, y);
  doc.text(euro(d.nettobetrag), PAGE_W - MARGIN - 2, y, { align: "right" });
  y += 5;
  doc.text("MwSt. 19%", MARGIN + 2, y);
  doc.text(euro(d.mwstBetrag), PAGE_W - MARGIN - 2, y, { align: "right" });
  y += 2;
  doc.setDrawColor(150);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Gesamtbetrag (brutto)", MARGIN + 2, y);
  doc.text(euro(d.bruttobetrag), PAGE_W - MARGIN - 2, y, { align: "right" });
  y += 10;

  // Payment
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  doc.text(`Zahlungsziel: ${d.zahlungsziel} nach Rechnungsdatum`, MARGIN, y);
  y += 6;
  if (v.iban) {
    doc.text(`Bankverbindung: ${v.bank}  ·  IBAN: ${v.iban}  ·  BIC: ${v.bic}`, MARGIN, y);
    y += 6;
  }

  // Footer
  y = Math.max(y + 10, 260);
  doc.setDrawColor(200);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(140);
  doc.text(`${v.autohausName}  ·  ${v.strasse}  ·  ${v.plzOrt}  ·  St.-Nr.: ${v.steuernummer}`, PAGE_W / 2, y, { align: "center" });

  return doc.output("datauristring");
}
