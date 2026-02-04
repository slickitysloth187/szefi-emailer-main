import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export const maxDuration = 60

export async function POST(req: Request) {
  const { prompt, currentHtml, currentCss, mode } = await req.json()
  
  // Check for OpenAI API key (required for non-Vercel deployments like Netlify)
  const openaiApiKey = process.env.OPENAI_API_KEY
  
  // Use direct OpenAI provider if API key is available, otherwise try Vercel AI Gateway
  const openai = openaiApiKey 
    ? createOpenAI({ apiKey: openaiApiKey })
    : null
  
  const model = openai 
    ? openai('gpt-4o')
    : 'openai/gpt-4o' as const // Vercel AI Gateway format
  
  const systemPrompt = `You are an expert email HTML/CSS developer. You create beautiful, responsive email templates that work across all email clients (Gmail, Outlook, Apple Mail, etc.).

IMPORTANT RULES:
1. You ONLY output valid HTML and CSS code for email newsletters - no explanations, no markdown, just code.
2. Use inline styles AND <style> tags for CSS (email clients need both).
3. Use table-based layouts for email compatibility.
4. Include responsive media queries for mobile (max-width: 620px).
5. Use web-safe fonts and fallbacks.
6. All colors should be hex codes.
7. Include proper email DOCTYPE and meta tags.
8. Support dark mode with prefers-color-scheme media query.
9. Use PNG images from CDN (like flaticon) for icons, NOT SVG (email clients don't support inline SVG).

OUTPUT FORMAT:
Return the code in this exact format:
---HTML---
[Your HTML code here]
---CSS---
[Your CSS code here - this goes in the email's <style> tag]
---END---

The HTML should be a complete email template with the CSS embedded in a <style> tag in the <head>.
The CSS section is for additional styles that might be useful.`

  const userPrompt = mode === 'edit' 
    ? `Here is the current email template:

CURRENT HTML:
${currentHtml}

CURRENT CSS:
${currentCss}

User request: ${prompt}

Please modify the template according to the user's request. Keep the overall structure but make the requested changes.`
    : `Create a completely new email template based on this request: ${prompt}

Design guidelines:
- Use a dark purple theme (#0a0a0f background, #8b5cf6 primary color, #a78bfa accent)
- Modern, clean design
- Include header, content sections, call-to-action buttons, and footer
- Make it mobile responsive`

  const result = streamText({
    model: model,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    abortSignal: req.signal,
  })

  return result.toTextStreamResponse()
}
