"use client";

import { useRef, useCallback } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css";
  label: string;
  showAiButton?: boolean;
  onAiClick?: () => void;
}

export function CodeEditor({ value, onChange, language, label, showAiButton, onAiClick }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { t } = useLanguage();

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleChange = useCallback(
    (value: string | undefined) => {
      onChange(value ?? "");
    },
    [onChange]
  );

  return (
    <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card">
      <div className="px-4 py-2 border-b border-border bg-secondary/50 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="ml-2 text-xs text-muted-foreground uppercase">{language}</span>
        </div>
        {showAiButton && onAiClick && (
          <Button
            size="sm"
            onClick={onAiClick}
            className="h-7 gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{t("ai.button")}</span>
          </Button>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
