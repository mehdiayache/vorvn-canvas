## Problem

Netlify build fails on `validate-newsroom`:

1. Translations (ar/es/fr/id/zh) have top-level `"type": "analysis"` — invalid. EN uses `"deep-insight"`, and all translations must match EN.
2. `zh` file has invalid JSON at position 1886 (likely an unescaped quote inside a string).

## Fix

1. In all 5 translation files (`2026-05-23-{ar,es,fr,id,zh}-meme-we-made-real-cook-warriors-method.json`), change top-level `"type": "analysis"` → `"type": "deep-insight"`.
2. Open the `zh` file, locate the JSON parse error near position 1886, and escape/repair the offending character so the file parses.
3. Re-run `node scripts/validate-newsroom.mjs` locally to confirm clean before redeploy.

No code or component changes — content-only repair.