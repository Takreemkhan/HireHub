import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HomepageInteractive from './components/HomepageInteractive';

export const metadata: Metadata = {
  title: 'Homepage - FreelanceHub Pro',
  description: 'Where talent meets opportunity. Professional freelancing platform connecting businesses with skilled freelancers through intelligent matching, secure payments, and seamless collaboration tools.',
};

export default function Homepage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HomepageInteractive />
      </main>
    </>
  );
}