# Build manual (PDF)

## Download

| File | Description |
|---|---|
| **[Path-A-Build-Manual.pdf](./Path-A-Build-Manual.pdf)** | Color instruction manual — plans, cut boards, step-by-step install, Kreg + face-screw notes |

**How to download**

1. Click **[Path-A-Build-Manual.pdf](./Path-A-Build-Manual.pdf)** in this folder (or from the repo root README).
2. On GitHub: open the file → use the **Download** button (or “Raw”, then save).
3. Companion cut lists/diagrams: [`../build-guides/`](../build-guides/).

## Regenerate after guide changes

```bash
cd built-in-entertainment-center/manual
npm install
node generate-manual.js
```

Source: `generate-manual.js` (cover photo from `../mockups/mockup-path-A-photoreal.jpg`).
