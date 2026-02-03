"use client";

import { useRef, useCallback } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css";
  label: string;
}

export function CodeEditor({ value, onChange, language, label }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

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
      <div className="px-4 py-2 border-b border-border bg-secondary/50">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="ml-2 text-xs text-muted-foreground uppercase">{language}</span>
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
