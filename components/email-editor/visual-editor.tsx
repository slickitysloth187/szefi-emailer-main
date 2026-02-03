"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Unlink,
  Type,
  Palette,
  ImageIcon,
  Plus,
} from "lucide-react";

interface VisualEditorProps {
  html: string;
  onHtmlChange: (html: string) => void;
  onInsertImage: (url: string, alt: string) => void;
}

interface ElementToEdit {
  tag: string;
  text: string;
  attributes: Record<string, string>;
  path: number[];
}

export function VisualEditor({ html, onHtmlChange, onInsertImage }: VisualEditorProps) {
  const [selectedText, setSelectedText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("16");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const wrapSelection = useCallback(
    (before: string, after: string) => {
      if (!selectedText) return;
      const newHtml = html.replace(selectedText, `${before}${selectedText}${after}`);
      onHtmlChange(newHtml);
    },
    [html, selectedText, onHtmlChange]
  );

  const applyBold = () => wrapSelection("<strong>", "</strong>");
  const applyItalic = () => wrapSelection("<em>", "</em>");
  const applyUnderline = () => wrapSelection('<span style="text-decoration:underline">', "</span>");

  const applyColor = () => {
    if (!selectedText) return;
    const newHtml = html.replace(
      selectedText,
      `<span style="color:${textColor}">${selectedText}</span>`
    );
    onHtmlChange(newHtml);
  };

  const applyFontSize = () => {
    if (!selectedText) return;
    const newHtml = html.replace(
      selectedText,
      `<span style="font-size:${fontSize}px">${selectedText}</span>`
    );
    onHtmlChange(newHtml);
  };

  const applyLink = () => {
    if (!selectedText || !linkUrl) return;
    const newHtml = html.replace(
      selectedText,
      `<a href="${linkUrl}" style="color:#ff0000;text-decoration:underline">${selectedText}</a>`
    );
    onHtmlChange(newHtml);
    setLinkUrl("");
  };

  const applyAlignment = (align: "left" | "center" | "right") => {
    if (!selectedText) return;
    const newHtml = html.replace(
      selectedText,
      `<div style="text-align:${align}">${selectedText}</div>`
    );
    onHtmlChange(newHtml);
  };

  const insertImage = () => {
    if (!imageUrl) return;
    onInsertImage(imageUrl, imageAlt || "Kép");
    setImageUrl("");
    setImageAlt("");
  };

  const presetColors = [
    "#ff0000",
    "#ffffff",
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#ff6600",
    "#ffcc00",
    "#00cc00",
    "#0066ff",
    "#9900ff",
    "#ff0099",
  ];

  return (
    <div className="h-full flex flex-col border border-border rounded-lg bg-card overflow-hidden">
      <div className="px-3 py-2 bg-secondary/30 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Vizuális Szerkesztő</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Selected Text Input */}
          <div className="space-y-2">
            <Label className="text-xs">Kijelölt szöveg (másolj ide a HTML-ből)</Label>
            <Input
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              placeholder="Jelölj ki szöveget a HTML-ből..."
              className="bg-input border-border text-sm"
            />
          </div>

          {/* Text Formatting */}
          <div className="space-y-2">
            <Label className="text-xs">Szöveg formázás</Label>
            <div className="flex flex-wrap gap-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={applyBold}
                disabled={!selectedText}
                className="h-8 w-8 p-0"
                title="Félkövér"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={applyItalic}
                disabled={!selectedText}
                className="h-8 w-8 p-0"
                title="Dőlt"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={applyUnderline}
                disabled={!selectedText}
                className="h-8 w-8 p-0"
                title="Aláhúzott"
              >
                <Underline className="h-4 w-4" />
              </Button>
              <div className="w-px h-8 bg-border mx-1" />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => applyAlignment("left")}
                disabled={!selectedText}
                className="h-8 w-8 p-0"
                title="Balra igazítás"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => applyAlignment("center")}
                disabled={!selectedText}
                className="h-8 w-8 p-0"
                title="Középre igazítás"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => applyAlignment("right")}
                disabled={!selectedText}
                className="h-8 w-8 p-0"
                title="Jobbra igazítás"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label className="text-xs">Szín</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 gap-2"
                  >
                    <div
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: textColor }}
                    />
                    <Palette className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-card border-border">
                  <div className="grid grid-cols-6 gap-1">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => setTextColor(color)}
                      />
                    ))}
                  </div>
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="mt-2 h-8 text-xs bg-input border-border"
                    placeholder="#ff0000"
                  />
                </PopoverContent>
              </Popover>
              <Button
                size="sm"
                variant="secondary"
                onClick={applyColor}
                disabled={!selectedText}
                className="h-8"
              >
                Alkalmazás
              </Button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label className="text-xs">Betűméret</Label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <Type className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-16 h-8 text-sm bg-input border-border"
                  min="8"
                  max="72"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={applyFontSize}
                disabled={!selectedText}
                className="h-8"
              >
                Alkalmazás
              </Button>
            </div>
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label className="text-xs">Link</Label>
            <div className="space-y-2">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-8 text-sm bg-input border-border"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={applyLink}
                disabled={!selectedText || !linkUrl}
                className="h-8 gap-1.5"
              >
                <Link className="h-4 w-4" />
                Link hozzáadása
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2 pt-2 border-t border-border">
            <Label className="text-xs">Kép beszúrása</Label>
            <div className="space-y-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Kép URL..."
                className="h-8 text-sm bg-input border-border"
              />
              <Input
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Alt szöveg..."
                className="h-8 text-sm bg-input border-border"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={insertImage}
                disabled={!imageUrl}
                className="h-8 gap-1.5 w-full"
              >
                <ImageIcon className="h-4 w-4" />
                Kép beszúrása
              </Button>
            </div>
          </div>

          {/* Quick Insert */}
          <div className="space-y-2 pt-2 border-t border-border">
            <Label className="text-xs">Gyors beszúrás</Label>
            <div className="flex flex-wrap gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const buttonHtml = `\n<a href="{{site_url}}" style="display:inline-block;background:#ff0000;color:#ffffff;padding:14px 28px;text-decoration:none;font-weight:bold;border-radius:6px;">Gomb szöveg</a>`;
                  onHtmlChange(html + buttonHtml);
                }}
                className="h-8 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Gomb
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const dividerHtml = `\n<hr style="border:none;border-top:1px solid #333333;margin:20px 0;">`;
                  onHtmlChange(html + dividerHtml);
                }}
                className="h-8 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Elválasztó
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const spacerHtml = `\n<div style="height:20px;"></div>`;
                  onHtmlChange(html + spacerHtml);
                }}
                className="h-8 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Térköz
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
