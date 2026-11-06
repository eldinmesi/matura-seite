# CLAUDE.md – Matura-Lernseite (Projektgedächtnis)

> Diese Datei ist das gesamte Gedächtnis des Projekts. Sie gehört in den Wurzelordner des Repositories
> (aktuell `C:\HTL\matura-seite-1\CLAUDE.md`). Claude Code in VS Code liest sie bei jedem Start automatisch.
> **Regel für dich (Claude): Am Ende jeder Arbeitssitzung ergänzt du das Änderungsprotokoll ganz unten
> und aktualisierst alle Abschnitte, die sich geändert haben. Es darf kein Wissen verloren gehen.**

---

## 1. Wer arbeitet hier und wie

- **Eldin**, Schüler (5AHELS, HTBLA Braunau, Österreich), Matura steht bevor. Will danach Informatik studieren (JKU Linz).
- Arbeitet auf einem **Windows-Laptop** (PowerShell, VS Code, Git). Befehle immer für **PowerShell** angeben.
- Kennt LaTeX, Obsidian (`[[Links]]`), Git-Grundlagen, JavaScript/C#/Python. Will den Code **verstehen und selbst verbessern**.
- Schreibt Deutsch. **Antworte auf Deutsch (Österreich).**

### Arbeitsweise (so will Eldin es)
- **Klare Struktur** statt langer Fließtext-Absätze: Überschriften, Stichpunkte, kurze Sätze.
- **Keine Sprachkorrekturen** an seinen eigenen Nachrichten.
- Vor größeren Umbauten **kurz den Plan zeigen** (Dateien, Ablauf), dann umsetzen.
- Nichts löschen oder umbenennen, ohne es zu sagen. Am Ende kurz: was wurde geändert, was ist zu tun (Befehle).
- Code **verständlich kommentieren** (warum, nicht nur was). Eldin liest und ändert ihn selbst.
- Nichts erfinden: bei Fachinhalt nur Gesichertes. Zahlen und Formeln nachrechnen. Unsicheres markieren (`> ⚠️ prüfen: …`).

---

## 2. Ziel des Projekts

Eine **Lernseite im Browser**, auf der der gesamte Matura-Stoff **an einem Ort** liegt:

1. **Zusammenfassungen** pro Thema, verständlich und gut strukturiert.
2. **Interaktive Visualisierungen** (z. B. Schaltungen: Werte verändern, Wirkung sofort sehen).
3. **Fotos** (Heft, Skizzen, Schaltpläne) pro Thema.
4. **Zusammenhänge als Graph**: Pfeile von Voraussetzung zu Thema. Man sieht, was man vorher können muss (auch indirekt) und in welcher Reihenfolge.
5. **Einfach erweiterbar**: Neues Thema = Ordner anlegen, Text schreiben, Build, Push.
6. Läuft über **Git (GitHub Pages)**, ohne eigenen Server.

Ursprünglicher Auslöser: Obsidian gefällt wegen der Verlinkungen und des Graphen; gewünscht war zusätzlich
Stift/Tastatur im selben Dokument (wie OneNote) und ein **Vorwissen-Graph**. Entscheidung (06.11.2026):
Statt eines Notiz-Tools kommt eine **eigene Lernseite im Browser**. Der Stift-Teil ist damit vom Tisch
(Handschrift und Skizzen kommen als Fotos in `bilder/`).

### Fächer / Inhalte, die vorkommen sollen (Stand der Gespräche, Eldin ergänzt)
- **Elektronik / Elektrotechnik:** RC-/RLC-Filter, Übertragungsfunktion, Bode-Diagramm, Gleichrichter, Z-Dioden, Netzteile, Verstärker.
- **Mathematik:** Komplexe Zahlen, DGL 1. Ordnung, Laplace-Transformation (Korrespondenztabelle), Statistik (Binomialverteilung).
- **Deutsch** (mündlich: Sprachensterben, Sensitivity-Reading, „Die Wolke“; schriftlich 13. Mai 2027), **Englisch** (mündlich: Digital Detox; schriftlich ca. eine Woche nach Deutsch), **Geografie/Geschichte** (vorgezogene mündliche Matura).
- Nicht jedes Fach braucht Visualisierungen. Textfächer nutzen nur Zusammenfassung, Bilder und Fragen.

---

## 3. Aktueller Stand (Prototyp, Version 1)

- Repository: `github.com/eldinmesi/matura-seite`, Branch `main`.
  Lokal ursprünglich `C:\HTL\matura-seite`, aktueller Klon: **`C:\HTL\matura-seite-1`**.
