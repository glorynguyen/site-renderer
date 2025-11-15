import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageRenderer from '@/components/PageRenderer';
import { getSiteByDomain, SiteData } from '@/lib/api';
import { extractStyles } from '@/lib/styleExtractor';

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

// --- Helper to get page data ---
async function getPageData(slug: string) {
  const site: SiteData = await getSiteByDomain(process.env.SITE_DOMAIN as string);
  
  if (!site) return null;
  
  const page = site.pages?.find(
    (p: PageData) => p.slug === slug || (p.isHomepage && slug === '/')
  );
  
  return { site, page };
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

// --- Metadata generation for SEO and Styles ---
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug.join('/')}` : '/';

  try {
    const data = await getPageData(slug);
    
    if (!data?.page || !data?.site) {
      return {
        title: 'Page Not Found',
      };
    }
    
    const { page, site } = data;
    
    // Extract all styles from the page config
    const styles = extractStyles(page.config);
    const styleStrings = Array.from(styles.entries()).map(([id, content]) => ({
      id,
      content,
    }));

    return {
      title: page?.name ? `${page.name} - ${site.name}` : site.name,
      description: page?.seo?.description || `${page?.name} - ${site.name}`,
      keywords: page?.seo?.keywords?.join(', ') || '',
      // Note: Next.js doesn't support injecting arbitrary HTML in metadata
      // We'll handle styles in the page component instead
      other: {
        'x-page-styles': JSON.stringify(styleStrings), // Store for reference
      },
    };
  } catch (error) {
    return {
      title: 'Page Not Found',
    };
  }
}

// --- Page Component ---
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug.join('/')}` : '/';

  try {
    const data = await getPageData(slug);
    
    if (!data?.page || !data?.site) {
      notFound();
    }
    
    const { page, site } = data;

    // Extract styles at build/render time
    const styles = extractStyles(page.config);
    
    return (
      <>
        {/* Inject critical CSS styles in the document head via style tags */}
        {Array.from(styles.entries()).map(([id, content]) => (
          <style 
            key={id} 
            id={id}
            // Suppress hydration warning since these are SSR-only
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        ))}
        
        <PageRenderer page={page} site={site} />
      </>
    );
  } catch (error) {
    console.error('Error loading page:', error);
    notFound();
  }
}