"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "szefi-email-smtp-settings";
const SUPABASE_CONFIG_KEY = "szefi-email-supabase-config";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [unsubscribeMessage, setUnsubscribeMessage] = useState(
    "Sikeresen leiratkoztál a hírlevélről. Sajnáljuk, hogy elmész!"
  );
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  const handleConfirm = async () => {
    if (!email) {
      setConfirmed(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try to delete from Supabase if config exists
      if (typeof window !== "undefined") {
        const supabaseConfig = localStorage.getItem(SUPABASE_CONFIG_KEY);
        if (supabaseConfig) {
          const config = JSON.parse(supabaseConfig);
          if (config.url && config.anonKey && config.table) {
            const response = await fetch(
              `${config.url}/rest/v1/${config.table}?email=eq.${encodeURIComponent(email)}`,
              {
                method: "DELETE",
                headers: {
                  apikey: config.anonKey,
                  Authorization: `Bearer ${config.anonKey}`,
                  "Content-Type": "application/json",
                  Prefer: "return=minimal",
                },
              }
            );

            if (!response.ok && response.status !== 404) {
              console.warn("Supabase delete failed:", response.statusText);
            }
          }
        }
      }

      setConfirmed(true);
    } catch (err) {
      console.error("Unsubscribe error:", err);
      // Still confirm even if delete fails
      setConfirmed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {confirmed ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : error ? (
              <AlertCircle className="h-8 w-8 text-destructive" />
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
            <p className="text-muted-foreground mb-2">
              Biztosan le szeretnél iratkozni a hírlevélről?
            </p>
            {email && (
              <p className="text-sm text-muted-foreground mb-6">
                Email: <span className="font-medium text-foreground">{email}</span>
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive mb-4">{error}</p>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isLoading}
              >
                Mégsem
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Feldolgozás...
                  </>
                ) : (
                  "Leiratkozás"
                )}
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

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
