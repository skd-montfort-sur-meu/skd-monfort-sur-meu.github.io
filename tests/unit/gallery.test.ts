import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, utimesSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { galleryPhotoNames, listGalleryPhotos } from '../../src/lib/gallery';

let dir: string | undefined;

function makeDir(): string {
  dir = mkdtempSync(join(tmpdir(), 'gallery-test-'));
  return dir;
}

afterEach(() => {
  if (dir) {
    rmSync(dir, { recursive: true, force: true });
    dir = undefined;
  }
});

describe('galleryPhotoNames', () => {
  it('sort by date prefix, newest first', () => {
    const gallery = makeDir();
    writeFileSync(join(gallery, '2026-01-01-photo.jpg'), '');
    writeFileSync(join(gallery, '2026-05-15-photo.png'), '');
    writeFileSync(join(gallery, '2026-03-03-photo.webp'), '');
    expect(galleryPhotoNames(gallery)).toEqual(['2026-05-15-photo.png', '2026-03-03-photo.webp', '2026-01-01-photo.jpg']);
  });

  it('ignore non-image files', () => {
    const gallery = makeDir();
    writeFileSync(join(gallery, 'photo.jpg'), '');
    writeFileSync(join(gallery, 'notes.txt'), '');
    writeFileSync(join(gallery, 'archive.zip'), '');
    expect(galleryPhotoNames(gallery)).toEqual(['photo.jpg']);
  });

  it('fall back to file mtime when there is no date prefix', () => {
    const gallery = makeDir();
    mkdirSync(join(gallery, 'sub'), { recursive: true });
    const a = join(gallery, 'ancienne.jpg');
    const b = join(gallery, 'recente.jpg');
    writeFileSync(a, '');
    writeFileSync(b, '');
    utimesSync(a, new Date('2026-01-01'), new Date('2026-01-01'));
    utimesSync(b, new Date('2026-06-01'), new Date('2026-06-01'));
    expect(galleryPhotoNames(gallery)).toEqual(['recente.jpg', 'ancienne.jpg']);
  });
});

describe('listGalleryPhotos', () => {
  it('prefer the photos.json manifest', () => {
    const gallery = makeDir();
    writeFileSync(join(gallery, '2026-01-01-x.jpg'), '');
    writeFileSync(
      join(gallery, 'photos.json'),
      JSON.stringify([{ src: '/foo/a.jpg' }, { src: 'foo/b.jpg' }]),
    );
    expect(listGalleryPhotos(gallery, '/')).toEqual([
      { src: '/foo/a.jpg', alt: 'Photo du club' },
      { src: '/foo/b.jpg', alt: 'Photo du club' },
    ]);
  });

  it('fall back to directory scan when manifest is invalid', () => {
    const gallery = makeDir();
    writeFileSync(join(gallery, 'photo.jpg'), '');
    writeFileSync(join(gallery, 'photos.json'), '{ pas du json');
    expect(listGalleryPhotos(gallery, '/base/')).toEqual([
      { src: '/base/images/gallery/photo.jpg', alt: 'Photo du club' },
    ]);
  });

  it('scan the directory when there is no manifest', () => {
    const gallery = makeDir();
    writeFileSync(join(gallery, 'z.jpg'), '');
    writeFileSync(join(gallery, 'a.png'), '');
    utimesSync(join(gallery, 'z.jpg'), new Date('2026-01-01'), new Date('2026-01-01'));
    utimesSync(join(gallery, 'a.png'), new Date('2026-02-01'), new Date('2026-02-01'));
    expect(listGalleryPhotos(gallery, '')).toEqual([
      { src: 'images/gallery/a.png', alt: 'Photo du club' },
      { src: 'images/gallery/z.jpg', alt: 'Photo du club' },
    ]);
  });
});