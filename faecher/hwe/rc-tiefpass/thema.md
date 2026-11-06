---
titel: RC-Tiefpass
voraus: [spannungsteiler, impedanz, dgl-1-ordnung]
kurz: Ein Widerstand und ein Kondensator lassen tiefe Frequenzen durch und dämpfen hohe. Grenzfrequenz, Bode-Diagramm und Sprungantwort zum Ausprobieren.
---

## Das Wichtigste in Kürze

- Der RC-Tiefpass ist ein **Spannungsteiler** aus $R$ und $C$. Der Ausgang $u_a$ wird am Kondensator abgegriffen.
- **Grenzfrequenz** $f_g = \dfrac{1}{2\pi RC}$: Dort ist der Ausgang um **−3 dB** gedämpft (Faktor 0,707), die Phase beträgt **−45°**.
- Oberhalb von $f_g$ fällt der Betrag mit **−20 dB pro Dekade**, die Phase geht gegen −90°.
- Im Zeitbereich: Zeitkonstante $\tau = R \cdot C$. Nach $1\,\tau$ sind 63,2 % erreicht, nach $5\,\tau$ rund 99,3 %.

## Ausprobieren

Verändere die Werte und sieh, was mit Amplitude, Phase und Zeitverlauf passiert.

{{viz:rc-simulation}}

## Erklärung

### 1. Die Idee

Der Kondensator hat einen frequenzabhängigen Blindwiderstand $X_C = \dfrac{1}{\omega C}$. Bei tiefen Frequenzen ist er sehr groß, fast die gesamte Spannung liegt am Ausgang. Bei hohen Frequenzen ist er klein und „schließt“ das Signal gegen Masse kurz, am Ausgang bleibt wenig übrig.

### 2. Spannungsteiler mit komplexen Widerständen

Der Tiefpass ist ein [[spannungsteiler|Spannungsteiler]] aus $R$ und dem Kondensator $\underline{Z}_C = \dfrac{1}{j\omega C}$:

$$
\underline{H}(j\omega) = \frac{\underline{U}_a}{\underline{U}_e} = \frac{\underline{Z}_C}{R + \underline{Z}_C} = \frac{1}{1 + j\omega RC}
$$

### 3. Grenzfrequenz, Betrag und Phase

Mit der Zeitkonstante $\tau = R \cdot C$ gilt:

$$
f_g = \frac{1}{2\pi RC} \qquad |\underline{H}| = \frac{1}{\sqrt{1 + (\omega\tau)^2}} \qquad \varphi = -\arctan(\omega\tau)
$$

Bei $f = f_g$ ist $\omega \tau = 1$. Dann ist $|\underline{H}| = 1/\sqrt{2} \approx 0{,}707$ (das sind −3 dB) und die Phase genau −45°. Oberhalb von $f_g$ fällt der Betrag mit −20 dB pro Dekade, die Phase nähert sich −90°.

### 4. Im Zeitbereich: die Sprungantwort

Legt man eine Gleichspannung $\hat{U}$ sprunghaft an, lädt sich der Kondensator auf:

$$
u_a(t) = \hat{U} \cdot \left(1 - e^{-t/\tau}\right)
$$

Nach $1\,\tau$ sind 63,2 % erreicht, nach $5\,\tau$ rund 99,3 %. Wähle oben „Rechteck“, dann siehst du das Auf- und Entladen direkt. Zusammenhang der beiden Welten: $f_g = \dfrac{1}{2\pi \tau}$.

## Formeln

| Formel | Bedeutung |
|---|---|
| $\tau = R \cdot C$ | Zeitkonstante in s |
| $f_g = \dfrac{1}{2\pi RC} = \dfrac{1}{2\pi\tau}$ | Grenzfrequenz in Hz |
| $\underline{H}(j\omega) = \dfrac{1}{1 + j\omega RC}$ | Übertragungsfunktion (komplex, ohne Einheit) |
| $\lvert\underline{H}\rvert = \dfrac{1}{\sqrt{1+(\omega\tau)^2}}$ | Betrag = $\hat{U}_a / \hat{U}_e$ |
| $\lvert\underline{H}\rvert_{\text{dB}} = 20 \cdot \log_{10} \lvert\underline{H}\rvert$ | Betrag in dB |
| $\varphi = -\arctan(\omega\tau)$ | Phasenverschiebung des Ausgangs in ° |
| $u_a(t) = \hat{U}\left(1 - e^{-t/\tau}\right)$ | Sprungantwort (Aufladen) |

