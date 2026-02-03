import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// FONTOS: Node.js runtime kell a nodemailer-hez
export const runtime = "nodejs";

interface Recipient {
  email: string;
  name: string;
  site_url?: string;
  unsubscribe?: string;
}

interface SmtpConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
  secure: boolean;
  domain?: string;
}

interface SendEmailRequest {
  subject: string;
  html: string;
  recipients: Recipient[];
  fromEmail: string;
  fromName: string;
  smtp: SmtpConfig;
  domain?: string;
}

function replaceVariables(html: string, recipient: Recipient, domain?: string): string {
  let result = html;
  result = result.replace(/\{\{name\}\}/g, recipient.name || "");
  result = result.replace(/\{\{email\}\}/g, recipient.email || "");
  result = result.replace(/\{\{site_url\}\}/g, recipient.site_url || domain || "#");
  
  // Unsubscribe link - use domain/unsubscribe if domain is set
  const unsubscribeUrl = domain 
    ? `${domain.replace(/\/$/, "")}/unsubscribe?email=${encodeURIComponent(recipient.email)}`
    : recipient.unsubscribe || "#";
  result = result.replace(/\{\{unsubscribe\}\}/g, unsubscribeUrl);
  
  return result;
}

export async function POST(request: NextRequest) {
  // Early validation before any nodemailer operations
  let body: SendEmailRequest;
  
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Érvénytelen JSON kérés" },
      { status: 400 }
    );
  }

  const { subject, html, recipients, fromEmail, fromName, smtp, domain } = body;

  // Validáció - ELŐBB, mielőtt nodemailer-t használnánk
  if (!subject || !html || !recipients || recipients.length === 0) {
    return NextResponse.json(
      { error: "Hiányzó kötelező mezők: subject, html, recipients" },
      { status: 400 }
    );
  }

  if (!smtp) {
    return NextResponse.json(
      { error: "SMTP objektum hiányzik. Kattints a fogaskerék ikonra a beállításokhoz." },
      { status: 400 }
    );
  }

  if (!smtp.host || !smtp.user || !smtp.pass) {
    return NextResponse.json(
      { error: `SMTP beállítások hiányoznak: ${!smtp.host ? 'host, ' : ''}${!smtp.user ? 'user, ' : ''}${!smtp.pass ? 'pass' : ''}`.replace(/, $/, '') },
      { status: 400 }
    );
  }

  try {
    // Transporter létrehozása - csak ha minden validáció sikeres
    const transportConfig = {
      host: String(smtp.host).trim(),
      port: Number(smtp.port) || 587,
      secure: smtp.secure || Number(smtp.port) === 465,
      auth: {
        user: String(smtp.user).trim(),
        pass: String(smtp.pass),
      },
    };

    const transporter = nodemailer.createTransport(transportConfig);

    const results: {
      email: string;
      success: boolean;
      error?: string;
      messageId?: string;
    }[] = [];

    for (const recipient of recipients) {
      const personalizedHtml = replaceVariables(html, recipient, domain || smtp.domain);

      try {
        const info = await transporter.sendMail({
          from: `"${fromName || "Szefi"}" <${fromEmail || smtp.user}>`,
          to: recipient.email,
          subject: subject,
          html: personalizedHtml,
        });

        results.push({
          email: recipient.email,
          success: true,
          messageId: info.messageId,
        });
      } catch (err) {
        results.push({
          email: recipient.email,
          success: false,
          error: err instanceof Error ? err.message : "Ismeretlen hiba",
        });
      }

      // Rate limiting - 200ms szünet emailek között
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `Küldés befejezve: ${successful} sikeres, ${failed} sikertelen`,
      results,
      summary: {
        total: recipients.length,
        successful,
        failed,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ismeretlen hiba történt" },
      { status: 500 }
    );
  }
}
