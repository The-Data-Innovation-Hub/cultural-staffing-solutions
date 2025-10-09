# Required Images for Cultural Staffing Solutions

This document lists all the images needed for the landing page. All images should be uploaded to Bunny CDN.

## Current Status
🔴 **13 images missing** - The website is currently using placeholder images.

## How to Upload Images

### Step 1: Prepare Your Images
Collect or create the following images and name them exactly as shown below.

### Step 2: Upload to Bunny CDN
Place all images in a single folder, then run:
```bash
npx tsx scripts/upload-images-to-bunny.ts /path/to/your/images/folder
```

Or upload them manually to your Bunny CDN storage zone at:
https://uk.storage.bunnycdn.com/cultural-staffing-solutions/

---

## Required Images

### 1. Hero Section (1 image)

#### `healthcare-professionals.jpg`
- **Purpose:** Background image for the hero section
- **Recommended Size:** 1920x1080px
- **Description:** High-quality image of healthcare professionals, ideally in a Northern Ireland healthcare setting
- **Upload Path:** `images/hero/healthcare-professionals.jpg`

---

### 2. Features Section (6 images)

#### `training.jpg`
- **Purpose:** Comprehensive Training feature card
- **Recommended Size:** 800x600px
- **Description:** Image representing healthcare training, possibly a classroom or training scenario
- **Upload Path:** `images/features/training.jpg`

#### `cultural-integration.jpg`
- **Purpose:** Cultural Integration feature card
- **Recommended Size:** 800x600px
- **Description:** Image showing diverse healthcare professionals working together
- **Upload Path:** `images/features/cultural-integration.jpg`

#### `ai-learning.jpg`
- **Purpose:** AI-Powered Learning feature card
- **Recommended Size:** 800x600px
- **Description:** Modern tech/AI learning concept, possibly tablet or digital learning
- **Upload Path:** `images/features/ai-learning.jpg`

#### `certified-programs.jpg`
- **Purpose:** Certified Programs feature card
- **Recommended Size:** 800x600px
- **Description:** Certificates, awards, or professional credentials
- **Upload Path:** `images/features/certified-programs.jpg`

#### `expert-support.jpg`
- **Purpose:** Expert Support feature card
- **Recommended Size:** 800x600px
- **Description:** Healthcare professionals providing support or mentorship
- **Upload Path:** `images/features/expert-support.jpg`

#### `compliance.jpg`
- **Purpose:** Compliance Assured feature card
- **Recommended Size:** 800x600px
- **Description:** Professional healthcare setting showing standards/compliance
- **Upload Path:** `images/features/compliance.jpg`

---

### 3. Services Section (3 images)

#### `healthcare-training.jpg`
- **Purpose:** Healthcare Professional Training service card
- **Recommended Size:** 800x600px
- **Description:** Nurses or healthcare workers in training
- **Upload Path:** `images/services/healthcare-training.jpg`

#### `cultural-orientation.jpg`
- **Purpose:** Cultural Orientation Program service card
- **Recommended Size:** 800x600px
- **Description:** Cultural exchange, diverse team collaboration
- **Upload Path:** `images/services/cultural-orientation.jpg`

#### `recruitment.jpg`
- **Purpose:** Recruitment & Placement service card
- **Recommended Size:** 800x600px
- **Description:** Job interview, professional handshake, or recruitment concept
- **Upload Path:** `images/services/recruitment.jpg`

---

### 4. Testimonials Section (3 images)

#### `maria-santos.jpg`
- **Purpose:** Avatar for Maria Santos testimonial
- **Recommended Size:** 100x100px (square)
- **Description:** Professional headshot of a female nurse (or stock photo)
- **Upload Path:** `images/testimonials/maria-santos.jpg`

#### `john-kumar.jpg`
- **Purpose:** Avatar for John Kumar testimonial
- **Recommended Size:** 100x100px (square)
- **Description:** Professional headshot of a male healthcare assistant (or stock photo)
- **Upload Path:** `images/testimonials/john-kumar.jpg`

#### `sarah-obrien.jpg`
- **Purpose:** Avatar for Sarah O'Brien testimonial
- **Recommended Size:** 100x100px (square)
- **Description:** Professional headshot of a female administrator (or stock photo)
- **Upload Path:** `images/testimonials/sarah-obrien.jpg`

---

## Image Guidelines

### Quality Standards
- **Format:** JPG (JPEG) preferred for photos
- **Quality:** High resolution, well-lit, professional
- **File Size:** Optimize for web (100-500KB per image)
- **Theme:** Professional healthcare setting, diverse and inclusive

### Free Stock Photo Resources
If you need stock photos, consider these sources:
- **Unsplash:** https://unsplash.com (search: "healthcare", "nurse", "hospital")
- **Pexels:** https://pexels.com (search: "medical", "doctor", "healthcare")
- **Pixabay:** https://pixabay.com (search: "healthcare professional")

### Naming Convention
⚠️ **Important:** Files must be named exactly as shown above (including .jpg extension)

---

## After Uploading

Once images are uploaded to Bunny CDN, they will be automatically available at:
```
https://cultural-staffing-solutions.b-cdn.net/images/[category]/[filename].jpg
```

The website will automatically use these images instead of placeholders.

---

## Current CDN Configuration

- **Storage Zone:** cultural-staffing-solutions
- **CDN URL:** https://cultural-staffing-solutions.b-cdn.net
- **Storage Region:** UK (United Kingdom)
- **Status:** ✅ Configured and ready

---

## Need Help?

Run the upload script without arguments to check which images are missing:
```bash
npx tsx scripts/upload-images-to-bunny.ts
```