Symbole: $R$ Widerstand in Ω, $C$ Kapazität in F, $f$ Frequenz in Hz, $\omega = 2\pi f$ Kreisfrequenz in 1/s, $\hat{U}$ Amplitude bzw. Sprunghöhe in V, $t$ Zeit in s.

### Merkwerte

| Frequenz | $\lvert\underline{H}\rvert$ | Betrag in dB | Phase |
|---|---|---|---|
| $f_g / 10$ | 0,995 | −0,04 dB | −5,7° |
| $f_g$ | 0,707 | −3,01 dB | −45° |
| $10 \cdot f_g$ | 0,0995 | −20,04 dB | −84,3° |
| $100 \cdot f_g$ | 0,01 | −40,0 dB | −89,4° |

## Beispiel

**Angabe:** $R = 1\,\text{k}\Omega$, $C = 100\,\text{nF}$. Am Eingang liegt ein Sinus mit $\hat{U}_e = 5\,\text{V}$ und $f = 10\,\text{kHz}$. Gesucht: $\tau$, $f_g$, $\hat{U}_a$ und die Phasenverschiebung.

1. Zeitkonstante: $\tau = R \cdot C = 1000\,\Omega \cdot 100 \cdot 10^{-9}\,\text{F} = 100\,\mu\text{s}$
2. Grenzfrequenz: $f_g = \dfrac{1}{2\pi \cdot 100\,\mu\text{s}} \approx 1{,}59\,\text{kHz}$
3. Hilfsgröße: $\omega\tau = 2\pi \cdot 10\,000\,\text{Hz} \cdot 100\,\mu\text{s} \approx 6{,}28$
4. Betrag: $|\underline{H}| = \dfrac{1}{\sqrt{1 + 6{,}28^2}} \approx 0{,}157$, das sind $20 \cdot \log_{10}(0{,}157) \approx -16{,}1\,\text{dB}$
5. Ausgangsamplitude: $\hat{U}_a = 0{,}157 \cdot 5\,\text{V} \approx 0{,}79\,\text{V}$
6. Phase: $\varphi = -\arctan(6{,}28) \approx -81{,}0^\circ$. Als Zeit: $\Delta t = \dfrac{81{,}0^\circ}{360^\circ} \cdot \dfrac{1}{10\,\text{kHz}} \approx 22{,}5\,\mu\text{s}$ Verzögerung.

**Ergebnis:** Die 10 kHz liegen gut über $f_g$, darum kommen nur noch rund 0,79 V an, und der Ausgang eilt um etwa 81° nach. Prüfen kannst du das oben in der Simulation (Standardwerte R = 1 kΩ, C = 100 nF).

## Typische Fragen

### Was passiert mit $f_g$, wenn R verdoppelt wird?

$f_g = 1/(2\pi RC)$ ist umgekehrt proportional zu $R$. Bei doppeltem $R$ halbiert sich die Grenzfrequenz. Dasselbe gilt für $C$.

### Wie stark wird eine Frequenz bei $10 \cdot f_g$ gedämpft?

Um knapp 20 dB, also etwa auf ein Zehntel der Amplitude ($|\underline{H}| \approx 0{,}0995$).

### Warum ist die Phase bei $f_g$ genau −45°?

Bei $f_g$ ist $\omega RC = 1$, der Nenner $1 + j$ hat gleich großen Real- und Imaginärteil. Also $\varphi = -\arctan(1) = -45^\circ$.

### Wie lange dauert es bei einem Spannungssprung, bis der Ausgang etwa 99 % erreicht?

Rund $5\,\tau$. Die Anstiegszeit von 10 % auf 90 % beträgt etwa $2{,}2\,\tau$.

### Welche Steigung hat die Betragskennlinie oberhalb von $f_g$?

−20 dB pro Dekade (entspricht etwa −6 dB pro Oktave), weil der Tiefpass 1. Ordnung ist.
