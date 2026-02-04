"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { CodeEditor } from "./code-editor";
import { EmailPreview } from "./email-preview";
import { InteractivePreview } from "./interactive-preview";
import { RecipientList, type Recipient } from "./recipient-list";
import { SendDialog } from "./send-dialog";
import { SettingsDialog, loadSettings, type SmtpSettings } from "./settings-dialog";
import { TemplateManager, type EmailTemplate } from "./template-manager";
import { AIEditorDialog } from "./ai-editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_HTML, DEFAULT_CSS } from "@/lib/default-template";
import { generateEmailHTML } from "@/lib/css-inliner";
import { 
  RotateCcw, Send, Bird, Maximize2, Settings, FolderOpen, 
  Code, Eye, Users, Menu, X, CreditCard, LogIn, Globe, Sparkles 
} from "lucide-react";
import Link from "next/link";
import { Mail } from "lucide-react"; // Added import for Mail
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage, type Language } from "@/lib/i18n";

type MobileTab = "code" | "preview" | "recipients";

export function EmailEditor() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [subject, setSubject] = useState("Email tárgy");
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("NightOwl");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(new Set());
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [templatesDialogOpen, setTemplatesDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>({
    host: "",
    port: "587",
    user: "",
    pass: "",
    secure: false,
    domain: "",
    unsubscribeMessage: "Sikeresen leiratkoztál a hírlevélről. Sajnáljuk, hogy elmész!",
  });
  const [mobileTab, setMobileTab] = useState<MobileTab>("code");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = loadSettings();
    setSmtpSettings(saved);
    if (saved.user) {
      setFromEmail(saved.user);
    }
  }, []);

  const resetTemplate = useCallback(() => {
    setHtml(DEFAULT_HTML);
    setCss(DEFAULT_CSS);
  }, []);

  const inlinedHtml = useMemo(() => {
    try {
      return generateEmailHTML(html, css);
    } catch {
      return html;
    }
  }, [html, css]);

  const handleLoadTemplate = useCallback((template: EmailTemplate) => {
    setHtml(template.html);
    setCss(template.css);
    setSubject(template.subject);
  }, []);

  const handleSettingsSave = useCallback((settings: SmtpSettings) => {
    setSmtpSettings(settings);
    if (settings.user && !fromEmail) {
      setFromEmail(settings.user);
    }
  }, [fromEmail]);

  const handleSend = useCallback(async () => {
    if (selectedRecipients.size === 0) {
      setSendResult({ success: false, message: "Nincs kiválasztott címzett" });
      return;
    }

    if (!smtpSettings.host || !smtpSettings.user || !smtpSettings.pass) {
      setSendResult({ 
        success: false, 
        message: "SMTP beállítások hiányoznak. Kattints a fogaskerék ikonra!" 
      });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const selectedList = recipients.filter((r) => selectedRecipients.has(r.email));

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          html: inlinedHtml,
          recipients: selectedList,
          fromEmail: fromEmail || smtpSettings.user,
          fromName,
          smtp: smtpSettings,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const summary = data.summary;
        setSendResult({
          success: summary.failed === 0,
          message: `Sikeresen elküldve: ${summary.successful} db, Sikertelen: ${summary.failed} db`,
        });
      } else {
        setSendResult({ success: false, message: data.error || "Hiba az emailek küldésekor" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ismeretlen hiba";
      setSendResult({ success: false, message: `Hálózati hiba: ${errorMessage}` });
    } finally {
      setIsSending(false);
    }
  }, [html, css, subject, recipients, selectedRecipients, fromEmail, fromName, inlinedHtml, smtpSettings]);

  const smtpConfigured = smtpSettings.host && smtpSettings.user && smtpSettings.pass;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header - Desktop */}
      <header className="border-b border-border bg-card px-4 py-3 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bird className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">NightOwl Mail</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "hu" : "en")}
              className="gap-1.5 px-2"
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? "EN" : "HU"}
            </Button>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <CreditCard className="h-4 w-4" />
                {t("header.pricing")}
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-1.5 bg-transparent" onClick={() => alert(t("general.comingSoon"))}>
              <LogIn className="h-4 w-4" />
              {t("header.signIn")}
            </Button>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTemplatesDialogOpen(true)}
              className="gap-1.5"
            >
              <FolderOpen className="h-4 w-4" />
              {t("header.templates")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetTemplate}
              className="gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              {t("header.reset")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewDialogOpen(true)}
              className="gap-1.5"
            >
              <Maximize2 className="h-4 w-4" />
              {t("header.preview")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsDialogOpen(true)}
              className={`gap-1.5 ${!smtpConfigured ? "border-primary text-primary" : ""}`}
            >
              <Settings className="h-4 w-4" />
              {!smtpConfigured && <span className="text-xs">!</span>}
            </Button>
            <Button
              size="sm"
              onClick={() => setSendDialogOpen(true)}
              disabled={selectedRecipients.size === 0 || !smtpConfigured}
              className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="h-4 w-4" />
              {t("header.send")} ({selectedRecipients.size})
            </Button>
          </div>
        </div>
      </header>

      {/* Header - Mobile */}
      <header className="border-b border-border bg-card px-3 py-2 flex md:hidden items-center justify-between">
        <div className="flex items-center gap-2">
          <Bird className="h-5 w-5 text-primary" />
          <h1 className="text-sm font-semibold text-foreground truncate">NightOwl Mail</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsDialogOpen(true)}
            className={`h-8 w-8 p-0 ${!smtpConfigured ? "border-primary text-primary" : ""}`}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => setSendDialogOpen(true)}
            disabled={selectedRecipients.size === 0 || !smtpConfigured}
            className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground px-2"
          >
            <Send className="h-4 w-4" />
            <span className="text-xs">({selectedRecipients.size})</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-8 w-8 p-0"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 px-3 py-2 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setTemplatesDialogOpen(true); setMobileMenuOpen(false); }}
            className="gap-1.5 text-xs h-8"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            Sablonok
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { resetTemplate(); setMobileMenuOpen(false); }}
            className="gap-1.5 text-xs h-8"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Alaphelyzet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setPreviewDialogOpen(true); setMobileMenuOpen(false); }}
            className="gap-1.5 text-xs h-8"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Teljes előnézet
          </Button>
        </div>
      )}

      {/* Subject & From Line - Desktop */}
      <div className="border-b border-border bg-card/50 px-4 py-2 hidden md:block">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Tárgy:
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email tárgya..."
              className="bg-input border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Feladó:
            </label>
            <Input
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Feladó neve..."
              className="bg-input border-border w-32"
            />
            <Input
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder={smtpSettings.user || "email@example.com"}
              className="bg-input border-border w-52"
            />
          </div>
        </div>
      </div>

      {/* Subject & From Line - Mobile */}
      <div className="border-b border-border bg-card/50 px-3 py-2 md:hidden space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground w-12">Tárgy:</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email tárgya..."
            className="bg-input border-border h-8 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground w-12">Feladó:</label>
          <Input
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            placeholder="Név..."
            className="bg-input border-border h-8 text-sm w-24"
          />
          <Input
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            placeholder={smtpSettings.user || "email@..."}
            className="bg-input border-border h-8 text-sm flex-1"
          />
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden border-b border-border bg-card flex">
        <button
          onClick={() => setMobileTab("code")}
          className={cn(
            "flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors",
            mobileTab === "code" 
              ? "text-primary border-b-2 border-primary bg-primary/5" 
              : "text-muted-foreground"
          )}
        >
          <Code className="h-4 w-4" />
          Kód
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={cn(
            "flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors",
            mobileTab === "preview" 
              ? "text-primary border-b-2 border-primary bg-primary/5" 
              : "text-muted-foreground"
          )}
        >
          <Eye className="h-4 w-4" />
          Előnézet
        </button>
        <button
          onClick={() => setMobileTab("recipients")}
          className={cn(
            "flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors",
            mobileTab === "recipients" 
              ? "text-primary border-b-2 border-primary bg-primary/5" 
              : "text-muted-foreground"
          )}
        >
          <Users className="h-4 w-4" />
          Címzettek
          {selectedRecipients.size > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px]">
              {selectedRecipients.size}
            </span>
          )}
        </button>
      </div>

      {/* Main Content - Desktop */}
      <div className="flex-1 overflow-hidden hidden md:block">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Code Editors Panel */}
          <ResizablePanel defaultSize={50} minSize={20}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* HTML Editor */}
              <ResizablePanel defaultSize={60} minSize={20}>
