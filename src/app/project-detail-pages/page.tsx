import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProjectDetailInteractive from './components/ProjectDetailInteractive';

export const metadata: Metadata = {
  title: 'Project Details - FreelanceHub Pro',
  description:
    'View comprehensive project details including requirements, budget, client information, and market rate comparisons. Submit your proposal and start your next freelance opportunity.',
};

function ProjectDetailFallback() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-96 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<ProjectDetailFallback />}>
        <ProjectDetailInteractive />
      </Suspense>
    </>
  );
}