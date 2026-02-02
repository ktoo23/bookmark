interface LinkMetadata {
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  url: string;
  screenshot?: string;
}

export async function fetchMetadata(url: string): Promise<LinkMetadata> {
  try {
    const urlObj = new URL(url);

    // Microlink API 호출
    const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }

    const { data } = await response.json();

    // 스크린샷 URL 생성
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

    return {
      url: data.url || url,
      title: data.title || urlObj.hostname,
      description: data.description || '',
      image: data.image?.url || '',
      favicon:
        data.logo?.url ||
        `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`,
      screenshot: screenshotUrl,
    };
  } catch (error) {
    console.error('Failed to fetch metadata:', error);

    try {
      const urlObj = new URL(url);
      const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

      return {
        url,
        title: urlObj.hostname,
        favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`,
        screenshot: screenshotUrl,
      };
    } catch {
      return {
        url,
        title: url,
        favicon: '',
      };
    }
  }
}
