"use client";

import { useMemo } from "react";
import { inlineCSS } from "@/lib/css-inliner";
import { cn } from "@/lib/utils";

interface EmailPreviewProps {
  html: string;
  css: string;
  fullscreen?: boolean;
}

export function EmailPreview({ html, css, fullscreen = false }: EmailPreviewProps) {
  const previewHTML = useMemo(() => {
    try {
      const inlined = inlineCSS(html, css);
      return inlined;
    } catch {
      return html;
    }
  }, [html, css]);

  return (
    <div className={cn(
      "flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card",
      fullscreen && "border-0 rounded-none"
    )}>
      {!fullscreen && (
        <div className="px-4 py-2 border-b border-border bg-secondary/50 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-foreground">Élő Előnézet</span>
            <span className="ml-2 text-xs text-muted-foreground">Email-biztos kimenet</span>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-auto bg-[#0b0b0b]">
        <div 
          className="min-h-full"
          dangerouslySetInnerHTML={{ __html: previewHTML }}
        />
      </div>
    </div>
  );
}