- Commits: „Erste Version“ (`add8f87`), danach „first commit“ (`1ffa54d`). GitHub Pages wurde aktiviert (Source: Deploy from a branch → `main` → `/ (root)`).
  Erwartete URL: `https://eldinmesi.github.io/matura-seite/` (Live-Status vom Nutzer noch nicht bestätigt).
- **Git-Stolperfalle:** Windows hatte die Anmeldung eines anderen GitHub-Accounts (`eldinmesic18`) gespeichert. Push klappte im ersten Ordner, weil die
  Remote-URL den Nutzer enthielt: `https://eldinmesi@github.com/eldinmesi/matura-seite.git`.
  **Im Klon `matura-seite-1` steht die Remote-URL ohne Nutzer** (`https://github.com/eldinmesi/matura-seite`), und `git config user.name` ist `eldinmesic18`.
  Falls Push mit 403 scheitert: `git remote set-url origin https://eldinmesi@github.com/eldinmesi/matura-seite.git`
  oder Windows **Anmeldeinformationsverwaltung** → Einträge `git:https://github.com` entfernen, neu anmelden als `eldinmesi`.
- CRLF-Warnungen von Git (`LF will be replaced by CRLF`) sind harmlos. Optional `.gitattributes` mit `* text=auto`.

### Dateien (Version 1, ohne Build-Schritt)
```
index.html                 Startseite: Themenkarten + Zusammenhangs-Graph
topics/rc-tiefpass.html    fertige interaktive Themenseite
js/topics.js               window.TOPICS (Themenliste) + window.TopicGraph (Ebenen, Voraussetzungen, Layout)
js/home.js                 Startseite: Karten, SVG-Graph, Auswahl hebt alle Voraussetzungen hervor
js/common.js               Hell/Dunkel-Schalter (localStorage-Key "theme"), Kasten "Das solltest du vorher können"
js/rc.js                   Simulation des RC-Tiefpasses
css/style.css              Layout, Farben (CSS-Variablen hell/dunkel), alle Komponenten
.nojekyll, README.md, CLAUDE.md
```
**Wichtige technische Randbedingung von Version 1:** keine ES-Module, kein `fetch()`, nur klassische `<script>`-Tags,
damit die Seite auch per Doppelklick (`file://`) funktioniert. Bei einem Umbau mit Build-Skript und lokalem Server
(VS Code „Live Server“) fällt diese Einschränkung weg, bleibt aber nützlich.

### js/topics.js
- `window.TOPICS`: Array mit `{ id, title, fach, status: 'fertig'|'geplant', file?, voraus: [ids], kurz }`.
  Aktuell 9 Themen, nur `rc-tiefpass` ist `fertig`:
  komplexe-zahlen, dgl-1-ordnung, spannungsteiler (Ebene 0) → impedanz, laplace (1) → rc-tiefpass, uebertragungsfunktion (2) → rlc-schwingkreis, bode-diagramm (3).
  Voraussetzungen: impedanz←komplexe-zahlen; laplace←komplexe-zahlen,dgl-1-ordnung; rc-tiefpass←spannungsteiler,impedanz,dgl-1-ordnung;
  uebertragungsfunktion←laplace,impedanz; rlc-schwingkreis←impedanz,rc-tiefpass; bode-diagramm←uebertragungsfunktion,rc-tiefpass.
- `window.TopicGraph`: `byId`, `layer(id)` (= längste Kette an Voraussetzungen davor, mit Zyklenschutz), `ancestors(id)`
  (alle direkten und indirekten Voraussetzungen, sortiert nach Ebene, dann Reihenfolge in der Liste), `successors(id)`,
  `layout({nodeW,nodeH,colW,rowH,pad})` (Spalten = Ebenen, Reihen per **Schwerpunkt-Sortierung** gegen Kantenkreuzungen, vertikal zentriert).
  Zeichenwerte in home.js: Knoten 178×42, Spaltenabstand 232, Zeilenabstand 66, Rand 24.

### js/home.js (Graph)
- SVG, Kanten als kubische Béziers von rechts-Mitte der Voraussetzung zu links-Mitte des Themas, Pfeilspitze per `<marker>`.
- Klick/Enter/Leertaste auf einen Knoten: Auswahl (schwarzer Rand), alle Voraussetzungen orange hervorgehoben, Rest abgeblendet
  (nur Text und Rand, Füllung bleibt deckend, damit Kanten nicht durchscheinen). Darunter Panel mit der Kette in Lernreihenfolge,
  „Darauf baut auf“ und Button „Zur Seite →“ bei fertigen Themen. Standardauswahl: `rc-tiefpass`.
