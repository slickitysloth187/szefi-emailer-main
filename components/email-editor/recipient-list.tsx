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
  emailColumn: string;
  nameColumn: string;
}

interface TableColumn {
  name: string;
  type: string;
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
    table: "",
    emailColumn: "",
    nameColumn: "",
  });
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [supabaseLog, setSupabaseLog] = useState<string[]>([]);

  // Add log message helper
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSupabaseLog(prev => [...prev.slice(-19), `[${timestamp}] ${message}`]);
    console.log(`[Supabase] ${message}`);
  };

  // Load saved Supabase config
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (saved) {
        try {
          const config = JSON.parse(saved);
          setSupabaseConfig({
            url: config.url || "",
            anonKey: config.anonKey || "",
            table: config.table || "",
            emailColumn: config.emailColumn || "",
            nameColumn: config.nameColumn || "",
          });
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
    setSupabaseLog([]);
    addLog("Csatlakozás megkezdése...");

    try {
      const cleanUrl = supabaseConfig.url.replace(/\/$/, "");
      addLog(`URL: ${cleanUrl}`);

      // Try to get OpenAPI schema for table list
      addLog("Táblák lekérése...");
      const schemaResponse = await fetch(
        `${cleanUrl}/rest/v1/`,
        {
          headers: {
            apikey: supabaseConfig.anonKey,
            Authorization: `Bearer ${supabaseConfig.anonKey}`,
            Accept: "application/openapi+json",
          },
        }
      );

      addLog(`Válasz: ${schemaResponse.status}`);

      // Even if schema fetch fails, we can still connect - user can enter table manually
      if (schemaResponse.ok) {
        const schema = await schemaResponse.json();
        if (schema.paths) {
          const tables = Object.keys(schema.paths)
            .filter((path) => path.startsWith("/") && !path.includes("{"))
            .map((path) => path.slice(1))
            .filter((table) => table.length > 0);
          setAvailableTables(tables);
          addLog(`Talált táblák: ${tables.join(", ") || "nincs"}`);
        } else if (schema.definitions) {
          // Alternative: get tables from definitions
          const tables = Object.keys(schema.definitions);
          setAvailableTables(tables);
          addLog(`Talált táblák (definitions): ${tables.join(", ")}`);
        }
      } else {
        const errorText = await schemaResponse.text();
        addLog(`Séma nem elérhető: ${schemaResponse.status}`);
        
        // Check if it's a permission issue
        if (schemaResponse.status === 401 || schemaResponse.status === 403) {
          addLog("A séma hozzáférés korlátozott - írd be manuálisan a tábla nevét!");
          addLog("Ez normális, ha nincs séma olvasási jog beállítva.");
        }
      }

      // Save config and mark as connected (we'll verify actual table access when fetching)
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(supabaseConfig));
      setIsConnected(true);
      addLog("Csatlakozás kész! Add meg a tábla nevet manuálisan, vagy válassz a listából.");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Csatlakozási hiba";
      addLog(`HIBA: ${errorMsg}`);
      setError(errorMsg);
      setIsConnected(false);
    } finally {
      setIsLoadingTables(false);
    }
  };

  // Fetch columns when table is selected
  const fetchColumns = async (tableName: string) => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey || !tableName) {
      return;
    }

    setIsLoadingColumns(true);
    addLog(`Oszlopok lekérése: ${tableName}...`);

    try {
      const cleanUrl = supabaseConfig.url.replace(/\/$/, "");
      
      // Fetch one row to detect columns
      const response = await fetch(
        `${cleanUrl}/rest/v1/${tableName}?limit=1`,
        {
          headers: {
            apikey: supabaseConfig.anonKey,
            Authorization: `Bearer ${supabaseConfig.anonKey}`,
            Prefer: "count=exact",
          },
        }
      );

      addLog(`Oszlop lekérés válasz: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`Oszlop hiba: ${errorText}`);
        
        // Check for RLS error
        if (response.status === 401 || response.status === 403 || errorText.includes("RLS") || errorText.includes("policy")) {
          throw new Error("RLS policy blokkolja az olvasást. Állítsd be a SELECT engedélyt a táblán!");
        }
        throw new Error(`Nem sikerült az oszlopokat lekérni (${response.status})`);
      }

      const data = await response.json();
      const totalCount = response.headers.get("content-range");
      addLog(`Összes sor a táblában: ${totalCount || "ismeretlen"}`);

      if (Array.isArray(data) && data.length > 0) {
        const columns = Object.keys(data[0]).map(name => ({
          name,
          type: typeof data[0][name],
        }));
        setTableColumns(columns);
        addLog(`Talált oszlopok: ${columns.map(c => c.name).join(", ")}`);

        // Auto-detect email and name columns
        const emailCol = columns.find(c => 
          c.name.toLowerCase().includes("email") || 
          c.name.toLowerCase() === "e-mail" ||
          c.name.toLowerCase() === "mail"
        );
        const nameCol = columns.find(c => 
          c.name.toLowerCase().includes("name") || 
          c.name.toLowerCase() === "nev" ||
          c.name.toLowerCase() === "név"
        );

        if (emailCol) {
          addLog(`Auto-detektált email oszlop: ${emailCol.name}`);
        }
        if (nameCol) {
          addLog(`Auto-detektált név oszlop: ${nameCol.name}`);
        }

        setSupabaseConfig(prev => ({
          ...prev,
          table: tableName,
          emailColumn: emailCol?.name || prev.emailColumn || "",
          nameColumn: nameCol?.name || prev.nameColumn || "",
        }));
      } else {
        addLog("A tábla üres, próbálom a séma alapján...");
        // Try to get columns from OpenAPI schema
        const schemaResponse = await fetch(
          `${cleanUrl}/rest/v1/`,
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
          const tablePath = `/${tableName}`;
          if (schema.definitions?.[tableName]?.properties) {
            const columns = Object.keys(schema.definitions[tableName].properties).map(name => ({
              name,
              type: schema.definitions[tableName].properties[name].type || "unknown",
            }));
            setTableColumns(columns);
            addLog(`Oszlopok a sémából: ${columns.map(c => c.name).join(", ")}`);
          }
        }

        setSupabaseConfig(prev => ({
          ...prev,
          table: tableName,
        }));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Oszlop lekérési hiba";
      addLog(`HIBA: ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setIsLoadingColumns(false);
    }
  };

  const fetchRecipientsFromSupabase = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey || !supabaseConfig.table) {
      setError("Kérlek válassz egy táblát!");
      return;
    }

    if (!supabaseConfig.emailColumn) {
      setError("Kérlek válaszd ki az email oszlopot!");
      return;
    }

    setIsLoadingRecipients(true);
    setError(null);
    addLog(`Címzettek betöltése: ${supabaseConfig.table}...`);
    addLog(`Email oszlop: ${supabaseConfig.emailColumn}, Név oszlop: ${supabaseConfig.nameColumn || "(nincs)"}`);

    try {
      const cleanUrl = supabaseConfig.url.replace(/\/$/, "");
      
      // Build select query with only needed columns
      const selectColumns = [supabaseConfig.emailColumn];
      if (supabaseConfig.nameColumn) {
        selectColumns.push(supabaseConfig.nameColumn);
      }
      // Also try to get id if exists
      selectColumns.push("id");

      const selectQuery = selectColumns.join(",");
      addLog(`SELECT query: ${selectQuery}`);

      const response = await fetch(
        `${cleanUrl}/rest/v1/${supabaseConfig.table}?select=${selectQuery}`,
        {
          headers: {
            apikey: supabaseConfig.anonKey,
            Authorization: `Bearer ${supabaseConfig.anonKey}`,
          },
        }
      );

      addLog(`Válasz státusz: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`Hiba részletek: ${errorText}`);
        
        // Check for specific errors
        if (response.status === 401) {
          throw new Error("Hibás API kulcs vagy lejárt token");
        }
        if (response.status === 403) {
          throw new Error("RLS policy blokkolja az olvasást. Ellenőrizd a tábla jogosultságait!");
        }
        if (response.status === 404) {
          throw new Error(`A "${supabaseConfig.table}" tábla nem található`);
        }
        if (errorText.includes("column") && errorText.includes("does not exist")) {
          throw new Error(`Az oszlop nem létezik: ${errorText}`);
        }
        throw new Error(`Hiba a lekérésénél: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      addLog(`Kapott adatok száma: ${Array.isArray(data) ? data.length : "nem tömb"}`);

      if (!Array.isArray(data)) {
        addLog(`Kapott adat típusa: ${typeof data}`);
        addLog(`Kapott adat: ${JSON.stringify(data).slice(0, 200)}`);
        throw new Error("A válasznak tömbnek kell lennie");
      }

      if (data.length === 0) {
        addLog("A tábla üres vagy az RLS policy nem enged olvasást");
        throw new Error("A tábla üres, vagy nincs olvasási jogosultságod (RLS policy)");
      }

      // Log first row for debugging
      addLog(`Első sor: ${JSON.stringify(data[0])}`);

      const validRecipients: Recipient[] = [];
      let skippedCount = 0;

      for (const item of data) {
        if (typeof item === "object" && item !== null) {
          const email = item[supabaseConfig.emailColumn];
          
          if (typeof email === "string" && email.includes("@")) {
            const name = supabaseConfig.nameColumn 
              ? (item[supabaseConfig.nameColumn] || email.split("@")[0])
              : email.split("@")[0];
            
            validRecipients.push({
              id: item.id?.toString(),
              email: email.trim(),
              name: String(name).trim(),
            });
          } else {
            skippedCount++;
          }
        }
      }

      addLog(`Érvényes címzettek: ${validRecipients.length}, Kihagyott: ${skippedCount}`);

      if (validRecipients.length === 0) {
        throw new Error(`Nem található érvényes email a "${supabaseConfig.emailColumn}" oszlopban`);
      }

      onRecipientsChange(validRecipients);
      onSelectionChange(new Set());
      setSupabaseDialogOpen(false);
      addLog("Betöltés sikeres!");

      // Save config
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(supabaseConfig));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Hiba a betöltés során";
      addLog(`HIBA: ${errorMsg}`);
      setError(errorMsg);
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

              {/* Manual table name input - always visible after connection */}
              {isConnected && (
                <div className="space-y-2">
                  <Label htmlFor="table-name">Tábla neve</Label>
                  <div className="flex gap-2">
                    <Input
                      id="table-name"
                      placeholder="pl. subscribers, users, contacts..."
                      value={supabaseConfig.table}
                      onChange={(e) =>
                        setSupabaseConfig({ ...supabaseConfig, table: e.target.value })
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (supabaseConfig.table) {
                          fetchColumns(supabaseConfig.table);
                        }
                      }}
                      disabled={!supabaseConfig.table || isLoadingColumns}
                    >
                      {isLoadingColumns ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Oszlopok"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {availableTables.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Vagy válassz a listából:</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                    {availableTables.map((table) => (
                      <Button
                        key={table}
                        size="sm"
                        variant={supabaseConfig.table === table ? "default" : "outline"}
                        onClick={() => fetchColumns(table)}
                        disabled={isLoadingColumns}
                        className="justify-start text-xs bg-transparent"
                      >
                        {table}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Column Selection - from detected columns */}
              {tableColumns.length > 0 && (
                <div className="space-y-3 p-3 bg-secondary/30 rounded-lg border border-border">
                  <p className="text-sm font-medium">Oszlop hozzárendelés</p>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Email oszlop *</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {tableColumns.map((col) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setSupabaseConfig({ ...supabaseConfig, emailColumn: col.name })}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                            supabaseConfig.emailColumn === col.name
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-transparent border-border hover:border-primary/50 hover:bg-primary/10"
                          }`}
                        >
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Név oszlop (opcionális)</Label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSupabaseConfig({ ...supabaseConfig, nameColumn: "" })}
                        className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                          !supabaseConfig.nameColumn
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-transparent border-border hover:border-primary/50 hover:bg-primary/10"
                        }`}
                      >
                        (nincs)
                      </button>
                      {tableColumns.map((col) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setSupabaseConfig({ ...supabaseConfig, nameColumn: col.name })}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                            supabaseConfig.nameColumn === col.name
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-transparent border-border hover:border-primary/50 hover:bg-primary/10"
                          }`}
                        >
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Column Input - if no columns detected (RLS issue) */}
              {tableColumns.length === 0 && supabaseConfig.table && (
                <div className="space-y-3 p-3 bg-secondary/30 rounded-lg border border-border">
                  <p className="text-sm font-medium">Manuális oszlop megadás</p>
                  <p className="text-xs text-muted-foreground">
                    Ha az oszlopok nem töltődtek be (pl. RLS policy miatt), add meg manuálisan:
                  </p>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Email oszlop neve *</Label>
                    <Input
                      placeholder="pl. email, e_mail, user_email..."
                      value={supabaseConfig.emailColumn}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, emailColumn: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Név oszlop neve (opcionális)</Label>
                    <Input
                      placeholder="pl. name, nev, full_name..."
                      value={supabaseConfig.nameColumn}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, nameColumn: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={fetchRecipientsFromSupabase}
                disabled={isLoadingRecipients || !supabaseConfig.table || !supabaseConfig.emailColumn}
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

              {/* Debug Log */}
              {supabaseLog.length > 0 && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Napló</Label>
                  <div className="bg-background border border-border rounded p-2 max-h-32 overflow-y-auto font-mono text-[10px] text-muted-foreground">
                    {supabaseLog.map((log, i) => (
                      <div key={i} className={log.includes("HIBA") ? "text-destructive" : log.includes("sikeres") ? "text-green-500" : ""}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
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
