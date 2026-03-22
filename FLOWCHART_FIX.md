## Comprehensive HTML & Special Character Handling

**The Solution**: The app now features **advanced multi-strategy rendering** with comprehensive HTML support, special character handling, and robust fallback mechanisms!

### What's Supported

#### HTML Tags in Labels
You can use these HTML tags for rich formatting:
- `<br>`, `<br/>`, `<br />` - Line breaks
- `<b>`, `<strong>` - Bold text
- `<i>`, `<em>` - Italic text  
- `<u>` - Underlined text
- `<sup>` - Superscript
- `<sub>` - Subscript
- `<span>` - Generic inline container

#### Special Characters & Unicode
Full support for:
- **Emoji**: 🚀 ✨ ⭐ ❤️ ✓ ✗
- **Math symbols**: ∑ ∫ √ ≈ × ÷
- **International**: äöü, 日本語, العربية
- **Special**: © ® ™ ° § ¶

#### Safe Automatic Processing
- HTML entities properly encoded
- XSS protection via tag sanitization
- Line endings normalized
- Whitespace trimmed
- BOM removed automatically

### Example - Rich Formatting:
```mermaid
flowchart TD
    A([User opens app in browser]) --> B[Initialize shared browser-session inactivity manager]
    B --> C[Track activity from all open tabs<br/>click / keypress / mousemove / scroll / API interaction]
    
    C --> D{Activity detected in any tab?}
    D -->|Yes| E[Broadcast activity to all tabs]
    E --> F[<b>Reset</b> shared inactivity timer<br/>for the whole browser session]
    F --> G[User remains <i>active</i>]
    G --> C

    D -->|No| H{Has configured inactivity period elapsed<br/>with <u>no activity</u> in any tab?}
    H -->|No| C
    H -->|Yes| I[Mark browser session as inactive ❌]
    
    I --> J[Clear access token from local storage]
    J --> K{Choose expiry handling}
    K -->|Redirect flow| L[Redirect user to login page 🔒]
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

### Multi-Strategy Rendering
The engine uses **6 intelligent fallback strategies** to ensure your diagram renders:

1. **Sanitized HTML** - Safe HTML tags only, dangerous content filtered
2. **Escaped Characters** - HTML entities properly encoded  
3. **Original Source** - Tries your exact input with HTML enabled
4. **Stripped HTML** - Removes all tags as compatibility fallback
5. **Plain Text Mode** - Disables HTML rendering completely
6. **Final Attempt** - Last resort with original source

If one strategy fails, the next is automatically tried until one succeeds!

### Intelligent Diagram Detection
The system automatically detects your diagram type and applies optimal configurations:
- **Flowcharts/Graphs**: Node spacing, padding, rounded corners
- **Sequence Diagrams**: Actor mirroring, message margins, wrapping
- **Gantt Charts**: Timeline styling, section formatting
- **State Diagrams**: Transition styling, composite states
- And 10+ other diagram types!

### Built-in Validation
Before rendering, the system can validate your syntax:
- Checks for unmatched quotes
- Detects unclosed HTML tags
- Validates diagram type syntax
- Provides helpful error messages
- Suggests fixes for common issues

## Security & Safety

### XSS Protection
Dangerous HTML is automatically sanitized:
- Script tags → converted to visible text
- Event handlers → stripped
- Style tags → sanitized
- Only safe formatting tags allowed

This ensures your diagrams are both feature-rich AND secure.

## Best Practices

### ✅ Recommended:
```mermaid
flowchart LR
    A["Text with <b>bold</b><br/>and line break"] --> B["Math: E=mc<sup>2</sup>"]
    B --> C["Logo ✓ Success"]
```

### ⚠️ Tips for Complex Content:
- Use double quotes for labels with special characters
- Close all HTML tags: `<b>text</b>` not `<b>text`
- Escape ampersands: `&amp;` instead of `&`
- Use HTML entities for `<`, `>`: `&lt;`, `&gt;`

## Technical Details

See [MERMAID_ROBUSTNESS.md](./MERMAID_ROBUSTNESS.md) for complete technical documentation including:
- Detailed rendering pipeline
- All supported diagram types
- Advanced troubleshooting
- Performance optimizations
- Security model
- API reference

## Error Handling

When rendering fails, you'll receive:
- ✅ Detected diagram type
- ✅ Specific error message
- ✅ Which strategy failed and why
- ✅ Common issue suggestions
- ✅ Line-specific feedback

This helps you quickly identify and fix any syntax issues!