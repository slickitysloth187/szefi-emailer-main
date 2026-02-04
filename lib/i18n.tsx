"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "en" | "hu";

type Translations = {
  [key: string]: {
    en: string;
    hu: string;
  };
};

export const translations: Translations = {
  // Header
  "header.pricing": { en: "Pricing", hu: "Árazás" },
  "header.signIn": { en: "Sign In", hu: "Bejelentkezés" },
  "header.templates": { en: "Templates", hu: "Sablonok" },
  "header.reset": { en: "Reset", hu: "Alaphelyzet" },
  "header.preview": { en: "Preview", hu: "Előnézet" },
  "header.send": { en: "Send", hu: "Küldés" },
  
  // Email Editor
  "editor.subject": { en: "Subject", hu: "Tárgy" },
  "editor.subjectPlaceholder": { en: "Email subject", hu: "Email tárgy" },
  "editor.from": { en: "From", hu: "Feladó" },
  "editor.htmlContent": { en: "HTML Content", hu: "HTML Tartalom" },
  "editor.cssStyles": { en: "CSS Styles", hu: "CSS Stílusok" },
  "editor.liveEditor": { en: "Live Editor", hu: "Live Editor" },
  "editor.recipients": { en: "Recipients", hu: "Címzettek" },
  
  // Recipients
  "recipients.title": { en: "Recipients", hu: "Címzettek" },
  "recipients.loadJson": { en: "Load JSON", hu: "JSON betöltése" },
  "recipients.supabase": { en: "Supabase", hu: "Supabase" },
  "recipients.add": { en: "Add", hu: "Hozzáadás" },
  "recipients.delete": { en: "Delete", hu: "Törlés" },
  "recipients.all": { en: "All", hu: "Mind" },
  "recipients.total": { en: "Total", hu: "Összesen" },
  "recipients.selected": { en: "Selected", hu: "Kiválasztva" },
  "recipients.noRecipients": { en: "No recipients", hu: "Nincsenek címzettek" },
  "recipients.loadJsonFile": { en: "Load a JSON file to add recipients", hu: "Tölts be egy JSON fájlt a címzettek hozzáadásához" },
  "recipients.addManually": { en: "Add manually", hu: "Kézi hozzáadás" },
  "recipients.addManuallyDesc": { en: "Add recipients line by line: Name, email", hu: "Soronként: Név, email cím" },
  "recipients.addManuallyPlaceholder": { en: "John Doe, john@example.com\nJane Doe, jane@example.com", hu: "Példa Péter, pelda@pelda.com\nKovács Anna, anna@example.com" },
  
  // Supabase
  "supabase.connect": { en: "Connect to Supabase", hu: "Csatlakozás Supabase-hez" },
  "supabase.connected": { en: "Connected to Supabase", hu: "Csatlakozva a Supabase-hez" },
  "supabase.url": { en: "Supabase URL", hu: "Supabase URL" },
  "supabase.anonKey": { en: "Anon Key", hu: "Anon Key" },
  "supabase.selectTable": { en: "Select Table", hu: "Tábla kiválasztása" },
  "supabase.loadFromTable": { en: "Load from table", hu: "Betöltés táblából" },
  "supabase.disconnect": { en: "Disconnect", hu: "Leválasztás" },
  
  // Templates
  "templates.title": { en: "Templates", hu: "Sablonok" },
  "templates.save": { en: "Save Template", hu: "Sablon mentése" },
  "templates.load": { en: "Load", hu: "Betöltés" },
  "templates.delete": { en: "Delete", hu: "Törlés" },
  "templates.name": { en: "Template name", hu: "Sablon neve" },
  "templates.saved": { en: "Saved templates", hu: "Mentett sablonok" },
  "templates.examples": { en: "Example templates", hu: "Példa sablonok" },
  
  // Settings
  "settings.title": { en: "SMTP Settings", hu: "SMTP Beállítások" },
  "settings.host": { en: "SMTP Host", hu: "SMTP Host" },
  "settings.port": { en: "Port", hu: "Port" },
  "settings.secure": { en: "Secure (TLS)", hu: "Biztonságos (TLS)" },
  "settings.username": { en: "Username", hu: "Felhasználónév" },
  "settings.password": { en: "Password", hu: "Jelszó" },
  "settings.save": { en: "Save Settings", hu: "Beállítások mentése" },
  
  // Send Dialog
  "send.title": { en: "Send Emails", hu: "Emailek küldése" },
  "send.confirm": { en: "Are you sure you want to send emails to", hu: "Biztosan elküldi az emaileket" },
  "send.recipients": { en: "recipients?", hu: "címzettnek?" },
  "send.sending": { en: "Sending...", hu: "Küldés..." },
  "send.sendAll": { en: "Send All", hu: "Összes küldése" },
  "send.cancel": { en: "Cancel", hu: "Mégse" },
  "send.success": { en: "Emails sent successfully!", hu: "Emailek sikeresen elküldve!" },
  "send.error": { en: "Error sending emails", hu: "Hiba az emailek küldésekor" },
  
  // Visual Editor
  "visual.addText": { en: "Add Text", hu: "Szöveg" },
  "visual.addButton": { en: "Add Button", hu: "Gomb" },
  "visual.addImage": { en: "Add Image", hu: "Kép" },
  "visual.addDivider": { en: "Add Divider", hu: "Elválasztó" },
  "visual.addSocial": { en: "Add Social", hu: "Social" },
  "visual.duplicate": { en: "Duplicate", hu: "Duplikálás" },
  "visual.delete": { en: "Delete", hu: "Törlés" },
  
  // Pricing
  "pricing.title": { en: "Simple, Transparent Pricing", hu: "Egyszerű, átlátható árazás" },
  "pricing.subtitle": { en: "Choose the plan that fits your needs", hu: "Válaszd ki a neked megfelelő csomagot" },
  "pricing.monthly": { en: "month", hu: "hó" },
  "pricing.emails": { en: "emails/month", hu: "email/hó" },
  "pricing.getStarted": { en: "Get Started", hu: "Kezdés" },
  "pricing.contactUs": { en: "Contact Us", hu: "Kapcsolat" },
  "pricing.enterprise": { en: "Need more?", hu: "Többet szeretnél?" },
  "pricing.enterpriseDesc": { en: "Contact us for custom enterprise solutions", hu: "Vedd fel velünk a kapcsolatot egyedi megoldásokért" },
  "pricing.backToApp": { en: "Back to App", hu: "Vissza az alkalmazáshoz" },
  "pricing.mostPopular": { en: "Most Popular", hu: "Legnépszerűbb" },
  
  // Features
  "feature.templates": { en: "Email templates", hu: "Email sablonok" },
  "feature.editor": { en: "Visual editor", hu: "Vizuális szerkesztő" },
  "feature.analytics": { en: "Basic analytics", hu: "Alap analitika" },
  "feature.support": { en: "Email support", hu: "Email támogatás" },
  "feature.prioritySupport": { en: "Priority support", hu: "Kiemelt támogatás" },
  "feature.apiAccess": { en: "API access", hu: "API hozzáférés" },
  "feature.customDomain": { en: "Custom domain", hu: "Egyedi domain" },
  "feature.dedicatedManager": { en: "Dedicated manager", hu: "Dedikált menedzser" },
  
  // Unsubscribe
  "unsubscribe.title": { en: "Unsubscribe", hu: "Leiratkozás" },
  "unsubscribe.success": { en: "You have been unsubscribed successfully", hu: "Sikeresen leiratkoztál" },
  "unsubscribe.error": { en: "Error during unsubscribe", hu: "Hiba a leiratkozás során" },
  
  // General
  "general.loading": { en: "Loading...", hu: "Betöltés..." },
  "general.save": { en: "Save", hu: "Mentés" },
  "general.cancel": { en: "Cancel", hu: "Mégse" },
  "general.close": { en: "Close", hu: "Bezárás" },
  "general.confirm": { en: "Confirm", hu: "Megerősítés" },
  "general.comingSoon": { en: "Coming soon!", hu: "Hamarosan!" },
  
  // AI Editor
  "ai.title": { en: "AI Email Editor", hu: "AI Email Szerkesztő" },
  "ai.button": { en: "Edit with AI", hu: "Szerkesztés AI-jal" },
  "ai.chooseMode": { en: "What would you like to do?", hu: "Mit szeretnél csinálni?" },
  "ai.enterPrompt": { en: "Describe what you want the AI to create or change", hu: "Írd le, mit szeretnél, hogy az AI létrehozzon vagy módosítson" },
  "ai.editCurrent": { en: "Edit Current", hu: "Jelenlegi szerkesztése" },
  "ai.editCurrentDesc": { en: "Modify the existing template based on your instructions", hu: "A meglévő sablon módosítása az utasításaid alapján" },
  "ai.createNew": { en: "Create New", hu: "Új létrehozása" },
  "ai.createNewDesc": { en: "Generate a completely new email template from scratch", hu: "Teljesen új email sablon létrehozása a nulláról" },
  "ai.modeEdit": { en: "Editing current template", hu: "Jelenlegi sablon szerkesztése" },
  "ai.modeNew": { en: "Creating new template", hu: "Új sablon létrehozása" },
  "ai.changeMode": { en: "Change", hu: "Változtatás" },
  "ai.editPlaceholder": { en: "E.g., Change the button color to blue, add a new section with product features...", hu: "Pl., Változtasd a gomb színét kékre, adj hozzá egy új szekciót termék jellemzőkkel..." },
  "ai.newPlaceholder": { en: "E.g., Create a welcome email for new subscribers with a purple theme, include a logo, welcome message, and CTA button...", hu: "Pl., Készíts üdvözlő emailt új feliratkozóknak lila témával, logóval, üdvözlő üzenettel és CTA gombbal..." },
  "ai.generate": { en: "Generate", hu: "Generálás" },
  "ai.generating": { en: "Generating...", hu: "Generálás..." },
  "ai.generatingDesc": { en: "The template is being updated in real-time", hu: "A sablon valós időben frissül" },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("nightowl-language") as Language;
    if (saved && (saved === "en" || saved === "hu")) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("nightowl-language", lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
