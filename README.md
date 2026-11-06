# Matura-Lernseite

Kleine statische Seite (nur HTML, CSS und JavaScript, kein Build-Schritt, keine Abhängigkeiten).
Zum Ansehen reicht ein Doppelklick auf `index.html`.

## Aufbau

```
index.html            Startseite: Themenkarten + Zusammenhangs-Graph
topics/               eine HTML-Datei pro Thema
  rc-tiefpass.html    fertig: interaktiver RC-Tiefpass
js/topics.js          Liste aller Themen und ihrer Voraussetzungen
js/rc.js              Simulation (Formeln, Diagramme, Regler)
css/style.css         Farben (hell/dunkel) und Layout
```

## Veröffentlichen mit GitHub Pages

1. Auf github.com ein neues Repository anlegen, z. B. `matura-seite` (leer, ohne README).
2. Im Ordner dieser Seite:

```
git init
git add .
git commit -m "Erste Version"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/matura-seite.git
git push -u origin main
```

3. Im Repository: **Settings → Pages → Source: Deploy from a branch → Branch `main`, Ordner `/ (root)`** → Save.
4. Nach ca. einer Minute ist die Seite unter `https://DEIN-NAME.github.io/matura-seite/` erreichbar.

Hinweis: Eine GitHub-Pages-Seite ist öffentlich abrufbar, wer den Link kennt, kann sie sehen.

Jede weitere Änderung: `git add .`, `git commit -m "..."`, `git push`. Die Seite aktualisiert sich von selbst.

## Neues Thema hinzufügen

1. In `js/topics.js` einen Eintrag ergänzen. `voraus` ist die Liste der Themen, die man vorher können muss:

```js
{ id: 'bode-diagramm', title: 'Bode-Diagramm', fach: 'Elektronik', status: 'fertig',
  file: 'bode-diagramm.html', voraus: ['uebertragungsfunktion', 'rc-tiefpass'], kurz: '...' }
```

2. `topics/rc-tiefpass.html` kopieren, umbenennen, `data-topic` im `<body>` auf die neue `id` setzen und den Inhalt ersetzen.

Der Graph auf der Startseite und der Kasten „Das solltest du vorher können“ auf jeder Themenseite bauen sich aus `voraus` automatisch auf.
