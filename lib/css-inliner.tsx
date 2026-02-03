/**
 * CSS Inliner - Converts CSS rules to inline styles for email compatibility
 * This is critical for email client rendering (Gmail, Outlook, Apple Mail)
 */

interface CSSRule {
  selector: string;
  properties: Record<string, string>;
}

/**
 * Parse CSS string into array of rules
 */
function parseCSS(css: string): CSSRule[] {
  const rules: CSSRule[] = [];
  
  // Remove comments
  const cleanCSS = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Match rule blocks
  const ruleRegex = /([^{}]+)\s*\{\s*([^{}]*)\s*\}/g;
  let match;
  
  while ((match = ruleRegex.exec(cleanCSS)) !== null) {
    const selector = match[1].trim();
    const propertiesString = match[2].trim();
    
    // Parse properties
    const properties: Record<string, string> = {};
    const propPairs = propertiesString.split(';').filter(p => p.trim());
    
    for (const pair of propPairs) {
      const colonIndex = pair.indexOf(':');
      if (colonIndex > -1) {
        const prop = pair.substring(0, colonIndex).trim();
        const value = pair.substring(colonIndex + 1).trim();
        if (prop && value) {
          properties[prop] = value;
        }
      }
    }
    
    if (Object.keys(properties).length > 0) {
      rules.push({ selector, properties });
    }
  }
  
  return rules;
}

/**
 * Check if an element matches a simple CSS selector
 */
function matchesSelector(element: Element, selector: string): boolean {
  // Handle simple selectors: tag, .class, #id
  const trimmedSelector = selector.trim();
  
  // Tag selector
  if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(trimmedSelector)) {
    return element.tagName.toLowerCase() === trimmedSelector.toLowerCase();
  }
  
  // Class selector
  if (trimmedSelector.startsWith('.')) {
    const className = trimmedSelector.substring(1);
    return element.classList?.contains(className) ?? false;
  }
  
  // ID selector
  if (trimmedSelector.startsWith('#')) {
    const id = trimmedSelector.substring(1);
    return element.id === id;
  }
  
  // Try native matches for complex selectors
  try {
    return element.matches(trimmedSelector);
  } catch {
    return false;
  }
}

/**
 * Apply CSS rules to elements as inline styles
 */
function applyStylesToElements(doc: Document, rules: CSSRule[]): void {
  for (const rule of rules) {
    // Split compound selectors
    const selectors = rule.selector.split(',').map(s => s.trim());
    
    for (const selector of selectors) {
      try {
        const elements = doc.querySelectorAll(selector);
        elements.forEach(el => {
          const htmlEl = el as HTMLElement;
          // Get existing inline styles
          const existingStyle = htmlEl.getAttribute('style') || '';
          const existingProps: Record<string, string> = {};
          
          // Parse existing inline styles
          existingStyle.split(';').filter(p => p.trim()).forEach(pair => {
            const colonIndex = pair.indexOf(':');
            if (colonIndex > -1) {
              const prop = pair.substring(0, colonIndex).trim();
              const value = pair.substring(colonIndex + 1).trim();
              if (prop && value) {
                existingProps[prop] = value;
              }
            }
          });
          
          // Merge with CSS rules (existing inline takes precedence)
          const mergedProps = { ...rule.properties, ...existingProps };
          
          // Build new style string
          const newStyle = Object.entries(mergedProps)
            .map(([prop, value]) => `${prop}:${value}`)
            .join(';');
          
          if (newStyle) {
            htmlEl.setAttribute('style', newStyle);
          }
        });
      } catch {
        // Selector not supported, skip
      }
    }
  }
}

/**
 * Remove style tags and class attributes from HTML
 */
function cleanupHTML(doc: Document): void {
  // Remove all <style> tags
  const styleTags = doc.querySelectorAll('style');
  styleTags.forEach(tag => tag.remove());
  
  // Remove class attributes
  const allElements = doc.querySelectorAll('[class]');
  allElements.forEach(el => el.removeAttribute('class'));
}

/**
 * Main function: Inline all CSS into HTML for email compatibility
 */
export function inlineCSS(html: string, css: string): string {
  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Parse CSS rules
  const rules = parseCSS(css);
  
  // Apply styles to elements
  applyStylesToElements(doc, rules);
  
  // Clean up (remove style tags and classes)
  cleanupHTML(doc);
  
  // Get the body content
  const body = doc.body;
  
  // Return the inner HTML
  return body.innerHTML;
}

/**
 * Replace template variables in HTML
 */
export function replaceVariables(
  html: string,
  variables: Record<string, string>
): string {
  let result = html;
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  
  return result;
}

/**
 * Generate email-safe HTML with all CSS inlined
 */
export function generateEmailHTML(html: string, css: string): string {
  // Wrap the content in proper email HTML structure
  const inlinedContent = inlineCSS(html, css);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;background:#0b0b0b;">
${inlinedContent}
</body>
</html>`;
}
