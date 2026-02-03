"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  Users,
  CheckSquare,
  XSquare,
  Trash2,
  Database,
  Plus,
  RefreshCw,
  Loader2,
} from "lucide-react";

export interface Recipient {
  id?: string;
  email: string;
  name: string;
}

interface SupabaseConfig {
  url: string;
  anonKey: string;
  table: string;
}

interface RecipientListProps {
  recipients: Recipient[];
  selectedRecipients: Set<string>;
  onRecipientsChange: (recipients: Recipient[]) => void;
  onSelectionChange: (selected: Set<string>) => void;
}

const SUPABASE_CONFIG_KEY = "szefi-email-supabase-config";

export function RecipientList({
  recipients,
  selectedRecipients,
  onRecipientsChange,
  onSelectionChange,
}: RecipientListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [supabaseDialogOpen, setSupabaseDialogOpen] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    url: "",
    anonKey: "",
    table: "subscribers",
  });
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Load saved Supabase config
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (saved) {
        try {
          const config = JSON.parse(saved);
          setSupabaseConfig(config);
          if (config.url && config.anonKey) {
            setIsConnected(true);
          }
        } catch {}
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (!Array.isArray(parsed)) {
          throw new Error("A JSON-nak tömbnek kell lennie");
        }

        const validRecipients: Recipient[] = [];
        for (const item of parsed) {
          if (
            typeof item === "object" &&
            item !== null &&
            typeof item.email === "string" &&
            typeof item.name === "string"
          ) {
            validRecipients.push({
              id: item.id,
              email: item.email,
              name: item.name,
            });
          }
        }

        if (validRecipients.length === 0) {
          throw new Error("Nem található érvényes címzett");
        }

        onRecipientsChange(validRecipients);
        onSelectionChange(new Set());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Érvénytelen JSON fájl");
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchTables = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      setError("Kérlek add meg a Supabase URL-t és az Anon Key-t!");
      return;
    }

    setIsLoadingTables(true);
    setError(null);

    try {
      // Try to get tables by querying the information_schema
      const response = await fetch(
        `${supabaseConfig.url}/rest/v1/?apikey=${supabaseConfig.anonKey}`,
        {
          headers: {
            apikey: supabaseConfig.anonKey,
            Authorization: `Bearer ${supabaseConfig.anonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nem sikerült csatlakozni a Supabase-hez");
      }

      // Get available endpoints from OpenAPI schema
      const schemaResponse = await fetch(
        `${supabaseConfig.url}/rest/v1/`,
        {
          headers: {
            apikey: supabaseConfig.anonKey,
            Authorization: `Bearer ${supabaseConfig.anonKey}`,
            Accept: "application/openapi+json",
          },
        }
      );

      if (schemaResponse.ok) {
        const schema = await schemaResponse.json();
        if (schema.paths) {
          const tables = Object.keys(schema.paths)
            .filter((path) => path.startsWith("/") && !path.includes("{"))
            .map((path) => path.slice(1));
          setAvailableTables(tables);
        }
      }

      // Save config
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(supabaseConfig));
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Csatlakozási hiba");
      setIsConnected(false);
    } finally {
      setIsLoadingTables(false);
    }
  };

  const fetchRecipientsFromSupabase = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey || !supabaseConfig.table) {
      setError("Kérlek válassz egy táblát!");
      return;
    }

    setIsLoadingRecipients(true);
    setError(null);

    try {
      const response = await fetch(
        `${supabaseConfig.url}/rest/v1/${supabaseConfig.table}?select=*`,
        {
          headers: {
            apikey: supabaseConfig.anonKey,
            Authorization: `Bearer ${supabaseConfig.anonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Hiba a táblázat lekérésénél: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("A válasznak tömbnek kell lennie");
      }

      const validRecipients: Recipient[] = [];
      for (const item of data) {
        if (typeof item === "object" && item !== null && typeof item.email === "string") {
          validRecipients.push({
            id: item.id,
            email: item.email,
            name: item.name || item.email.split("@")[0],
          });
        }
      }

      if (validRecipients.length === 0) {
        throw new Error("Nem található érvényes címzett a táblában");
      }

      onRecipientsChange(validRecipients);
      onSelectionChange(new Set());
      setSupabaseDialogOpen(false);

      // Save config
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(supabaseConfig));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hiba a betöltés során");
    } finally {
      setIsLoadingRecipients(false);
    }
  };

  const handleManualAdd = () => {
    const lines = manualInput.trim().split("\n");
    const newRecipients: Recipient[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Format: Name, email OR just email
      const parts = trimmed.split(",").map((p) => p.trim());

      if (parts.length >= 2) {
        // Name, email format
        const name = parts[0];
        const email = parts[1];
        if (email && email.includes("@")) {
          newRecipients.push({ name, email });
        }
      } else if (parts[0].includes("@")) {
        // Just email
        const email = parts[0];
        newRecipients.push({ name: email.split("@")[0], email });
      }
    }

    if (newRecipients.length > 0) {
      // Merge with existing, avoiding duplicates
      const existingEmails = new Set(recipients.map((r) => r.email));
      const uniqueNew = newRecipients.filter((r) => !existingEmails.has(r.email));
      onRecipientsChange([...recipients, ...uniqueNew]);
      setManualInput("");
      setManualDialogOpen(false);
      setError(null);
    } else {
      setError("Nem található érvényes email cím");
    }
  };

  const toggleRecipient = (email: string) => {
    const newSelected = new Set(selectedRecipients);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    onSelectionChange(newSelected);
  };

  const selectAll = () => {
    onSelectionChange(new Set(recipients.map((r) => r.email)));
  };

  const clearSelection = () => {
    onSelectionChange(new Set());
  };

  const clearRecipients = () => {
    onRecipientsChange([]);
    onSelectionChange(new Set());
  };

  return (
    <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card">
      <div className="px-4 py-2 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Címzettek</span>
          {isConnected && (
            <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">
              Supabase
            </span>
          )}
        </div>
      </div>

      <div className="p-2 md:p-3 border-b border-border flex flex-wrap gap-1.5 md:gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* JSON Upload */}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          className="gap-1 md:gap-1.5 text-xs h-7 md:h-8 px-2 md:px-3"
        >
          <Upload className="h-3 w-3 md:h-3.5 md:w-3.5" />
          <span className="hidden sm:inline">JSON</span> betöltése
        </Button>

        {/* Supabase Dialog */}
        <Dialog open={supabaseDialogOpen} onOpenChange={setSupabaseDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="gap-1 md:gap-1.5 text-xs h-7 md:h-8 px-2 md:px-3"
            >
              <Database className="h-3 w-3 md:h-3.5 md:w-3.5" />
              <span className="hidden sm:inline">Supabase</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Supabase adatbázis</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="supabase-url">Supabase URL</Label>
                <Input
                  id="supabase-url"
                  placeholder="https://xxxxx.supabase.co"
                  value={supabaseConfig.url}
                  onChange={(e) =>
                    setSupabaseConfig({ ...supabaseConfig, url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supabase-key">Anon Key</Label>
                <Input
                  id="supabase-key"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseConfig.anonKey}
                  onChange={(e) =>
                    setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })
                  }
                />
              </div>

              <Button
                onClick={fetchTables}
                disabled={isLoadingTables}
                className="w-full"
                variant="secondary"
              >
                {isLoadingTables ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Csatlakozás / Táblák lekérése
              </Button>

              {availableTables.length > 0 && (
                <div className="space-y-2">
                  <Label>Válassz táblát</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {availableTables.map((table) => (
                      <Button
                        key={table}
                        size="sm"
                        variant={supabaseConfig.table === table ? "default" : "outline"}
                        onClick={() => setSupabaseConfig({ ...supabaseConfig, table })}
                        className="justify-start text-xs"
                      >
                        {table}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {supabaseConfig.table && (
                <div className="space-y-2">
                  <Label htmlFor="table-name">Tábla neve</Label>
                  <Input
                    id="table-name"
                    placeholder="subscribers"
                    value={supabaseConfig.table}
                    onChange={(e) =>
                      setSupabaseConfig({ ...supabaseConfig, table: e.target.value })
                    }
                  />
                </div>
              )}

              <Button
                onClick={fetchRecipientsFromSupabase}
                disabled={isLoadingRecipients || !supabaseConfig.table}
                className="w-full"
              >
                {isLoadingRecipients ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Címzettek betöltése
              </Button>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Manual Add Dialog */}
        <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="gap-1 md:gap-1.5 text-xs h-7 md:h-8 px-2 md:px-3"
            >
              <Plus className="h-3 w-3 md:h-3.5 md:w-3.5" />
              <span className="hidden sm:inline">Hozzáadás</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Címzettek hozzáadása</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Soronként egy címzett</Label>
                <p className="text-xs text-muted-foreground">
                  Formátum: Név, email cím (pl.: Példa Péter, pelda@pelda.com)
                  <br />
                  Vagy csak email cím
                </p>
                <textarea
                  className="w-full h-40 p-3 text-sm bg-background border border-border rounded-md resize-none font-mono"
                  placeholder={`Példa Péter, pelda@pelda.com\nTeszt Elek, teszt@email.hu\nvalaki@email.com`}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                />
              </div>
              <Button onClick={handleManualAdd} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Hozzáadás
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          size="sm"
          variant="secondary"
          onClick={selectAll}
          disabled={recipients.length === 0}
          className="gap-1 md:gap-1.5 text-xs h-7 md:h-8 px-2 md:px-3"
        >
          <CheckSquare className="h-3 w-3 md:h-3.5 md:w-3.5" />
          Összes
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={clearSelection}
          disabled={selectedRecipients.size === 0}
          className="gap-1 md:gap-1.5 text-xs h-7 md:h-8 px-2 md:px-3"
        >
          <XSquare className="h-3 w-3 md:h-3.5 md:w-3.5" />
          <span className="hidden sm:inline">Törlés</span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={clearRecipients}
          disabled={recipients.length === 0}
          className="gap-1 md:gap-1.5 text-xs h-7 md:h-8 px-2 md:px-3"
        >
          <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
          <span className="hidden sm:inline">Mind</span>
        </Button>
      </div>

      {error && !supabaseDialogOpen && !manualDialogOpen && (
        <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <div className="px-4 py-2 border-b border-border bg-muted/30 flex justify-between text-xs text-muted-foreground">
        <span>Összesen: {recipients.length}</span>
        <span>Kiválasztva: {selectedRecipients.size}</span>
      </div>

      <ScrollArea className="flex-1">
        {recipients.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nincsenek címzettek</p>
            <p className="text-xs mt-1">Tölts be egy JSON fájlt a címzettek hozzáadásához</p>
          </div>
        ) : (
          <div className="p-2">
            {recipients.map((recipient) => (
              <label
                key={recipient.email}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedRecipients.has(recipient.email)}
                  onCheckedChange={() => toggleRecipient(recipient.email)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{recipient.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{recipient.email}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
