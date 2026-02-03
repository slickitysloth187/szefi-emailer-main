"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle, XCircle } from "lucide-react";

interface SendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: string;
  recipientCount: number;
  onConfirm: () => void;
  isSending: boolean;
  result: { success: boolean; message: string } | null;
}

export function SendDialog({
  open,
  onOpenChange,
  subject,
  recipientCount,
  onConfirm,
  isSending,
  result,
}: SendDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Email Küldése</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {result ? (
              result.message
            ) : (
              <>
                Emailt fogsz küldeni{" "}
                <span className="text-foreground font-medium">{recipientCount}</span>{" "}
                címzettnek.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {!result && (
          <div className="py-4">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground mb-1">Tárgy:</p>
              <p className="text-foreground font-medium">{subject || "(Nincs tárgy)"}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="py-4 flex items-center justify-center">
            {result.success ? (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-8 w-8" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-8 w-8" />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {result ? (
            <Button
              onClick={() => {
                onOpenChange(false);
              }}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            >
              Bezárás
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={isSending}
              >
                Mégse
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isSending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Küldés folyamatban...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Küldés most
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
