export interface Anfrage {
  id: string;
  sender: string;
  source: "Mobile.de" | "AutoScout24" | "E-Mail";
  fahrzeug: string;
  fahrzeugId: string;
  preview: string;
  fullMessage: string;
  timestamp: string;
  bewertung: "Hoch" | "Mittel" | "Niedrig";
  unread: boolean;
  telefon?: string;
  email?: string;
  kiAntwort: string;
  kiBewertung: {
    kaufwahrscheinlichkeit: { wert: string; color: string; text: string };
    dringlichkeit: { wert: string; color: string; text: string };
    preisbereitschaft: { wert: string; color: string; text: string };
    empfehlung: string;
  };
}

export const SAMPLE_ANFRAGEN: Anfrage[] = [
  {
    id: "a1",
    sender: "Klaus Weber",
    source: "Mobile.de",
    fahrzeug: "BMW 320d 2021",
    fahrzeugId: "s1",
    preview: "Ist das Inserat noch verfügbar? Ich würde es gerne...",
    fullMessage: "Guten Tag, ist das Inserat noch verfügbar? Ich würde es sehr gerne besichtigen und bin zeitlich flexibel. Haben Sie diese Woche noch Termine frei?\n\nMit freundlichen Grüßen,\nKlaus Weber",
    timestamp: "vor 12 Min.",
    bewertung: "Hoch",
    unread: true,
    telefon: "+49 172 345 6789",
    email: "k.weber@email.de",
    kiAntwort: "Guten Tag Herr Weber,\n\nvielen Dank für Ihr Interesse an unserem BMW 320d 2021. Das Fahrzeug ist selbstverständlich noch verfügbar.\n\nWir würden uns freuen, Ihnen das Fahrzeug persönlich zu präsentieren. Für eine Probefahrt stehen wir Ihnen diese Woche noch zu folgenden Zeiten zur Verfügung: Dienstag bis Freitag zwischen 9:00 und 18:00 Uhr.\n\nWir freuen uns auf Ihre Rückmeldung.\n\nMit freundlichen Grüßen,\nThomas Müller\nAutoDealer KI",
    kiBewertung: {
      kaufwahrscheinlichkeit: { wert: "Hoch", color: "text-success", text: "Konkrete Frage zur Verfügbarkeit, zeitnahes Interesse" },
      dringlichkeit: { wert: "Mittel", color: "text-warning", text: "Keine explizite Zeitangabe, aber aktives Interesse" },
      preisbereitschaft: { wert: "Offen", color: "text-muted-foreground", text: "Kein Preisverhandlungsversuch erkennbar" },
      empfehlung: "Sofort antworten. Hohe Abschlusswahrscheinlichkeit bei schneller Reaktion.",
    },
  },
  {
    id: "a2",
    sender: "Sandra Müller",
    source: "AutoScout24",
    fahrzeug: "Audi A4 Avant",
    fahrzeugId: "s2",
    preview: "Können Sie mir mehr zur Unfallfreiheit sagen?",
    fullMessage: "Hallo, können Sie mir mehr zur Unfallfreiheit des Fahrzeugs sagen? Gibt es ein Scheckheft und wurde das Fahrzeug regelmäßig gewartet?\n\nVielen Dank,\nSandra Müller",
    timestamp: "vor 1 Std.",
    bewertung: "Mittel",
    unread: true,
    email: "s.mueller@web.de",
    kiAntwort: "Guten Tag Frau Müller,\n\nvielen Dank für Ihre Anfrage zu unserem Audi A4 Avant. Das Fahrzeug ist unfallfrei und verfügt über ein lückenlos geführtes Scheckheft. Alle Wartungen wurden bei autorisierten Audi-Werkstätten durchgeführt.\n\nGerne können wir Ihnen die Unterlagen bei einem persönlichen Termin vorlegen.\n\nMit freundlichen Grüßen,\nThomas Müller\nAutoDealer KI",
    kiBewertung: {
      kaufwahrscheinlichkeit: { wert: "Mittel", color: "text-warning", text: "Detailfragen deuten auf ernstes Kaufinteresse" },
      dringlichkeit: { wert: "Niedrig", color: "text-muted-foreground", text: "Informationsphase, kein Zeitdruck" },
      preisbereitschaft: { wert: "Offen", color: "text-muted-foreground", text: "Noch keine Preisdiskussion" },
      empfehlung: "Innerhalb von 2 Stunden antworten. Detaillierte Informationen stärken Vertrauen.",
    },
  },
  {
    id: "a3",
    sender: "Thomas Becker",
    source: "E-Mail",
    fahrzeug: "VW Golf 8 GTI",
    fahrzeugId: "s3",
    preview: "Wäre ein Probefahrttermin möglich?",
    fullMessage: "Sehr geehrte Damen und Herren,\n\nich interessiere mich für den VW Golf 8 GTI. Wäre ein Probefahrttermin diese Woche möglich? Am liebsten Donnerstag oder Freitag nachmittags.\n\nBeste Grüße,\nThomas Becker",
    timestamp: "vor 2 Std.",
    bewertung: "Hoch",
    unread: true,
    telefon: "+49 151 987 6543",
    email: "t.becker@gmail.com",
    kiAntwort: "Guten Tag Herr Becker,\n\nvielen Dank für Ihr Interesse an unserem VW Golf 8 GTI. Gerne vereinbaren wir einen Probefahrttermin mit Ihnen.\n\nDonnerstag und Freitag Nachmittag sind beide möglich. Wie wäre es mit Donnerstag um 15:00 Uhr oder Freitag um 14:00 Uhr?\n\nBitte bringen Sie Ihren Führerschein zur Probefahrt mit.\n\nMit freundlichen Grüßen,\nThomas Müller\nAutoDealer KI",
    kiBewertung: {
      kaufwahrscheinlichkeit: { wert: "Hoch", color: "text-success", text: "Probefahrt angefragt, konkreter Terminwunsch" },
      dringlichkeit: { wert: "Hoch", color: "text-success", text: "Diese Woche, konkrete Tage genannt" },
      preisbereitschaft: { wert: "Offen", color: "text-muted-foreground", text: "Noch kein Preisthema" },
      empfehlung: "Sofort antworten. Probefahrt-Anfragen haben die höchste Konversionsrate.",
    },
  },
  {
    id: "a4",
    sender: "Maria Schmidt",
    source: "Mobile.de",
    fahrzeug: "Mercedes C200",
    fahrzeugId: "s4",
    preview: "Was ist der Endpreis inkl. Überführung?",
    fullMessage: "Guten Tag,\n\nwas ist der Endpreis für den Mercedes C200 inklusive Überführungskosten? Gibt es noch Spielraum beim Preis?\n\nMfG, Maria Schmidt",
    timestamp: "vor 3 Std.",
    bewertung: "Mittel",
    unread: false,
    kiAntwort: "Guten Tag Frau Schmidt,\n\nvielen Dank für Ihre Anfrage. Der Gesamtpreis für den Mercedes C200 beträgt € 24.900 inklusive MwSt. Die Überführungskosten betragen pauschal € 350.\n\nGerne besprechen wir die Details bei einem persönlichen Termin.\n\nMit freundlichen Grüßen,\nThomas Müller\nAutoDealer KI",
    kiBewertung: {
      kaufwahrscheinlichkeit: { wert: "Mittel", color: "text-warning", text: "Preisanfrage zeigt konkretes Interesse" },
      dringlichkeit: { wert: "Mittel", color: "text-warning", text: "Aktives Interesse, aber kein Zeitdruck" },
      preisbereitschaft: { wert: "Verhandlung", color: "text-warning", text: "Fragt nach Spielraum beim Preis" },
      empfehlung: "Zeitnah antworten. Preisanfragen deuten auf fortgeschrittene Kaufphase.",
    },
  },
  {
    id: "a5",
    sender: "Peter Hoffmann",
    source: "AutoScout24",
    fahrzeug: "BMW 320d 2021",
    fahrzeugId: "s1",
    preview: "Haben Sie Finanzierungsoptionen?",
    fullMessage: "Hallo, bieten Sie auch Finanzierungsmöglichkeiten an? Wenn ja, zu welchen Konditionen?\n\nPeter Hoffmann",
    timestamp: "gestern",
    bewertung: "Niedrig",
    unread: false,
    kiAntwort: "Guten Tag Herr Hoffmann,\n\nvielen Dank für Ihre Anfrage. Ja, wir bieten verschiedene Finanzierungsoptionen an. Gerne erstellen wir Ihnen ein individuelles Finanzierungsangebot.\n\nBitte teilen Sie uns Ihre gewünschte Laufzeit und Anzahlung mit, damit wir Ihnen ein passendes Angebot machen können.\n\nMit freundlichen Grüßen,\nThomas Müller\nAutoDealer KI",
    kiBewertung: {
      kaufwahrscheinlichkeit: { wert: "Niedrig", color: "text-muted-foreground", text: "Allgemeine Finanzierungsfrage" },
      dringlichkeit: { wert: "Niedrig", color: "text-muted-foreground", text: "Orientierungsphase" },
      preisbereitschaft: { wert: "Offen", color: "text-muted-foreground", text: "Finanzierung deutet auf Budgetgrenze" },
      empfehlung: "Innerhalb von 24 Stunden antworten. Finanzierungsdetails bereitstellen.",
    },
  },
  {
    id: "a6",
    sender: "Julia Lang",
    source: "E-Mail",
    fahrzeug: "Opel Insignia",
    fahrzeugId: "s5",
    preview: "Das Fahrzeug ist ja schon länger online...",
    fullMessage: "Hallo, mir ist aufgefallen, dass der Opel Insignia schon länger online steht. Ist noch alles in Ordnung mit dem Fahrzeug? Wäre ein Preisnachlass möglich?\n\nJulia Lang",
    timestamp: "gestern",
    bewertung: "Niedrig",
    unread: false,
    kiAntwort: "Guten Tag Frau Lang,\n\nvielen Dank für Ihre Anfrage zum Opel Insignia. Das Fahrzeug befindet sich in einwandfreiem technischem Zustand.\n\nGerne laden wir Sie zu einer unverbindlichen Besichtigung ein, um sich persönlich von der Qualität zu überzeugen.\n\nMit freundlichen Grüßen,\nThomas Müller\nAutoDealer KI",
    kiBewertung: {
      kaufwahrscheinlichkeit: { wert: "Niedrig", color: "text-muted-foreground", text: "Kritische Frage zur Standzeit" },
      dringlichkeit: { wert: "Niedrig", color: "text-muted-foreground", text: "Kein Zeitdruck erkennbar" },
      preisbereitschaft: { wert: "Verhandlung", color: "text-warning", text: "Fragt nach Preisnachlass" },
      empfehlung: "Antworten und Besichtigung anbieten. Standzeit-Argument entkräften.",
    },
  },
  {
    id: "a7",
    sender: "Andreas Krause",
    source: "Mobile.de",
    fahrzeug: "Audi A4 Avant",
    fahrzeugId: "s2",
    preview: "Letzter Preis?",
    fullMessage: "Letzter Preis?\n\nAndreas Krause",
    timestamp: "vor 2 Tagen",
    bewertung: "Mittel",
    unread: false,
    kiAntwort: "Guten Tag Herr Krause,\n\nvielen Dank für Ihr Interesse an unserem Audi A4 Avant. Der aktuelle Preis beträgt € 32.900.\n\nGerne laden wir Sie zu einer persönlichen Besichtigung ein, bei der wir alle Details besprechen können.\n\nMit freundlichen Grüßen,\nThomas Müller\nAutoDealer KI",
    kiBewertung: {
      kaufwahrscheinlichkeit: { wert: "Mittel", color: "text-warning", text: "Direkte Preisverhandlung" },
      dringlichkeit: { wert: "Niedrig", color: "text-muted-foreground", text: "Kurze Anfrage, wenig Kontext" },
      preisbereitschaft: { wert: "Verhandlung", color: "text-warning", text: "Sofortige Preisfrage" },
      empfehlung: "Höflich antworten, zum Termin einladen statt Preis direkt verhandeln.",
    },
  },
  {
    id: "a8",
    sender: "Sabine Wolf",
    source: "AutoScout24",
    fahrzeug: "VW Golf 8 GTI",
    fahrzeugId: "s3",
    preview: "Sind Extras noch verhandelbar?",
    fullMessage: "Guten Tag, sind beim VW Golf 8 GTI noch Extras wie Winterreifen oder eine Garantieverlängerung verhandelbar?\n\nVielen Dank,\nSabine Wolf",
    timestamp: "vor 3 Tagen",
    bewertung: "Niedrig",
    unread: false,
    kiAntwort: "Guten Tag Frau Wolf,\n\nvielen Dank für Ihre Anfrage zum VW Golf 8 GTI. Wir können Ihnen gerne ein Paket mit Winterreifen anbieten. Bezüglich einer Garantieverlängerung haben wir verschiedene Optionen.\n\nLassen Sie uns die Details gerne persönlich besprechen.\n\nMit freundlichen Grüßen,\nThomas Müller\nAutoDealer KI",
    kiBewertung: {
      kaufwahrscheinlichkeit: { wert: "Niedrig", color: "text-muted-foreground", text: "Extras-Frage, noch keine Kaufzusage" },
      dringlichkeit: { wert: "Niedrig", color: "text-muted-foreground", text: "Informationsphase" },
      preisbereitschaft: { wert: "Offen", color: "text-muted-foreground", text: "Sucht nach Mehrwert statt Preisnachlass" },
      empfehlung: "Paketangebot erstellen und zum Termin einladen.",
    },
  },
];