<div className="h-full p-2">
  <CodeEditor
    value={html}
    onChange={setHtml}
    language="html"
    label={t("editor.htmlContent")}
    showAiButton
    onAiClick={() => setAiDialogOpen(true)}
  />
  </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              {/* CSS Editor */}
              <ResizablePanel defaultSize={40} minSize={15}>
                <div className="h-full p-2 pt-0">
                  <CodeEditor
                    value={css}
                    onChange={setCss}
                    language="css"
                    label="CSS Stílusok"
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Panel - Interactive */}
          <ResizablePanel defaultSize={30} minSize={15}>
            <div className="h-full p-2">
<InteractivePreview html={html} css={css} onHtmlChange={setHtml} onAiClick={() => setAiDialogOpen(true)} />
  </div>
  </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Recipients Panel */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full p-2 pl-0">
              <RecipientList
                recipients={recipients}
                selectedRecipients={selectedRecipients}
                onRecipientsChange={setRecipients}
                onSelectionChange={setSelectedRecipients}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Main Content - Mobile */}
      <div className="flex-1 overflow-hidden md:hidden">
        {/* Code Tab */}
        {mobileTab === "code" && (
          <div className="h-full flex flex-col">
            <div className="flex-1 p-2">
              <CodeEditor
                value={html}
                onChange={setHtml}
                language="html"
                label={t("editor.htmlContent")}
                showAiButton
                onAiClick={() => setAiDialogOpen(true)}
              />
            </div>
            <div className="h-[30%] min-h-[120px] p-2 pt-0">
              <CodeEditor
                value={css}
                onChange={setCss}
                language="css"
                label={t("editor.cssStyles")}
              />
            </div>
          </div>
        )}

        {/* Preview Tab */}
{mobileTab === "preview" && (
  <div className="h-full p-2">
  <InteractivePreview html={html} css={css} onHtmlChange={setHtml} onAiClick={() => setAiDialogOpen(true)} />
  </div>
  )}

        {/* Recipients Tab */}
        {mobileTab === "recipients" && (
          <div className="h-full p-2">
            <RecipientList
              recipients={recipients}
              selectedRecipients={selectedRecipients}
              onRecipientsChange={setRecipients}
              onSelectionChange={setSelectedRecipients}
            />
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Email Előnézet - Teljes méret</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-lg border border-border">
            <EmailPreview html={html} css={css} fullscreen />
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        onSave={handleSettingsSave}
        settings={smtpSettings}
      />

      {/* Templates Dialog */}
      <TemplateManager
        open={templatesDialogOpen}
        onOpenChange={setTemplatesDialogOpen}
        currentHtml={html}
        currentCss={css}
        currentSubject={subject}
        onLoadTemplate={handleLoadTemplate}
      />

      {/* Send Dialog */}
      <SendDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        subject={subject}
        recipientCount={selectedRecipients.size}
        onConfirm={handleSend}
        isSending={isSending}
        result={sendResult}
      />

      {/* AI Editor Dialog */}
      <AIEditorDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        currentHtml={html}
        currentCss={css}
        onApply={(newHtml, newCss) => {
          setHtml(newHtml);
          if (newCss) setCss(newCss);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-2 text-center">
        <span className="text-xs text-muted-foreground">
          NightOwl Mail - developed by SlickitySloth -{" "}
          <a
            href="https://www.viragtamas.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            www.viragtamas.dev
          </a>
        </span>
      </footer>
    </div>
  );
}
