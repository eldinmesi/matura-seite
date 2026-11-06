---
titel: Blockschaltbilder vereinfachen – Beispiele
fach: Regelungstechnik
voraus: [blockschaltbild-algebra]
kurz: Zehn durchgerechnete Blockschaltbilder (TESLA 020) mit den Ergebnissen $G(s)$ und den Lösungswegen.
---

## Das Wichtigste in Kürze
- Immer zuerst die innerste Rückkopplung oder Parallelschaltung zusammenfassen.
- Bei verschachtelten Schleifen hilft es, Summierstellen/Verzweigungen zu verlegen, bis wieder eine einfache Rückkopplung sichtbar ist.
- Probe: Ergebnis mit Zahlenwerten oder ohne Rückkopplung (Schleife = 0) auf Plausibilität prüfen.
- Alle Ergebnisse unten sind mit Computeralgebra gegen die Rechenschritte aus dem Heft geprüft. Die Schaltbilder selbst siehe Heftseiten.

## Erklärung
### Ergebnisse der zehn Beispiele
| Nr. | Ergebnis $G=X_a/X_e$ |
|---|---|
| 01 | $\dfrac{F_1\,(F_2-F_4)}{1+F_1F_3}$ |
| 02 | $\dfrac{F_1F_3F_5}{1+F_1\,(F_3F_4-F_2)}$ |
| 03 | $\dfrac{-F_1\,(F_3-F_4)\,F_5}{1-(F_3-F_4)\,F_2F_5}$ |
| 04 | $\dfrac{F_1F_2}{1-F_2F_3+F_1F_2F_4}$ |
| 05 | $\dfrac{2F_1F_2}{1+F_2-F_1\,(F_3+F_4F_5)}$ |
| 06 | $\dfrac{F_1F_2F_3}{1+F_2F_3+F_1F_2}$ |
| 07 | $\dfrac{G_1G_2}{1+G_1+G_2}$ |
| 08 | siehe Hinweis unten |
| 09 | $\dfrac{G_1G_2G_3G_4}{1+G_1G_2+G_2G_3-G_3G_4-G_1G_2G_3G_4}$ |
| 10 | $\dfrac{K\,G_1\,(G_2+G_4)}{1-G_1G_3+G_1G_2}$ |

### Beispiel 02 im Heft
![Beispiel 02](bilder/heft-beispiel-02.jpg)

Vorgehen: Mitkopplung $A=\dfrac{F_1}{1-F_1F_2}$ zusammenfassen, danach mit $F_3$ in Reihe, dann Gegenkopplung über $F_4$:
$$G=\frac{A F_3F_5}{1+F_4 A F_3}=\frac{F_1F_3F_5}{1+F_1(F_3F_4-F_2)}$$

> ⚠️ prüfen: Im Heft steht beim dritten Teilschaubild von Beispiel 02 „1 − F4·A·F3“, die Rechnung ergibt aber „1 + F4·A·F3“ (Gegenkopplung). Vorzeichen am Summierer im Original kontrollieren.

### Beispiel 05 im Heft
![Beispiel 05](bilder/heft-beispiel-05.jpg)

Erst $P=\dfrac{F_2}{1+F_2}$ (innere Gegenkopplung), dann Verlegung von $F_2$ auf die Rückführung ($1/F_2$) und äußere Mitkopplung mit $F_3+F_4F_5$.

### Beispiel 07: Fehlversuch und Korrektur
Beim ersten Versuch (blau) wurde die Verzweigung nicht korrekt verlegt, das Ergebnis weicht ab. Die richtige Rechnung (rot) ergibt
$$G=\frac{G_1G_2}{1+G_1+G_2}.$$
Gelernt: nach jedem Verlegen den Korrekturfaktor ($F$ oder $1/F$) prüfen.

### Beispiel 10 im Heft
![Beispiel 10, Fehlversuch](bilder/heft-beispiel-10-fehlversuch.jpg)
![Beispiel 10, Lösung](bilder/heft-beispiel-10-loesung.jpg)

Mit den Hilfsnamen $A=G_1$, $B=G_2$, $C=G_3$, $D=G_4$:
$$Z=\frac{\frac{A}{1-AC}}{1+\frac{AB}{1-AC}},\qquad G=K\,Z\,(B+D)=\frac{K\,G_1(G_2+G_4)}{1-G_1G_3+G_1G_2}$$

### Beispiel 08 (unsicher)
Zwei Rechenwege im Heft führen auf unterschiedliche Nenner:
- Weg 1 (Seiten 12–14): $G=\dfrac{F_1F_2F_3F_4}{1+F_2F_3F_4-F_1F_2+F_1F_2F_3}$
- Weg 2 / Merkregel im Kasten (Seiten 15–16): $G=\dfrac{F_1F_2F_3F_4}{1-F_1F_2F_3+F_1F_2+F_2F_3F_4}$

Beide Wege sind in sich rechnerisch stimmig, unterscheiden sich aber im Vorzeichen des Terms $F_1F_2F_3$.

> ⚠️ prüfen: Welcher Nenner zum Schaltbild gehört, kann ich aus der Handschrift nicht sicher sagen (Vorzeichen an einer Summierstelle oder beim Verlegen). Bitte am Original nachsehen und den falschen Weg streichen.

> ⚠️ prüfen: Beispiel 09 – der letzte Bruch im Heft ist unvollständig, die Notiz „G1-4 / (1+G1G2+G2G3)“ passt nicht zum Ergebnis oben. Die Tabelle zeigt das aus den Rechenschritten rekonstruierte Ergebnis.

## Formeln
$$G=\frac{F_\text{vor}}{1\pm F_\text{vor}F_\text{rück}}$$

Beispiel mit Hilfsblock (Bsp. 04): $V=\dfrac{F_1F_2}{1-F_2F_3}$, dann $G=\dfrac{V}{1+VF_4}=\dfrac{F_1F_2}{1-F_2F_3+F_1F_2F_4}$.

## Beispiel
Beispiel 04 vollständig:
1. Innere Mitkopplung um $F_2$ mit Rückführung $F_3$: $V=\dfrac{F_1F_2}{1-F_2F_3}$.
2. Äußere Gegenkopplung mit $F_4$: $G=\dfrac{V}{1+V F_4}$.
3. Einsetzen und mit $(1-F_2F_3)$ erweitern: $G=\dfrac{F_1F_2}{1-F_2F_3+F_1F_2F_4}$.

## Typische Fragen
**Womit fängt man bei verschachtelten Rückkopplungen an?**
Mit der innersten Schleife. Sie wird zu einem Block, dann arbeitet man nach außen.

**Was tut man, wenn zwei Schleifen sich überlappen?**
Eine Summierstelle oder Verzweigung so verlegen, dass die Schleifen getrennt werden, und den Korrekturfaktor $F$ bzw. $1/F$ ergänzen.

**Wie prüft man das Ergebnis?**
Rückführungen auf null setzen (Ergebnis wird zur reinen Reihen-/Parallelschaltung) und mit einfachen Zahlenwerten gegenrechnen.

**Woran erkennt man ein Vorzeichenproblem?**
Am Summierer: Minus ergibt $+$ im Nenner, Plus ergibt $-$. Fehler passieren meist beim Verlegen.
