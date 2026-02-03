"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "szefi-email-smtp-settings";

export default function UnsubscribePage() {
  const [unsubscribeMessage, setUnsubscribeMessage] = useState(
    "Sikeresen leiratkoztál a hírlevélről. Sajnáljuk, hogy elmész!"
  );
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // Load custom unsubscribe message from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.unsubscribeMessage) {
            setUnsubscribeMessage(settings.unsubscribeMessage);
          }
        } catch {}
      }
    }
  }, []);

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {confirmed ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <Mail className="h-8 w-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {confirmed ? "Leiratkozva" : "Leiratkozás"}
          </h1>
        </div>

        {confirmed ? (
          <p className="text-muted-foreground mb-6">{unsubscribeMessage}</p>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Biztosan le szeretnél iratkozni a hírlevélről?
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                Mégsem
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Leiratkozás
              </Button>
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Ha kérdésed van, írj nekünk!
          </p>
        </div>
      </div>
    </div>
  );
}
