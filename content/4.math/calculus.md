---
title: 微积分
description: 
navigation:
  icon: i-lucide-sigma
---

学微积分主要是为了 AP 微积分 BC，不用学太深，学个皮毛就行，用的教材是 Stewart Calculus（《斯图尔特微积分》）。

我认为学数学是不用笔记的，这里只放习题解答吧。又因为我比较懒，习题解答只挑我觉得有价值的做。

多项式：

$$ P(x) = c_{n}x^{n} + c_{n - 1}x^{n - 1} + ... + c_{1}x + c_{0} $$

有理式：

$$ f(x) = \frac{P(x)}{Q(x)} $$

## 极限

$$\lim_{x \to a} f(x) = L \quad \Longleftrightarrow \quad \lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = L, L \in \mathbb{R} $$

**[2.2.1]**

$$ \lim_{x \to 2} f(x) = 5 $$

此式含义是：当 $ x $ 趋近于 $ 2 $ 时，$ f(x) $ 的极限是 $ 5 $。

如果 $ f(2) = 3 $，此式仍成立，因为左极限和右极限相同。

**[2.2.2]**

$$ \lim_{x \to 1^{-}} f(x) = 3, \text{且} \lim_{x \to 1^{+}} f(x) = 7 $$

此时，$ \lim\limits_{x \to 1} f(x) $ 不存在，因为左极限和右极限不相同。

**[2.2.42]**

求 $ y= \frac{x^{2} + 1}{3x - 2x^{2}} $ 的垂直渐近线

先求分母零点

$$ 3x - 2x^{2} $$
$$ x(3-2x) $$

解得

$$ x = 0, \text{或} x = \frac{3}{2} $$

验算：当 $ x = 0, \text{或} x = \frac{3}{2} $ 时，$ \text{分子} \neq 0 $

若 $ x = 0 $

$$ x^{2} + 1 = 1 \neq 0 $$

若 $ x = \frac{3}{2} $

$$ x^{2} + 1 = \frac{13}{4} \neq 0 $$

综上所述，垂直渐近线是 
$$ \text{直线} x = 0 和 \text{直线} x = \frac{3}{2}$$

### 求极限的方法

1. 对于定义域内连续的函数，可以直接带入求极限（先因式分解）
2. 求两侧极限，若相等即为极限
3. 夹逼定理

**[2.3.1]**

已知

$$ \lim_{x \to 2} f(x) = 4, \lim_{x \to 2} g(x) = -2, \lim_{x \to 2} h(x) = 0 $$

a. $$ \lim_{x \to 2} [f(x) + 5g(x)] $$
$$ = \lim_{x \to 2} f(x) + 5 \lim_{x \to 2} g(x) $$
$$ = 4 + 5 \times (-2) $$
$$ = -6 $$

b. $$ \lim_{x \to 2} [g(x)]^{3} $$
$$ = [\lim_{x \to 2} g(x)]^{3} $$
$$ = (-2)^{3} $$
$$ = -8 $$

c. $$ \lim_{x \to 2} \sqrt{f(x)} $$
$$ = \sqrt{\lim_{x \to 2} f(x)} $$
$$ = \sqrt{4} $$
$$ = 2 $$

d. $$ \lim_{x \to 2} \frac{3f(x)}{g(x)} $$
$$ = \frac{3 \lim_{x \to 2} f(x)}{\lim_{x \to 2}g(x)} $$
$$ = \frac{3 \times 4}{-2} $$
$$ = -6 $$

e. $$ \lim_{x \to 2} \frac{g(x)}{h(x)} $$
$$ = \frac{\lim_{x \to 2} g(x)}{\lim_{x \to 2} h(x)} $$
因为 $$ \lim_{x \to 2} h(x) = 0 $$
所以 $ \lim\limits_{x \to 2} \frac{g(x)}{h(x)} $ 不存在极限。

**[2.3.11]**

$$ \lim_{x \to -2}(3x - 7) $$
$$ = \lim_{x \to -2} 3x - \lim_{x \to -2} 7 $$
$$ = 3 \times (-2) - 7 $$
$$ = -13 $$

**[2.3.19]**

$$ \lim_{x \to 3} \frac{t^3 - 27}{t^2 - 9} $$
$$ = \lim_{x \to 3} \frac{t^2 + 3t + 9}{t + 3} $$
$$ = \frac{3^2 + 3 \times 3 + 9}{3 + 3} $$
$$ = \frac{9}{2} $$

**[2.3.37]**

$$ \lim_{x \to 0} x^2 \cos20 \pi x = 0 $$

证明：

