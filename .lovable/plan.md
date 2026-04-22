
Fix the Portfolio gallery so it behaves as truly infinite, keeps the current filmstrip size, restores rounded geometry, and shows the eye loader when a newly requested next/previous image appears.

## What is wrong now

1. The gallery is only using a circular index on the original array:
   - `setIndex((i) => (i + dir + total) % total)`
   - `translateX(-${index * slideBasis}%)`
   This is cyclic state, but not a visually seamless infinite track. When the last image is reached, the track resets instead of continuing naturally.

2. The next images are being preloaded too early:
   - `isNear` loads images within roughly 2 positions of the current slide.
   - Because of that, the next image is often already decoded before the click, so the eye loader is not visible after navigation.

3. The gallery tiles are square, but not explicitly rounded:
   - current slide shell uses `aspect-square`
   - `LoadingImage` is inserted without a rounded wrapper/class
   This conflicts with the fully rounded UI direction.

## Implementation plan

### 1) Rebuild the gallery track as a seamless infinite carousel
Update `src/components/sections/VorvnPortfolioSection.tsx`:

- Keep the same visual proportion:
  - desktop: about `2.5` visible images
  - mobile: one full image plus a peek
- Replace the current single-array transform logic with a cloned-track strategy:
  - duplicate slides before and after the real set
  - start on the first “real” slide in the middle copy
  - animate one slide per click
  - after transition ends, silently snap back to the equivalent real slide position with transitions temporarily disabled
- Result:
  - clicking next on the last image continues naturally into the first image
  - clicking prev on the first image continues naturally into the last image
  - no visual reset/jump

### 2) Keep the current gallery size and filmstrip behavior
In the same gallery component:

- Preserve the current ratio and width logic instead of changing to a single large square slider
- Keep:
  - desktop filmstrip with 2 images + half image visible
  - mobile filmstrip with one image + partial next image
- Remove any extra “counter” UI and keep only simple left/right navigation

## 3) Make the gallery rounded
Apply rounded styling to the visible image tiles:

- Add rounded geometry to the image frame using the existing design tokens:
  - use `.r-card` for the gallery item shell
  - ensure the image container clips overflow so the image respects the rounded corners
- Keep logos themselves untouched in the brand logo area above; only the gallery content tiles get rounded

Files:
- `src/components/sections/VorvnPortfolioSection.tsx`
- possibly `src/components/LoadingImage.tsx` if the rounding/clipping is better centralized there

## 4) Change loading behavior so the eye appears after click
Adjust the lazy-loading strategy:

- Stop preloading a wide `isNear` range
- Only mount/load:
  - currently visible slides
  - optionally the immediate adjacent peek if required for layout smoothness
- For the newly requested next/previous image:
  - let it mount/load when it becomes active through navigation
  - show `LoadingImage` with `EyeLoader` until decode completes
- This ensures the eye is visible for newly entered images instead of silently showing an already preloaded asset

### Recommended behavior
- visible now = loaded now
- clicked next/prev = next target starts loading if not already available
- loader appears centered inside that rounded tile until the image is ready

## 5) Keep mobile behavior clean
While updating the carousel:

- preserve swipe-like visual flow, even if navigation remains button-driven
- ensure the rounded tiles, loader, and snapping all work at mobile widths
- keep keyboard arrow support if it does not interfere with the infinite-track logic

## Files to change

- `src/components/sections/VorvnPortfolioSection.tsx`
  - replace modulo-only carousel logic with cloned infinite track
  - update loading window logic
  - add rounded gallery shells
- `src/components/LoadingImage.tsx`
  - ensure it can inherit rounded clipping cleanly without flashing square corners

## Technical notes

```text
Current:
[1][2][3][4] + index wraps in state only

Needed:
[3][4][1][2][3][4][1][2]
      ^
   start here in middle set

Click next:
animate to next position
if landed in cloned edge zone:
snap instantly back to matching real slide
```

```text
Desired desktop view:
[ image ][ image ][ half image ]

Desired mobile view:
[ image ][ partial next ]
```

## Expected result

- Truly infinite next/previous behavior
- Same gallery proportion as now
- Rounded gallery tiles
- Eye loader appears when a newly navigated image is still loading
- Mobile remains smooth and readable
