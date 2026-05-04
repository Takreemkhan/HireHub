import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProjectDescriptionProps {
  description: string;
  skills: string[];
  deliverables: string[];
}

const ProjectDescription = ({
  description,
  skills,
  deliverables,
}: ProjectDescriptionProps) => {
  return (
    <div className="bg-card rounded-lg shadow-brand p-6 mb-6">
      <h2 className="text-2xl font-display font-bold text-foreground mb-4">
        Project Description
      </h2>
      <div className="prose max-w-none mb-6">
        <p className="text-foreground leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center">
          <Icon name="WrenchScrewdriverIcon" size={20} className="mr-2 text-primary" />
          Required Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-secondary/10 text-secondary border border-secondary/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* <div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center">
          <Icon name="CheckCircleIcon" size={20} className="mr-2 text-brand-green" />
          Key Deliverables
        </h3>
        <ul className="space-y-2">
          {deliverables.map((deliverable, index) => (
            <li key={index} className="flex items-start">
              <Icon
                name="CheckIcon"
                size={20}
                className="text-brand-green mr-2 mt-0.5 flex-shrink-0"
              />
              <span className="text-foreground">{deliverable}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default ProjectDescription;