$$ -1 ≤ \cos20 \pi x ≤ 1 $$
$$ -x^2 ≤ x^2 \cos20 \pi x ≤ x^2 $$
已知 $$ \lim_{x \to 0} x^2 = 0, \lim_{x \to 0} -x^2 = 0, $$
由夹逼定理得 $$ \lim_{x \to 0} x^2 \cos20 \pi x = 0 $$

**[2.3.51]**

设 $ g(x) = \frac{x^2 + x - 6}{\left| x - 2 \right|} $

1. 求下面的极限
    1. $ \lim\limits_{x \to 2^+} g(x) $
    2. $ \lim\limits_{x \to 2^-} g(x) $
2. $ \lim\limits_{x \to 2} g(x) $ 存在吗？
3. 画出 $ g $ 的图像

解:

$$ g(x) = \frac{x^2 + x - 6}{\left| x - 2 \right|} = \frac{(x + 3)(x - 2)}{\left| x - 2 \right|} $$

1.i

$$ \lim\limits_{x \to 2^+} g(x) $$
$$ = \lim\limits_{x \to 2^+} \frac{(x + 3)(x - 2)}{\left| x - 2 \right|} $$
$$ = \lim\limits_{x \to 2^+} \frac{(x + 3)(x - 2)}{x - 2} $$
$$ = \lim\limits_{x \to 2^+} (x + 3) $$
$$ = 2 + 3 $$
$$ = 5 $$

ii.

$$ \lim\limits_{x \to 2^-} g(x) $$
$$ = \lim\limits_{x \to 2^-} \frac{(x + 3)(x - 2)}{\left| x - 2 \right|} $$
$$ = \lim\limits_{x \to 2^-} \frac{(x + 3)(x - 2)}{-(x - 2)} $$
$$ = \lim\limits_{x \to 2^-} (-x - 3) $$
$$ = -2 - 3 $$
$$ = -5 $$

2.

$$ \lim\limits_{x \to 2^+} g(x) \neq \lim\limits_{x \to 2^-} g(x) $$

$ \lim\limits_{x \to 2} g(x) $ 不存在

3. 略

**[2.4.19]**

$$ \lim_{x \to 9} (1 - \frac{1}{3}x) = -2 $$

初步分析：

$$ \text{如果} 0 < \left| x - 9 \right| < \delta, 则有 \left| (1 - \frac{1}{3}x) -(-2) \right| < \varepsilon $$

$$ \text{而} \left| (1 - \frac{1}{3}x) -(-2) \right| = \left| 3 - \frac{1}{3}x \right| = \frac{1}{3} \left| x - 9 \right| $$

$$ \text{因此，我们要找到} \delta \text{使得} $$

$$ \text{如果} 0 < \left| x - 9 \right| < \delta, 则有 \frac{1}{3} \left| x - 9 \right| < \varepsilon $$

$$ \text{也就是}  $$

$$ \text{如果} 0 < \left| x - 9 \right| < \delta, 则有  \left| x - 9 \right| < 3 \varepsilon $$

$$ \text{这表明我们应该选取} \delta = 3 \varepsilon $$

证明：

$$ \text{给定} \varepsilon > 0, \text{令} \delta = 3 \varepsilon, \text{如果} 0 < \left| x - 9 \right| < \delta, 则有 $$

$$ \left| (1 - \frac{1}{3}x) -(-2) \right| = \left| 3 - \frac{1}{3}x \right| = \frac{1}{3} \left| x - 9 \right| $$

$$ \text{因此} $$

$$ \text{如果} 0 < \left| x - 9 \right| < \delta, 则有 \left| (1 - \frac{1}{3}x) -(-2) \right| < \varepsilon $$

$$ \text{由极限的定义可知}, \lim_{x \to 9} (1 - \frac{1}{3}x) = -2 $$

**[2.5.13]**

证明 $ f(x) = 3x^2 + (x + 2)^5 $ 在 $ -1 $ 处是连续的。

证明：

$ f(x) $ 是多项式函数，且定义域是 $ \mathbb{R} $，则 $ f(x) $ 在 $ \mathbb{R} $ 上是连续函数，即 $ f(x) $ 在 $ -1 $ 处连续。

**[2.5.14]**

证明 $ f(t) = \frac{t^2 + 5t}{2t + 1} $ 在 $ 2 $ 处是连续的。

证明：

$ t^2 + 5t $ 和 $ 2t + 1 $ 都是多项式函数，则二者在 $ 2 $ 处是连续的，且当 $ t = 2 $ 时 $ 2t + 1 \neq 0 $，则 $ f(t) $ 在 $ 2 $ 处是连续的。