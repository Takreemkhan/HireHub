import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import FooterSection from "@/app/homepage/components/FooterSection";
import SearchInteractive from './components/SearchInteractive';

export const metadata: Metadata = {
  title: 'Search & Discovery - FreelanceHub Pro',
  description: 'Find the perfect freelance talent or projects with our advanced search and filtering system. Discover skilled professionals and opportunities that match your exact needs.',
};

export default function SearchAndDiscoveryPage() {

  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          </div>
        </div>
      }>
        <SearchInteractive />
      </Suspense>
      <FooterSection />
    </>
  );
}



