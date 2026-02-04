"use client";

import React from "react"

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Wand2, FileText, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface AIEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHtml: string;
  currentCss: string;
  onApply: (html: string, css: string) => void;
}

export function AIEditorDialog({
  open,
  onOpenChange,
  currentHtml,
  currentCss,
  onApply,
}: AIEditorDialogProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<"choose" | "prompt">("choose");
  const [mode, setMode] = useState<"edit" | "new">("edit");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedHtml, setStreamedHtml] = useState("");
  const [streamedCss, setStreamedCss] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleModeSelect = (selectedMode: "edit" | "new") => {
    setMode(selectedMode);
    setStep("prompt");
    setStreamedHtml("");
    setStreamedCss("");
    setError(null);
  };

  const handleClose = () => {
    setStep("choose");
    setPrompt("");
    setStreamedHtml("");
    setStreamedCss("");
    setError(null);
    setIsGenerating(false);
    onOpenChange(false);
  };

  const parseResponse = (text: string): { html: string; css: string } => {
    const htmlMatch = text.match(/---HTML---\s*([\s\S]*?)(?:---CSS---|---END---|$)/);
    const cssMatch = text.match(/---CSS---\s*([\s\S]*?)(?:---END---|$)/);
    
    return {
      html: htmlMatch ? htmlMatch[1].trim() : text,
      css: cssMatch ? cssMatch[1].trim() : "",
    };
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setStreamedHtml("");
    setStreamedCss("");
    
    try {
      const response = await fetch("/api/ai-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          currentHtml: mode === "edit" ? currentHtml : "",
          currentCss: mode === "edit" ? currentCss : "",
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate email template");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // Parse and update preview in real-time
        const { html, css } = parseResponse(fullText);
        if (html) {
          setStreamedHtml(html);
          // Apply changes in real-time for live preview
          onApply(html, css || currentCss);
        }
        if (css) {
          setStreamedCss(css);
        }
      }

      // Final parse and apply
      const { html, css } = parseResponse(fullText);
      if (html) {
        onApply(html, css || currentCss);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, mode, currentHtml, currentCss, onApply]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-amber-500" />
            {t("ai.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "choose" ? t("ai.chooseMode") : t("ai.enterPrompt")}
          </DialogDescription>
        </DialogHeader>

        {step === "choose" && (
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => handleModeSelect("edit")}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">{t("ai.editCurrent")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("ai.editCurrentDesc")}
                </p>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect("new")}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-border hover:border-amber-500 hover:bg-amber-500/5 transition-all group"
            >
              <div className="p-3 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                <FileText className="h-8 w-8 text-amber-500" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">{t("ai.createNew")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("ai.createNewDesc")}
                </p>
              </div>
            </button>
          </div>
        )}

        {step === "prompt" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {mode === "edit" ? (
                <>
                  <Wand2 className="h-4 w-4 text-primary" />
                  {t("ai.modeEdit")}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 text-amber-500" />
                  {t("ai.modeNew")}
                </>
              )}
              <button
                onClick={() => setStep("choose")}
                className="ml-auto text-xs underline hover:text-foreground"
              >
                {t("ai.changeMode")}
              </button>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === "edit" ? t("ai.editPlaceholder") : t("ai.newPlaceholder")}
                className="w-full h-32 p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isGenerating}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {isGenerating && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-500 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("ai.generating")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("ai.generatingDesc")}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isGenerating}
                className="bg-transparent"
              >
                {t("general.cancel")}
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("ai.generating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {t("ai.generate")}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
