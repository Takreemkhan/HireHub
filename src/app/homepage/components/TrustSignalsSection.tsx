import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface TrustSignal {
  type: 'certification' | 'media' | 'partner';
  name: string;
  logo: string;
  alt: string;
  description: string;
}

const TrustSignalsSection = () => {
  const certifications: TrustSignal[] = [
  {
    type: 'certification',
    name: 'SOC 2 Type II',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1a8098a6b-1764655584180.png",
    alt: 'SOC 2 Type II security compliance certification badge with shield icon',
    description: 'Enterprise-grade security'
  },
  {
    type: 'certification',
    name: 'PCI DSS',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1d75ffa79-1764669838610.png",
    alt: 'PCI DSS payment card industry data security standard certification badge',
    description: 'Secure payment processing'
  },
  {
    type: 'certification',
    name: 'GDPR Compliant',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1803b52d2-1764669839249.png",
    alt: 'GDPR General Data Protection Regulation compliance badge with EU flag colors',
    description: 'Data privacy protection'
  }];


  const mediaLogos: TrustSignal[] = [
  {
    type: 'media',
    name: 'TechCrunch',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_189bc26c4-1764668471132.png",
    alt: 'TechCrunch technology news publication logo on digital screen',
    description: 'Featured in TechCrunch'
  },
  {
    type: 'media',
    name: 'Forbes',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1283dd3e8-1764668469036.png",
    alt: 'Forbes business magazine logo displayed on tablet device',
    description: 'Recognized by Forbes'
  },
  {
    type: 'media',
    name: 'Entrepreneur',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1541be473-1767335219243.png",
    alt: 'Entrepreneur magazine logo with business and startup theme',
    description: 'Featured in Entrepreneur'
  }];


  const partners: TrustSignal[] = [
  {
    type: 'partner',
    name: 'Stripe',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_18c3e74f1-1764661523111.png",
    alt: 'Stripe payment processing platform logo with purple gradient',
    description: 'Payment partner'
  },
  {
    type: 'partner',
    name: 'AWS',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1178818da-1764664281728.png",
    alt: 'Amazon Web Services AWS cloud computing logo with orange color',
    description: 'Cloud infrastructure'
  },
  {
    type: 'partner',
    name: 'Slack',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_103aa447c-1764658017289.png",
    alt: 'Slack team collaboration platform logo with colorful hashtag symbol',
    description: 'Integration partner'
  }];


  return (
    <section className="bg-card py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
            Trusted & Recognized Globally
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Industry-leading security, media recognition, and strategic partnerships
          </p>
        </div>

        <div className="space-y-12">
          <div>
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Icon name="ShieldCheckIcon" size={28} className="text-success" variant="solid" />
              <h3 className="text-2xl font-display font-bold text-primary">Security Certifications</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {certifications.map((cert, index) =>
              <div
                key={index}
                className="bg-muted rounded-xl p-6 text-center hover:shadow-brand transition-all duration-300">

                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                    <AppImage
                    src={cert.logo}
                    alt={cert.alt}
                    className="w-full h-full object-cover" />

                  </div>
                  <p className="font-display font-bold text-primary mb-1">{cert.name}</p>
                  <p className="text-sm text-muted-foreground font-body">{cert.description}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Icon name="NewspaperIcon" size={28} className="text-brand-blue" variant="solid" />
              <h3 className="text-2xl font-display font-bold text-primary">Media Recognition</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {mediaLogos.map((media, index) =>
              <div
                key={index}
                className="bg-muted rounded-xl p-6 text-center hover:shadow-brand transition-all duration-300">

                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                    <AppImage
                    src={media.logo}
                    alt={media.alt}
                    className="w-full h-full object-cover" />

                  </div>
                  <p className="font-display font-bold text-primary mb-1">{media.name}</p>
                  <p className="text-sm text-muted-foreground font-body">{media.description}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Icon name="BuildingOfficeIcon" size={28} className="text-accent" variant="solid" />
              <h3 className="text-2xl font-display font-bold text-primary">Strategic Partners</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {partners.map((partner, index) =>
              <div
                key={index}
                className="bg-muted rounded-xl p-6 text-center hover:shadow-brand transition-all duration-300">

                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                    <AppImage
                    src={partner.logo}
                    alt={partner.alt}
                    className="w-full h-full object-cover" />

                  </div>
                  <p className="font-display font-bold text-primary mb-1">{partner.name}</p>
                  <p className="text-sm text-muted-foreground font-body">{partner.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default TrustSignalsSection;