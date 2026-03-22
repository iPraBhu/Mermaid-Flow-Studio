# Mermaid Edge Cases - Quick Reference

This guide shows challenging scenarios that Mermaid Flow Studio handles gracefully.

## 1. HTML Tags in Labels

### Basic Formatting
```mermaid
flowchart LR
    A[<b>Bold</b> Text] --> B[<i>Italic</i> Text]
    B --> C[<u>Underlined</u> Text]
    C --> D[<b><i>Combined</i></b>]
```

### Scientific Notation
```mermaid
flowchart TD
    A[E=mc<sup>2</sup>] --> B[H<sub>2</sub>O]
    B --> C[CO<sub>2</sub> Emissions]
    C --> D[10<sup>9</sup> calculations/sec]
```

### Multi-line with Formatting
```mermaid
flowchart TD
    A[<b>Step 1</b><br/><i>Initialize System</i><br/>⚙️ Settings]
    --> B[<b>Step 2</b><br/><i>Process Data</i><br/>📊 Analysis]
```

## 2. Special Characters

### Quotes in Labels
```mermaid
flowchart LR
    A["User says: \"Hello World\""] --> B['Response: "OK"']
    B --> C["Status: 'Active'"]
```

### Mathematical Operators
```mermaid
flowchart TD
    A["Calculate: 2 × 3 = 6"] --> B["Division: 10 ÷ 2 = 5"]
    B --> C["Compare: 5 ≈ 5.001"]
    C --> D["Sigma: ∑(1..10) = 55"]
```

### Currency & Symbols
```mermaid
flowchart LR
    A["Price: $100 & €85"] --> B["Discount: 20% off"]
    B --> C["Total: $80 ≈ €68"]
    C --> D["™ © ®"]
```

## 3. Unicode & Emoji

### Status Indicators
```mermaid
flowchart TD
    A[Start 🚀] --> B{Check Status}
    B -->|Success| C[Done ✓]
    B -->|Error| D[Failed ✗]
    C --> E[Celebrate 🎉]
    D --> F[Retry 🔄]
```

### International Characters
```mermaid
flowchart LR
    A[English] --> B[Deutsch: äöü]
    B --> C[日本語: こんにちは]
    C --> D[العربية: مرحبا]
```

### Progress States
```mermaid
flowchart LR
    A[⏳ Loading] --> B[⚙️ Processing]
    B --> C[🔍 Validating]
    C --> D[✅ Complete]
```

## 4. Complex Labels

### API Endpoints
```mermaid
flowchart TD
    A["<b>GET</b><br/>/api/users<br/>🔓 Public"]
    --> B["<b>POST</b><br/>/api/auth/login<br/>🔐 Auth Required"]
    --> C["<b>PUT</b><br/>/api/users/:id<br/>🔒 Admin Only"]
```

### Code Snippets
```mermaid
flowchart LR
    A["<b>Function:</b><br/>getUserData()"]
    --> B["<b>Returns:</b><br/>User { id, name, email }"]
    --> C["<b>Status:</b><br/>200 OK"]
```

### Temperature & Units
```mermaid
flowchart TD
    A[Water: 0°C → 🧊 Ice] --> B[Water: 25°C → 💧 Liquid]
    B --> C[Water: 100°C → ☁️ Steam]
```

## 5. Nested Structures

### Subgraphs with HTML
```mermaid
flowchart TB
    subgraph Frontend["💻 <b>Frontend</b><br/><i>React App</i>"]
        A[<b>UI Layer</b><br/>Components]
        B[<b>State</b><br/>Redux Store]
    end
    
    subgraph Backend["🖥️ <b>Backend</b><br/><i>Node.js API</i>"]
        C[<b>Routes</b><br/>Express]
        D[<b>Database</b><br/>PostgreSQL]
    end
    
    A --> C
    B --> C
    C --> D
```

## 6. Mixed Content

### Business Process
```mermaid
flowchart TD
    A["📋 <b>Proposal</b><br/>Status: Draft<br/>Amount: $50,000"]
    --> B{"🤔 <b>Review</b><br/>Manager Approval"}
    
    B -->|✓ Approved| C["✅ <b>Execute</b><br/>Contract signed<br/>Date: 2026-03-21"]
    B -->|✗ Rejected| D["❌ <b>Archive</b><br/>Reason: 'Budget exceeded'"]
    
    C --> E["📊 <b>Report</b><br/>ROI: 125%<br/>Success! 🎉"]
```