- Fertige Themen: ✓ vor dem Titel plus Fachzeile (Status nicht nur über Farbe).

### js/rc.js (RC-Tiefpass)
Formeln (alles live berechnet, keine Näherung):
- `H(jω) = 1/(1 + jωRC)`, `|H| = 1/√(1+(ωτ)²)`, `φ = −arctan(ωτ)`, `τ = R·C`, `f_g = 1/(2πτ)`.
- Sprungantwort `u_a = Û(1 − e^(−t/τ))`. Rechteck ±1 V im eingeschwungenen Zustand: Startwert `V0 = tanh(T/(4τ))`,
  Halbperiode 1: `1 − (1+V0)e^(−s/τ)`, Halbperiode 2: `−1 + (1+V0)e^(−s/τ)` (stetig, nachgerechnet).
Bedienung:
- R: 100 Ω … 100 kΩ, C: 1 nF … 10 µF, beide auf **E12-Werte** einrastend. f: 1 Hz … 1 MHz logarithmisch (Regler 0…600, `f = 10^(v/100)`).
- Standard: R = 1 kΩ, C = 100 nF → τ = 100 µs, f_g ≈ 1,59 kHz.
- Presets `f = f_g/10`, `f_g`, `10·f_g` setzen die **exakte** Frequenz (`fExact`), bis der Regler wieder bewegt wird
  (sonst rastet der Regler und es käme −44,9° statt −45,0° heraus).
- Diagramme werden bei jeder Änderung per `innerHTML` als SVG neu aufgebaut und passen sich der Breite an
  (`getBoundingClientRect().width`), Redraw bei `resize`.
- Bode-Diagramme: Betrag −60…+5 dB, Phase −95…+5°, Frequenzachse 1 Hz…1 MHz. Hover zeigt Fadenkreuz in beiden Diagrammen plus Tooltip
  (f, dB, Faktor, Phase). Klicken/Ziehen setzt f (Pointer Events, `touch-action: pan-y`, Pointer Capture).
- Zeitverlauf: immer drei Perioden, Eingang blau, Ausgang orange. Bildunterschrift erklärt dynamisch (Sinus: Amplitude, Phasenverschiebung in Grad und Zeit;
  Rechteck: Halbperiode in τ, ob der Kondensator voll oder teilweise umgeladen wird).
- Tabellenansicht (aufklappbar) mit Werten bei f_g und 1 Hz … 1 MHz.
- Geprüfte Kontrollwerte: bei f_g −3,01 dB und −45°; bei 10·f_g −20,04 dB und −84,3°; bei f_g/10 −0,04 dB und −5,7°;
  100·f_g −40,0 dB, −89,4°. Nach 1τ 63,2 %, nach 5τ 99,3 %, Anstiegszeit 10–90 % ≈ 2,2τ.

### Test von Version 1
Headless Chrome (Playwright) auf `file://`: keine Konsolenfehler (hell, dunkel, 390 px breit), Werte und Presets stimmen.
Beim Weiterbauen genauso prüfen: Konsole, Kontrollwerte, Screenshots hell/dunkel/Handy.

---

## 4. Design-Regeln (verbindlich für alle Visualisierungen)

Basis ist eine **validierte Datenvisualisierungs-Palette** (Farbenblind-sicher, Kontraste geprüft). Werte stehen in `css/style.css`.
- **Farbe folgt der Bedeutung:** Blau = Eingang u_e / Akzent, Orange = Ausgang u_a. In allen Diagrammen gleich, nie neu zuordnen.
- Hell: Fläche `#fcfcfb`, Seite `#f9f9f7`, Text `#0b0b0b`/`#52514e`/`#898781`, Gitter `#e1e0d9`, Achse `#c3c2b7`, Blau `#2a78d6`, Orange `#eb6834`.
- Dunkel: Fläche `#1a1a19`, Seite `#0d0d0d`, Text `#f0efec`/`#c3c2b7`, Gitter `#2c2c2a`, Achse `#383835`, Blau `#3987e5`, Orange `#d95926`.
- Reihenfolge weiterer Serienfarben (nur wenn nötig, nie zyklisch): Blau, Orange, Aqua `#1baf7a`, Gelb `#eda100`, Magenta `#e87ba4`, Grün `#008300`, Violett `#6250d6`, Rot `#e34948`.
  Neue Farbkombinationen vor Verwendung mit dem Validierungsskript prüfen.
