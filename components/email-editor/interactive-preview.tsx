"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  ImageIcon,
  X,
  GripVertical,
  Trash2,
  Square,
  Minus,
  Maximize2,
  Settings2,
  ArrowUp,
  ArrowDown,
  Undo2,
  Columns,
  Share2,
  Plus,
  Copy,
} from "lucide-react";

interface InteractivePreviewProps {
  html: string;
  css: string;
  fullscreen?: boolean;
  onHtmlChange: (html: string) => void;
}

interface SocialIcon {
  platform: "facebook" | "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin" | "patreon";
  url: string;
  color: string;
  size: string;
}

interface EditableElement {
  id: string;
  type: "text" | "button" | "image" | "divider" | "spacer" | "row" | "social";
  content: string;
  href?: string;
  src?: string;
  children?: EditableElement[];
  socialIcons?: SocialIcon[];
  styles: {
    color: string;
    backgroundColor: string;
    fontSize: string;
    padding: string;
    margin: string;
    textAlign: string;
    borderRadius: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    width?: string;
    height?: string;
  };
}

const socialPlatforms = {
  facebook: { name: "Facebook", defaultColor: "#1877F2", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>` },
  instagram: { name: "Instagram", defaultColor: "#E4405F", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>` },
  youtube: { name: "YouTube", defaultColor: "#FF0000", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>` },
  tiktok: { name: "TikTok", defaultColor: "#000000", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>` },
  twitter: { name: "X/Twitter", defaultColor: "#000000", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
  linkedin: { name: "LinkedIn", defaultColor: "#0A66C2", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>` },
  patreon: { name: "Patreon", defaultColor: "#FF424D", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003"/></svg>` },
};

export function InteractivePreview({ 
  html, 
  css, 
  fullscreen = false,
  onHtmlChange 
}: InteractivePreviewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [elements, setElements] = useState<EditableElement[]>([]);
  const [history, setHistory] = useState<EditableElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<EditableElement | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isUndoingRef = useRef(false);
  const lastHtmlRef = useRef<string>("");

  const saveToHistory = useCallback((newElements: EditableElement[]) => {
    if (isUndoingRef.current) {
      isUndoingRef.current = false;
      return;
    }
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newElements);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const rebuildAndSave = useCallback((newElements: EditableElement[], addToHistory = true) => {
    let innerContent = "";
    
    const renderElement = (el: EditableElement): string => {
      switch (el.type) {
        case "row":
          const cellWidth = el.children ? Math.floor(100 / el.children.length) : 100;
          return `<tr>
${el.children?.map(child => `  <td width="${cellWidth}%" align="${child.styles.textAlign || 'center'}" style="vertical-align:top;">
    ${renderElementContent(child)}
  </td>`).join("\n") || ""}
</tr>`;
        default:
          return `<tr>
  <td align="${el.styles.textAlign || 'left'}" style="padding:${el.styles.padding || '10px 0'};">
    ${renderElementContent(el)}
  </td>
</tr>`;
      }
    };

    const renderElementContent = (el: EditableElement): string => {
      switch (el.type) {
        case "button":
          return `<a href="${el.href || '#'}" style="display:inline-block;background:${el.styles.backgroundColor || '#ff0000'};color:${el.styles.color || '#ffffff'};padding:${el.styles.padding || '14px 28px'};text-decoration:none;font-weight:${el.styles.fontWeight || 'bold'};border-radius:${el.styles.borderRadius || '6'}px;font-size:${el.styles.fontSize || '16'}px;">${el.content}</a>`;
        case "image":
          const imgWidth = el.styles.width || "100%";
          const imgHeight = el.styles.height || "auto";
          return `<img src="${el.src || ''}" alt="Kép" style="max-width:100%;width:${imgWidth};height:${imgHeight};border-radius:${el.styles.borderRadius || '0'}px;">`;
        case "divider":
          return `<hr style="border:none;border-top:1px solid ${el.styles.color || '#333'};margin:0;">`;
        case "spacer":
          return `<div style="height:${el.styles.padding || '30px'};"></div>`;
        case "social":
          if (!el.socialIcons || el.socialIcons.length === 0) return "";
          // Use PNG images from CDN instead of SVG (email clients don't support inline SVG)
          const socialImageUrls: Record<string, string> = {
            facebook: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
            instagram: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
            youtube: "https://cdn-icons-png.flaticon.com/512/174/174883.png",
            tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
            twitter: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
            linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
            patreon: "https://cdn-icons-png.flaticon.com/512/2111/2111548.png",
          };
          return el.socialIcons.map(icon => {
            const imgUrl = socialImageUrls[icon.platform] || "";
            const platform = socialPlatforms[icon.platform];
            return `<a href="${icon.url}" style="display:inline-block;margin:0 8px;text-decoration:none;" title="${platform.name}">
              <img src="${imgUrl}" alt="${platform.name}" width="${icon.size || '32'}" height="${icon.size || '32'}" style="display:block;border:0;outline:none;">
            </a>`;
          }).join("");
        default:
          return `<span style="color:${el.styles.color || '#ffffff'};font-size:${el.styles.fontSize || '16'}px;${el.styles.fontWeight === 'bold' ? 'font-weight:bold;' : ''}${el.styles.fontStyle === 'italic' ? 'font-style:italic;' : ''}${el.styles.textDecoration === 'underline' ? 'text-decoration:underline;' : ''}">${el.content.replace(/\n/g, '<br>')}</span>`;
      }
    };

    newElements.forEach(el => {
      innerContent += renderElement(el);
    });

    const newHtml = `<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#0b0b0b">
<tr>
  <td align="center">
    <table width="600" cellpadding="30" cellspacing="0" bgcolor="#111111">
${innerContent}
    </table>
  </td>
</tr>
</table>`;

    lastHtmlRef.current = newHtml;
    onHtmlChange(newHtml);
    if (addToHistory) {
      saveToHistory(newElements);
    }
  }, [onHtmlChange, saveToHistory]);

  // Parse HTML to elements when html prop changes
  useEffect(() => {
    // Skip if this is our own change
    if (html === lastHtmlRef.current) return;
    
    const parsed = parseHtmlToElements(html);
    if (parsed.length > 0) {
      setElements(parsed);
      setHistory([parsed]);
      setHistoryIndex(0);
      lastHtmlRef.current = html;
    }
  }, [html]);

  // Parse HTML string to editable elements
  const parseHtmlToElements = (htmlString: string): EditableElement[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const result: EditableElement[] = [];
    let idCounter = 0;

    const getStyle = (style: string, prop: string, defaultVal: string): string => {
      const regex = new RegExp(`${prop}\\s*:\\s*([^;]+)`, "i");
      const match = style.match(regex);
      return match ? match[1].trim() : defaultVal;
    };

    const extractTextFromNode = (node: Node): string => {
      let text = "";
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent || "";
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as Element;
          if (el.tagName.toLowerCase() === "br") {
            text += "\n";
          } else {
            text += extractTextFromNode(child);
          }
        }
      });
      return text.trim();
    };

    const processNode = (node: Element): EditableElement | null => {
      const tagName = node.tagName.toLowerCase();
      const style = node.getAttribute("style") || "";
      
      // Skip container tables
      if (tagName === "table" || tagName === "tbody") {
        return null;
      }

      // Image
      if (tagName === "img") {
        return {
          id: `el-${idCounter++}`,
          type: "image",
          content: "",
          src: node.getAttribute("src") || "",
          styles: {
            color: "", backgroundColor: "",
            fontSize: "",
            padding: "10px 0",
            margin: "0",
            textAlign: "center",
            borderRadius: getStyle(style, "border-radius", "0").replace("px", ""),
            fontWeight: "normal", fontStyle: "normal", textDecoration: "none",
            width: getStyle(style, "width", "100%"),
            height: getStyle(style, "height", "auto"),
          },
        };
      }

      // Divider
      if (tagName === "hr") {
        return {
          id: `el-${idCounter++}`,
          type: "divider",
          content: "",
          styles: {
            color: getStyle(style, "border-top", "#333333").split(" ").pop() || "#333333",
            backgroundColor: "",
            fontSize: "",
            padding: "10px 0",
            margin: "0",
            textAlign: "center",
            borderRadius: "0",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
          },
        };
      }

      // Check if link is a social icon (SVG or IMG with social platform) - return null to handle in processTd
      if (tagName === "a") {
        const hasSvg = node.querySelector("svg");
        const img = node.querySelector("img");
        const href = node.getAttribute("href") || "";
        const title = node.getAttribute("title")?.toLowerCase() || "";
        const isSocialPlatform = detectPlatformFromUrl(href) !== null;
        const isSocialByTitle = title.includes("facebook") || title.includes("instagram") || 
          title.includes("youtube") || title.includes("tiktok") ||
          title.includes("twitter") || title.includes("linkedin") || title.includes("patreon");
        
        if (hasSvg || (img && (isSocialPlatform || isSocialByTitle))) {
          return null; // Will be handled as part of social group in processTd
        }
      }

      // Button (link with background, NOT a social icon)
      if (tagName === "a" && (style.includes("background") || style.includes("display:inline-block"))) {
        const hasVisibleText = (node.textContent?.trim() || "").length > 0;
        const img = node.querySelector("img");
        // Only treat as button if it has text content and no social img
        if (hasVisibleText && !img) {
          return {
            id: `el-${idCounter++}`,
            type: "button",
            content: node.textContent?.trim() || "Gomb",
            href: node.getAttribute("href") || "#",
            styles: {
              color: getStyle(style, "color", "#ffffff"),
              backgroundColor: getStyle(style, "background", "#ff0000"),
              fontSize: getStyle(style, "font-size", "16px").replace("px", ""),
              padding: getStyle(style, "padding", "14px 28px"),
              margin: "0",
              textAlign: "center",
              borderRadius: getStyle(style, "border-radius", "6px").replace("px", ""),
              fontWeight: getStyle(style, "font-weight", "bold"),
              fontStyle: "normal",
              textDecoration: "none",
            },
          };
        }
      }

      // Regular link (not button, not social icon)
      if (tagName === "a" && !node.querySelector("svg") && !node.querySelector("img")) {
        return {
          id: `el-${idCounter++}`,
          type: "text",
          content: node.textContent?.trim() || "",
          href: node.getAttribute("href") || "#",
          styles: {
            color: getStyle(style, "color", "#ffffff"),
            backgroundColor: "",
            fontSize: getStyle(style, "font-size", "16px").replace("px", ""),
            padding: "5px 0",
            margin: "0",
            textAlign: getStyle(style, "text-align", "center"),
            borderRadius: "0",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "underline",
          },
        };
      }

      // Span or other text element
      if (tagName === "span" || tagName === "p" || tagName === "div" || tagName === "h1" || tagName === "h2" || tagName === "h3") {
        const text = extractTextFromNode(node);
        if (text) {
          return {
            id: `el-${idCounter++}`,
            type: "text",
            content: text,
            styles: {
              color: getStyle(style, "color", "#ffffff"),
              backgroundColor: "",
              fontSize: getStyle(style, "font-size", "16px").replace("px", ""),
              padding: "5px 0",
              margin: "0",
              textAlign: getStyle(style, "text-align", "left"),
              borderRadius: "0",
              fontWeight: getStyle(style, "font-weight", "normal"),
              fontStyle: getStyle(style, "font-style", "normal"),
              textDecoration: getStyle(style, "text-decoration", "none"),
            },
          };
        }
      }

      return null;
    };

    const detectPlatformFromUrl = (url: string): SocialIcon["platform"] | null => {
      const urlLower = url.toLowerCase();
      if (urlLower.includes("facebook.com")) return "facebook";
      if (urlLower.includes("instagram.com")) return "instagram";
      if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) return "youtube";
      if (urlLower.includes("tiktok.com")) return "tiktok";
      if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) return "twitter";
      if (urlLower.includes("linkedin.com")) return "linkedin";
      if (urlLower.includes("patreon.com")) return "patreon";
      return null;
    };

    const processTd = (td: Element): EditableElement[] => {
      const elements: EditableElement[] = [];
      const tdStyle = td.getAttribute("style") || "";
      const tdAlign = td.getAttribute("align") || getStyle(tdStyle, "text-align", "left");
      
      // Check for social media icons (links with SVG or social IMG inside)
      const socialLinks = td.querySelectorAll("a");
      const socialIcons: SocialIcon[] = [];
      
      socialLinks.forEach(link => {
        const hasSvg = link.querySelector("svg");
        const img = link.querySelector("img");
        const href = link.getAttribute("href") || "";
        const platform = detectPlatformFromUrl(href);
        const title = link.getAttribute("title")?.toLowerCase() || "";
        
        const isSocialImg = img && (
          platform !== null ||
          title.includes("facebook") || title.includes("instagram") || 
          title.includes("youtube") || title.includes("tiktok") ||
          title.includes("twitter") || title.includes("linkedin") || title.includes("patreon")
        );
        
        if (hasSvg || isSocialImg) {
          const style = link.getAttribute("style") || "";
          const color = getStyle(style, "color", "");
          const imgWidth = img?.getAttribute("width") || "32";
          const spanStyle = link.querySelector("span")?.getAttribute("style") || "";
          const size = img ? imgWidth : getStyle(spanStyle, "width", "32px").replace("px", "");
          
          if (platform) {
            socialIcons.push({
              platform,
              url: href,
              color: color || socialPlatforms[platform].defaultColor,
              size: size || "32",
            });
          }
        }
      });
      
      // If we found social icons, create a social element
      if (socialIcons.length > 0) {
        elements.push({
          id: `el-${idCounter++}`,
          type: "social",
          content: "",
          socialIcons,
          styles: {
            color: "", backgroundColor: "", fontSize: "",
            padding: "10px 0", margin: "0", textAlign: tdAlign,
            borderRadius: "0", fontWeight: "normal", fontStyle: "normal", textDecoration: "none",
          },
        });
        return elements;
      }
      
      // First check for direct child elements
      const children = td.children;
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const parsed = processNode(child);
          if (parsed) {
            parsed.styles.textAlign = tdAlign;
            elements.push(parsed);
          }
        }
      }
      
      // If no elements found, check for direct text content
      if (elements.length === 0) {
        const text = extractTextFromNode(td);
        if (text) {
          elements.push({
            id: `el-${idCounter++}`,
            type: "text",
            content: text,
            styles: {
              color: getStyle(tdStyle, "color", "#ffffff"),
              backgroundColor: "",
              fontSize: getStyle(tdStyle, "font-size", "16px").replace("px", ""),
              padding: "5px 0",
              margin: "0",
              textAlign: tdAlign,
              borderRadius: "0",
              fontWeight: getStyle(tdStyle, "font-weight", "normal"),
              fontStyle: getStyle(tdStyle, "font-style", "normal"),
              textDecoration: getStyle(tdStyle, "text-decoration", "none"),
            },
          });
        }
      }
      
      return elements;
    };

    // Get all rows from the inner table (not the wrapper table)
    const tables = doc.querySelectorAll("table");
    let innerTable: Element | null = null;
    tables.forEach(table => {
      const width = table.getAttribute("width");
      if (width === "600") {
        innerTable = table;
      }
    });

    if (innerTable) {
      const rows = innerTable.querySelectorAll(":scope > tbody > tr, :scope > tr");
      rows.forEach(row => {
        const cells = row.querySelectorAll(":scope > td");
        
        // Check if this row contains social icons (links with SVG or social IMG spread across cells)
        const allSocialLinks: SocialIcon[] = [];
        let hasSocialLinks = false;
        
        cells.forEach(cell => {
          const links = cell.querySelectorAll("a");
          links.forEach(link => {
            const hasSvg = link.querySelector("svg");
            const img = link.querySelector("img");
            const href = link.getAttribute("href") || "";
            const platform = detectPlatformFromUrl(href);
            
            // Detect social by: SVG inside, or IMG with social platform URL, or title attribute
            const title = link.getAttribute("title")?.toLowerCase() || "";
            const isSocialImg = img && (
              platform !== null ||
              title.includes("facebook") || title.includes("instagram") || 
              title.includes("youtube") || title.includes("tiktok") ||
              title.includes("twitter") || title.includes("linkedin") || title.includes("patreon")
            );
            
            if (hasSvg || isSocialImg) {
              hasSocialLinks = true;
              const style = link.getAttribute("style") || "";
              const color = getStyle(style, "color", "");
              const imgWidth = img?.getAttribute("width") || "32";
              const spanStyle = link.querySelector("span")?.getAttribute("style") || "";
              const size = img ? imgWidth : getStyle(spanStyle, "width", "32px").replace("px", "");
              
              if (platform) {
                allSocialLinks.push({
                  platform,
                  url: href,
                  color: color || socialPlatforms[platform].defaultColor,
                  size: size || "32",
                });
              }
            }
          });
        });
        
        // If row contains social icons, create a single social element
        if (hasSocialLinks && allSocialLinks.length > 0) {
          result.push({
            id: `el-${idCounter++}`,
            type: "social",
            content: "",
            socialIcons: allSocialLinks,
            styles: {
              color: "", backgroundColor: "", fontSize: "",
              padding: "10px 0", margin: "0", textAlign: "center",
              borderRadius: "0", fontWeight: "normal", fontStyle: "normal", textDecoration: "none",
            },
          });
          return; // Skip to next row
        }
        
        if (cells.length > 1) {
          // Multiple cells = row with children (buttons side by side, etc.)
          const children: EditableElement[] = [];
          cells.forEach(cell => {
            const cellElements = processTd(cell);
            if (cellElements.length > 0) {
              children.push(cellElements[0]);
            }
          });
          if (children.length > 0) {
            result.push({
              id: `el-${idCounter++}`,
              type: "row",
              content: "",
              children,
              styles: {
                color: "", backgroundColor: "", fontSize: "", padding: "0",
                margin: "0", textAlign: "center", borderRadius: "0",
                fontWeight: "normal", fontStyle: "normal", textDecoration: "none",
              },
            });
          }
        } else if (cells.length === 1) {
          // Single cell
          const cellElements = processTd(cells[0]);
          cellElements.forEach(el => result.push(el));
        }
      });
    }

    return result;
  };

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoingRef.current = true;
      const prevElements = history[historyIndex - 1];
      setElements(prevElements);
      setHistoryIndex(prev => prev - 1);
      rebuildAndSave(prevElements, false);
    }
  }, [historyIndex, history]);

  // Copy element to clipboard
  const copyElement = useCallback(() => {
    if (!selectedId) return;
    const findElement = (list: EditableElement[]): EditableElement | null => {
      for (const el of list) {
        if (el.id === selectedId) return el;
        if (el.children) {
          const found = findElement(el.children);
          if (found) return found;
        }
      }
      return null;
    };
    const element = findElement(elements);
    if (element) {
      setClipboard(JSON.parse(JSON.stringify(element)));
    }
  }, [selectedId, elements]);

  // Paste element from clipboard
  const pasteElement = useCallback(() => {
    if (!clipboard) return;
    const newElement: EditableElement = {
      ...JSON.parse(JSON.stringify(clipboard)),
      id: `el-${Date.now()}`,
    };
    if (newElement.children) {
      newElement.children = newElement.children.map((child, idx) => ({
        ...child,
        id: `el-${Date.now()}-${idx}`,
      }));
    }
    setElements(prev => {
      const newElements = [...prev, newElement];
      rebuildAndSave(newElements);
      return newElements;
    });
  }, [clipboard, rebuildAndSave]);

  // Duplicate element
  const duplicateElement = useCallback(() => {
    if (!selectedId) return;
    const findElement = (list: EditableElement[]): EditableElement | null => {
      for (const el of list) {
        if (el.id === selectedId) return el;
        if (el.children) {
          const found = findElement(el.children);
          if (found) return found;
        }
      }
      return null;
    };
    const element = findElement(elements);
    if (element) {
      const newElement: EditableElement = {
        ...JSON.parse(JSON.stringify(element)),
        id: `el-${Date.now()}`,
      };
      if (newElement.children) {
        newElement.children = newElement.children.map((child, idx) => ({
          ...child,
          id: `el-${Date.now()}-${idx}`,
        }));
      }
      setElements(prev => {
        const idx = prev.findIndex(el => el.id === selectedId);
        const newElements = [...prev];
        newElements.splice(idx + 1, 0, newElement);
        rebuildAndSave(newElements);
        return newElements;
      });
      setSelectedId(newElement.id);
    }
  }, [selectedId, elements, rebuildAndSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedId) {
        e.preventDefault();
        copyElement();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "v" && clipboard) {
        e.preventDefault();
        pasteElement();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedId) {
        e.preventDefault();
        duplicateElement();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, copyElement, pasteElement, duplicateElement, selectedId, clipboard]);

  // Update element and auto-save
  const updateElement = useCallback((id: string, updates: Partial<EditableElement>) => {
    setElements(prev => {
      const updateInList = (list: EditableElement[]): EditableElement[] => {
        return list.map(el => {
          if (el.id === id) {
            return { ...el, ...updates, styles: { ...el.styles, ...(updates.styles || {}) } };
          }
          if (el.children) {
            return { ...el, children: updateInList(el.children) };
          }
          return el;
        });
      };
      const newElements = updateInList(prev);
      rebuildAndSave(newElements);
      return newElements;
    });
  }, [rebuildAndSave]);

  // Move element
  const moveElement = useCallback((direction: "up" | "down") => {
    if (!selectedId) return;
    
    setElements(prev => {
      const findAndMove = (list: EditableElement[]): EditableElement[] | null => {
        const index = list.findIndex(e => e.id === selectedId);
        if (index !== -1) {
          const newIndex = direction === "up" ? index - 1 : index + 1;
          if (newIndex < 0 || newIndex >= list.length) return null;
          const newList = [...list];
          [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
          return newList;
        }
        for (let i = 0; i < list.length; i++) {
          if (list[i].children) {
            const result = findAndMove(list[i].children!);
            if (result) {
              const newList = [...list];
              newList[i] = { ...newList[i], children: result };
              return newList;
            }
          }
        }
        return null;
      };
      
      const newElements = findAndMove(prev);
      if (newElements) {
        rebuildAndSave(newElements);
        return newElements;
      }
      return prev;
    });
  }, [selectedId, rebuildAndSave]);

  // Delete element
  const deleteElement = useCallback(() => {
    if (!selectedId) return;
    
    setElements(prev => {
      const removeFromList = (list: EditableElement[]): EditableElement[] => {
        return list.filter(el => {
          if (el.id === selectedId) return false;
          if (el.children) {
            el.children = removeFromList(el.children);
          }
          return true;
        });
      };
      const newElements = removeFromList(prev);
      rebuildAndSave(newElements);
      return newElements;
    });
    setSelectedId(null);
  }, [selectedId, rebuildAndSave]);

  // Add element
  const addElement = useCallback((type: EditableElement["type"]) => {
    const newId = `el-${Date.now()}`;
    const newElement: EditableElement = {
      id: newId,
      type,
      content: type === "text" ? "Kattints a szerkesztéshez" : 
               type === "button" ? "Gomb" : "",
      href: type === "button" ? "{{site_url}}" : undefined,
      src: type === "image" ? "" : undefined,
      children: type === "row" ? [
        {
          id: `el-${Date.now()}-1`,
          type: "text",
          content: "Bal oszlop",
          styles: { color: "#ffffff", backgroundColor: "", fontSize: "16", padding: "10px", margin: "0", textAlign: "center", borderRadius: "0", fontWeight: "normal", fontStyle: "normal", textDecoration: "none" },
        },
        {
          id: `el-${Date.now()}-2`,
          type: "text",
          content: "Jobb oszlop",
          styles: { color: "#ffffff", backgroundColor: "", fontSize: "16", padding: "10px", margin: "0", textAlign: "center", borderRadius: "0", fontWeight: "normal", fontStyle: "normal", textDecoration: "none" },
        },
      ] : undefined,
      socialIcons: type === "social" ? [
        { platform: "facebook", url: "https://facebook.com", color: "#1877F2", size: "32" },
      ] : undefined,
      styles: {
        color: type === "divider" ? "#333333" : "#ffffff",
        backgroundColor: type === "button" ? "#ff0000" : "",
        fontSize: type === "text" ? "16" : "16",
        padding: type === "button" ? "14px 28px" : type === "spacer" ? "30px" : "10px 0",
        margin: "0",
        textAlign: type === "row" ? "center" : "left",
        borderRadius: type === "button" ? "6" : "0",
        fontWeight: type === "button" ? "bold" : "normal",
        fontStyle: "normal",
        textDecoration: "none",
        width: type === "image" ? "100%" : undefined,
        height: type === "image" ? "auto" : undefined,
      },
    };
    
    setElements(prev => {
      const newElements = [...prev, newElement];
      rebuildAndSave(newElements);
      return newElements;
    });
    setSelectedId(newId);
  }, [rebuildAndSave]);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedId && draggedId !== targetId) {
      setDragOverId(targetId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedId || draggedId === targetId) return;

    setElements(prev => {
      let draggedElement: EditableElement | null = null;
      
      const removeElement = (list: EditableElement[]): EditableElement[] => {
        return list.filter(el => {
          if (el.id === draggedId) {
            draggedElement = el;
            return false;
          }
          if (el.children) {
            el.children = removeElement(el.children);
          }
          return true;
        });
      };

      const insertElement = (list: EditableElement[]): EditableElement[] => {
        const result: EditableElement[] = [];
        for (const el of list) {
          if (el.id === targetId) {
            result.push(draggedElement!);
          }
          if (el.children) {
            el.children = insertElement(el.children);
          }
          result.push(el);
        }
        return result;
      };

      let newElements = removeElement([...prev]);
      if (draggedElement) {
        newElements = insertElement(newElements);
      }
      
      rebuildAndSave(newElements);
      return newElements;
    });
    
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  // Find selected element
  const findElement = (id: string, list: EditableElement[] = elements): EditableElement | null => {
    for (const el of list) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElement(id, el.children);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = selectedId ? findElement(selectedId) : null;

  const presetColors = [
    "#ff0000", "#ffffff", "#000000", "#333333", 
    "#666666", "#999999", "#ff6600", "#ffcc00",
    "#00cc00", "#0066ff", "#9900ff", "#ff0099",
    "#111111", "#0b0b0b", "#1a1a1a", "#2a2a2a",
  ];

  // Render element
  const renderElement = (el: EditableElement, inRow = false) => {
    const isSelected = selectedId === el.id;
    const isDragging = draggedId === el.id;
    const isDragOver = dragOverId === el.id;

    const wrapperClasses = cn(
      "relative group transition-all",
      isSelected && "ring-2 ring-primary",
      isDragging && "opacity-40",
      isDragOver && "ring-2 ring-blue-500",
      !inRow && "my-1"
    );

    const dragHandle = (
      <div 
        className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-0.5 z-10"
        draggable
        onDragStart={(e) => handleDragStart(e, el.id)}
        onDragEnd={handleDragEnd}
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>
    );

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedId(el.id);
    };

    if (el.type === "row" && el.children) {
      return (
        <div
          key={el.id}
          className={wrapperClasses}
          onClick={handleClick}
          onDragOver={(e) => handleDragOver(e, el.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, el.id)}
        >
          {dragHandle}
          <div className="flex gap-2">
            {el.children.map(child => (
              <div key={child.id} className="flex-1">
                {renderElement(child, true)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const contentStyle: React.CSSProperties = {
      color: el.styles.color || "#ffffff",
      fontSize: `${el.styles.fontSize || 16}px`,
      fontWeight: el.styles.fontWeight as "normal" | "bold",
      fontStyle: el.styles.fontStyle as "normal" | "italic",
      textDecoration: el.styles.textDecoration,
      textAlign: el.styles.textAlign as "left" | "center" | "right",
      padding: el.styles.padding,
    };

    switch (el.type) {
      case "button":
        return (
          <div
            key={el.id}
            className={wrapperClasses}
            style={{ textAlign: el.styles.textAlign as "left" | "center" | "right", padding: "15px 0" }}
            onClick={handleClick}
            onDragOver={(e) => handleDragOver(e, el.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, el.id)}
          >
            {dragHandle}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "inline-block",
                background: el.styles.backgroundColor || "#ff0000",
                color: el.styles.color || "#ffffff",
                padding: el.styles.padding || "14px 28px",
                textDecoration: "none",
                fontWeight: el.styles.fontWeight as "normal" | "bold",
                borderRadius: `${el.styles.borderRadius || 6}px`,
                fontSize: `${el.styles.fontSize || 16}px`,
              }}
            >
              {el.content}
            </a>
          </div>
        );

      case "image":
        return (
          <div
            key={el.id}
            className={wrapperClasses}
            style={{ textAlign: el.styles.textAlign as "left" | "center" | "right", padding: "15px 0" }}
            onClick={handleClick}
            onDragOver={(e) => handleDragOver(e, el.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, el.id)}
          >
            {dragHandle}
            {el.src ? (
              <img
                src={el.src || "/placeholder.svg"}
                alt="Kép"
                style={{
                  width: el.styles.width || "100%",
                  height: el.styles.height || "auto",
                  maxWidth: "100%",
                  borderRadius: `${el.styles.borderRadius || 0}px`,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="bg-muted/30 border border-dashed border-muted-foreground/30 p-8 text-center text-muted-foreground text-sm">
                Add meg a kép URL-jét a szerkesztosavban
              </div>
            )}
          </div>
        );

      case "divider":
        return (
          <div
            key={el.id}
            className={wrapperClasses}
            style={{ padding: "15px 0" }}
            onClick={handleClick}
            onDragOver={(e) => handleDragOver(e, el.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, el.id)}
          >
            {dragHandle}
            <hr style={{ border: "none", borderTop: `1px solid ${el.styles.color || "#333"}`, margin: 0 }} />
          </div>
        );

      case "spacer":
        return (
          <div
            key={el.id}
            className={cn(wrapperClasses, "bg-muted/10")}
            style={{ height: el.styles.padding || "30px" }}
            onClick={handleClick}
            onDragOver={(e) => handleDragOver(e, el.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, el.id)}
          >
            {dragHandle}
          </div>
        );

      case "social":
        return (
          <div
            key={el.id}
            className={wrapperClasses}
            style={{ textAlign: el.styles.textAlign as "left" | "center" | "right", padding: "15px 0" }}
            onClick={handleClick}
            onDragOver={(e) => handleDragOver(e, el.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, el.id)}
          >
            {dragHandle}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {el.socialIcons?.map((icon, idx) => {
                const platform = socialPlatforms[icon.platform];
                // Use same PNG images as in email output for consistency
                const socialImageUrls: Record<string, string> = {
                  facebook: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
                  instagram: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
                  youtube: "https://cdn-icons-png.flaticon.com/512/174/174883.png",
                  tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
                  twitter: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
                  linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
                  patreon: "https://cdn-icons-png.flaticon.com/512/2111/2111548.png",
                };
                const imgUrl = socialImageUrls[icon.platform] || "";
                return (
                  <a
                    key={idx}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{ display: "inline-block", margin: "0 8px" }}
                    title={`${platform.name}: ${icon.url}`}
                  >
                    <img 
                      src={imgUrl || "/placeholder.svg"}
                      alt={platform.name}
                      width={icon.size || 32}
                      height={icon.size || 32}
                      style={{ display: "block", border: 0 }}
                    />
                  </a>
                );
              })}
              {(!el.socialIcons || el.socialIcons.length === 0) && (
                <span className="text-muted-foreground text-xs">Adj hozza social ikonokat</span>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div
            key={el.id}
            className={wrapperClasses}
            style={contentStyle}
            onClick={handleClick}
            onDragOver={(e) => handleDragOver(e, el.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, el.id)}
            dangerouslySetInnerHTML={{ __html: el.content.replace(/\n/g, "<br>") }}
          />
        );
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card",
      fullscreen && "border-0 rounded-none"
    )}>
      {/* Header */}
      <div className="px-2 py-1.5 border-b border-border bg-secondary/50 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">Live Editor</span>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={undo}
            disabled={historyIndex <= 0}
            className="h-6 w-6 p-0" 
            title="Visszavonás (Ctrl+Z)"
          >
            <Undo2 className="h-3 w-3" />
          </Button>
          {clipboard && (
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={pasteElement}
              className="h-6 px-2 text-[10px] gap-1" 
              title="Beillesztés (Ctrl+V)"
            >
              Beill.
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-0.5 flex-wrap">
          <Button size="sm" variant="ghost" onClick={() => addElement("text")} className="h-6 px-1.5 text-[10px] gap-0.5" title="Szöveg">
            <Type className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addElement("button")} className="h-6 px-1.5 text-[10px] gap-0.5" title="Gomb">
            <Square className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addElement("image")} className="h-6 px-1.5 text-[10px] gap-0.5" title="Kép">
            <ImageIcon className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addElement("divider")} className="h-6 px-1.5 text-[10px] gap-0.5" title="Vonal">
            <Minus className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addElement("spacer")} className="h-6 px-1.5 text-[10px] gap-0.5" title="Térköz">
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addElement("row")} className="h-6 px-1.5 text-[10px] gap-0.5" title="Sor (2 oszlop)">
            <Columns className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addElement("social")} className="h-6 px-1.5 text-[10px] gap-0.5" title="Social Media">
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      {selectedElement && (
        <div className="px-2 py-1.5 border-b border-border bg-card space-y-1.5">
          <div className="flex flex-wrap items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => moveElement("up")} className="h-6 w-6 p-0" title="Feljebb">
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => moveElement("down")} className="h-6 w-6 p-0" title="Lejjebb">
              <ArrowDown className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={deleteElement} className="h-6 w-6 p-0 text-destructive" title="Törlés">
              <Trash2 className="h-3 w-3" />
            </Button>

            <div className="w-px h-4 bg-border mx-1" />

            {(selectedElement.type === "text" || selectedElement.type === "button") && (
              <>
                <Button 
                  size="sm" 
                  variant={selectedElement.styles.fontWeight === "bold" ? "secondary" : "ghost"} 
                  onClick={() => updateElement(selectedId!, { styles: { ...selectedElement.styles, fontWeight: selectedElement.styles.fontWeight === "bold" ? "normal" : "bold" } })}
                  className="h-6 w-6 p-0"
                >
                  <Bold className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedElement.styles.fontStyle === "italic" ? "secondary" : "ghost"} 
                  onClick={() => updateElement(selectedId!, { styles: { ...selectedElement.styles, fontStyle: selectedElement.styles.fontStyle === "italic" ? "normal" : "italic" } })}
                  className="h-6 w-6 p-0"
                >
                  <Italic className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedElement.styles.textDecoration === "underline" ? "secondary" : "ghost"} 
                  onClick={() => updateElement(selectedId!, { styles: { ...selectedElement.styles, textDecoration: selectedElement.styles.textDecoration === "underline" ? "none" : "underline" } })}
                  className="h-6 w-6 p-0"
                >
                  <Underline className="h-3 w-3" />
                </Button>

                <div className="w-px h-4 bg-border mx-1" />

                <Button 
                  size="sm" 
                  variant={selectedElement.styles.textAlign === "left" ? "secondary" : "ghost"} 
                  onClick={() => updateElement(selectedId!, { styles: { ...selectedElement.styles, textAlign: "left" } })}
                  className="h-6 w-6 p-0"
                >
                  <AlignLeft className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedElement.styles.textAlign === "center" ? "secondary" : "ghost"} 
                  onClick={() => updateElement(selectedId!, { styles: { ...selectedElement.styles, textAlign: "center" } })}
                  className="h-6 w-6 p-0"
                >
                  <AlignCenter className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedElement.styles.textAlign === "right" ? "secondary" : "ghost"} 
                  onClick={() => updateElement(selectedId!, { styles: { ...selectedElement.styles, textAlign: "right" } })}
                  className="h-6 w-6 p-0"
                >
                  <AlignRight className="h-3 w-3" />
                </Button>

                <div className="w-px h-4 bg-border mx-1" />

                {/* Color */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <div className="h-3 w-3 rounded border" style={{ backgroundColor: selectedElement.styles.color }} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <p className="text-xs text-muted-foreground mb-1">Szín</p>
                    <div className="grid grid-cols-8 gap-1">
                      {presetColors.map(c => (
                        <button key={c} className="w-4 h-4 rounded border" style={{ backgroundColor: c }} onClick={() => updateElement(selectedId!, { styles: { ...selectedElement.styles, color: c } })} />
                      ))}
                    </div>
                    <Input
                      value={selectedElement.styles.color}
                      onChange={(e) => updateElement(selectedId!, { styles: { ...selectedElement.styles, color: e.target.value } })}
                      className="h-5 mt-1 text-xs"
                    />
                  </PopoverContent>
                </Popover>

                {selectedElement.type === "button" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <div className="h-3 w-3 rounded border" style={{ backgroundColor: selectedElement.styles.backgroundColor }} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <p className="text-xs text-muted-foreground mb-1">Háttér</p>
                      <div className="grid grid-cols-8 gap-1">
                        {presetColors.map(c => (
                          <button key={c} className="w-4 h-4 rounded border" style={{ backgroundColor: c }} onClick={() => updateElement(selectedId!, { styles: { ...selectedElement.styles, backgroundColor: c } })} />
                        ))}
                      </div>
                      <Input
                        value={selectedElement.styles.backgroundColor}
                        onChange={(e) => updateElement(selectedId!, { styles: { ...selectedElement.styles, backgroundColor: e.target.value } })}
                        className="h-5 mt-1 text-xs"
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {/* Font size */}
                <Input
                  type="number"
                  value={selectedElement.styles.fontSize}
                  onChange={(e) => updateElement(selectedId!, { styles: { ...selectedElement.styles, fontSize: e.target.value } })}
                  className="h-6 w-12 text-xs"
                  min="8"
                  max="72"
                />
              </>
            )}

            <Button size="sm" variant="ghost" onClick={copyElement} className="h-6 w-6 p-0" title="Másolás (Ctrl+C)">
              <Copy className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={duplicateElement} className="h-6 px-1.5 text-[10px] gap-0.5" title="Duplikálás (Ctrl+D)">
              <Plus className="h-3 w-3" />
              Dup
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedId(null)} className="h-6 w-6 p-0 ml-auto">
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Content inputs */}
          {selectedElement.type === "text" && (
            <textarea
              value={selectedElement.content}
              onChange={(e) => updateElement(selectedId!, { content: e.target.value })}
              className="w-full h-16 p-1.5 text-xs bg-input border rounded resize-none"
              placeholder="Szöveg (Enter = új sor)"
            />
          )}

          {selectedElement.type === "button" && (
            <div className="flex gap-2">
              <Input
                value={selectedElement.content}
                onChange={(e) => updateElement(selectedId!, { content: e.target.value })}
                className="h-6 text-xs flex-1"
                placeholder="Gomb szövege"
              />
              <Input
                value={selectedElement.href || ""}
                onChange={(e) => updateElement(selectedId!, { href: e.target.value })}
                className="h-6 text-xs flex-1"
                placeholder="Link URL"
              />
            </div>
          )}

          {selectedElement.type === "image" && (
            <div className="space-y-1">
              <Input
                value={selectedElement.src || ""}
                onChange={(e) => updateElement(selectedId!, { src: e.target.value })}
                className="h-6 text-xs"
                placeholder="Kép URL (https://...)"
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-[10px]">Szélesség</Label>
                  <Input
                    value={selectedElement.styles.width || "100%"}
                    onChange={(e) => updateElement(selectedId!, { styles: { ...selectedElement.styles, width: e.target.value } })}
                    className="h-5 text-xs"
                    placeholder="100% vagy 300px"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-[10px]">Magasság</Label>
                  <Input
                    value={selectedElement.styles.height || "auto"}
                    onChange={(e) => updateElement(selectedId!, { styles: { ...selectedElement.styles, height: e.target.value } })}
                    className="h-5 text-xs"
                    placeholder="auto vagy 200px"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-[10px]">Lekerekítés</Label>
                  <Input
                    type="number"
                    value={selectedElement.styles.borderRadius || "0"}
                    onChange={(e) => updateElement(selectedId!, { styles: { ...selectedElement.styles, borderRadius: e.target.value } })}
                    className="h-5 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Icons Editor */}
          {selectedElement.type === "social" && (
            <div className="space-y-2 border-t border-border pt-2 mt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Social Ikonok</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="secondary" className="h-6 text-xs gap-1">
                      <Plus className="h-3 w-3" />
                      Hozzáadás
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="space-y-1">
                      {(Object.keys(socialPlatforms) as Array<keyof typeof socialPlatforms>).map(platform => (
                        <Button
                          key={platform}
                          size="sm"
                          variant="ghost"
                          className="w-full justify-start h-7 text-xs"
                          onClick={() => {
                            const newIcons = [...(selectedElement.socialIcons || []), {
                              platform,
                              url: `https://${platform}.com`,
                              color: socialPlatforms[platform].defaultColor,
                              size: "32",
                            }];
                            updateElement(selectedId!, { socialIcons: newIcons });
                          }}
                        >
                          <span 
                            className="w-4 h-4 mr-2"
                            style={{ color: socialPlatforms[platform].defaultColor }}
                            dangerouslySetInnerHTML={{ __html: socialPlatforms[platform].icon }}
                          />
                          {socialPlatforms[platform].name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              {selectedElement.socialIcons?.map((icon, idx) => (
                <div key={idx} className="flex items-center gap-1 p-1.5 bg-secondary/50 rounded text-xs">
                  <span 
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: icon.color }}
                    dangerouslySetInnerHTML={{ __html: socialPlatforms[icon.platform].icon }}
                  />
                  <Input
                    value={icon.url}
                    onChange={(e) => {
                      const newIcons = [...(selectedElement.socialIcons || [])];
                      newIcons[idx] = { ...newIcons[idx], url: e.target.value };
                      updateElement(selectedId!, { socialIcons: newIcons });
                    }}
                    className="h-5 text-xs flex-1"
                    placeholder="URL"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                        <div className="w-3 h-3 rounded border" style={{ backgroundColor: icon.color }} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <div className="grid grid-cols-6 gap-1 mb-1">
                        {presetColors.map(c => (
                          <button
                            key={c}
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: c }}
                            onClick={() => {
                              const newIcons = [...(selectedElement.socialIcons || [])];
                              newIcons[idx] = { ...newIcons[idx], color: c };
                              updateElement(selectedId!, { socialIcons: newIcons });
                            }}
                          />
                        ))}
                      </div>
                      <Input
                        value={icon.color}
                        onChange={(e) => {
                          const newIcons = [...(selectedElement.socialIcons || [])];
                          newIcons[idx] = { ...newIcons[idx], color: e.target.value };
                          updateElement(selectedId!, { socialIcons: newIcons });
                        }}
                        className="h-5 text-xs"
                        placeholder="#ffffff"
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="number"
                    value={icon.size}
                    onChange={(e) => {
                      const newIcons = [...(selectedElement.socialIcons || [])];
                      newIcons[idx] = { ...newIcons[idx], size: e.target.value };
                      updateElement(selectedId!, { socialIcons: newIcons });
                    }}
                    className="h-5 w-12 text-xs"
                    placeholder="32"
                    title="Méret (px)"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 text-destructive"
                    onClick={() => {
                      const newIcons = (selectedElement.socialIcons || []).filter((_, i) => i !== idx);
                      updateElement(selectedId!, { socialIcons: newIcons });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Spacing popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-6 text-xs gap-1 bg-transparent">
                <Settings2 className="h-3 w-3" />
                Térköz
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                <div>
                  <Label className="text-[10px]">Belső (padding)</Label>
                  <Input
                    value={selectedElement.styles.padding}
                    onChange={(e) => updateElement(selectedId!, { styles: { ...selectedElement.styles, padding: e.target.value } })}
                    className="h-5 text-xs"
                    placeholder="10px 20px"
                  />
                </div>
                <div>
                  <Label className="text-[10px]">Külső (margin)</Label>
                  <Input
                    value={selectedElement.styles.margin}
                    onChange={(e) => updateElement(selectedId!, { styles: { ...selectedElement.styles, margin: e.target.value } })}
                    className="h-5 text-xs"
                    placeholder="0 0 10px 0"
                  />
                </div>
                {(selectedElement.type === "button" || selectedElement.type === "image") && (
                  <div>
                    <Label className="text-[10px]">Lekerekítés (px)</Label>
                    <Input
                      type="number"
                      value={selectedElement.styles.borderRadius}
                      onChange={(e) => updateElement(selectedId!, { styles: { ...selectedElement.styles, borderRadius: e.target.value } })}
                      className="h-5 text-xs"
                    />
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Preview */}
      <ScrollArea className="flex-1">
        <div ref={previewRef} className="p-4" style={{ backgroundColor: "#0b0b0b" }} onClick={() => setSelectedId(null)}>
          <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#111111", padding: "30px" }}>
            {elements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Kattints a fenti gombokra elemek hozzáadásához
              </div>
            ) : (
              <div className="pl-5">
                {elements.map(el => renderElement(el))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
