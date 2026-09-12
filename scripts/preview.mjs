import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.PORT ?? 4321);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json',
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`);
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^([^.]+)$/, '$1/');
  if (path.endsWith('/')) path += 'index.html';
  const file = join(root, path);
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not Found');
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
}).listen(port, () => {
  console.log(`Preview running at http://localhost:${port}`);
});