# Matura-Lernseite

Der gesamte Matura-Stoff an einem Ort: Zusammenfassungen mit Formeln, interaktive Visualisierungen,
Fotos und ein Graph, der zeigt, was man vorher können muss.

Live: <https://eldinmesi.github.io/matura-seite/>

## Wie es funktioniert

```
faecher/      QUELLE   – hier schreibst du (Markdown, Fotos, Visualisierungen)
   │
   │  npm run build   (build.js)
   ▼
docs/         AUSGABE  – fertige Seite, wird committet, GitHub Pages zeigt sie an
```

**Nie in `docs/` von Hand ändern.** Der nächste Build überschreibt es.

## Einmalig einrichten

Node.js muss installiert sein (`node -v` zeigt eine Version). Dann im Projektordner:

```powershell
npm install
```

## Alltag

```powershell
npm run neu -- hwe gleichrichter "Gleichrichter"   # neues Thema anlegen
npm run build                                        # Seite bauen (Fehler werden genau gemeldet)
npm run vorschau                                     # docs/index.html im Browser öffnen
git add .
git commit -m "Gleichrichter"
git push                                             # nach ca. 1 Minute live
```

## Aufbau

```
faecher/
  hwe/
    fach.json                  { "kuerzel": "HWE", "name": "Hardwareentwicklung", "reihenfolge": 1 }
    rc-tiefpass/               Ordnername = id des Themas
      thema.md                 Zusammenfassung (Front matter + Markdown + Formeln)
      viz/rc-simulation.html   Visualisierung als HTML-Fragment (+ eigene .js-Dateien)
      bilder/                  Fotos (JPG/PNG/WebP), werden beim Build verkleinert
vorlagen/                      HTML-Gerüste der Seiten + Vorlage für neue Themen
assets/                        CSS und JavaScript für den Browser (wird nach docs/ kopiert)
  js/graph.js                  Voraussetzungs-Graph (benutzt von Browser UND build.js)
  js/home.js                   Startseite: Fach-Filter, Karten, Graph
  js/thema.js                  Themenseite: Reiter, Bilder-Lightbox, eingebettete Visualisierungen
  js/viz.js                    läuft in jeder Visualisierung (Höhe + Hell/Dunkel ans iframe)
  js/common.js                 Hell/Dunkel-Schalter
build.js                       baut docs/ aus faecher/
neu.js                         legt ein neues Thema an
```

## thema.md

```markdown
---
titel: RC-Tiefpass
voraus: [spannungsteiler, impedanz, dgl-1-ordnung]
kurz: Ein Satz für die Karte auf der Startseite.
status: geplant          ← solange das dasteht: nur im Graphen, keine eigene Seite
---

## Das Wichtigste in Kürze
- Formeln im Text: $f_g = \frac{1}{2\pi RC}$, als Block: $$ ... $$

{{viz:rc-simulation}}                       ← Visualisierung einbetten (eigene Zeile)
![Heft Seite 3](bilder/heft-seite-3.jpg)    ← Foto
Siehe [[impedanz]] oder [[impedanz|Text]]   ← Link auf ein anderes Thema

## Typische Fragen
### Frage?                                  ← wird zum Aufklappen
Antwort.
```

- Das **Fach** ergibt sich aus dem Ordner, nicht aus dem Front matter.
- **ids** (Ordnernamen): klein, ohne Umlaute, mit Bindestrich, z. B. `uebertragungsfunktion`.
- Ein `$` als echtes Dollarzeichen: `\$`. „5 $ und 10 $“ (mit Leerzeichen) bleibt ohnehin Text.

## Visualisierung

Eine `.html`-Datei in `viz/`, **nur der Inhalt** (kein `<html>`, kein `<head>`). Oben zwei Kommentare:

```html
<!-- titel: RC-Tiefpass – Simulation -->
<!-- kurz: R, C und f einstellen ... -->
<div class="card"> ... </div>
<script src="rc-simulation.js"></script>
```

Sie wird auf der Themenseite in einem `<iframe>` gezeigt (mit Vollbild-Knopf) und erscheint automatisch
auf der Seite „Alle Visualisierungen“. Mehrere Visualisierungen pro Thema sind möglich.

## Was der Build prüft

Doppelte ids, unbekannte ids in `voraus` oder `[[Links]]`, Zyklen im Graphen, fehlerhafte Formeln,
fehlende Bilder und Visualisierungen. Bei einem Fehler bricht er ab und nennt Datei und Grund.

## GitHub Pages

Settings → Pages → Deploy from a branch → `main` → **`/docs`**. Die Seite ist öffentlich abrufbar.
