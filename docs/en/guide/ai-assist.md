---
title: AI Assist
description: luno's AI features — content generation in the editor, form set field suggestions, widget CSS generation, and AI agent integration via MCP.
prev:
  text: SEO & sitemaps
  link: /en/guide/seo
next:
  text: Changelog
  link: /en/changelog
---

# AI Assist

luno includes several AI-powered features that accelerate content creation and CMS configuration — from drafting body copy to suggesting form structures and generating widget styles.

::: tip Do this now (3 lines)
1. Open a text / tiptap field in the entry editor and click **AI**  
2. Prompt briefly (e.g. “150-char summary”), then accept a suggestion  
3. For agent workflows, go to [Path A · Agents](/en/guide/paths/agents)  
:::

## Content AI

The entry editor offers AI-generated suggestions directly inside text and rich-text fields.

### Supported field types

| Field type | What AI can do |
|---|---|
| `text` | Suggest title variants, generate headlines, propose A/B test options |
| `textarea` | Write excerpts, meta descriptions, summaries |
| `tiptap` | Draft body copy, rewrite sections, translate content |

### How to use

1. Open an entry for editing and focus a field
2. Click the **✨ AI** button in the top-right corner of the field
3. Enter a prompt (or leave it blank for automatic generation based on context)
4. Review the generated suggestion and click **Accept** or **Regenerate**
5. Manually refine as needed

### Example prompts

**Title generation for A/B testing:**

Prompt: "Suggest 3 title variants for a case study about how a retail company cut content publishing time by 80% using a headless CMS."

→ Output:
```
1. "From 5 Days to 1 Hour: How Acme Retail Transformed Their Content Pipeline"
2. "80% Faster Publishing: A Retail Chain's Switch to Headless CMS"
3. "Case Study: Scaling Content Operations Without Scaling the Team"
```

**Meta description:**

Prompt: "Write a 155-character meta description for a Google Search result based on this article body."

## Form Set Field Suggestions

When creating a new form set, describe your content in plain text and the AI will propose a field structure.

### How to use

1. Go to **Settings → Form Sets → New Form Set**
2. Click **Suggest fields with AI**
3. Describe your content type

**Example 1 — E-commerce product catalog:**

Prompt: "I'm managing product listings for an online store. I need product name, description, price, stock level, categories, multiple product images, and an SKU."

→ AI suggests:
```
- name         (text, required)
- description  (tiptap, required)
- price        (number, required, min: 0)
- stock        (number, min: 0)
- categories   (multiselect)
- images       (image)  ← multiple image handling note included
- sku          (text, required)
```

**Example 2 — Technical documentation:**

Prompt: "I want to manage API reference documentation with endpoint name, HTTP method, path, request body description, response examples, and version."

→ AI suggests:
```
- name             (text, required)
- http_method      (select: GET / POST / PUT / PATCH / DELETE)
- path             (text, required)
- description      (tiptap)
- request_body     (tiptap)
- response_example (textarea)
- version          (text)
```

## Widget CSS Generation

Describe your desired widget style in plain language and the AI generates the CSS for you.

### How to use

1. Go to **Widgets → Style Settings**
2. Click **Generate CSS with AI**
3. Describe the design you want

**Example prompt:** "Minimal grid layout, 3 columns on desktop, 1 column on mobile. Card style with a subtle border. No shadows. Thumbnail on top, title and date below."

→ Generated CSS:
```css
.luno-widget-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .luno-widget-list {
    grid-template-columns: 1fr;
  }
}

.luno-widget-item {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.luno-widget-thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.luno-widget-content {
  padding: 1rem;
}

.luno-widget-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #1a202c;
}

.luno-widget-date {
  font-size: 0.8rem;
  color: #718096;
  margin: 0;
}
```

You can edit the generated CSS in the admin panel editor.

## Schema Context (for AI agents)

Go to **Settings → Schema Context** to add semantic descriptions of your form sets. This helps AI agents understand what your content types mean and how to work with them effectively.

### Example schema context

```
Form Set: blog
Purpose: Technical blog articles for a developer audience.

Fields:
- title: SEO-optimized article headline (60 chars recommended)
- body: Full article body as HTML (tiptap editor). NOT Markdown.
- author: entry_ref to the "authors" form set — use the author's entry UUID.
- tags: Technology slugs (e.g., cloudflare, typescript, cms). Comma-separated.
- og_image: Social sharing image (1200×630 px). Provide as asset UUID.
- meta_description: 155 chars max. Used for search snippets.
```

This context is available at `GET /admin/v1/schema-context` and is automatically used by the luno MCP server when an AI agent connects.

## AI Agent Integration

luno integrates directly with AI agents via the Model Context Protocol (MCP) and the Agent API.

### MCP server setup

```json
{
  "mcpServers": {
    "luno": {
      "command": "npx",
      "args": ["-y", "@luno-cms/mcp"],
      "env": {
        "LUNO_API_URL": "https://api.luno.rest/admin",
        "LUNO_AGENT_KEY": "sk-agent-xxxxxxxx"
      }
    }
  }
}
```

See [AI Agents Guide](/en/api/ai-agents) for the full setup.

## AI Feature Configuration

To enable AI features, configure an LLM provider in **Settings → AI Settings**:

| Setting | Description |
|---|---|
| **AI Provider** | OpenAI or Anthropic |
| **API Key** | Your provider's API key |
| **Model** | The model to use (e.g., `gpt-4o`, `claude-3-5-sonnet-20241022`) |

::: tip Cost consideration
AI assist features consume tokens billed by your LLM provider. Usage costs are separate from luno's subscription and depend on how much you use the AI features.
:::

## Important Notes

::: warning Always review AI-generated content before publishing
AI can produce inaccurate, outdated, or inappropriate content. Use luno's approval workflow (`draft → pending_review → published`) to ensure human review before any AI-generated content goes live.
:::

- Generation results vary each time — regenerate for alternatives
- Very long articles may hit the LLM's context window limit
- For multilingual content, explicitly specify the target language in your prompt

## Next Steps

- [AI Agents Guide](/en/api/ai-agents) — MCP server setup and API key management
- [Form Builder](/en/guide/form-builder) — Building form sets that AI can suggest fields for
- [Embed on Your Site](/en/guide/embed) — CSS customization in detail
