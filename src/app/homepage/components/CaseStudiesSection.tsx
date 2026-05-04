import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface CaseStudy {
  id: number;
  title: string;
  client: string;
  category: string;
  image: string;
  alt: string;
  outcome: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

const CaseStudiesSection = () => {
  const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: 'E-Commerce Platform Redesign',
    client: 'RetailPro Solutions',
    category: 'UI/UX Design',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eb7c1cb3-1764655134961.png",
    alt: 'Modern e-commerce website interface displayed on laptop screen with shopping cart and product images',
    outcome: 'Complete platform redesign that improved user experience and increased conversion rates significantly.',
    metrics: [
    { label: 'Conversion Rate', value: '+45%' },
    { label: 'User Engagement', value: '+60%' },
    { label: 'Project Duration', value: '8 weeks' }]

  },
  {
    id: 2,
    title: 'Mobile App Development',
    client: 'HealthTrack Wellness',
    category: 'App Development',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f9e0c16d-1764676756614.png",
    alt: 'Smartphone displaying colorful health tracking mobile application with fitness metrics and graphs',
    outcome: 'Cross-platform mobile application with real-time health tracking and personalized wellness recommendations.',
    metrics: [
    { label: 'App Downloads', value: '50K+' },
    { label: 'User Rating', value: '4.8/5' },
    { label: 'Team Size', value: '4 developers' }]

  },
  {
    id: 3,
    title: 'Content Marketing Campaign',
    client: 'GreenTech Innovations',
    category: 'Content Strategy',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_162fe9d1a-1766842679716.png",
    alt: 'Marketing strategy documents and charts spread on desk with coffee cup and digital tablet',
    outcome: 'Comprehensive content strategy that established brand authority and generated qualified leads consistently.',
    metrics: [
    { label: 'Lead Generation', value: '+200%' },
    { label: 'Organic Traffic', value: '+150%' },
    { label: 'Content Pieces', value: '50+' }]

  }];


  return (
    <section className="bg-muted py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
            Real Projects, Measurable Results
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            In-depth case studies showcasing successful collaborations with measurable outcomes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {caseStudies.map((study) =>
          <div
            key={study.id}
            className="bg-card rounded-xl shadow-brand overflow-hidden hover:shadow-brand-lg transition-all duration-300 hover:scale-105">

              <div className="relative h-48 overflow-hidden">
                <AppImage
                src={study.image}
                alt={study.alt}
                className="w-full h-full object-cover" />

                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center space-x-2 bg-card px-3 py-1 rounded-full text-sm font-body font-medium text-primary">
                    <Icon name="BriefcaseIcon" size={16} />
                    <span>{study.category}</span>
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-primary mb-2">{study.title}</h3>
                  <p className="text-sm text-muted-foreground font-body">{study.client}</p>
                </div>

                <p className="text-foreground font-body leading-relaxed">{study.outcome}</p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  {study.metrics.map((metric, index) =>
                <div key={index} className="text-center">
                      <p className="text-2xl font-display font-bold text-primary mb-1">{metric.value}</p>
                      <p className="text-xs text-muted-foreground font-body">{metric.label}</p>
                    </div>
                )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default CaseStudiesSection;