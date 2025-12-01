# Image Management Guide

## Image Storage Structure

```
frontend/public/images/
├── fixtures/           # Fixture images
│   ├── robe-pointe.jpg
│   ├── martin-mac-aura.jpg
│   └── ...
├── manufacturers/      # Manufacturer logos
│   ├── robe.png
│   ├── martin.png
│   └── ...
└── vendors/           # Vendor logos
    └── ...
```

## Adding Images

### Option 1: Manual Upload (Current Setup)

1. Download fixture images from manufacturer websites
2. Name them consistently: `manufacturer-fixture-name.jpg`
3. Place in `frontend/public/images/fixtures/`
4. Update database with path: `/images/fixtures/filename.jpg`

### Option 2: Database Insert with URLs

When inserting fixtures, set the `primary_image_url` field:

```sql
-- For local images
UPDATE fixtures 
SET primary_image_url = '/images/fixtures/robe-pointe.jpg'
WHERE slug = 'robe-pointe';

-- For external URLs (manufacturer websites)
UPDATE fixtures 
SET primary_image_url = 'https://www.robe.cz/pointe/img/pointe.jpg'
WHERE slug = 'robe-pointe';
```

### Option 3: Multiple Images

Use the `fixture_images` table for galleries:

```sql
-- Add multiple images for a fixture
INSERT INTO fixture_images (fixture_id, image_url, alt_text, is_primary, display_order)
VALUES 
  ((SELECT id FROM fixtures WHERE slug = 'robe-pointe'), 
   '/images/fixtures/robe-pointe-front.jpg', 
   'Robe Pointe front view', 
   true, 
   1),
  ((SELECT id FROM fixtures WHERE slug = 'robe-pointe'), 
   '/images/fixtures/robe-pointe-side.jpg', 
   'Robe Pointe side view', 
   false, 
   2);
```

## Image Sources

### Free/Legal Sources:
1. **Manufacturer websites** - Usually allow use for informational purposes
2. **PRG/4Wall rental catalogs** - Often have high-quality images
3. **PLASA show photos** - Trade show images (check licensing)
4. **Contact manufacturers** - Ask for official product photos

### Image Naming Convention:
- Format: `manufacturer-model-view.extension`
- Examples:
  - `robe-pointe.jpg` (primary)
  - `robe-pointe-side.jpg` (additional view)
  - `martin-mac-aura-xb.jpg`
  - `clay-paky-sharpy.jpg`

### Image Specifications:
- **Format**: JPG for photos, PNG for logos
- **Size**: 800x800px (square) or 1200x800px (landscape)
- **Max file size**: 500KB (compress if needed)
- **Background**: White or transparent for PNGs

## Quick Start Example

1. **Download an image** from Robe's website:
   - https://www.robe.cz/pointe

2. **Save it as**: `robe-pointe.jpg`

3. **Move to**: `frontend/public/images/fixtures/`

4. **Update database**:
```sql
UPDATE fixtures 
SET primary_image_url = '/images/fixtures/robe-pointe.jpg'
WHERE name = 'Pointe' AND manufacturer_id = (SELECT id FROM manufacturers WHERE slug = 'robe');
```

5. **Restart frontend** - Images are served automatically from `/public`

## Future: Admin Upload Interface

We can build an admin panel later that:
- Allows drag-and-drop image upload
- Automatically resizes/optimizes images
- Manages multiple images per fixture
- Bulk import from URLs

## External CDN Setup (Optional)

For production, consider Cloudinary:

```javascript
// In fixture insert
primary_image_url: 'https://res.cloudinary.com/your-account/image/upload/v1/fixtures/robe-pointe.jpg'
```

Benefits:
- Automatic image optimization
- Responsive images (different sizes)
- CDN delivery
- Transformation on-the-fly

## Copyright Notice

⚠️ **Important**: When using manufacturer images:
- Use only for product identification/information
- Credit the manufacturer
- Don't modify images (except resize)
- Consider adding attribution: "Product images courtesy of [Manufacturer]"
