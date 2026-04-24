import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import FooterSection from "@/app/homepage/components/FooterSection";
import WorkspaceDashboardInteractive from './components/WorkspaceDashboardInteractive';

export const metadata: Metadata = {
  title: 'Workspace Dashboard - FreelanceHub Pro',
  description: 'Mission control for active projects with communication tools, progress tracking, time management, and earnings overview. Manage your freelance workspace efficiently.',
};

export default function WorkspaceDashboardPage() {
  return (
    <>
      <Header />
      <WorkspaceDashboardInteractive />
      <FooterSection/>
    </>
  );
}