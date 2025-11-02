export interface SiteData {
  id: string;
  domain: string;
  name?: string;
  config?: Record<string, any>;
  [key: string]: any;
}

export async function getSiteByDomain(domain: string): Promise<SiteData> {
  const apiUrl = process.env.API_URL;
  const token = process.env.API_TOKEN;

  if (!token) {
    throw new Error('API_TOKEN environment variable is not set');
  }

  try {
    const response = await fetch(`${apiUrl}/${domain}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result: {
      success: boolean;
      data?: SiteData;
      [key: string]: any;
    } = await response.json();

    if (!result.success || !result.data) {
      throw new Error('Invalid API response format');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching site data:', error);
    throw error;
  }
}
