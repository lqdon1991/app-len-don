export function toYoutubeEmbedUrl(inputUrl: string): string | null {
  try {
    const url = new URL(inputUrl);
    const host = url.hostname.replace('www.', '');

    // youtu.be/<id>
    if (host === 'youtu.be') {
      const id = url.pathname.replace('/', '').trim();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    // youtube.com/watch?v=<id>
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }

    // /embed/<id>, /shorts/<id>
    const parts = url.pathname.split('/').filter(Boolean);
    const idx = parts.findIndex(p => p === 'embed' || p === 'shorts');
    if (idx >= 0 && parts[idx + 1]) {
      return `https://www.youtube.com/embed/${parts[idx + 1]}`;
    }

    return null;
  } catch {
    return null;
  }
}

