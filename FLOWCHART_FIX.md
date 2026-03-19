## Automatic HTML Break Tag Handling

**The Solution**: The app now **automatically normalizes** `<br>` tags in your Mermaid flowcharts to render as **actual line breaks**! 

You can use `<br>`, `<br/>`, or `<br />` directly in your node labels, and the app will normalize them to a consistent format that Mermaid interprets as line breaks. The rendered output will show proper line breaks, not the literal text.

### Example - Just Use Normal `<br>` Tags:
```
flowchart TD
    A([User opens app in browser]) --> B[Initialize shared browser-session inactivity manager]
    B --> C[Track activity from all open tabs<br/>click / keypress / mousemove / scroll / API interaction]
    
    C --> D{Activity detected in any tab?}
    D -->|Yes| E[Broadcast activity to all tabs]
    E --> F[Reset shared inactivity timer<br/>for the whole browser session]
    F --> G[User remains active]
    G --> C

    D -->|No| H{Has configured inactivity period elapsed<br/>with no activity in any tab?}
    H -->|No| C
    H -->|Yes| I[Mark browser session as inactive]
    
    I --> J[Clear access token from local storage]
    J --> K{Choose expiry handling}
    K -->|Redirect flow| L[Redirect user to login page]
    K -->|Inline UX flow| M[Show session expired message]
    
    style A fill:#7dd3fc,stroke:#0369a1,stroke-width:2px,color:#0f172a
    style B fill:#c4b5fd,stroke:#6d28d9,stroke-width:2px,color:#0f172a
    style C fill:#86efac,stroke:#15803d,stroke-width:2px,color:#0f172a
    style D fill:#fde68a,stroke:#b45309,stroke-width:2px,color:#0f172a
    style E fill:#f9a8d4,stroke:#be185d,stroke-width:2px,color:#0f172a
    style F fill:#67e8f9,stroke:#0e7490,stroke-width:2px,color:#0f172a
    style G fill:#bbf7d0,stroke:#166534,stroke-width:2px,color:#0f172a
    style H fill:#fcd34d,stroke:#92400e,stroke-width:2px,color:#0f172a
    style I fill:#fca5a5,stroke:#b91c1c,stroke-width:2px,color:#0f172a
    style J fill:#fdba74,stroke:#c2410c,stroke-width:2px,color:#0f172a
    style K fill:#ddd6fe,stroke:#7c3aed,stroke-width:2px,color:#0f172a
    style L fill:#93c5fd,stroke:#1d4ed8,stroke-width:2px,color:#0f172a
    style M fill:#f5d0fe,stroke:#a21caf,stroke-width:2px,color:#0f172a
```

## How It Works
The rendering engine automatically detects `<br>` tags within node labels and normalizes them to `<br/>` before processing. Mermaid then interprets these as line break instructions and renders them as **actual line breaks in the diagram** (not as visible text). This happens transparently behind the scenes, so you can write natural Mermaid syntax without worrying about HTML encoding.

### Supported Formats
- `<br>` - Basic HTML break
- `<br/>` - Self-closing break
- `<br />` - Self-closing with space

All variations are automatically detected and normalized within:
- Square brackets: `[label<br/>text]`
- Parentheses: `(label<br/>text)` 
- Curly braces: `{label<br/>text}`
- Quotes: `"label<br/>text"`

## Technical Details
The `normalizeBrTags()` function uses a stack-based parser to track label contexts and selectively normalize only the `<br>` tags that appear within Mermaid node labels to `<br/>`. Mermaid's htmlLabels feature then renders these as actual line breaks in the SVG output, preserving all other syntax unchanged.