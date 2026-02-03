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
import { Switch } from "@/components/ui/switch";
import { Save, Eye, EyeOff, Globe, Mail } from "lucide-react";

export interface SmtpSettings {
  host: string;
  port: string;
  user: string;
  pass: string;
  secure: boolean;
  domain: string;
  unsubscribeMessage: string;
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: SmtpSettings) => void;
  settings: SmtpSettings;
}

const STORAGE_KEY = "szefi-email-smtp-settings";

export function loadSettings(): SmtpSettings {
  if (typeof window === "undefined") {
    return { 
      host: "", 
      port: "587", 
      user: "", 
      pass: "", 
      secure: false,
      domain: "",
      unsubscribeMessage: "Sikeresen leiratkoztál a hírlevélről. Sajnáljuk, hogy elmész!"
    };
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        host: parsed.host || "",
        port: parsed.port || "587",
        user: parsed.user || "",
        pass: parsed.pass || "",
        secure: parsed.secure || false,
        domain: parsed.domain || "",
        unsubscribeMessage: parsed.unsubscribeMessage || "Sikeresen leiratkoztál a hírlevélről. Sajnáljuk, hogy elmész!"
      };
    } catch {
      return { 
        host: "", 
        port: "587", 
        user: "", 
        pass: "", 
        secure: false,
        domain: "",
        unsubscribeMessage: "Sikeresen leiratkoztál a hírlevélről. Sajnáljuk, hogy elmész!"
      };
    }
  }
  return { 
    host: "", 
    port: "587", 
    user: "", 
    pass: "", 
    secure: false,
    domain: "",
    unsubscribeMessage: "Sikeresen leiratkoztál a hírlevélről. Sajnáljuk, hogy elmész!"
  };
}

export function saveSettings(settings: SmtpSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function SettingsDialog({
  open,
  onOpenChange,
  onSave,
  settings,
}: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<SmtpSettings>(settings);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"smtp" | "email">("smtp");

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    saveSettings(localSettings);
    onSave(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Beállítások</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            SMTP és email beállítások. A beállítások a böngésződben lesznek tárolva.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("smtp")}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "smtp"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            SMTP Szerver
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "email"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Email & Domain
          </button>
        </div>

        <div className="py-4">
          {activeTab === "smtp" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Szerver</Label>
                <Input
                  id="smtp-host"
                  value={localSettings.host}
                  onChange={(e) => setLocalSettings({ ...localSettings, host: e.target.value })}
                  placeholder="pl. smtp.gmail.com"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port</Label>
                <Input
                  id="smtp-port"
                  value={localSettings.port}
                  onChange={(e) => setLocalSettings({ ...localSettings, port: e.target.value })}
                  placeholder="587"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-user">Felhasználónév / Email</Label>
                <Input
                  id="smtp-user"
                  value={localSettings.user}
                  onChange={(e) => setLocalSettings({ ...localSettings, user: e.target.value })}
                  placeholder="email@example.com"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-pass">Jelszó / Alkalmazásjelszó</Label>
                <div className="relative">
                  <Input
                    id="smtp-pass"
                    type={showPassword ? "text" : "password"}
                    value={localSettings.pass}
                    onChange={(e) => setLocalSettings({ ...localSettings, pass: e.target.value })}
                    placeholder="••••••••"
                    className="bg-input border-border pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smtp-secure">SSL/TLS (465-ös port)</Label>
                  <p className="text-xs text-muted-foreground">
                    Kapcsold be ha 465-ös portot használsz
                  </p>
                </div>
                <Switch
                  id="smtp-secure"
                  checked={localSettings.secure}
                  onCheckedChange={(checked) => setLocalSettings({ ...localSettings, secure: checked })}
                />
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Weboldal Domain
                </Label>
                <Input
                  id="domain"
                  value={localSettings.domain}
                  onChange={(e) => setLocalSettings({ ...localSettings, domain: e.target.value })}
                  placeholder="https://example.com"
                  className="bg-input border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Ez lesz a leiratkozási link alapja (pl. https://example.com/unsubscribe)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unsubscribe-message" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Leiratkozási üzenet
                </Label>
                <textarea
                  id="unsubscribe-message"
                  value={localSettings.unsubscribeMessage}
                  onChange={(e) => setLocalSettings({ ...localSettings, unsubscribeMessage: e.target.value })}
                  placeholder="A leiratkozás oldalon megjelenő üzenet..."
                  className="w-full h-24 px-3 py-2 text-sm bg-input border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground">
                  Ez az üzenet jelenik meg, amikor valaki leiratkozik
                </p>
              </div>

              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  <strong>Tipp:</strong> A HTML sablonban használd a <code className="bg-background px-1 rounded">{"{{unsubscribe}}"}</code> változót,
                  ami automatikusan kicserélődik a leiratkozási linkre.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Mégse
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
          >
            <Save className="h-4 w-4" />
            Mentés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
