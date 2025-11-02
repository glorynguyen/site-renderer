import { notFound } from 'next/navigation';
import PageRenderer from '@/components/PageRenderer';
import { getSiteByDomain, SiteData } from '@/lib/api';

export const revalidate = 60; // Revalidate every 60 seconds

interface PageParams {
  params: {
    slug?: string[];
  };
}

interface PageData {
  slug: string;
  name?: string;
  isHomepage?: boolean;
  seo?: {
    description?: string;
    keywords?: string[];
  };
  config?: Record<string, any>;
  [key: string]: any;
}

// --- Generate static paths for SSG ---
export async function generateStaticParams() {
  try {
    const site = await getSiteByDomain(process.env.SITE_DOMAIN as string);

    if (!site?.pages) return [];

    return site.pages.map((page: PageData) => ({
      slug: page.slug === '/' ? [] : page.slug.split('/').filter(Boolean),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// --- Page Component ---
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug.join('/')}` : '/';

  try {
    const site: SiteData = await getSiteByDomain(process.env.SITE_DOMAIN as string);

    if (!site) notFound();

    const page = site.pages?.find(
      (p: PageData) => p.slug === slug || (p.isHomepage && slug === '/')
    );

    if (!page) notFound();

    return <PageRenderer page={page} site={site} />;
  } catch (error) {
    console.error('Error loading page:', error);
    notFound();
  }
}

// --- Metadata generation for SEO ---
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug.join('/')}` : '/';

  try {
    const site: SiteData = await getSiteByDomain(process.env.SITE_DOMAIN as string);
    const page = site.pages?.find(
      (p: PageData) => p.slug === slug || (p.isHomepage && slug === '/')
    );

    return {
      title: page?.name ? `${page.name} - ${site.name}` : site.name,
      description: page?.seo?.description || `${page?.name} - ${site.name}`,
      keywords: page?.seo?.keywords?.join(', ') || '',
    };
  } catch (error) {
    return {
      title: 'Page Not Found',
    };
  }
}
