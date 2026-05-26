## Plan

**1. Add Maqtob images to project**
Copy 4 uploaded images into `src/assets/brands/`:
- `maqtob-1.png` (wordmark, dark green)
- `maqtob-2.png` (evil-eye tote)
- `maqtob-3.png` (heart sweatshirt)
- `maqtob-4.png` (patterned tote)

**2. Update `src/data/brands.ts`**
- Maqtob: set `url: 'https://maqtob.id'`, replace `images` with imported assets above.
- Stories of Bible, X Voyager, Warung Marrakech: set `images: []` (placeholder picsum removed).

**3. Update `src/components/sections/VorvnPortfolioSection.tsx`**
- In the expanded panel grid, only render `<VorvnGallery>` when `data.images.length > 0`. When no images, the left column spans full width (switch grid to single column for that brand).

That's it. Visit-brand link will now show for Maqtob automatically since `url` is set. Cook Warriors + Maqtob will be the only brands showing image galleries.
