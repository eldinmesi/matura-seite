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
    "pfad": "faecher/hwe/spannungsteiler/index.html"
  },
  {
    "id": "impedanz",
    "titel": "Impedanz & Reaktanz",
    "fach": "hwe",
    "status": "geplant",
    "voraus": [
      "komplexe-zahlen"
    ],
    "pfad": "faecher/hwe/impedanz/index.html"
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
    "pfad": "faecher/hwe/rlc-schwingkreis/index.html"
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
    "pfad": "faecher/mtrs/uebertragungsfunktion/index.html"
  },
  {
    "id": "blockschaltbild-algebra",
    "titel": "Algebra von Blockschaltbildern",
    "fach": "mtrs",
    "status": "fertig",
    "voraus": [
      "uebertragungsfunktion",
      "laplace"
    ],
    "pfad": "faecher/mtrs/blockschaltbild-algebra/index.html"
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
    "pfad": "faecher/mtrs/bode-diagramm/index.html"
  },
  {
    "id": "blockschaltbild-beispiele",
    "titel": "Blockschaltbilder vereinfachen – Beispiele",
    "fach": "mtrs",
    "status": "fertig",
    "voraus": [
      "blockschaltbild-algebra"
    ],
    "pfad": "faecher/mtrs/blockschaltbild-beispiele/index.html"
  },
  {
    "id": "dgl-1-ordnung",
    "titel": "DGL 1. Ordnung",
    "fach": "mathe",
    "status": "geplant",
    "voraus": [],
    "pfad": "faecher/mathe/dgl-1-ordnung/index.html"
  },
  {
    "id": "komplexe-zahlen",
    "titel": "Komplexe Zahlen",
    "fach": "mathe",
    "status": "geplant",
    "voraus": [],
    "pfad": "faecher/mathe/komplexe-zahlen/index.html"
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
    "pfad": "faecher/mathe/laplace/index.html"
  },
  {
    "id": "die-wolke",
    "titel": "„Die Wolke“",
    "fach": "deutsch",
    "status": "geplant",
    "voraus": [],
    "pfad": "faecher/deutsch/die-wolke/index.html"
  },
  {
    "id": "sensitivity-reading",
    "titel": "Sensitivity-Reading",
    "fach": "deutsch",
    "status": "geplant",
    "voraus": [],
    "pfad": "faecher/deutsch/sensitivity-reading/index.html"
  },
  {
    "id": "sprachensterben",
    "titel": "Sprachensterben",
    "fach": "deutsch",
    "status": "geplant",
    "voraus": [],
    "pfad": "faecher/deutsch/sprachensterben/index.html"
  },
  {
    "id": "digital-detox",
    "titel": "Digital Detox",
    "fach": "englisch",
    "status": "geplant",
    "voraus": [],
    "pfad": "faecher/englisch/digital-detox/index.html"
  }
];
