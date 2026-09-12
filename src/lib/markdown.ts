import { marked } from 'marked';

const SYNC_OPTIONS = { async: false } as const;

marked.use({ ...SYNC_OPTIONS });

export function md(source: string): string {
  return marked.parse(source, SYNC_OPTIONS);
}

export function mdInline(source: string): string {
  return marked.parseInline(source, SYNC_OPTIONS);
}