### Technical Workflow
```mermaid
flowchart LR
    A["<b>Input</b><br/>File: data.json<br/>Size: 2.5MB"]
    --> B["⚙️ <b>Process</b><br/>Algorithm: ML-v2<br/>GPU: 80% usage"]
    --> C["💾 <b>Store</b><br/>DB: PostgreSQL<br/>Table: results"]
    --> D["📤 <b>Export</b><br/>Format: CSV & PDF<br/>Delivery: ✓"]
```

## 7. Error Handling Examples

### Recoverable Issues

#### Before (Would break):
```mermaid
flowchart TD
    A[Status: <incomplete] --> B
```

#### After (Auto-fixed):
The system automatically encodes `<` as `&lt;` to prevent breaking.

#### Before (Would break):
```mermaid
flowchart TD
    A[Price: $50 & Tax] --> B
```

#### After (Auto-fixed):
The system encodes `&` as `&amp;` when needed.

## 8. Different Diagram Types

### Sequence Diagram with HTML
```mermaid
sequenceDiagram
    participant User as 👤 <b>User</b>
    participant API as 🖥️ <b>API Server</b>
    participant DB as 💾 <b>Database</b>
    
    User->>API: POST /login<br/>{"user": "john"}
    API->>DB: SELECT * FROM users<br/>WHERE name='john'
    DB-->>API: User data ✓
    API-->>User: Token: abc123<br/>Status: 200
```

### State Diagram with Emoji
```mermaid
stateDiagram-v2
    [*] --> Idle: 🏁 Start
    Idle --> Loading: ⏳ Request
    Loading --> Success: ✅ Data received
    Loading --> Error: ❌ Failed
    Success --> [*]: 🎉 Complete
    Error --> Retry: 🔄 Retry
    Retry --> Loading: Try again
```

### Gantt Chart with Special Chars
```mermaid
gantt
    title 🚀 Project Timeline (Q1 2026)
    dateFormat  YYYY-MM-DD
    
    section Phase 1 ⚙️
    Research & Planning    :a1, 2026-01-01, 30d
    Design © UI/UX        :a2, after a1, 20d
    
    section Phase 2 💻
    Development (80%)     :b1, after a2, 45d
    Testing ✓            :b2, after b1, 15d
    
    section Launch 🎉
    Deployment →         :c1, after b2, 5d
    Monitoring 📊        :c2, after c1, 30d
```

## 9. Accessibility Features

### ARIA Labels Automatic
All rendered diagrams include:
- `role="img"`
- `aria-label="Rendered Mermaid diagram"`
- Proper SVG structure
- Semantic markup

### Screen Reader Friendly
```mermaid
flowchart LR
    A["Step 1:<br/>User Authentication ✓"] 
    --> B["Step 2:<br/>Data Validation ✓"]
    --> C["Step 3:<br/>Process Complete ✓"]
```

## 10. Performance Edge Cases

### Large Labels
```mermaid
flowchart TD
    A["<b>Long Description</b><br/>This is a very long description that includes multiple lines of text with <i>formatting</i> and <b>emphasis</b> and even some emoji 🚀 to test how the system handles larger content blocks without breaking or causing performance issues."]
    --> B["<b>Another Long Node</b><br/>With lots of content<br/>Line 3<br/>Line 4<br/>Line 5"]
```

### Many Special Characters
```mermaid
flowchart LR
    A["∑∫√≈×÷±∞°§¶†‡©®™¢£¥€"] 
    --> B["αβγδεζηθικλμνξοπρστυφχψω"]
    --> C["ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏ"]
```

## Tips for Success

1. **Always close HTML tags**: `<b>text</b>` not `<b>text`
2. **Use quotes for complex labels**: `["text with <special> chars"]`
3. **Test incrementally**: Add complexity gradually
4. **Check error messages**: They provide specific guidance
5. **Use validation**: `validateMermaidSyntax()` before rendering
6. **Escape when needed**: `&lt;` `&gt;` `&amp;` `&quot;`

## What's Handled Automatically

✅ BOM removal
✅ Line ending normalization
✅ Whitespace trimming
✅ HTML entity encoding
✅ XSS prevention
✅ Fallback strategies (6 levels)
✅ Diagram type detection
✅ Character encoding preservation
✅ SVG accessibility
✅ Error recovery

---

For complete technical documentation, see [MERMAID_ROBUSTNESS.md](./MERMAID_ROBUSTNESS.md)
