import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const IMAGE_EXT = /\.(jpg|jpeg|png|webp)$/i;

export interface Photo {
  src: string;
  alt: string;
}

export function galleryPhotoNames(dir: string): string[] {
  const files = readdirSync(dir).filter((f) => IMAGE_EXT.test(f));
  return files
    .map((name) => {
      const match = name.match(/^(\d{4}-\d{2}-\d{2})/);
      const date = match
        ? new Date(`${match[1]}T00:00:00`).getTime()
        : statSync(join(dir, name)).mtimeMs;
      return { name, date };
    })
    .sort((a, b) => b.date - a.date)
    .map((f) => f.name);
}

export function listGalleryPhotos(dir: string, base: string): Photo[] {
  const manifestFile = join(dir, 'photos.json');
  if (existsSync(manifestFile)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestFile, 'utf-8')) as unknown;
      if (Array.isArray(manifest) && manifest.length > 0) {
        return manifest.map((p) => ({
          src: `${base}${String((p as { src?: string }).src ?? '').replace(/^\//, '')}`,
          alt: 'Photo du club',
        }));
      }
    } catch {
      // manifest invalide : on retombe sur le scan du dossier
    }
  }
  return galleryPhotoNames(dir).map((f) => ({
    src: `${base}images/gallery/${f}`,
    alt: 'Photo du club',
  }));
}