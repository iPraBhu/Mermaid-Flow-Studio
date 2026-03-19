## Automatic HTML Break Tag Handling

**The Solution**: The app now **passes `<br>` tags through as-is**, letting Mermaid's native HTML label rendering handle them correctly!

You can use `<br>`, `<br/>`, or `<br />` directly in your node labels. The app enables Mermaid's `htmlLabels` feature, which interprets these tags as **actual line breaks** in the rendered diagram.

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
The rendering engine passes your Mermaid source through with `<br>` tags intact and enables Mermaid's `htmlLabels` configuration option. This tells Mermaid to interpret HTML tags in labels, including `<br>` tags as line break instructions. The result is **actual line breaks in the diagram** (not visible text).

### Supported Formats
- `<br>` - Basic HTML break
- `<br/>` - Self-closing break (recommended)
- `<br />` - Self-closing with space

All variations work in:
- Square brackets: `[label<br/>text]`
- Parentheses: `(label<br/>text)` 
- Curly braces: `{label<br/>text}`
- Quotes: `"label<br/>text"`

## Technical Details
The app uses a fallback strategy when rendering:
1. **First attempt**: Original source with `htmlLabels: true` (handles `<br>` natively)
2. **Fallback**: Source with breaks removed (replaces `<br>` with spaces)

This ensures your diagram renders successfully even if there are any compatibility issues with HTML tags.