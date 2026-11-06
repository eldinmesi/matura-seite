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

### Fächer (Ordner in `faecher/`, Stand 06.11.2026)
| Ordner | Kürzel | Name | Inhalte (bisher bekannt) |
|---|---|---|---|
| `hwe` | HWE | Hardwareentwicklung | Spannungsteiler, Impedanz, RC-Tiefpass, RLC-Schwingkreis; geplant: Gleichrichter, Z-Dioden, Netzteile, Verstärker |
| `mtrs` | MTRS | Messtechnik und Regelungssysteme | Übertragungsfunktion, Bode-Diagramm |
| `dic` | DIC | Digitale Systeme und Computersysteme | – |
| `ksn` | KSN | Kommunikationssysteme und -netze | – |
| `fsst` | FSST | Fachspezifische Softwaretechnik (auch „– Übungen“) | – |
| `kinz` | KINZ | Autonomie: Coding & AI | – |
| `mathe` | MATHE | Mathematik | Komplexe Zahlen, DGL 1. Ordnung, Laplace (Korrespondenztabelle); geplant: Statistik (Binomialverteilung) |
| `deutsch` | D | Deutsch | mündlich: Sprachensterben, Sensitivity-Reading, „Die Wolke“; schriftlich 13. Mai 2027 |
| `englisch` | E | Englisch | mündlich: Digital Detox; schriftlich ca. eine Woche nach Deutsch |

- Die Zuordnung HWE/MTRS der Elektronik-Themen hat Claude vorgeschlagen, Eldin hat sie noch nicht ausdrücklich bestätigt. Umhängen = Ordner verschieben.
- **Geografie/Geschichte entfällt** (vorgezogene Matura ist vorbei).
- Nicht jedes Fach braucht Visualisierungen. Textfächer nutzen nur Zusammenfassung, Bilder und Fragen.

---

## 3. Aktueller Stand: Version 2 (Fach-Ordner + Build)

- Repository: `github.com/eldinmesi/matura-seite`, Branch `main`.
  Lokal ursprünglich `C:\HTL\matura-seite`, aktueller Klon: **`C:\HTL\matura-seite-1`**.
- Commits: „Erste Version“ (`add8f87`), „first commit“ (`1ffa54d`), danach der Umbau auf Version 2.
- **GitHub Pages muss auf `main` → `/docs` stehen** (vorher `/ (root)`). Live-URL: `https://eldinmesi.github.io/matura-seite/` (Live-Status noch nicht bestätigt).
- **Git-Stolperfalle:** Windows hatte die Anmeldung eines anderen GitHub-Accounts (`eldinmesic18`) gespeichert. Push klappte im ersten Ordner, weil die
  Remote-URL den Nutzer enthielt: `https://eldinmesi@github.com/eldinmesi/matura-seite.git`.
  **Im Klon `matura-seite-1` steht die Remote-URL ohne Nutzer** (`https://github.com/eldinmesi/matura-seite`), und `git config user.name` ist `eldinmesic18`.
  Falls Push mit 403 scheitert: `git remote set-url origin https://eldinmesi@github.com/eldinmesi/matura-seite.git`
  oder Windows **Anmeldeinformationsverwaltung** → Einträge `git:https://github.com` entfernen, neu anmelden als `eldinmesi`.
