/* =====================================================================
   neu.js – legt ein neues Thema an
   Aufruf:  npm run neu -- <fach> <thema-id> ["Titel"]
   Beispiel: npm run neu -- hwe gleichrichter "Gleichrichter"

   Legt an:  faecher/<fach>/<thema-id>/thema.md   (aus vorlagen/neues-thema.md)
                                        viz/       (für Visualisierungen)
                                        bilder/    (für Fotos)
   Das "--" nach "npm run neu" ist nötig, damit npm die Werte an das Skript weitergibt.
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const QUELLE = path.join(__dirname, 'faecher');
const [fach, id, ...titelTeile] = process.argv.slice(2);

function stopp(text) {
  console.error('✗ ' + text);
  process.exit(1);
}

const faecher = fs.readdirSync(QUELLE, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(QUELLE, d.name, 'fach.json')))
  .map((d) => d.name);

if (!fach || !id) {
  stopp('So geht\'s:  npm run neu -- <fach> <thema-id> ["Titel"]\n  Fächer: ' + faecher.join(', '));
}
if (!faecher.includes(fach)) {
  stopp(`Fach "${fach}" gibt es nicht. Vorhanden: ${faecher.join(', ')}\n  Neues Fach: Ordner faecher/${fach}/ mit fach.json anlegen.`);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  stopp(`"${id}" ist keine gültige id. Nur Kleinbuchstaben, Ziffern und Bindestriche, Umlaute als ae/oe/ue/ss. Beispiel: z-diode`);
}

// Gibt es die id schon in irgendeinem Fach? (ids müssen über ALLE Fächer eindeutig sein)
for (const f of faecher) {
  if (fs.existsSync(path.join(QUELLE, f, id))) stopp(`Das Thema "${id}" gibt es schon: faecher/${f}/${id}/`);
}

// Titel: angegeben, sonst aus der id (erstes Wort groß): "z-diode" → "Z diode" – bitte danach anpassen
const titel = titelTeile.join(' ') || id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');

const dir = path.join(QUELLE, fach, id);
fs.mkdirSync(path.join(dir, 'viz'), { recursive: true });
fs.mkdirSync(path.join(dir, 'bilder'), { recursive: true });
// Git speichert keine leeren Ordner → kleine Platzhalter-Datei
fs.writeFileSync(path.join(dir, 'viz', '.gitkeep'), '');
fs.writeFileSync(path.join(dir, 'bilder', '.gitkeep'), '');

const vorlage = fs.readFileSync(path.join(__dirname, 'vorlagen', 'neues-thema.md'), 'utf8');
fs.writeFileSync(path.join(dir, 'thema.md'), vorlage.replace('{{titel}}', titel));

console.log(`✓ Angelegt: faecher/${fach}/${id}/`);
console.log('  thema.md   ← Text schreiben, "voraus" eintragen, am Ende "status: geplant" löschen');
console.log('  viz/       ← Visualisierungen (name.html, siehe hwe/rc-tiefpass/viz als Beispiel)');
console.log('  bilder/    ← Fotos (JPG/PNG), werden beim Build automatisch verkleinert');
console.log('Danach:  npm run build');
