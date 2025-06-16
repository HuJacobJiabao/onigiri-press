---
type: "blog"
title: "Math Demo"
createTime: "2025-06-06T15:22:00.000Z"
description: "A demonstration of markdown math equation functionality."
tags: ["Markdown", "Footnotes", "Demo"]
category: "Markdown"
coverImage: "./content/assets/markdown.png"
---

# Math Equations Demo

This is a demonstration of math equation rendering using KaTeX.

| Left Aligned | Center Aligned | Right Aligned |
|:------------ |:--------------:| -------------:|
| Apple        | Banana         | Cherry        |
| Dog          | Elephant       | Fox           |
| 100          | 200            | `300`           |

```latex
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\begin{bmatrix}
x \\
y
\end{bmatrix}
=
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$
```
## Inline Math

Here's an inline math equation: $E = mc^2$ which is Einstein's famous equation.

You can also write more complex inline equations like $\int_{a}^{b} x^2 dx = \frac{b^3 - a^3}{3}$.

## Display Math

Here's a display math equation:

$$
\frac{d}{dx}\left[ \int_{a}^{x} f(u) \, du\right] = f(x)
$$

Another example with matrices:

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$


## Greek Letters and Symbols

Inline: $\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta$

Display:

$$
\sum_{i=1}^{n} x_i = \mu \pm \sigma \sqrt{n}
$$

## Fractions and Roots

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

$$
\sqrt[n]{x^n + y^n} \leq \sqrt[n]{2} \cdot \max(x, y)
$$

## Limits and Integrals

$$
\lim_{x \to \infty} \frac{1}{x} = 0
$$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

This demonstrates the KaTeX integration working properly!
