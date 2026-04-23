export default async function handler(req: any, res: any) {
  const pathParam = req.query?.path;
  const segments = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : [];
  const pathname = segments.join('/');
  const target = new URL(`https://newsapi.org/v2/${pathname}`);

  const entries = Object.entries(req.query ?? {});
  for (const [key, value] of entries) {
    if (key === 'path') continue;
    if (Array.isArray(value)) {
      value.forEach((v) => target.searchParams.append(key, String(v)));
    } else if (value !== undefined) {
      target.searchParams.set(key, String(value));
    }
  }

  if (!target.searchParams.get('apiKey')) {
    const env = (globalThis as any)?.process?.env as Record<string, string | undefined> | undefined;
    const serverKey = env?.NEWS_API_KEY ?? env?.VITE_NEWS_API_KEY;
    if (serverKey) {
      target.searchParams.set('apiKey', serverKey);
    }
  }

  if (!target.searchParams.get('apiKey')) {
    res.status(400).json({ status: 'error', code: 'api_key_missing', message: 'Missing NewsAPI key.' });
    return;
  }

  try {
    const upstream = await fetch(target.toString(), {
      method: req.method,
      headers: { Accept: 'application/json' },
    });
    const contentType = upstream.headers.get('content-type') ?? 'application/json';
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader('content-type', contentType);
    res.send(body);
  } catch {
    res.status(502).json({ status: 'error', code: 'proxy_failed', message: 'News proxy failed.' });
  }
}
