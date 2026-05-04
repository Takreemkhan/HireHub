import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import PaymentCenterInteractive from './components/PaymentCenterInteractive';
import FooterSection from '../homepage/components/FooterSection';

export const metadata: Metadata = {
  title: 'Payment Center - FreelanceHub Pro',
  description: 'Manage your earnings, payments, withdrawals, and tax documents. Secure financial management with transparent fees, multi-currency support, and automated invoicing for freelancers.',
};

export default function PaymentCenterPage() {
  return (
    <>
      <Header />
      <PaymentCenterInteractive />
      <FooterSection/>
    </>
  );
}