---
titel: Algebra von Blockschaltbildern
fach: Regelungstechnik
voraus: [uebertragungsfunktion, laplace]
kurz: Mit welchen Regeln man ein Blockschaltbild Schritt für Schritt zu einer einzigen Übertragungsfunktion vereinfacht.
---

## Das Wichtigste in Kürze
- Reihenschaltung: Blöcke **multiplizieren** sich. Parallelschaltung: Blöcke **addieren** (bzw. subtrahieren) sich.
- Rückkopplung: $G = \dfrac{F_\text{vor}}{1 \pm F_\text{vor}\,F_\text{rück}}$. Das Vorzeichen im Nenner ist **das Gegenteil** vom Vorzeichen am Summierpunkt.
- Summierstellen und Verzweigungen darf man über Blöcke **verlegen**, wenn man den verschobenen Zweig mit $F$ bzw. $1/F$ korrigiert ($F\neq 0$).
- Eine Summierstelle und eine Verzweigung darf man **nie** gegeneinander vertauschen.
- Vorgehen: Rückkopplung oder Parallelschaltung suchen, durch einen Block ersetzen, wiederholen, bis ein Block übrig ist.

## Erklärung
### Warum das alles erlaubt ist
- Die Blöcke sind lineare, zeitinvariante Systeme (LTI). Ihre Übertragungsfunktionen $F(s)$ sind Zahlen (komplexe Zahlen, für jedes $s$) und folgen den Körperaxiomen:
  - Kommutativ: $a+b=b+a$, $a\cdot b=b\cdot a$
  - Assoziativ: $(a+b)+c=a+(b+c)$
  - Distributiv: $a(b+c)=ab+ac$
- Deshalb darf man Blöcke in einer Reihe vertauschen und Summierstellen umordnen.

![Körperaxiome im Heft](bilder/heft-koerperaxiome.jpg)

### Die drei Grundschaltungen
![Grundregeln im Heft](bilder/heft-grundregeln.jpg)

- **Reihe:** $X_a = F_2 F_1 X_e$, also $G=F_1F_2$.
- **Parallel:** $X_a=(F_1 \pm F_2)X_e$ (Vorzeichen je nach Summierstelle).
- **Rückkopplung:** Aus $X_a = F\,(X_e \mp H X_a)$ folgt durch Auflösen die Formel unten. Gegenkopplung (Minus am Summierer) ergibt $+$ im Nenner, Mitkopplung (Plus) ergibt $-$.

### Summierstelle oder Verzweigung über einen Block verlegen
![Verlegung im Heft](bilder/heft-verlegung.jpg)

- **Summierstelle** von hinter $F$ nach vor $F$: das zusätzliche Signal muss durch $1/F$ geteilt werden. Nach hinten: mit $F$ multiplizieren.
- **Verzweigung** von vor $F$ nach hinter $F$: der abgezweigte Pfad bekommt $F$. Von hinten nach vorne: $1/F$.
- Probe mit Zahlen: $(2+3)\cdot 2 = 2\cdot 2 + 3\cdot 2 = 10$.

### Was verboten ist
![Summierstelle und Verzweigung tauschen](bilder/heft-summier-verzweigung-tausch.jpg)

Eine Summierstelle und eine Verzweigung direkt hintereinander dürfen nicht vertauscht werden, weil sich das Signal dadurch ändert (an der Verzweigung wird ein Signal abgegriffen, das schon summiert war).

### Vereinfachen in Schritten
1. Eine Rückkopplung oder Parallelschaltung suchen, die nur aus Blöcken besteht.
2. Durch **einen** Block ersetzen und ihm eine Hilfsbezeichnung geben ($A$, $B$, $P$, $Q$, $Z$).
3. Falls nichts mehr zusammenfassbar ist: eine Summierstelle oder Verzweigung verlegen, dann weiter bei 1.
4. Am Ende Hilfsbezeichnungen wieder einsetzen und den Bruch zusammenfassen.

{{viz:blockschaltbild-vereinfachen}}

## Formeln
$$G_\text{Reihe}=F_1F_2 \qquad G_\text{parallel}=F_1\pm F_2$$

$$G_\text{Rückkopplung}=\frac{F_\text{vor}}{1\pm F_\text{vor}F_\text{rück}}\qquad(+:\ \text{Gegenkopplung},\ -:\ \text{Mitkopplung})$$

- $F_\text{vor}$: Übertragungsfunktion des Vorwärtszweigs (dimensionslos bzw. Einheit Ausgang/Eingang)
- $F_\text{rück}$: Übertragungsfunktion des Rückwärtszweigs
- $G$: Gesamtübertragungsfunktion $X_a/X_e$

## Beispiel
Vorwärtsblock $F_\text{vor}=4$, Rückführung $F_\text{rück}=0{,}25$, Gegenkopplung.

- Ansatz: $X_a = 4\,(X_e - 0{,}25\,X_a)$
- Umformen: $X_a(1+1)=4X_e$
- Ergebnis: $G = 4/(1+4\cdot0{,}25) = 2$ (Probe mit der Formel stimmt).

> ⚠️ prüfen: Das Zahlenbeispiel auf Heftseite 1 (Werte 1, 2, 0,5, 2) war schwer lesbar und ist hier nicht übernommen. Das Beispiel oben ist neu gerechnet.

## Typische Fragen
**Wie berechnet man eine Rückkopplung?**
$G=F_\text{vor}/(1\pm F_\text{vor}F_\text{rück})$. Gegenkopplung: $+$ im Nenner, Mitkopplung: $-$.

**Warum darf man Blöcke einfach multiplizieren?**
Weil die Blöcke LTI-Systeme sind und ihre Übertragungsfunktionen mit Zahlen rechnen, die den Körperaxiomen (Kommutativ, Assoziativ, Distributiv) folgen.

**Was passiert, wenn ich eine Summierstelle vor einen Block $F$ schiebe?**
Der zweite Eingang muss durch $F$ geteilt werden, sonst ändert sich das Gesamtsystem. Voraussetzung: $F\neq0$.

**Warum darf man Summierstelle und Verzweigung nicht tauschen?**
An der Verzweigung wird ein anderes Signal abgegriffen als vorher, die Rückführung würde das falsche Signal sehen.

**Wie gehe ich bei einem großen Blockschaltbild vor?**
Innen anfangen: Rückkopplung bzw. Parallelschaltung zu einem Block zusammenfassen, Hilfsnamen vergeben, wiederholen.
