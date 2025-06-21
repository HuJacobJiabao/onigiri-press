---
type: "blog"
title: "Complete Markdown Features Demo"
createTime: "2025-06-13T16:30:55.818Z"
description: "A comprehensive demonstration of all markdown features supported by this portfolio framework, including advanced syntax, tables, code blocks, and custom extensions."
tags: ["Markdown", "Demo", "Documentation", "Tutorial", "Features"]
category: "Markdown"
coverImage: "./content/assets/markdown.png"
---

# {{title}}

This document serves as a comprehensive demonstration of all the markdown features supported by this portfolio framework. It showcases the powerful combination of standard markdown syntax with advanced features powered by **markdown-it** and custom plugins.

## Table of Contents

1. [Headers and Typography](#headers-and-typography)
2. [Text Formatting](#text-formatting)
3. [Lists and Organization](#lists-and-organization)
4. [Links and References](#links-and-references)
5. [Images and Media](#images-and-media)
6. [Code and Syntax Highlighting](#code-and-syntax-highlighting)
7. [Tables](#tables)
8. [Mathematical Expressions](#mathematical-expressions)
9. [Blockquotes and Callouts](#blockquotes-and-callouts)
10. [Advanced Features](#advanced-features)

---

## Headers and Typography

### All Header Levels

# H1 - Main Document Title
## H2 - Major Section Headers
### H3 - Subsection Headers
#### H4 - Sub-subsection Headers
##### H5 - Minor Headers
###### H6 - Smallest Headers

**Markdown Code:**
```markdown
# H1 - Main Document Title
## H2 - Major Section Headers
### H3 - Subsection Headers
#### H4 - Sub-subsection Headers
##### H5 - Minor Headers
###### H6 - Smallest Headers
```

### Horizontal Rules

Content above the line.

---

Content below the line.

***

**Markdown Code:**
```markdown
Content above the line.

---

Content below the line.

***
```

Alternative horizontal rule style.

___


## Text Formatting

### Basic Formatting

**Bold text** and __alternative bold syntax__

*Italic text* and _alternative italic syntax_

***Bold and italic*** combined

~~Strikethrough text~~

`Inline code` with backticks

**Markdown Code:**
```markdown
**Bold text** and __alternative bold syntax__

*Italic text* and _alternative italic syntax_

***Bold and italic*** combined

~~Strikethrough text~~

`Inline code` with backticks
```

### Advanced Typography

- **Mark/Highlight**: ==highlighted text==

**Markdown Code:**
```markdown
==highlighted text==
```


## Lists and Organization

### Unordered Lists

- Main item 1
- Main item 2
  - Nested item 2.1
  - Nested item 2.2
    - Deeply nested item 2.2.1
    - Deeply nested item 2.2.2
- Main item 3

**Markdown Code:**
```markdown
- Main item 1
- Main item 2
  - Nested item 2.1
  - Nested item 2.2
    - Deeply nested item 2.2.1
    - Deeply nested item 2.2.2
- Main item 3
```

### Ordered Lists

1. First ordered item
2. Second ordered item
   1. Nested numbered item
   2. Another nested item
      1. Deeply nested numbered item
      2. Another deeply nested item
3. Third ordered item

**Markdown Code:**
```markdown
1. First ordered item
2. Second ordered item
   1. Nested numbered item
   2. Another nested item
      1. Deeply nested numbered item
      2. Another deeply nested item
3. Third ordered item
```

### Task Lists


- [x] Completed task
- [x] Another completed task
- [ ] Pending task
- [ ] Another pending task
  - [x] Completed subtask
  - [ ] Pending subtask

**Markdown Code:**
```markdown
- [x] Completed task
- [x] Another completed task
- [ ] Pending task
- [ ] Another pending task
  - [x] Completed subtask
  - [ ] Pending subtask
```

### Definition Lists

Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Alternative definition for term 2

Complex Term
: This is a more complex definition that spans multiple lines
  and includes detailed explanations with **formatting**.

**Markdown Code:**
```markdown
Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Alternative definition for term 2

Complex Term
: This is a more complex definition that spans multiple lines
  and includes detailed explanations with **formatting**.
```



## Links and References

### Basic Links

[External Link](https://example.com)

[Link with Title](https://example.com "This is a tooltip")

<https://automatic-link.com>

### Reference Links

This is a [reference link][ref1] and another [reference link][ref2].

[ref1]: https://example.com "Reference 1"
[ref2]: https://example.com "Reference 2"

### Internal Navigation

[Go to Code Section](#code-and-syntax-highlighting)

[Jump to Tables](#tables)

## Images and Media

### Basic Images

![Alt text](https://w.wallhaven.cc/full/l8/wallhaven-l83e5l.png "Demo Image")

### Images with Links

[![Linked Image](https://w.wallhaven.cc/full/l8/wallhaven-l83e5l.png "Click me!")](https://example.com)

### Image References

![Reference Image][demo-img]

[demo-img]: https://w.wallhaven.cc/full/l8/wallhaven-l83e5l.png "Reference Image"

```markdown

![Alt text](https://w.wallhaven.cc/full/l8/wallhaven-l83e5l.png "Demo Image")

### Images with Links

[![Linked Image](https://w.wallhaven.cc/full/l8/wallhaven-l83e5l.png "Click me!")](https://example.com)

### Image References

![Reference Image][demo-img]

[demo-img]: https://w.wallhaven.cc/full/l8/wallhaven-l83e5l.png "Reference Image"
```

## Code and Syntax Highlighting

### Inline Code

Use `console.log()` for debugging, `npm install` for packages, and `git commit` for version control.

### Code Blocks

```javascript
// JavaScript example with syntax highlighting
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Arrow function example
const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);

console.log(fibonacci(10)); // 55
console.log(factorial(5));  // 120
```

```python
# Python example with syntax highlighting
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Example usage
numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quicksort(numbers)
print(sorted_numbers)  # [1, 1, 2, 3, 6, 8, 10]
```

```typescript
// TypeScript example with interfaces and generics
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

class UserService<T extends User> {
  private users: T[] = [];

  async createUser(userData: Omit<T, 'id' | 'createdAt'>): Promise<T> {
    const newUser = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date(),
    } as T;
    
    this.users.push(newUser);
    return newUser;
  }

  async findUserById(id: number): Promise<T | undefined> {
    return this.users.find(user => user.id === id);
  }

  private generateId(): number {
    return Math.max(0, ...this.users.map(u => u.id)) + 1;
  }
}
```

```css
/* CSS example with modern features */
.markdown-content {
  --primary-color: #4f46e5;
  --secondary-color: #10b981;
  --border-radius: 8px;
  
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.6;
  color: #374151;
}

.code-block {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  overflow-x: auto;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
}

@media (max-width: 768px) {
  .markdown-content {
    font-size: 14px;
    padding: 1rem;
  }
}
```

```bash
# Bash/Shell script example
#!/bin/bash

# Function to deploy application
deploy_app() {
    local environment=$1
    local version=$2
    
    echo "Deploying version $version to $environment..."
    
    # Build the application
    npm run build
    
    # Run tests
    npm test
    
    # Deploy based on environment
    case $environment in
        "staging")
            echo "Deploying to staging..."
            # staging deployment commands
            ;;
        "production")
            echo "Deploying to production..."
            # production deployment commands
            ;;
        *)
            echo "Unknown environment: $environment"
            exit 1
            ;;
    esac
    
    echo "Deployment completed successfully!"
}

# Usage
deploy_app "staging" "v1.2.3"
```

```sql
-- SQL example with complex queries
WITH user_stats AS (
    SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(p.id) as post_count,
        MAX(p.created_at) as last_post_date,
        AVG(p.view_count) as avg_views
    FROM users u
    LEFT JOIN posts p ON u.id = p.author_id
    WHERE u.active = true
    GROUP BY u.id, u.name, u.email
),
top_users AS (
    SELECT *,
        ROW_NUMBER() OVER (ORDER BY post_count DESC, avg_views DESC) as rank
    FROM user_stats
    WHERE post_count > 0
)
SELECT 
    rank,
    name,
    email,
    post_count,
    ROUND(avg_views, 2) as avg_views,
    last_post_date
FROM top_users
WHERE rank <= 10
ORDER BY rank;
```

```json
{
  "name": "markdown-demo",
  "version": "1.0.0",
  "description": "Complete markdown features demonstration",
  "author": {
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "dependencies": {
    "markdown-it": "^13.0.1",
    "prismjs": "^1.29.0",
    "katex": "^0.16.8"
  },
  "scripts": {
    "build": "vite build",
    "dev": "vite dev",
    "preview": "vite preview"
  },
  "keywords": ["markdown", "demo", "documentation"]
}
```

## Tables

### Basic Table

| Feature | Support | Notes |
|---------|---------|-------|
| Headers | ✅ Full | All heading levels |
| Lists | ✅ Full | Ordered, unordered, tasks |
| Links | ✅ Full | Internal and external |
| Images | ✅ Full | With alt text and titles |
| Code | ✅ Full | Syntax highlighting |
| Tables | ✅ Full | Responsive design |

**Markdown Code:**
```markdown
| Feature | Support | Notes |
|---------|---------|-------|
| Headers | ✅ Full | All heading levels |
| Lists | ✅ Full | Ordered, unordered, tasks |
| Links | ✅ Full | Internal and external |
| Images | ✅ Full | With alt text and titles |
| Code | ✅ Full | Syntax highlighting |
| Tables | ✅ Full | Responsive design |
```

### Advanced Table with Alignment

| Left Aligned | Center Aligned | Right Aligned | Description |
|:-------------|:--------------:|--------------:|:------------|
| Apple        | Banana         | Cherry        | Fruits |
| Dog          | Elephant       | Fox           | Animals |
| 100          | 200            | 300           | Numbers |
| Short        | Medium length  | Very long text content | Text lengths |

**Markdown Code:**
```markdown
| Left Aligned | Center Aligned | Right Aligned | Description |
|:-------------|:--------------:|--------------:|:------------|
| Apple        | Banana         | Cherry        | Fruits |
| Dog          | Elephant       | Fox           | Animals |
| 100          | 200            | 300           | Numbers |
| Short        | Medium length  | Very long text content | Text lengths |
```

### Complex Table with Rich Content

| Technology | Difficulty | Learning Time | Description |
|------------|:----------:|:-------------:|-------------|
| **HTML** | 🟢 Easy | 1-2 weeks | Foundation of web development |
| **CSS** | 🟡 Medium | 2-4 weeks | Styling and layout language |
| **JavaScript** | 🟡 Medium | 1-3 months | Programming language for web |
| **React** | 🔴 Hard | 3-6 months | Component-based UI library |
| **TypeScript** | 🔴 Hard | 2-4 months | Typed superset of JavaScript |

**Markdown Code:**
```markdown
| Technology | Difficulty | Learning Time | Description |
|------------|:----------:|:-------------:|-------------|
| **HTML** | 🟢 Easy | 1-2 weeks | Foundation of web development |
| **CSS** | 🟡 Medium | 2-4 weeks | Styling and layout language |
| **JavaScript** | 🟡 Medium | 1-3 months | Programming language for web |
| **React** | 🔴 Hard | 3-6 months | Component-based UI library |
| **TypeScript** | 🔴 Hard | 2-4 months | Typed superset of JavaScript |
```

### Wide Table (Testing Horizontal Scroll)

| Col 1 | Col 2 | Col 3 | Col 4 | Col 5 | Col 6 | Col 7 | Col 8 | Col 9 | Col 10 |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|--------|
| Data 1 | Data 2 | Data 3 | Data 4 | Data 5 | Data 6 | Data 7 | Data 8 | Data 9 | Data 10 |
| Information A | Information B | Information C | Information D | Information E | Information F | Information G | Information H | Information I | Information J |
| Content X | Content Y | Content Z | Content AA | Content BB | Content CC | Content DD | Content EE | Content FF | Content GG |

## Mathematical Expressions

### Inline Math

Here's an inline equation: $E = mc^2$ which is Einstein's famous equation.

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.

**Markdown Code:**
```markdown
Here's an inline equation: $E = mc^2$ which is Einstein's famous equation.

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.
```

### Block Math

Note: KaTeX does not support single quote (') in derivatives; use `\prime` instead for correct rendering.
<div class="info info-blue">
    > ℹ️ For block math, leave a blank line before and after the block for correct rendering.
</div>


$$
\begin{align}
f(x) &= ax^2 + bx + c \\
f^{\prime}(x) &= 2ax + b \\
f^{\prime\prime}(x) &= 2a
\end{align}
$$

**Markdown Code:**
```Latex
$$
\begin{align}
f(x) &= ax^2 + bx + c \\
f^{\prime}(x) &= 2ax + b \\
f^{\prime\prime}(x) &= 2a
\end{align}
$$
```

Complex mathematical expressions:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

**Markdown Code:**
```latex
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

Matrix notation:

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

## Blockquotes and Callouts

### Basic Blockquotes

> This is a simple blockquote. It can contain multiple lines
> and will be styled consistently throughout.

> **Important Note**: This blockquote contains **bold text** and *italic text*
> to demonstrate that formatting works within quotes.

**Markdown Code:**
```markdown
> This is a simple blockquote. It can contain multiple lines
> and will be styled consistently throughout.

> **Important Note**: This blockquote contains **bold text** and *italic text*
> to demonstrate that formatting works within quotes.
```

### Nested Blockquotes

> This is the first level of quoting.
>
> > This is nested blockquote.
> >
> > > This is a third level nested quote.
>
> Back to the first level.

**Markdown Code:**
```markdown
> This is the first level of quoting.
>
> > This is nested blockquote.
> >
> > > This is a third level nested quote.
>
> Back to the first level.
```

### Blockquotes with Attribution

> "The best way to predict the future is to create it."
>
> — Peter Drucker

**Markdown Code:**
```markdown
> "The best way to predict the future is to create it."
>
> — Peter Drucker
```

> "In the middle of difficulty lies opportunity."
>
> — Albert Einstein

## Advanced Features

### Footnotes

This text has a footnote[^1]. Here's another reference[^note].


### Keyboard Keys

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

Use <kbd>Cmd</kbd> + <kbd>V</kbd> on Mac to paste.

Navigate with <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> arrow keys.

**Markdown Code:**
```markdown
Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

Use <kbd>Cmd</kbd> + <kbd>V</kbd> on Mac to paste.

Navigate with <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> arrow keys.
```

### Emoji Support

Web development is fun! 😄 🚀 💻

Here are some common emojis:
- ✅ Success
- ❌ Error  
- ⚠️ Warning
- 📝 Note
- 🔥 Popular
- 💡 Idea
- 🎯 Goal
- 📊 Data

**Markdown Code:**
```markdown
Web development is fun! 😄 🚀 💻

Here are some common emojis:
- ✅ Success
- ❌ Error  
- ⚠️ Warning
- 📝 Note
- 🔥 Popular
- 💡 Idea
- 🎯 Goal
- 📊 Data
```

### Special Characters and Symbols

Mathematical: ∑ ∫ ∂ ∆ ∇ ∞ ± × ÷

Arrows: → ← ↑ ↓ ↔ ⇒ ⇐ ⇔

Currency: $ € £ ¥ ₹ ₿

Symbols: © ® ™ § ¶ † ‡

## Code Demonstrations

### Configuration Examples

```yaml
# YAML configuration example
server:
  host: localhost
  port: 3000
  ssl:
    enabled: true
    cert: /path/to/cert.pem
    key: /path/to/key.pem

database:
  type: postgresql
  host: db.example.com
  port: 5432
  name: myapp
  credentials:
    username: admin
    password: ${DB_PASSWORD}

features:
  - authentication
  - logging
  - monitoring
  - caching
```

```xml
<!-- XML example -->
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appSettings>
        <add key="ApiUrl" value="https://api.example.com" />
        <add key="Timeout" value="30000" />
        <add key="EnableLogging" value="true" />
    </appSettings>
    <connectionStrings>
        <add name="DefaultConnection" 
             connectionString="Server=localhost;Database=MyApp;Trusted_Connection=true;" />
    </connectionStrings>
</configuration>
```

### Data Examples

```csv
Name,Age,Department,Salary,Start Date
John Doe,28,Engineering,75000,2022-01-15
Jane Smith,32,Marketing,68000,2021-03-10
Bob Johnson,45,Sales,82000,2020-06-22
Alice Brown,29,Engineering,73000,2022-09-05
```

## Performance and Optimization

### Rendering Performance

This framework is optimized for:

1. **Fast initial page load** - Static generation with Vite
2. **Smooth scrolling** - Optimized CSS and minimal JavaScript
3. **Mobile responsiveness** - Adaptive layouts for all devices
4. **Accessibility** - Semantic HTML and proper ARIA labels

### Features Summary

| Category | Features | Status |
|----------|----------|--------|
| **Basic Markdown** | Headers, text formatting, lists | ✅ Complete |
| **Extended Syntax** | Tables, code blocks, footnotes | ✅ Complete |
| **Math Support** | LaTeX via KaTeX | ✅ Complete |
| **Code Highlighting** | Prism.js with multiple languages | ✅ Complete |
| **Responsive Design** | Mobile-optimized tables and layout | ✅ Complete |

## Conclusion

This comprehensive demonstration showcases the full range of markdown features supported by this portfolio framework. From basic text formatting to advanced mathematical expressions, code syntax highlighting, and responsive tables, the system provides a powerful and flexible content authoring experience.

The framework combines the simplicity of markdown with the power of modern web technologies, creating an ideal environment for technical documentation, blog posts, and educational content.

[^1]: This is the first footnote with detailed explanation.
[^note]: This is a named footnote that can be referenced multiple times.
