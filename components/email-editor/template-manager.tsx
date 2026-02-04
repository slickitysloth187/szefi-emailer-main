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
import { Save, Trash2, FileText, Download, Sparkles } from "lucide-react";
import { exampleTemplates, type ExampleTemplate } from "@/lib/email-templates";
import { useLanguage } from "@/lib/i18n";

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

const TEMPLATES_KEY = "nightowl-email-templates";

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
  const { language, t } = useLanguage();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTemplates(loadTemplates());
      setIsLoaded(true);
    }
  }, []);

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

  const handleLoadExampleTemplate = (example: ExampleTemplate) => {
    onLoadTemplate({
      id: example.id,
      name: language === "hu" ? example.nameHu : example.name,
      html: example.html,
      css: example.css,
      subject: language === "hu" ? example.subjectHu : example.subject,
      createdAt: Date.now(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t("templates.title")}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {language === "hu" 
              ? "Mentsd el és töltsd be az email sablonjaidat, vagy válassz a példák közül."
              : "Save and load your email templates, or choose from examples."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh] pr-4">
            {/* Save Form */}
            <div className="py-4">
              {showSaveForm ? (
                <div className="space-y-3 p-4 rounded-lg bg-secondary/30 border border-border">
                  <Label htmlFor="template-name">{t("templates.name")}</Label>
                  <Input
                    id="template-name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder={language === "hu" ? "Pl. Hírlevél sablon" : "E.g. Newsletter template"}
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
                      {t("general.save")}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setShowSaveForm(false);
                        setNewTemplateName("");
                      }}
                    >
                      {t("general.cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowSaveForm(true)}
                  className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("templates.save")}
                </Button>
              )}
            </div>

            {/* Example Templates */}
            <div className="border-t border-border pt-4 mb-4">
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {t("templates.examples")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {exampleTemplates.map((example) => (
                  <div
                    key={example.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleLoadExampleTemplate(example)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {language === "hu" ? example.nameHu : example.name}
                        </p>
                      </div>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Templates */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-3">{t("templates.saved")}</p>
              {templates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {language === "hu" ? "Még nincs mentett sablonod." : "No saved templates yet."}
                </p>
              ) : (
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
                            {new Date(template.createdAt).toLocaleDateString(language === "hu" ? "hu-HU" : "en-US")}
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
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("general.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
