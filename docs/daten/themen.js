/* Automatisch erzeugt von build.js – nicht von Hand ändern, sondern thema.md bearbeiten. */
window.FAECHER = [
  {
    "id": "hwe",
    "kuerzel": "HWE",
    "name": "Hardwareentwicklung"
  },
  {
    "id": "mtrs",
    "kuerzel": "MTRS",
    "name": "Messtechnik und Regelungssysteme"
  },
  {
    "id": "dic",
    "kuerzel": "DIC",
    "name": "Digitale Systeme und Computersysteme"
  },
  {
    "id": "ksn",
    "kuerzel": "KSN",
    "name": "Kommunikationssysteme und -netze"
  },
  {
    "id": "fsst",
    "kuerzel": "FSST",
    "name": "Fachspezifische Softwaretechnik"
  },
  {
    "id": "kinz",
    "kuerzel": "KINZ",
    "name": "Autonomie: Coding & AI"
  },
  {
    "id": "mathe",
    "kuerzel": "MATHE",
    "name": "Mathematik"
  },
  {
    "id": "deutsch",
    "kuerzel": "D",
    "name": "Deutsch"
  },
  {
    "id": "englisch",
    "kuerzel": "E",
    "name": "Englisch"
  }
];
window.TOPICS = [
  {
    "id": "spannungsteiler",
    "titel": "Spannungsteiler",
    "fach": "hwe",
    "status": "geplant",
    "voraus": [],
    "kurz": "Zwei Widerstände teilen eine Spannung."
  },
  {
    "id": "impedanz",
    "titel": "Impedanz & Reaktanz",
    "fach": "hwe",
    "status": "geplant",
    "voraus": [
      "komplexe-zahlen"
    ],
    "kurz": "Komplexe Wechselstromrechnung mit R, L und C."
  },
  {
    "id": "rc-tiefpass",
    "titel": "RC-Tiefpass",
    "fach": "hwe",
    "status": "fertig",
    "voraus": [
      "spannungsteiler",
      "impedanz",
      "dgl-1-ordnung"
    ],
    "kurz": "Ein Widerstand und ein Kondensator lassen tiefe Frequenzen durch und dämpfen hohe. Grenzfrequenz, Bode-Diagramm und Sprungantwort zum Ausprobieren.",
    "pfad": "faecher/hwe/rc-tiefpass/index.html"
  },
  {
    "id": "rlc-schwingkreis",
    "titel": "RLC-Schwingkreis",
    "fach": "hwe",
    "status": "geplant",
    "voraus": [
      "impedanz",
      "rc-tiefpass"
    ],
    "kurz": "Resonanz, Güte und Bandbreite."
  },
  {
    "id": "uebertragungsfunktion",
    "titel": "Übertragungsfunktion",
    "fach": "mtrs",
    "status": "geplant",
    "voraus": [
      "laplace",
      "impedanz"
    ],
    "kurz": "H(s) aufstellen, Pole und Nullstellen."
  },
  {
    "id": "bode-diagramm",
    "titel": "Bode-Diagramm",
    "fach": "mtrs",
    "status": "geplant",
    "voraus": [
      "uebertragungsfunktion",
      "rc-tiefpass"
    ],
    "kurz": "Betrag und Phase über der Frequenz zeichnen."
  },
  {
    "id": "dgl-1-ordnung",
    "titel": "DGL 1. Ordnung",
    "fach": "mathe",
    "status": "geplant",
    "voraus": [],
    "kurz": "Differentialgleichungen und die e-Funktion."
  },
  {
    "id": "komplexe-zahlen",
    "titel": "Komplexe Zahlen",
    "fach": "mathe",
    "status": "geplant",
    "voraus": [],
    "kurz": "Rechnen mit j, Betrag und Phase, Polarform."
  },
  {
    "id": "laplace",
    "titel": "Laplace-Transformation",
    "fach": "mathe",
    "status": "geplant",
    "voraus": [
      "komplexe-zahlen",
      "dgl-1-ordnung"
    ],
    "kurz": "Vom Zeitbereich in den Bildbereich."
  },
  {
    "id": "die-wolke",
    "titel": "„Die Wolke“",
    "fach": "deutsch",
    "status": "geplant",
    "voraus": [],
    "kurz": "Thema für die mündliche Matura."
  },
  {
    "id": "sensitivity-reading",
    "titel": "Sensitivity-Reading",
    "fach": "deutsch",
    "status": "geplant",
    "voraus": [],
    "kurz": "Thema für die mündliche Matura."
  },
  {
    "id": "sprachensterben",
    "titel": "Sprachensterben",
    "fach": "deutsch",
    "status": "geplant",
    "voraus": [],
    "kurz": "Thema für die mündliche Matura."
  },
  {
    "id": "digital-detox",
    "titel": "Digital Detox",
    "fach": "englisch",
    "status": "geplant",
    "voraus": [],
    "kurz": "Topic for the oral exam."
  }
];
