import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface ClientInfoProps {
  name: string;
  avatar: string;
  avatarAlt: string;
  location: string;
  memberSince: string;
  totalSpent: string;
  projectsPosted: number;
  hireRate: number;
  rating: number;
  reviews: number;
  verificationBadges: string[];
}

const ClientInfo = ({
  name,
  avatar,
  avatarAlt,
  location,
  memberSince,
  totalSpent,
  projectsPosted,
  hireRate,
  rating,
  reviews,
  verificationBadges,
}: ClientInfoProps) => {
  return (
    <div className="bg-card rounded-lg shadow-brand p-6 mb-6">
      <h2 className="text-2xl font-display font-bold text-foreground mb-4">
        About the Client
      </h2>

      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <AppImage
            src={avatar}
            alt={avatarAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-display font-semibold text-foreground mb-1">
            {name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Icon name="MapPinIcon" size={16} />
            <span>{location}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {verificationBadges.map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-brand-green/10 text-brand-green"
              >
                <Icon name="CheckBadgeIcon" size={14} className="mr-1" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Member Since</p>
          <p className="font-semibold text-foreground">{memberSince}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
          <p className="font-semibold text-foreground">{totalSpent}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Projects Posted</p>
          <p className="font-semibold text-foreground">{projectsPosted}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Hire Rate</p>
          <p className="font-semibold text-foreground">{hireRate}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="StarIcon"
                size={18}
                variant={index < Math.floor(rating) ? 'solid' : 'outline'}
                className={
                  index < Math.floor(rating) ? 'text-accent' : 'text-muted-foreground'
                }
              />
            ))}
          </div>
          <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {reviews} {reviews === 1 ? 'review' : 'reviews'}
        </span>
      </div>
    </div>
  );
};

export default ClientInfo;