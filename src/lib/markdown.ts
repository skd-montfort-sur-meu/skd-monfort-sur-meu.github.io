import { marked } from 'marked';

marked.use({ mangle: false, headerIds: false });

export function md(source: string): string {
  return marked.parse(source);
}

export function mdInline(source: string): string {
  return marked.parseInline(source);
}