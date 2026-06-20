import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles } from 'lucide-react';

export const PredictionCard = ({ title, recommendation, badge = 'IA Predictiva' }) => {
  return (
    <Card className="relative overflow-hidden bg-white border border-accent-pink/15 shadow-sm mt-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent-pink/20 blur-2xl -mr-6 -mt-6 pointer-events-none" />
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-lg font-bold text-text-primary">
              {title}
            </h4>
          </div>
          <Badge variant="brand">{badge}</Badge>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed font-medium">
          {recommendation}
        </p>
      </div>
    </Card>
  );
};

export default PredictionCard;
