import type {
  BackgroundMode,
  ExportFormat,
  FontFamilyOption,
  MermaidThemeOption,
  PresetDefinition,
  StudioSettings,
  TemplateDefinition
} from "@/lib/types";

export const DEFAULT_MERMAID_SOURCE = `flowchart TD
    A[User opens Mermaid Flow Studio] --> B[Paste Mermaid flowchart text]
    B --> C[Live preview renders diagram]
    C --> D{Customize style?}
    D -->|Yes| E[Choose theme and export settings]
    D -->|No| F[Keep default style]
    E --> G[Export as SVG PNG JPG or PDF]
    F --> G
    G --> H[Download high quality diagram]`;

export const TEMPLATE_LIBRARY: TemplateDefinition[] = [
  {
    id: "default",
    name: "Studio intro",
    description: "The default sample showing the end-to-end editing flow.",
    source: DEFAULT_MERMAID_SOURCE
  },
  {
    id: "basic-process",
    name: "Basic process flow",
    description: "A clean multi-step process map for operations or product flows.",
    source: `flowchart LR
    Intake([New request received]) --> Review[Review requirements]
    Review --> Scope{Clear scope?}
    Scope -->|Yes| Build[Create implementation plan]
    Scope -->|No| Clarify[Ask follow-up questions]
    Clarify --> Review
    Build --> Approve[Stakeholder approval]
    Approve --> Delivery([Ship outcome])`
  },
  {
    id: "decision-tree",
    name: "Decision tree",
    description: "A branching flow for policies, approvals, or troubleshooting.",
    source: `flowchart TD
    Start([Incoming issue]) --> Severity{Is it critical?}
    Severity -->|Yes| Escalate[Page on-call engineer]
    Severity -->|No| Queue[Add to triage queue]
    Escalate --> Fix{Hotfix available?}
    Fix -->|Yes| Deploy[Deploy patch]
    Fix -->|No| Rollback[Rollback release]
    Queue --> Groom[Review next business day]
    Deploy --> Close([Resolve issue])
    Rollback --> Close
    Groom --> Close`
  },
  {
    id: "user-journey",
    name: "User journey",
    description: "A lightweight experience map from discovery to activation.",
    source: `flowchart LR
    Discover([Finds product]) --> Explore[Scans landing page]
    Explore --> Evaluate{Sees value?}
    Evaluate -->|Yes| Trial[Starts free trial]
    Evaluate -->|No| Exit([Leaves site])
    Trial --> Onboard[Completes onboarding]
    Onboard --> Success{First win achieved?}
    Success -->|Yes| Upgrade[Upgrades plan]
    Success -->|No| Support[Reads help docs]
    Support --> Onboard
    Upgrade --> Advocate([Shares with team])`
  },
  {
    id: "api-request-lifecycle",
    name: "API request lifecycle",
    description: "A backend request path from client call to cached response.",
    source: `flowchart TD
    Client[Client app] --> Gateway[API gateway]
    Gateway --> Auth{Authenticated?}
    Auth -->|No| Reject[Return 401 response]
    Auth -->|Yes| Cache{Cache hit?}
    Cache -->|Yes| Hit[Return cached payload]
    Cache -->|No| Service[Call application service]
    Service --> DB[(Database query)]
    DB --> Serialize[Serialize response]
    Serialize --> Store[Write cache]
    Store --> Hit
    Reject --> End([Request complete])
    Hit --> End`
  }
];

export const MERMAID_THEME_OPTIONS: Array<{
  label: string;
  value: MermaidThemeOption;
}> = [
  { label: "Default", value: "default" },
  { label: "Neutral", value: "neutral" },
  { label: "Forest", value: "forest" },
  { label: "Dark", value: "dark" },
  { label: "Base", value: "base" }
];

export const FONT_FAMILY_OPTIONS: FontFamilyOption[] = [
  "Space Grotesk",
  "IBM Plex Sans",
  "Manrope",
  "DM Sans",
  "JetBrains Mono"
];

export const EXPORT_FORMAT_OPTIONS: Array<{ label: string; value: ExportFormat }> = [
  { label: "SVG", value: "svg" },
  { label: "PNG", value: "png" },
  { label: "JPEG", value: "jpeg" },
  { label: "PDF", value: "pdf" }
];

export const BACKGROUND_MODE_OPTIONS: Array<{
  label: string;
  value: BackgroundMode;
}> = [
  { label: "Transparent", value: "transparent" },
  { label: "White", value: "white" },
  { label: "Dark", value: "dark" },
  { label: "Custom", value: "custom" }
];

