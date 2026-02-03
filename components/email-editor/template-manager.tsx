"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Trash2, FileText, Download } from "lucide-react";

export interface EmailTemplate {
  id: string;
  name: string;
  html: string;
  css: string;
  subject: string;
  createdAt: number;
}

interface TemplateManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHtml: string;
  currentCss: string;
  currentSubject: string;
  onLoadTemplate: (template: EmailTemplate) => void;
}

const TEMPLATES_KEY = "szefi-email-templates";

export function loadTemplates(): EmailTemplate[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(TEMPLATES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveTemplates(templates: EmailTemplate[]) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function TemplateManager({
  open,
  onOpenChange,
  currentHtml,
  currentCss,
  currentSubject,
  onLoadTemplate,
}: TemplateManagerProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load templates on mount and when dialog opens
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTemplates(loadTemplates());
      setIsLoaded(true);
    }
  }, []);

  // Also reload when dialog opens
  useEffect(() => {
    if (open && typeof window !== "undefined") {
      setTemplates(loadTemplates());
    }
  }, [open]);

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      html: currentHtml,
      css: currentCss,
      subject: currentSubject,
      createdAt: Date.now(),
    };

    const updated = [...templates, newTemplate];
    setTemplates(updated);
    saveTemplates(updated);
    setNewTemplateName("");
    setShowSaveForm(false);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    saveTemplates(updated);
  };

  const handleLoadTemplate = (template: EmailTemplate) => {
    onLoadTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Email Sablonok</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Mentsd el és töltsd be az email sablonjaidat.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {showSaveForm ? (
            <div className="space-y-3 p-4 rounded-lg bg-secondary/30 border border-border">
              <Label htmlFor="template-name">Sablon neve</Label>
              <Input
                id="template-name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Pl. Hírlevél sablon"
                className="bg-input border-border"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveTemplate}
                  disabled={!newTemplateName.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Mentés
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setShowSaveForm(false);
                    setNewTemplateName("");
                  }}
                >
                  Mégse
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowSaveForm(true)}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            >
              <Save className="h-4 w-4 mr-2" />
              Jelenlegi sablon mentése
            </Button>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground mb-3">Mentett sablonok</p>
          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Még nincs mentett sablonod.
            </p>
          ) : (
            <ScrollArea className="h-[250px]">
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{template.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(template.createdAt).toLocaleDateString("hu-HU")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLoadTemplate(template)}
                        className="h-8 px-2"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="h-8 px-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Bezárás
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
