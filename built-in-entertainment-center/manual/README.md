# Build manual (PDF)

| File | Description |
|---|---|
| **[Path-A-Build-Manual.pdf](./Path-A-Build-Manual.pdf)** | Color instruction manual — plans, cut boards, step-by-step install, Kreg + face-screw notes |

Regenerate after guide changes:

```powershell
cd built-in-entertainment-center\manual
node generate-manual.js
```

Source for the PDF: `generate-manual.js` (uses cover photo from `../mockups/mockup-path-A-photoreal.jpg`).
