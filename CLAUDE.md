# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A zero-dependency static web project — no build tools, no package manager, no framework. Open `index.html` directly in a browser to run it.

```
# Preview in Chrome (Windows)
& "C:\Program Files\Google\Chrome\Application\chrome.exe" index.html
```

## File Layout

| File | Status | Purpose |
|---|---|---|
| `index.html` | **Active** | Self-contained "Agentic AI Applications with Claude Code" reference page |
| `style.css` | Legacy | CSS for the original Luxe Interiors landing page (not linked from index.html) |
| `script.js` | Legacy | JS for the original Luxe Interiors landing page (not linked from index.html) |

## index.html Architecture

The page is **entirely self-contained** — all CSS lives in a `<style>` block in `<head>` and all JavaScript lives in a `<script>` block before `</body>`. Nothing is imported externally.

### Tab system
Tabs are driven by `data-tab="<panel-id>"` attributes on `.tab-btn` elements. Clicking a tab removes `.active` from all panels then adds it to the matching `id`. The active panel animates in via `@keyframes fadeSlide`. Keyboard navigation (Arrow Left/Right) is wired up for accessibility.

### Accordion system
Collapsible `.subtopic` cards use an `onclick="toggle(this)"` on `.subtopic-header`. The `toggle()` function closes open siblings within the same `.subtopics` container before opening the clicked one, creating a single-open accordion per tab panel.

### CSS architecture
All colours are CSS custom properties on `:root` (dark theme only — no light mode). Key variables: `--bg`, `--surface`, `--surface2`, `--border`, `--orange`, `--blue`, `--green`, `--purple`. No responsive breakpoints beyond `clamp()` for typography.

### Adding a new tab
1. Add a `<button class="tab-btn" data-tab="<id>">` inside `.tabs-nav`
2. Add a matching `<div class="tab-panel" id="<id>">` inside `.content-area`
3. No JS changes required — the tab switcher queries all `.tab-btn` elements dynamically.

### Adding a new accordion item
Use the existing `.subtopic` / `.subtopic-header` / `.subtopic-body` structure inside a `.subtopics` container. The `toggle()` function is global and works on any element with this class structure.

## FormSubmit Integration (style.css / script.js era)

If restoring the Luxe Interiors landing page, the contact form posts to:
```
POST https://formsubmit.co/ajax/christinecheong88@gmail.com
Content-Type: application/json
```
The first submission triggers a one-time confirmation email — click the link to activate delivery. Hidden fields `_captcha=false` and `_template=table` are included in the form.

## Known Gotcha

JS string literals that contain apostrophes **must** use double quotes or escaped single quotes — a bare `'We'll...'` will silently break the entire script since no bundler catches it.
