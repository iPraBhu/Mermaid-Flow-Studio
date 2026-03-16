'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  BookOpen, 
  Code2, 
  Lightbulb, 
  AlertTriangle,
  Play
} from 'lucide-react';

interface SyntaxReferenceProps {
  onInsertExample: (code: string) => void;
}

export function SyntaxReference({ onInsertExample }: SyntaxReferenceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const insertExample = (code: string) => {
    onInsertExample(code);
  };

  const quickStartExamples = [
    {
      title: "Simple Flow",
      description: "Basic start to end flow",
      code: `flowchart TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`
    },
    {
      title: "Left to Right",
      description: "Horizontal layout",
      code: `flowchart LR
    A[Input] --> B[Process]
    B --> C[Output]`
    },
    {
      title: "User Journey",
      description: "Step-by-step process",
      code: `flowchart TD
    A[User visits site] --> B[Browse products]
    B --> C{Found what they need?}
    C -->|Yes| D[Add to cart]
    C -->|No| E[Search]
    E --> B
    D --> F[Checkout]
    F --> G[Order complete]`
    }
  ];

  const nodeTypes = [
    {
      name: "Rectangle",
      syntax: "A[Text]",
      description: "Standard process box"
    },
    {
      name: "Round Edges", 
      syntax: "A(Text)",
      description: "Rounded rectangle"
    },
    {
      name: "Circle",
      syntax: "A((Text))",
      description: "Circular node"
    },
    {
      name: "Diamond",
      syntax: "A{Text}",
      description: "Decision point"
    },
    {
      name: "Hexagon",
      syntax: "A{{Text}}",
      description: "Preparation step"
    },
    {
      name: "Parallelogram",
      syntax: "A[/Text/]",
      description: "Input/Output"
    },
    {
      name: "Trapezoid",
      syntax: "A[/Text\\]",
      description: "Manual operation"
    },
    {
      name: "Stadium",
      syntax: "A([Text])",
      description: "Start/End point"
    }
  ];

  const connectionTypes = [
    {
      name: "Arrow",
      syntax: "A --> B",
      description: "Basic connection"
    },
    {
      name: "Open Link",
      syntax: "A --- B",
      description: "Line without arrow"
    },
    {
      name: "Text on Link", 
      syntax: "A -->|Text| B",
      description: "Labeled connection"
    },
    {
      name: "Dotted Arrow",
      syntax: "A -.-> B",
      description: "Dashed connection"
    },
    {
      name: "Thick Arrow",
      syntax: "A ==> B",
      description: "Emphasized connection"
    },
    {
      name: "Bi-directional",
      syntax: "A <--> B",
      description: "Two-way connection"
    }
  ];

  const patterns = [
    {
      title: "Decision Tree",
      description: "Multiple choice branching",
      code: `flowchart TD
    A[Problem] --> B{Option 1?}
    B -->|Yes| C[Result 1]
    B -->|No| D{Option 2?}
    D -->|Yes| E[Result 2]
    D -->|No| F[Default Result]`
    },
    {
      title: "Parallel Processing",
      description: "Multiple paths converging",
      code: `flowchart TD
    A[Start] --> B[Split]
    B --> C[Process 1]
    B --> D[Process 2]
    B --> E[Process 3]
    C --> F[Merge]
    D --> F
    E --> F
    F --> G[End]`
    },
    {
      title: "Loop Structure",
      description: "Repeating process flow",
      code: `flowchart TD
    A[Start] --> B[Initialize]
    B --> C[Process Item]
    C --> D{More items?}
    D -->|Yes| C
    D -->|No| E[End]`
    },
    {
      title: "Error Handling",
      description: "Try-catch pattern",
      code: `flowchart TD
    A[Start] --> B[Try Operation]
    B --> C{Success?}
    C -->|Yes| D[Continue]
    C -->|No| E[Handle Error]
    E --> F{Retry?}
    F -->|Yes| B
    F -->|No| G[Stop]
    D --> H[End]`
    }
  ];

  const troubleshooting = [
    {
      problem: "Syntax Error",
      solution: "Check for missing brackets, quotes, or arrows",
      example: "A[Text] --> B[Text]  ✓\nA[Text] -> B[Text]   ✗"
    },
    {
      problem: "Special Characters",
      solution: "Use quotes for text with spaces or symbols",
      example: 'A["User Input"] --> B["Process Data"]'
    },
    {
      problem: "Long Labels",
      solution: "Break long text into multiple lines",
      example: 'A["This is a very<br>long label"]'
    },
    {
      problem: "Complex Flows",
      solution: "Use subgraphs to organize related nodes",
      example: `subgraph "User Actions"
    A[Login]
    B[Browse]
end`
    }
  ];

  if (!isExpanded) {
    return (
      <div className="mb-4">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Show Mermaid Syntax Guide
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Mermaid Syntax Guide
            </CardTitle>
            <CardDescription>
              Learn how to create flowcharts with Mermaid syntax
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quickstart" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="syntax">Syntax</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="troubleshoot">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="quickstart" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Quick Start Examples
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click any example to insert it into the editor and start customizing.
              </p>
            </div>
            <div className="grid gap-4">
              {quickStartExamples.map((example, index) => (
                <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">{example.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {example.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(example.code)}
                          variant="ghost"
                          size="sm"
                          className={copiedCode === example.code ? "text-green-600" : ""}
                        >
                          <Copy className="w-3 h-3" />
                          {copiedCode === example.code ? "Copied!" : ""}
                        </Button>
                        <Button
                          onClick={() => insertExample(example.code)}
                          variant="default"
                          size="sm"
                        >
                          <Play className="w-3 h-3" />
                          Use
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="syntax" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Flowchart Directions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                  <Badge>TD</Badge>
                  <span>Top Down (default)</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                  <Badge>TB</Badge>
                  <span>Top to Bottom</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                  <Badge>LR</Badge>
                  <span>Left to Right</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                  <Badge>RL</Badge>
                  <span>Right to Left</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Node Types</h3>
              <div className="grid gap-2">
                {nodeTypes.map((node, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium text-sm">{node.name}</div>
                      <div className="text-xs text-muted-foreground">{node.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{node.syntax}</code>
                      <Button
                        onClick={() => copyToClipboard(node.syntax)}
                        variant="ghost"
                        size="sm"
                        className={copiedCode === node.syntax ? "text-green-600" : ""}
                      >
                        <Copy className="w-3 h-3" />
                        {copiedCode === node.syntax ? "✓" : ""}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Connection Types</h3>
              <div className="grid gap-2">
                {connectionTypes.map((conn, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium text-sm">{conn.name}</div>
                      <div className="text-xs text-muted-foreground">{conn.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{conn.syntax}</code>
                      <Button
                        onClick={() => copyToClipboard(conn.syntax)}
                        variant="ghost"
                        size="sm"
                        className={copiedCode === conn.syntax ? "text-green-600" : ""}
                      >
                        <Copy className="w-3 h-3" />
                        {copiedCode === conn.syntax ? "✓" : ""}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Common Patterns
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ready-to-use patterns for common flowchart scenarios.
              </p>
            </div>
            <div className="grid gap-4">
              {patterns.map((pattern, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">{pattern.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {pattern.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(pattern.code)}
                          variant="ghost"
                          size="sm"
                          className={copiedCode === pattern.code ? "text-green-600" : ""}
                        >
                          <Copy className="w-3 h-3" />
                          {copiedCode === pattern.code ? "Copied!" : ""}
                        </Button>
                        <Button
                          onClick={() => insertExample(pattern.code)}
                          variant="default"
                          size="sm"
                        >
                          <Play className="w-3 h-3" />
                          Use
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      <code>{pattern.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="troubleshoot" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Troubleshooting
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Common issues and how to fix them.
              </p>
            </div>
            <div className="space-y-4">
              {troubleshooting.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-red-600">{item.problem}</CardTitle>
                    <CardDescription className="text-xs">
                      {item.solution}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <pre className="text-xs bg-muted p-2 rounded">
                      <code>{item.example}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Pro Tips:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Start with <code>flowchart TD</code> or <code>flowchart LR</code></li>
                <li>• Use meaningful node IDs (A, B, C or Start, Process, End)</li>
                <li>• Keep labels short and descriptive</li>
                <li>• Use consistent spacing and formatting</li>
                <li>• Test with simple examples first</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}