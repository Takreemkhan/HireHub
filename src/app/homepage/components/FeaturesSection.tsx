// import React from 'react';
// import Icon from '@/components/ui/AppIcon';

// interface Feature {
//   icon: string;
//   title: string;
//   description: string;
//   color: string;
// }

// const FeaturesSection = () => {
//   const features: Feature[] = [
//     {
//       icon: 'MagnifyingGlassIcon',
//       title: 'Intelligent Matching',
//       description: 'AI-powered search connects you with the perfect talent or opportunities based on skills, experience, and project requirements.',
//       color: 'text-brand-blue',
//     },
//     {
//       icon: 'ShieldCheckIcon',
//       title: 'Secure Payments',
//       description: 'Escrow system protects both parties with milestone-based payments, automated invoicing, and dispute resolution.',
//       color: 'text-success',
//     },
//     {
//       icon: 'ChatBubbleLeftRightIcon',
//       title: 'Real-Time Collaboration',
//       description: 'Integrated workspace with messaging, file sharing, time tracking, and project management tools for seamless teamwork.',
//       color: 'text-accent',
//     },
//     {
//       icon: 'AcademicCapIcon',
//       title: 'Skill Verification',
//       description: 'Comprehensive assessment system validates expertise, building trust and helping professionals stand out from the competition.',
//       color: 'text-warning',
//     },
//     {
//       icon: 'ChartBarIcon',
//       title: 'Analytics Dashboard',
//       description: 'Track performance metrics, earnings, project success rates, and business intelligence to optimize your growth strategy.',
//       color: 'text-brand-blue',
//     },
//     {
//       icon: 'UserGroupIcon',
//       title: 'Community Support',
//       description: 'Access knowledge sharing forums, networking opportunities, peer mentorship, and industry insights from experienced professionals.',
//       color: 'text-success',
//     },
//   ];

//   return (
//     <section className="bg-background py-16 lg:py-24">
//       <div className="max-w-7xl mx-auto px-4 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
//             Everything You Need to Succeed
//           </h2>
//           <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
//             Professional tools and features designed to help you build lasting business relationships
//           </p>
//         </div>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="bg-card rounded-xl shadow-brand p-8 hover:shadow-brand-lg transition-all duration-300 hover:scale-105"
//             >
//               <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-muted mb-6 ${feature.color}`}>
//                 <Icon name={feature.icon as any} size={28} />
//               </div>
//               <h3 className="text-xl font-display font-bold text-primary mb-3">{feature.title}</h3>
//               <p className="text-muted-foreground font-body leading-relaxed">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturesSection;


import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Feature {
  icon: string;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  bgColor: string;
}

const FeaturesSection = () => {
  const features: Feature[] = [
    {
      icon: 'MagnifyingGlassIcon',
      title: 'AI-Powered Matching',
      description: 'Smart algorithms connect you with perfect opportunities or talent in seconds.',
      benefits: ['Skill-based matching', 'Project compatibility', 'Success prediction'],
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
    },
    {
      icon: 'ShieldCheckIcon',
      title: 'Secure Escrow System',
      description: 'Your money is protected until work is completed to your satisfaction.',
      benefits: ['Milestone payments', 'Dispute resolution', 'Automated invoicing'],
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: 'ChatBubbleLeftRightIcon',
      title: 'Integrated Workspace',
      description: 'Everything you need in one place - messaging, files, and time tracking.',
      benefits: ['Real-time chat', 'File sharing', 'Time tracking'],
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: 'AcademicCapIcon',
      title: 'Verified Skills',
      description: 'Showcase your expertise with our comprehensive skill assessment system.',
      benefits: ['Skill tests', 'Portfolio review', 'Client ratings'],
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: 'ChartBarIcon',
      title: 'Advanced Analytics',
      description: 'Data-driven insights to optimize your earnings and project success rate.',
      benefits: ['Earnings tracking', 'Performance metrics', 'Market insights'],
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
    },
    {
      icon: 'UserGroupIcon',
      title: 'Thriving Community',
      description: 'Connect with fellow professionals, share knowledge, and grow together.',
      benefits: ['Networking events', 'Forums & groups', 'Mentorship programs'],
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <section className="bg-background py-20 lg:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, #1B365D 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full text-accent mb-6">
            <Icon name="SparklesIcon" size={20} />
            <span className="text-sm font-body font-semibold">Platform Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-6">
            Everything You Need to{' '}
            <span className="text-accent">Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto leading-relaxed">
            Professional tools and features designed to help you build lasting business relationships and achieve your goals
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl shadow-brand p-8 hover:shadow-brand-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-border relative overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={feature.icon as any} size={32} className={feature.color} />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-display font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                {/* Benefits List */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-foreground font-body">
                      <div className={`w-1.5 h-1.5 rounded-full ${feature.color.replace('text-', 'bg-')}`}></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <div className="mt-6 flex items-center space-x-2 text-accent font-body font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Learn more</span>
                  <Icon name="ArrowRightIcon" size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground font-body mb-6">
            Want to see all features in action?
          </p>
          <button className="group inline-flex items-center space-x-2 px-8 py-4 bg-primary text-white rounded-xl font-display font-semibold text-lg shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:scale-105">
            <span>Start Free Trial</span>
            <Icon name="ArrowRightIcon" size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;