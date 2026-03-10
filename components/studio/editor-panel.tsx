"use client";

import { Copy, FileUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface EditorPanelProps {
  source: string;
  onSourceChange: (value: string) => void;
  onCopy: () => void;
  onReset: () => void;
  onImport: () => void;
}

export function EditorPanel({
  source,
  onSourceChange,
  onCopy,
  onReset,
  onImport
}: EditorPanelProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <CardTitle>Mermaid editor</CardTitle>
          <CardDescription>
            Write or paste Mermaid flowchart syntax. Your content autosaves locally as you work.
          </CardDescription>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button variant="secondary" size="sm" onClick={onCopy}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={onImport}>
            <FileUp className="h-4 w-4" />
            Import
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          aria-label="Mermaid source editor"
          className="min-h-[360px] resize-none"
          placeholder="Paste Mermaid flowchart syntax here..."
          spellCheck={false}
          value={source}
          onChange={(event) => onSourceChange(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 sm:hidden">
          <Button variant="secondary" size="sm" onClick={onCopy}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={onImport}>
            <FileUp className="h-4 w-4" />
            Import
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
