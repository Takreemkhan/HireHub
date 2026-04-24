'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  alt: string;
  rating: number;
  text: string;
  projectType: string;
}

const TestimonialCarousel = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Marketing Director',
    company: 'TechVision Inc.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_18d07eb19-1763299289544.png",
    alt: 'Professional woman with blonde hair in navy blazer smiling confidently in modern office',
    rating: 5,
    text: 'FreelanceHub Pro transformed how we find talent. Within 48 hours, we connected with a designer who perfectly understood our brand vision. The project management tools made collaboration seamless, and the quality exceeded our expectations.',
    projectType: 'Brand Design'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Full-Stack Developer',
    company: 'Independent Freelancer',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fafcb5e1-1763294038476.png",
    alt: 'Asian man with glasses and casual shirt working on laptop in bright workspace',
    rating: 5,
    text: 'As a freelancer, this platform has been a game-changer. The intelligent matching system connects me with clients who value quality work. I\'ve built long-term relationships and grown my income by 300% in just one year.',
    projectType: 'Web Development'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Founder & CEO',
    company: 'GreenLeaf Startups',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_10bbbf135-1763294543564.png",
    alt: 'Hispanic woman with brown hair in professional attire smiling warmly in corporate setting',
    rating: 5,
    text: 'The escrow system and milestone-based payments gave us confidence to work with international talent. We\'ve completed 15 projects with zero payment disputes. The platform\'s transparency is unmatched.',
    projectType: 'Content Strategy'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Senior Copywriter',
    company: 'WordCraft Agency',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ddf71bff-1763295438197.png",
    alt: 'Middle-aged man with beard in casual blue shirt smiling in creative studio environment',
    rating: 5,
    text: 'The skill verification system helped me stand out from the competition. Clients trust my expertise before we even connect. The platform\'s focus on quality over quantity means I work with serious businesses who respect professional rates.',
    projectType: 'Content Writing'
  }];


  const handlePrevious = () => {
    if (!isHydrated) return;
    setCurrentIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
  };

  const handleNext = () => {
    if (!isHydrated) return;
    setCurrentIndex((prev) => prev === testimonials.length - 1 ? 0 : prev + 1);
  };

  const handleDotClick = (index: number) => {
    if (!isHydrated) return;
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="bg-card py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
            Success Stories from Our Community
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Real experiences from freelancers and clients building meaningful professional relationships
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-muted rounded-2xl shadow-brand-lg p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-brand">
                  <AppImage
                    src={currentTestimonial.image}
                    alt={currentTestimonial.alt}
                    className="w-full h-full object-cover" />

                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) =>
                  <Icon key={i} name="StarIcon" size={24} className="text-warning" variant="solid" />
                  )}
                </div>

                <p className="text-lg text-foreground font-body mb-6 leading-relaxed">
                  "{currentTestimonial.text}"
                </p>

                <div className="space-y-2">
                  <p className="text-xl font-display font-bold text-primary">{currentTestimonial.name}</p>
                  <p className="text-sm text-muted-foreground font-body">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </p>
                  <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                    <Icon name="BriefcaseIcon" size={16} className="text-primary" />
                    <span className="text-sm font-body text-primary">{currentTestimonial.projectType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrevious}
            disabled={!isHydrated}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 bg-card rounded-full shadow-brand hover:shadow-brand-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Previous testimonial">

            <Icon name="ChevronLeftIcon" size={24} className="text-primary" />
          </button>

          <button
            onClick={handleNext}
            disabled={!isHydrated}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 bg-card rounded-full shadow-brand hover:shadow-brand-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial">

            <Icon name="ChevronRightIcon" size={24} className="text-primary" />
          </button>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) =>
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              disabled={!isHydrated}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-primary w-8' : 'bg-border hover:bg-primary/50'}`
              }
              aria-label={`Go to testimonial ${index + 1}`} />

            )}
          </div>
        </div>
      </div>
    </section>);

};

export default TestimonialCarousel;