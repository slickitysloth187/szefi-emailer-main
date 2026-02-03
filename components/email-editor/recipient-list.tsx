"use client";

import React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Users, CheckSquare, XSquare, Trash2 } from "lucide-react";

export interface Recipient {
  email: string;
  name: string;
}

interface RecipientListProps {
  recipients: Recipient[];
  selectedRecipients: Set<string>;
  onRecipientsChange: (recipients: Recipient[]) => void;
  onSelectionChange: (selected: Set<string>) => void;
}

export function RecipientList({
  recipients,
  selectedRecipients,
  onRecipientsChange,
  onSelectionChange,
}: RecipientListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

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

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        <Button
          size="sm"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          className="gap-1 md:gap-1.5 text-xs h-7 md:h-8 px-2 md:px-3"
        >
          <Upload className="h-3 w-3 md:h-3.5 md:w-3.5" />
          <span className="hidden sm:inline">JSON</span> betöltése
        </Button>
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

      {error && (
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
