## Fixed Version of Your Flowchart

**The issue**: Your `<br/>` tags were being treated as actual HTML in the preview instead of Mermaid syntax.

**The solution**: The app now automatically HTML-encodes these tags. Here are working versions:

### Version 1: HTML-encoded breaks (RECOMMENDED)
```
flowchart TD
    A([User opens app in browser]) --> B[Initialize shared browser-session inactivity manager]
    B --> C[Track activity from all open tabs&lt;br/&gt;click / keypress / mousemove / scroll / API interaction]
    
    C --> D{Activity detected in any tab?}
    D -->|Yes| E[Broadcast activity to all tabs]
    E --> F[Reset shared inactivity timer&lt;br/&gt;for the whole browser session]
    F --> G[User remains active]
    G --> C

    D -->|No| H{Has configured inactivity period elapsed&lt;br/&gt;with no activity in any tab?}
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

### Your original flowchart should also work now
**The app will automatically encode the HTML tags for you!** Just paste your original version and it should render correctly.

## What I fixed in the code:
1. Added `encodeHtmlInLabels()` function to HTML-encode `<br/>` tags
2. Enhanced `buildRenderAttempts()` to try multiple fallback strategies
3. The app now tries encoded version first, then original, then fallbacks