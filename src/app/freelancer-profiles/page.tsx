import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import FooterSection from "@/app/homepage/components/FooterSection";
import FreelancerProfilesInteractive from './components/FreelancerProfilesInteractive';
import StatsBar from './components/StatsBar';

export const metadata: Metadata = {
  title: 'Freelancer Profiles - FreelanceHub Pro',
  description: 'Discover and connect with verified professional freelancers across all industries. Browse comprehensive talent profiles with portfolios, skill assessments, ratings, and availability.',
};

export default function FreelancerProfilesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <StatsBar />
        </div>
        <FreelancerProfilesInteractive />
      </main>
      <FooterSection />
    </>
  );
}