- Linien 2 px (runde Enden), Punkte r ≥ 4 mit 2 px Ring in Flächenfarbe, Gitter 1 px, durchgezogen, zurückhaltend. **Keine Doppelachsen.**
- Text nie in Datenfarbe, sondern in Textfarben. Bei ≥ 2 Serien immer eine Legende. Hover-Tooltip auf Diagrammen, aufklappbare **Tabellenansicht**.
- Hell/Dunkel über CSS-Variablen, Umschalter oben rechts, Standard folgt dem System.
- Schrift: `system-ui, -apple-system, "Segoe UI", sans-serif`. Zahlen deutsch formatiert (Komma, SI-Vorsätze, schmales Leerzeichen vor der Einheit).
- Statusangaben (z. B. „fertig“) nie nur über Farbe, immer zusätzlich Zeichen oder Text.

---

## 5. Zielstruktur (Umbau, beschlossen als Richtung)

```
faecher/
  elektronik/
    fach.json                 Name, Farbe des Fachs
    rc-tiefpass/
      thema.md                Zusammenfassung (Text, Formeln, Bilder, Verweise auf Visualisierungen)
      viz/rc-simulation.html  interaktive Visualisierung(en) des Themas
      bilder/heft-seite-3.jpg Fotos, Skizzen, Schaltpläne
    gleichrichter/
  mathematik/laplace/
  deutsch/ …  englisch/ …  geschichte/ …
index.html                    Startseite mit Fächerauswahl (Fächer als Kacheln, Filter für Karten und Graph)
```
- Jedes Thema hat Reiter: **Zusammenfassung · Visualisierungen · Bilder (Galerie, Klick zum Vergrößern) · Vorwissen**.
- Seite **„Alle Visualisierungen“** listet alles aus allen Fächern zum schnellen Aufrufen.
- Der Graph läuft über **alle Fächer** (Laplace aus Mathematik kann Voraussetzung eines Elektronik-Themas sein). Startseite filtert nach Fach.
- Die bisherige RC-Tiefpass-Seite zieht um: Simulation nach `viz/`, Erklärtext wird `thema.md`.

### Build-Skript (nötig, weil eine statische Seite ihre Ordner nicht auflisten kann)
Vorschlag (noch nicht gebaut, Eldin hat zugestimmt, dass es kommen soll; Details offen):
- `build.js` (Node, ca. 150 Zeilen, wenig Abhängigkeiten) liest alle `faecher/*/*/thema.md`, parst das Front matter, rendert Markdown
  (z. B. `marked`) und **Formeln mit KaTeX zur Build-Zeit**, ersetzt Platzhalter und erzeugt daraus die Seiten und eine Datenliste (statt Handpflege in `topics.js`).
- Befehle: `npm run build` und `npm run neu -- <fach> <thema>` (legt Ordner plus Vorlage `thema.md`, `viz/`, `bilder/` an).
- **Fotos** beim Build automatisch verkleinern (z. B. `sharp`, max. ca. 1600 px Breite, JPEG/WebP). Handyfotos sind oft 5–10 MB.
- **Ausgabeordner (offene Entscheidung):** GitHub Pages kann nur `/ (root)` oder `/docs` ausliefern. Vorschlag: Build erzeugt `docs/` (wird committet),
  Pages-Quelle auf `main` → `/docs` umstellen. Später optional GitHub Actions, dann baut GitHub beim Push selbst.
- Offen: eigenes Skript (empfohlen, Eldin will es verstehen) vs. fertiges Werkzeug wie VitePress (bringt Markdown, Suche, Seitenleiste mit).

---

## 6. Format von `thema.md` (auch für Zusammenfassungen aus Material)

Wenn Eldin Material schickt (Text, Heftfotos, PDF, Folien) und eine Zusammenfassung will, erzeugst du **eine fertige `thema.md`**,
die er nur noch einfügen muss. Es gibt dazu auch einen Skill `lernseite-zusammenfassung` in claude.ai.

Ausgabe: Zielpfad `faecher/<fach-klein>/<thema>/thema.md`, danach **ein Codeblock mit vier Backticks** (`markdown`) mit dem kompletten Inhalt,
danach höchstens drei kurze Zeilen: Bilder (Dateinamen für `bilder/`), Visualisierungs-Idee, Befehle zum Veröffentlichen.