export const ACCENT_PRESETS = [
  "#0ea5e9",
  "#2563eb",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#ef4444"
];

export const RESOLUTION_PRESETS = [
  { label: "Social", width: 1600, height: 900 },
  { label: "Square", width: 1400, height: 1400 },
  { label: "Presentation", width: 1920, height: 1080 },
  { label: "Document", width: 1600, height: 1200 }
];

export const STUDIO_PRESETS: PresetDefinition[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Quiet spacing, neutral colors, and clean print-oriented output.",
    settings: {
      mermaidTheme: "neutral",
      backgroundMode: "white",
      backgroundColor: "#ffffff",
      accentColor: "#0f172a",
      fontFamily: "Space Grotesk",
      fontSize: 15,
      padding: 36,
      nodeSpacing: 42,
      rankSpacing: 48,
      roundedNodes: true,
      shadowStyle: "none",
      exportPadding: 42
    }
  },
  {
    id: "modern",
    name: "Modern",
    description: "Balanced contrast with a crisp product-tool aesthetic.",
    settings: {
      mermaidTheme: "default",
      backgroundMode: "custom",
      backgroundColor: "#f8fbff",
      accentColor: "#2563eb",
      fontFamily: "Space Grotesk",
      fontSize: 16,
      padding: 40,
      nodeSpacing: 46,
      rankSpacing: 54,
      roundedNodes: true,
      shadowStyle: "soft",
      exportPadding: 48
    }
  },
  {
    id: "glass",
    name: "Glass",
    description: "Soft translucency with cool tones and elevated cards.",
    settings: {
      mermaidTheme: "base",
      backgroundMode: "custom",
      backgroundColor: "#0f172a",
      accentColor: "#38bdf8",
      fontFamily: "Manrope",
      fontSize: 16,
      padding: 44,
      nodeSpacing: 44,
      rankSpacing: 56,
      roundedNodes: true,
      shadowStyle: "glass",
      exportPadding: 52
    }
  },
  {
    id: "dark-pro",
    name: "Dark Pro",
    description: "High-contrast dark canvas for developer docs and decks.",
    settings: {
      mermaidTheme: "dark",
      backgroundMode: "dark",
      backgroundColor: "#050816",
      accentColor: "#8b5cf6",
      fontFamily: "IBM Plex Sans",
      fontSize: 16,
      padding: 44,
      nodeSpacing: 44,
      rankSpacing: 54,
      roundedNodes: true,
      shadowStyle: "depth",
      exportPadding: 52
    }
  },
  {
    id: "presentation",
    name: "Presentation",
    description: "Larger type and roomier composition for slides and reviews.",
    settings: {
      mermaidTheme: "default",
      backgroundMode: "custom",
      backgroundColor: "#fff9ef",
      accentColor: "#f97316",
      fontFamily: "Manrope",
      fontSize: 18,
      padding: 54,
      nodeSpacing: 52,
      rankSpacing: 62,
      roundedNodes: true,
      shadowStyle: "soft",
      exportPadding: 60
    }
  },
  {
    id: "print-friendly",
    name: "Print Friendly",
    description: "Low-ink defaults tuned for reports and documentation.",
    settings: {
      mermaidTheme: "neutral",
      backgroundMode: "white",
      backgroundColor: "#ffffff",
      accentColor: "#334155",
      fontFamily: "IBM Plex Sans",
      fontSize: 15,
      padding: 32,
      nodeSpacing: 40,
      rankSpacing: 46,
      roundedNodes: false,
      shadowStyle: "none",
      exportPadding: 36
    }
  }
];

export const DEFAULT_SETTINGS: StudioSettings = {
  source: DEFAULT_MERMAID_SOURCE,
  presetId: "modern",
  mermaidTheme: "default",
  backgroundMode: "custom",
  backgroundColor: "#f8fbff",
  accentColor: "#2563eb",
  fontFamily: "Space Grotesk",
  fontSize: 16,
  padding: 40,
  nodeSpacing: 46,
  rankSpacing: 54,
  roundedNodes: true,
  shadowStyle: "soft",
  exportWidth: 1920,
  exportHeight: 1080,
  exportScale: 2,
  exportPadding: 48,
  exportFormat: "png",
  fileName: "mermaid-flow-diagram",
  showGrid: true
};

export const PRESET_MAP = Object.fromEntries(
  STUDIO_PRESETS.map((preset) => [preset.id, preset])
) as Record<(typeof STUDIO_PRESETS)[number]["id"], PresetDefinition>;
