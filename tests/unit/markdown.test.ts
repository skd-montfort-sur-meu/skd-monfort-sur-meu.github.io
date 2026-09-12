import { describe, expect, it } from 'vitest';
import { md, mdInline } from '../../src/lib/markdown';

describe('md', () => {
  it('render a simple paragraph', () => {
    expect(md('Du texte.')).toBe('<p>Du texte.</p>\n');
  });

  it('split paragraphs on a blank line', () => {
    expect(md('Premier **paragraphe**.\n\nSecond paragraphe.')).toBe(
      '<p>Premier <strong>paragraphe</strong>.</p>\n<p>Second paragraphe.</p>\n',
    );
  });

  it('render bold and italic', () => {
    expect(md('**Gras** et *italique*.')).toBe('<p><strong>Gras</strong> et <em>italique</em>.</p>\n');
  });

  it('not leak valid markdown markers', () => {
    const html = md('**Fondateur** et <em>kihon</em>.');
    expect(html).not.toContain('**');
    expect(html).toContain('<strong>Fondateur</strong>');
    expect(html).toContain('<em>kihon</em>');
  });

  it('handle an empty string', () => {
    expect(md('')).toBe(''); 
  });
});

describe('mdInline', () => {
  it('render without wrapping in a paragraph', () => {
    expect(mdInline('**Gras** et *italique*.')).toBe('<strong>Gras</strong> et <em>italique</em>.');
  });

  it('output inline markdown without block wrapping', () => {
    const html = mdInline('« Karaté ni sente nashi »');
    expect(html).toBe('« Karaté ni sente nashi »');
  });
});