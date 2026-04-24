
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import FooterSection from "@/app/homepage/components/FooterSection";
import SearchInteractive from './components/SearchInteractive';

export const metadata: Metadata = {
  title: 'Search & Discovery - FreelanceHub Pro',
  description: 'Find the perfect freelance talent or projects with our advanced search and filtering system. Discover skilled professionals and opportunities that match your exact needs.',
};

import { Suspense } from 'react';

export default function SearchAndDiscoveryPage() {

  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchInteractive />
      </Suspense>
      <FooterSection />
    </>
  );
}



