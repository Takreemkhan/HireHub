import React from 'react';
import AboutPageInteractive from './components/AboutPageInteractive';
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

export const metadata = {
  title: 'About Us - FreelanceHub Pro',
  description: 'Discover what makes FreelanceHub Pro different from other freelancing platforms. Quality over quantity, verified professionals, and secure payments.',
};

export default function AboutPage() {
  return (
    <>
    <Header/>
    <AboutPageInteractive />;
    <FooterSection/>
    </>
  )
  
}