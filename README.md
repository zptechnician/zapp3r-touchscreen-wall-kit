# Zapp3r Touchscreen Wall Kit

The Zapp3r Touchscreen Wall Kit is a logic-driven React framework designed to transform any touchscreen into an interactive wall. It replaces static presentations with a performance-optimized, self-hosted experience that is entirely driven by a single JSON manifest.

This repository provides a "Sanitized Kit." All data fields are pre-populated with instructional placeholders to act as a real-time content guide for field technicians. The architecture enforces zero-PII and strict asset hygiene, ensuring that the display remains fast, reliable, and visually consistent regardless of the content loaded into it.

---

## The Field Tech Guide: Deploying Content

The kiosk is designed to be deployed via Docker on local hardware (like an Intel NUC). You do not need to rebuild the Docker image to change the content. Instead, you mount your local assets and JSON manifest into the running container.

### 1. The Folder Structure

Your local content directory must match this exact structure before deployment:

```
kiosk-content/
├── kiosk-data.json
└── assets/
    ├── logos/
    │   ├── brand-a.png
    │   ├── brand-b.png
    │   └── brand-a-header.png  (Optional)
    └── heroes/
        ├── brand-a.webp
        └── brand-b.webp
```

### 2. Asset Naming and Formats

The system enforces strict asset hygiene via runtime Zod validation. If an asset does not meet these requirements, the kiosk will fail the data audit and refuse to render the broken entry.

| Asset Type | Format | Dimensions (Recommended) | Naming Convention |
| --- | --- | --- | --- |
| **Grid Logo** | `.png` (Transparent) | 512×512 (Square) | `brand-name.png` |
| **Hero Image** | `.webp` | 1920×1080 (16:9) | `brand-name.webp` |
| **Header Logo** | `.png` (Transparent) | 1024×300 (Horizontal) | `brand-name-header.png` |

*Note: The Header Logo is an optional override. If omitted, the kiosk will automatically scale and use the Grid Logo in the detail page header.*

### 3. The JSON Manifest (`kiosk-data.json`)

Every brand, image, and text block is managed via this single file. The schema is divided into two arrays: `partners` (typically logo-only grid entries) and `customers` (full case study detail pages).

```json
{
  "settings": {
    "partnerWallTitle": "Our Partner Network",
    "customerWallTitle": "Customer Spotlight"
  },
  "partners": [
    {
      "id": "partner-acme",
      "name": "Acme Corp",
      "logo": "/assets/logos/acme.png",
      "hero": "/assets/heroes/acme.webp",
      "challenge": "Placeholder text...",
      "solution": "Placeholder text...",
      "impact": "Placeholder text...",
      "hasDetailPage": false
    }
  ],
  "customers": [
    {
      "id": "customer-globex",
      "name": "Globex",
      "logo": "/assets/logos/globex.png",
      "logoHeader": "/assets/logos/globex-header.png",
      "hero": "/assets/heroes/globex.webp",
      "challenge": "Globex needed a reliable payment option...",
      "solution": "Integrated with our platform in 2 weeks...",
      "impact": "99.999% uptime during peak holiday sales."
    }
  ]
}
```

### 4. Running the Kiosk

Once your folder structure is ready, run the unprivileged Nginx container, mounting your local content over the sanitized defaults:

```bash
docker run -d -p 8080:8080 \
  -v "/path/to/kiosk-content/kiosk-data.json:/usr/share/nginx/html/kiosk-data.json:ro" \
  -v "/path/to/kiosk-content/assets:/usr/share/nginx/html/assets:ro" \
  --name zapp3r-kiosk \
  zapp3r-touchscreen-wall-kit
```

The kiosk will be live at `http://localhost:8080`.

---

## The Developer Guide: Architecture and Extension

The Zapp3r Touchscreen Wall Kit is built on React, Tailwind CSS, and TypeScript. It is designed to be extended without breaking the core routing or layout logic.

### Runtime Schema Hardening (Zod )

The application does not blindly trust `kiosk-data.json`. At fetch time, the payload is parsed against a strict Zod schema (`src/lib/schema.ts`). This ensures that:

- IDs follow the `partner-[a-z0-9-]+` or `customer-[a-z0-9-]+` format.

- Asset paths are strictly relative to `/assets/` (preventing path traversal).

- Required text fields are present and non-empty.

If the audit fails, the UI renders a structured error screen detailing exactly which field failed validation, rather than crashing silently.

### The `hasDetailPage` Flag

By default, tapping any logo in a grid navigates to that brand's T-layout detail page. However, some walls (like a broad Partner Network) may only require a logo grid without underlying case studies.

To bypass the detail page routing, set `"hasDetailPage": false` on the entry in `kiosk-data.json`. When tapped, the application will intercept the route and redirect the user to the Customer Wall instead.

### The `logoHeader` Fallback Pattern

The T-layout detail page features a top-right header for the brand logo. While the square grid logo (`logo`) works in this space, horizontal wordmarks often read better at header scale.

The `logoHeader` field is an optional override. The `DetailPage` component resolves the image source using the nullish coalescing operator:

```typescript
const headerLogoSrc = entry.logoHeader ?? entry.logo;
```

If the `logoHeader` file fails to load (e.g., a 404 error), the `FallbackImage` component gracefully degrades to rendering the brand's `name` as text.

### Security Posture

The Dockerfile uses `nginxinc/nginx-unprivileged:stable-alpine`, running the web server as the `nginx` user rather than `root`. The `nginx.conf` is hardened with:

- `limit_req_zone` (30 req/sec) to mitigate network scanners on event Wi-Fi.

- Strict HTTP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).

- A locked-down `Content-Security-Policy` restricting all assets to `self`.

---

## Troubleshooting

### 1. The screen says "DATA AUDIT FAILED"

The `kiosk-data.json` file contains an error that violates the Zod schema. Read the error message on the screen (e.g., `[customers.0.logo] Logo must be a .png file`). Fix the JSON file and hard-refresh the browser.

### 2. The grid loads, but all logos are grey boxes with text

The JSON manifest loaded successfully, but the Nginx container cannot find the image files. Ensure that your Docker `-v` volume mount points to the correct absolute path for the `assets/` directory, and that the filenames exactly match the paths in the JSON.

### 3. The screen is completely blank

Check the browser console. If you see a CORS error or a 404 for `kiosk-data.json`, the volume mount for the JSON file failed. Verify the absolute path in your `docker run` command.

---

*A Zapp3r Open Source Project*