- CRLF-Warnungen von Git (`LF will be replaced by CRLF`) sind harmlos. Optional `.gitattributes` mit `* text=auto`.
- **Node.js** v26.13.0 / npm 11.20.0 per `winget install OpenJS.NodeJS.LTS` installiert (`C:\Program Files\nodejs\`).
  Im Bash-Tool von Claude ist `node` nicht im PATH → `"/c/Program Files/nodejs/node"` verwenden oder `export PATH="/c/Program Files/nodejs:$PATH"`.
  ExecutionPolicy für Eldin: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (gesetzt).

### Dateien
```
faecher/<fach>/fach.json            { kuerzel, name, reihenfolge }
faecher/<fach>/<id>/thema.md        Front matter + Markdown (Ordnername = id)
faecher/<fach>/<id>/viz/*.html      Visualisierung als HTML-FRAGMENT (+ .js usw., wird 1:1 kopiert)
faecher/<fach>/<id>/bilder/*        Fotos (jpg/jpeg/png/webp), Originale bleiben hier
vorlagen/seite.html                 Gerüst aller Seiten (Kopf, Navigation, Hell/Dunkel)
vorlagen/start.html, thema.html, alle-viz.html   Inhalte der Seiten
vorlagen/viz.html                   Gerüst einer Visualisierungs-Seite
vorlagen/neues-thema.md             Vorlage für npm run neu
assets/css/style.css                alle Stile (Palette, Komponenten, v2-Teil unten angehängt)
assets/js/graph.js                  TopicGraph.create(topics) – UMD: Browser UND build.js (require)
assets/js/home.js                   Startseite: Fach-Kacheln (Filter), Karten, SVG-Graph
assets/js/thema.js                  Themenseite: Reiter, Lightbox, iframes (Höhe, Theme, Vollbild)
assets/js/viz.js                    in jeder Visualisierung: erkennt iframe, meldet Höhe, übernimmt Theme
assets/js/common.js                 Hell/Dunkel-Schalter, schickt Theme per postMessage an iframes
build.js                            faecher/ → docs/
neu.js                              npm run neu -- <fach> <id> ["Titel"]
package.json                        Abhängigkeiten: marked 18, katex 0.19, sharp 0.35
docs/                               AUSGABE (committet, nie von Hand ändern)
.gitignore                          node_modules/
```
Version-1-Dateien wurden mit `git mv` verschoben: `css/` und `js/` → `assets/`, `js/topics.js` → `assets/js/graph.js` (Themenliste daraus entfernt),
`js/rc.js` → `faecher/hwe/rc-tiefpass/viz/rc-simulation.js` (unverändert), `topics/rc-tiefpass.html` → `viz/rc-simulation.html` (nur noch Simulationsteil),
`index.html` → `vorlagen/start.html`. `.nojekyll` im Wurzelordner gelöscht (Build schreibt `docs/.nojekyll`).

### Randbedingung (weiterhin)
Keine ES-Module, kein `fetch()` im Browser, nur klassische `<script>`-Tags, alle Links relativ und bis `…/index.html` ausgeschrieben.
So funktioniert `docs/` auch per Doppelklick (`file://`). Die Themenliste kommt darum als **`docs/daten/themen.js`**
(`window.FAECHER`, `window.TOPICS`) statt als JSON.

### build.js (Ablauf)
1. **Einlesen:** `fach.json`, `thema.md` (Front matter selbst geparst: `schluessel: wert`, Listen `[a, b]`), `viz/*.html` (Titel/Kurz aus `<!-- titel: … -->`, `<!-- kurz: … -->`), `bilder/*`.
2. **Prüfen** (Fehler sammeln, dann Abbruch mit Liste): id-Format, doppelte ids, fehlender titel, unbekannter status, unbekannte/eigene `voraus`, Zyklen (`findCycle`).
   Warnungen: fehlendes `kurz`, Ordner ohne thema.md, nicht unterstützte Bildformate (.heic).
3. **Rendern** je Thema: HTML-Kommentare entfernen → Code schützen → Formeln `$$…$$`/`$…$` durch Platzhalter ersetzen (KaTeX `strict: 'error'`, Fehler mit Datei und Formel) →
   `[[id]]`/`[[id|Text]]` → Link (geplant: `<span class="link-geplant">`) → `marked` → Formeln einsetzen (Block allein im Absatz → `div.formula`) →
   `{{viz:name}}` (allein im Absatz) → `figure.viz` mit iframe → Bilder prüfen + `loading="lazy"` → unter `## Typische Fragen` jede `###` → `details.qa`.
   Inline-Regel: kein Leerzeichen direkt innen und keine Ziffer nach dem schließenden `$` (so bleibt „5 $ und 10 $“ Text).
4. **Schreiben:** nur geänderte Dateien. `docs/index.html`, `docs/alle-visualisierungen.html`, je fertigem Thema `docs/faecher/<fach>/<id>/index.html`
   und `viz/<name>.html`, `docs/daten/themen.js`, `docs/.nojekyll`, `assets/` und KaTeX-CSS + nur `.woff2`-Schriften nach `docs/assets/katex/`.
   Bilder mit sharp: `.rotate()` (EXIF), max. 1600 px nach `bilder/`, 480 px nach `bilder/klein/`; PNG bleibt PNG, JPG Qualität 82 (mozjpeg). Nur neu, wenn Original neuer.
5. **Aufräumen:** alles in `docs/`, was dieser Lauf nicht erzeugt hat, wird gelöscht (gelöschte Themen verschwinden).
- Sortierung: Fach-`reihenfolge`, dann Ebene im Graphen, dann Titel (`localeCompare('de')`).
- Vorlagen: `{{name}}`, unbekannter Platzhalter = Fehler; HTML-Kommentare in Vorlagen werden entfernt.

### Startseite (home.js)
- Fach-Kacheln „Alle“ + 9 Fächer (Kürzel, Name, „x von y fertig“), `aria-pressed`, ausgewählt: 2-px-Rand + ●.
- Filter in der Adresse: `#fach=hwe`, `#thema=<id>` wählt im Graphen aus und scrollt hin. `history.replaceState`.
- Graph bei Filter: Themen des Fachs **plus alle ihre Voraussetzungen** aus anderen Fächern (Klasse `fremd`, gestrichelter Rand, Legende darunter).
  Fach ohne Themen: Graph ausgeblendet, Hinweis `npm run neu -- <fach> thema-id`.
- Knoten: Titel (✓ bei fertig, gekürzt auf 21 Zeichen) + Zeile „KÜRZEL“ bzw. „KÜRZEL · geplant“. Zeichenwerte wie v1: 178×42, Spalten 232, Zeilen 66, Rand 24.
  Layout wie v1 (Ebenen-Spalten, Schwerpunkt-Sortierung, vertikal zentriert), leere Spalten werden übersprungen.
- Auswahl: wie v1 (orange Voraussetzungen, Rest abgeblendet, Panel mit Kette, „Darauf baut auf“, „Zur Seite →“). Chips zeigen „Titel · KÜRZEL“.
- Handy: Graph in Originalgröße, waagrecht scrollbar (`.graph-scroll svg { max-width: none }`).

### Themenseite (thema.html + thema.js)
- Reiter aus `section.tab-panel[data-reiter]`: **Zusammenfassung · Visualisierungen (n) · Bilder (n) · Vorwissen**, nur vorhandene. `role=tab`, Pfeiltasten,
  aktiver Reiter in der Adresse (`#bilder`). Ohne JS: alles untereinander mit Ersatz-Überschriften (`.nur-ohne-js`).
- Vorwissen wird **beim Build** berechnet (kein JS): Kette in Lernreihenfolge, „Darauf baut auf“, Fach-Kürzel bei anderen Fächern, Link „Im Graphen ansehen“.
- Visualisierung: `figure.viz` mit Leiste (Titel, „⛶ Vollbild“ = `iframe.requestFullscreen()`, fehlt die API → Knopf versteckt; „Neuer Tab ↗“), iframe `loading="lazy"`.
  Höhe: viz.js meldet `{vizHoehe}` per postMessage (ResizeObserver), thema.js setzt die iframe-Höhe → kein innerer Scrollbalken.
  Theme: beim Laden und beim Umschalten `{theme}` an das iframe. Eingebettet: Klasse `eingebettet` an `<html>`, Kopf ausgeblendet.
- Galerie: Vorschaubilder (`klein/`) verlinken auf groß; Lightbox (Pfeiltasten, Esc, Klick daneben), auch für Bilder im Text.

### Visualisierung RC-Tiefpass (`faecher/hwe/rc-tiefpass/viz/rc-simulation.js`, unverändert aus v1)
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
- `thema.md` RC-Tiefpass: Text der v1-Seite vollständig übernommen (MathML → LaTeX), neu: „Das Wichtigste in Kürze“, Formeltabelle mit Einheiten,
  Beispiel (R = 1 kΩ, C = 100 nF, Û_e = 5 V, f = 10 kHz → ωτ ≈ 6,28, |H| ≈ 0,157 = −16,1 dB, Û_a ≈ 0,79 V, φ ≈ −81,0°, Δt ≈ 22,5 µs; nachgerechnet).

### Test (Version 2)
Headless Chrome über `playwright-core` (nur im Scratchpad installiert, nicht im Projekt; nutzt `C:/Program Files/Google/Chrome/Application/chrome.exe`),
jeweils `file://` und lokaler http-Server, hell/dunkel, 1200 px und 390 px. Geprüft: Konsole ohne Fehler/Warnungen, Fach-Filter und Adresse, Kontrollwerte in der
Simulation (1,59 kHz, 100 µs, −3,0 dB/−45,0°, −20,0 dB/−84,3°, −5,7°), 5 aufklappbare Fragen, iframe-Höhe ohne inneren Scrollbalken, kein waagrechtes Scrollen,
Theme-Umschalter erreicht iframe, Reiter + Adresse, Lightbox, „Alle Visualisierungen“. Build-Fehlerfälle (unbekannte id, kaputte Formel) und Bildverkleinerung
(4000×3000 → 1600×1200 / 480×360, Cache) mit einem Wegwerf-Thema getestet. Leeres `favicon` (`data:,`) verhindert 404 in der Konsole.

---

## 4. Design-Regeln (verbindlich für alle Visualisierungen)

Basis ist eine **validierte Datenvisualisierungs-Palette** (Farbenblind-sicher, Kontraste geprüft). Werte stehen in `assets/css/style.css`.
- **Farbe folgt der Bedeutung:** Blau = Eingang u_e / Akzent, Orange = Ausgang u_a. In allen Diagrammen gleich, nie neu zuordnen.
- Hell: Fläche `#fcfcfb`, Seite `#f9f9f7`, Text `#0b0b0b`/`#52514e`/`#898781`, Gitter `#e1e0d9`, Achse `#c3c2b7`, Blau `#2a78d6`, Orange `#eb6834`.
- Dunkel: Fläche `#1a1a19`, Seite `#0d0d0d`, Text `#f0efec`/`#c3c2b7`, Gitter `#2c2c2a`, Achse `#383835`, Blau `#3987e5`, Orange `#d95926`.
- Reihenfolge weiterer Serienfarben (nur wenn nötig, nie zyklisch): Blau, Orange, Aqua `#1baf7a`, Gelb `#eda100`, Magenta `#e87ba4`, Grün `#008300`, Violett `#6250d6`, Rot `#e34948`.
  Neue Farbkombinationen vor Verwendung mit dem Validierungsskript prüfen.
- **Fächer haben bewusst keine eigene Farbe:** 9 Fächer > 8 Serienfarben, und Farbe soll Bedeutung tragen. Fächer werden über das Kürzel (Text) unterschieden.
- Linien 2 px (runde Enden), Punkte r ≥ 4 mit 2 px Ring in Flächenfarbe, Gitter 1 px, durchgezogen, zurückhaltend. **Keine Doppelachsen.**
- Text nie in Datenfarbe, sondern in Textfarben. Bei ≥ 2 Serien immer eine Legende. Hover-Tooltip auf Diagrammen, aufklappbare **Tabellenansicht**.
- Hell/Dunkel über CSS-Variablen, Umschalter oben rechts, Standard folgt dem System.
- Schrift: `system-ui, -apple-system, "Segoe UI", sans-serif`. Zahlen deutsch formatiert (Komma, SI-Vorsätze, schmales Leerzeichen vor der Einheit).
- Statusangaben (z. B. „fertig“) nie nur über Farbe, immer zusätzlich Zeichen oder Text.

---

## 5. Entscheidungen zum Umbau (umgesetzt am 06.11.2026)

- Ausgabe nach **`docs/`** (committet), Pages-Quelle `main` → `/docs`. Später optional GitHub Actions (dann baut GitHub beim Push selbst und `docs/` muss nicht committet werden).
- **Eigenes Build-Skript** statt VitePress (Eldin will es verstehen). Abhängigkeiten nur `marked`, `katex`, `sharp`. Front matter selbst geparst.
- Visualisierungen als **eigene Seite im iframe** (Isolation: gleiche ids/Variablen stören sich nicht; Vollbild und „Alle Visualisierungen“ verlinken direkt).
- Geplante Themen sind `thema.md` mit nur Front matter und `status: geplant` → einzige Quelle für Graph und Karten.
- Vorwissen-Reiter wird beim Build berechnet; der Graph auf der Startseite im Browser (gleicher Code `graph.js`).
- Obsidian-artige Links `[[id]]` im Text, weil Eldin das von Obsidian kennt.

---

## 6. Format von `thema.md` (auch für Zusammenfassungen aus Material)

Wenn Eldin Material schickt (Text, Heftfotos, PDF, Folien) und eine Zusammenfassung will, erzeugst du **eine fertige `thema.md`**,
die er nur noch einfügen muss. Es gibt dazu auch einen Skill `lernseite-zusammenfassung` in claude.ai
(> ⚠️ prüfen: Der Skill kennt evtl. noch `fach:` im Front matter und kennt `status`, `[[Links]]` und `###`-Fragen nicht → bei Gelegenheit anpassen).

Ausgabe: Zielpfad `faecher/<fach-ordner>/<thema>/thema.md` (Fach-Ordner siehe Tabelle in Abschnitt 2), danach **ein Codeblock mit vier Backticks** (`markdown`) mit dem kompletten Inhalt,
danach höchstens drei kurze Zeilen: Bilder (Dateinamen für `bilder/`), Visualisierungs-Idee, Befehle zum Veröffentlichen.

```
---
titel: RC-Tiefpass
voraus: [spannungsteiler, impedanz, dgl-1-ordnung]
kurz: Grenzfrequenz, Bode-Diagramm und Sprungantwort.
---
```
- Das **Fach ergibt sich aus dem Ordner**; ein `fach:`-Eintrag wird ignoriert.
- `status: geplant` → nur Graph/Karte, keine Seite. Fehlt `status` → fertig.

Danach in dieser Reihenfolge (nicht Passendes weglassen):
`## Das Wichtigste in Kürze` (3–5 Stichpunkte) · `## Erklärung` (kleine Schritte, `###`) · `## Formeln` (LaTeX `$…$` / `$$…$$`, jedes Symbol mit Einheit erklärt) ·
`## Beispiel` (vollständig durchgerechnet) · `## Typische Fragen` (3–6 Matura-Fragen: **jede Frage als `###`-Überschrift**, Antwort darunter → wird aufklappbar).
Platzhalter: `{{viz:rc-simulation}}` (eigene Zeile; Visualisierung einbetten, mit Vollbild-Knopf), `![Beschreibung](bilder/heft-seite-3.jpg)` (Foto),
`[[id]]` oder `[[id|Text]]` (Link auf ein anderes Thema).
Formel-Tipps: Gradzeichen in Formeln als `^\circ` (KaTeX streng), Betragsstriche in Tabellen als `\lvert … \rvert`, Dezimalkomma `0{,}707`.

Regeln: ids sind kebab-case ohne Umlaute (ae, oe, ue, ss); `voraus` nutzt bestehende ids, keine Zyklen. Ein Thema ist etwa 1–2 Bildschirmseiten lang,
sonst in mehrere Themen teilen. Deutsch (Österreich), Matura-Niveau HTL. Fachbegriffe beim ersten Mal erklären.

---

## 7. Roadmap (Reihenfolge)

1. ~~**Gerüst umbauen**~~ ✓ 06.11.2026: Ordnerstruktur, `build.js`, Vorlagen, Fächer-Startseite mit Filter, Reiter, Galerie, „Alle Visualisierungen“.
2. ~~RC-Tiefpass in die neue Struktur umziehen~~ ✓ 06.11.2026 (Kontrollwerte geprüft).
3. **Pages-Quelle auf `/docs` umstellen und die Live-Seite prüfen** ← als Nächstes (Eldin: push, dann sofort umstellen).
4. Weitere Visualisierungen: RLC-Schwingkreis (Resonanz, Güte, Bandbreite), Laplace/Übertragungsfunktion (Pole und Nullstellen), Bode-Diagramm, Gleichrichter/Netzteil (Glättung, Brummspannung).
5. Inhalte für die übrigen Fächer (DIC, KSN, FSST, KINZ) sammeln; Skill `lernseite-zusammenfassung` an das neue Format anpassen.
6. Optional später: Themen als „gekonnt“ markieren (localStorage) und Lücken im Graphen anzeigen; Suche; GitHub Actions statt committetem `docs/`;
   geräteübergreifende Speicherung (z. B. Supabase) nur falls wirklich gebraucht.

### Verworfene oder vertagte Ideen (damit sie nicht wieder aufkommen)
- Obsidian-Plugins und Handschrift im Browser (Stift im selben Dokument): vom Tisch, Handschrift kommt als Foto.
- Themen **im Browser** eintragen: vertagt. Inhalte liegen als Dateien im Repo (VS Code). Falls doch: localStorage plus JSON-Export/Import wäre der einfache Weg,
  Safari kann lokale Daten löschen; geräteübergreifend bräuchte es eine Datenbank.
- VitePress o. Ä.: verworfen zugunsten des eigenen Skripts.
- Fach-Farben: verworfen (siehe Abschnitt 4).
- GitHub Pages ist **öffentlich** abrufbar. Nichts Vertrauliches ins Repo legen (keine Klausurunterlagen mit Namen, keine privaten Daten).

---

## 8. Bekannte Schwächen / Ideen zum Verbessern
- Kanten im Graphen können hinter Knoten durchlaufen, wenn Themen mehrere Ebenen überspringen. Bei vielen Themen: Layout verbessern (z. B. Zwischenpunkte).
- Auf Handys scrollt der Graph horizontal (feste Breite, bewusst, sonst unlesbar).
- Lange Titel werden im Graphen nach 21 Zeichen mit „…“ gekürzt.
- Bode-Diagramme zeigen den Punkt am Rand, wenn f_g außerhalb von 1 Hz … 1 MHz liegt (f_g-Linie entfällt).
- Rechteck-Modus zeigt den eingeschwungenen Zustand, nicht das Einschwingen aus 0 V.
- `innerHTML`-Neuaufbau bei jeder Mausbewegung ist für die jetzige Größe schnell genug, bei vielen Elementen auf gezielte Updates umstellen.
- Vollbild für Visualisierungen geht auf iPhones nicht (keine Fullscreen-API für iframes) → dort „Neuer Tab“.
- iPhone-Fotos `.heic` werden nicht verarbeitet (Warnung beim Build) → als JPG exportieren.
- Bildvorschau-Cache vergleicht nur Änderungszeit; wird ein Bild durch ein älteres ersetzt, `docs/…/bilder/` löschen und neu bauen.

---

## 9. Änderungsprotokoll (hier immer ergänzen)

- **2026-11-06** · Version 1 gebaut und getestet (Startseite mit Graph, RC-Tiefpass-Simulation, Hell/Dunkel). Auf GitHub gepusht, Pages aktiviert.
  Entscheidung: Umbau auf Fach-Ordner mit `thema.md`, `viz/`, `bilder/` und Build-Skript. Skill `lernseite-zusammenfassung` in claude.ai angelegt.
  Diese Datei als Projektgedächtnis erstellt.
- **2026-11-06** · `CLAUDE.md` ins Repo gelegt (Klon `C:\HTL\matura-seite-1`). Abschnitt 3 an den Klon angepasst:
  lokaler Pfad, Commit „first commit“, Remote-URL ohne Nutzernamen (Hinweis für 403 ergänzt). Sonst keine Codeänderungen.
- **2026-11-06** · Node.js installiert. **Umbau auf Version 2** (Roadmap 1 + 2): Entscheidungen `docs/` + eigenes Skript.
  9 Fächer laut Eldin angelegt (Geografie/Geschichte entfällt). 13 Themen als `thema.md` (12 geplant, RC-Tiefpass fertig, inkl. 4 Deutsch/Englisch-Themen).
  `build.js`, `neu.js`, Vorlagen, Fach-Filter, Reiter, Galerie/Lightbox, iframe-Visualisierungen, „Alle Visualisierungen“, `[[Links]]`, aufklappbare Fragen.
  Alte Dateien per `git mv` verschoben, `.nojekyll` (Wurzel) gelöscht. Getestet (Abschnitt 3). README neu geschrieben.
  Offen: Pages auf `/docs` umstellen, Zuordnung HWE/MTRS bestätigen, Skill anpassen.
