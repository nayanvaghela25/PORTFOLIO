# Nayan Vaghela — Premium Portfolio

A responsive, data-driven portfolio for 3D art, games, and web development.

## Run locally

Open this folder in VS Code and choose **Open with Live Server** on `index.html`. A local server is required because browser security prevents JSON loading from a raw `file://` address.

## Add a 3D model

1. Put a thumbnail in `images/`.
2. Put the matching `.glb` file in `models/`.
3. Add one object to `data/models.json`:

```json
{
  "name": "Model Name",
  "category": "Character",
  "image": "images/thumbnail.jpg",
  "model": "models/model.glb",
  "rating": 5
}
```

Supported filters: Character, Weapon, Environment, Architecture, Furniture, Vehicle, and Product.

## Add a project

Add an object to `data/projects.json` using `name`, `category`, `image`, `description`, and optionally `url`. The Coming Soon display disappears automatically.

## Personalize

- Replace `nayan@example.com` and social URLs in `index.html`.
- Add `resume/resume.pdf`.
- Adjust statistics and biography in `index.html`.
- Replace the generated SVG thumbnails with optimized WebP/JPEG assets when ready.

## Structure

The project uses semantic HTML, CSS, and modern vanilla JavaScript only. Portfolio items and projects are rendered from JSON; no HTML changes are needed when adding work.
