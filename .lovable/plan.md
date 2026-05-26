## Plan

Replace remote WordPress-hosted logos with the uploaded local assets for all 4 brands.

**1. Copy logos to `src/assets/brands/`:**
- `cookwarriors.svg` ← `logo-cw-03-cookwarriors.svg`
- `maqtob.png` ← `maqtob.png`
- `warung-marrakech.png` ← `warung-marrakech-300x216.png`
- `xvoyager.png` ← `the-x-voyager.png`

**2. Update `src/data/brands.ts`:**
- Add 4 ES6 imports at top.
- Replace each brand's `logo` field (currently `https://vorvn.com/wp-content/uploads/...`) with the imported asset. Stories of Bible stays `null`.