```
---
titel: RC-Tiefpass
fach: Elektronik
voraus: [spannungsteiler, impedanz, dgl-1-ordnung]
kurz: Grenzfrequenz, Bode-Diagramm und Sprungantwort.
---
```
Danach in dieser Reihenfolge (nicht Passendes weglassen):
`## Das Wichtigste in Kürze` (3–5 Stichpunkte) · `## Erklärung` (kleine Schritte, `###`) · `## Formeln` (LaTeX `$…$` / `$$…$$`, jedes Symbol mit Einheit erklärt) ·
`## Beispiel` (vollständig durchgerechnet) · `## Typische Fragen` (3–6 Matura-Fragen mit kurzer Antwort).
Platzhalter: `{{viz:rc-simulation}}` (Visualisierung einbetten, mit Vollbild-Knopf), `![Beschreibung](bilder/heft-seite-3.jpg)` (Foto).

Regeln: ids sind kebab-case ohne Umlaute (ae, oe, ue, ss); `voraus` nutzt bestehende ids, keine Zyklen. Ein Thema ist etwa 1–2 Bildschirmseiten lang,
sonst in mehrere Themen teilen. Deutsch (Österreich), Matura-Niveau HTL. Fachbegriffe beim ersten Mal erklären.

---

## 7. Roadmap (Reihenfolge)

1. **Gerüst umbauen** (Abschnitt 5): Ordnerstruktur, `build.js`, Vorlagen, Fächer-Startseite mit Filter, Reiter pro Thema, Bilder-Galerie, Seite „Alle Visualisierungen“.
2. RC-Tiefpass in die neue Struktur umziehen. Inhalte und Kontrollwerte aus Abschnitt 3 müssen erhalten bleiben.
3. Pages-Quelle anpassen (falls `docs/`) und die Live-Seite prüfen.
4. Weitere Visualisierungen: RLC-Schwingkreis (Resonanz, Güte, Bandbreite), Laplace/Übertragungsfunktion (Pole und Nullstellen), Bode-Diagramm, Gleichrichter/Netzteil (Glättung, Brummspannung).
5. Optional später: Themen als „gekonnt“ markieren (localStorage) und Lücken im Graphen anzeigen; Suche; geräteübergreifende Speicherung (z. B. Supabase) nur falls wirklich gebraucht.

### Verworfene oder vertagte Ideen (damit sie nicht wieder aufkommen)
- Obsidian-Plugins und Handschrift im Browser (Stift im selben Dokument): vom Tisch, Handschrift kommt als Foto.
- Themen **im Browser** eintragen: vertagt. Inhalte liegen als Dateien im Repo (VS Code). Falls doch: localStorage plus JSON-Export/Import wäre der einfache Weg,
  Safari kann lokale Daten löschen; geräteübergreifend bräuchte es eine Datenbank.
- GitHub Pages ist **öffentlich** abrufbar. Nichts Vertrauliches ins Repo legen (keine Klausurunterlagen mit Namen, keine privaten Daten).

---

## 8. Bekannte Schwächen / Ideen zum Verbessern
- Kanten im Graphen können hinter Knoten durchlaufen, wenn Themen mehrere Ebenen überspringen. Bei vielen Themen: Layout verbessern (z. B. Zwischenpunkte) oder Graph pro Fach.
- Auf Handys scrollt der Graph horizontal (feste Breite).
- Bode-Diagramme zeigen den Punkt am Rand, wenn f_g außerhalb von 1 Hz … 1 MHz liegt (f_g-Linie entfällt).
- Rechteck-Modus zeigt den eingeschwungenen Zustand, nicht das Einschwingen aus 0 V.
- `innerHTML`-Neuaufbau bei jeder Mausbewegung ist für die jetzige Größe schnell genug, bei vielen Elementen auf gezielte Updates umstellen.

---

## 9. Änderungsprotokoll (hier immer ergänzen)

- **2026-11-06** · Version 1 gebaut und getestet (Startseite mit Graph, RC-Tiefpass-Simulation, Hell/Dunkel). Auf GitHub gepusht, Pages aktiviert.
  Entscheidung: Umbau auf Fach-Ordner mit `thema.md`, `viz/`, `bilder/` und Build-Skript. Skill `lernseite-zusammenfassung` in claude.ai angelegt.
  Diese Datei als Projektgedächtnis erstellt.
- **2026-11-06** · `CLAUDE.md` ins Repo gelegt (Klon `C:\HTL\matura-seite-1`). Abschnitt 3 an den Klon angepasst:
  lokaler Pfad, Commit „first commit“, Remote-URL ohne Nutzernamen (Hinweis für 403 ergänzt). Sonst keine Codeänderungen.
