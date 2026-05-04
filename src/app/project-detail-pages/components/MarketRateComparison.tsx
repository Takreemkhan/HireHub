// import React from 'react';
// import Icon from '@/components/ui/AppIcon';

// interface MarketRateComparisonProps {
//   projectBudget: number;
//   marketAverage: number;
//   marketLow: number;
//   marketHigh: number;
// }

// const MarketRateComparison = ({
//   projectBudget,
//   marketAverage,
//   marketLow,
//   marketHigh,
// }: MarketRateComparisonProps) => {
//   const budgetPosition = ((projectBudget - marketLow) / (marketHigh - marketLow)) * 100;
//   const isCompetitive = projectBudget >= marketAverage;

//   return (
//     <div className="bg-card rounded-lg shadow-brand p-6 mb-6">
//       <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center">
//         <Icon name="ChartBarIcon" size={20} className="mr-2 text-primary" />
//         Market Rate Comparison
//       </h3>

//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm text-muted-foreground">Market Range</span>
//           <span className="text-sm font-medium text-foreground">
//             ${marketLow.toLocaleString()} - ${marketHigh.toLocaleString()}
//           </span>
//         </div>
//         <div className="relative h-3 bg-muted rounded-full overflow-hidden">
//           <div
//             className="absolute h-full bg-gradient-to-r from-brand-coral via-accent to-brand-green"
//             style={{ width: '100%' }}
//           />
//           <div
//             className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-foreground rounded-full shadow-md"
//             style={{ left: `${budgetPosition}%` }}
//           />
//         </div>
//         <div className="flex items-center justify-between mt-2">
//           <span className="text-xs text-muted-foreground">Low</span>
//           <span className="text-xs text-muted-foreground">Average</span>
//           <span className="text-xs text-muted-foreground">High</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <div className="text-center p-3 bg-muted rounded-lg">
//           <p className="text-xs text-muted-foreground mb-1">Market Low</p>
//           <p className="font-semibold text-foreground">${marketLow.toLocaleString()}</p>
//         </div>
//         <div className="text-center p-3 bg-primary/10 rounded-lg">
//           <p className="text-xs text-muted-foreground mb-1">Market Average</p>
//           <p className="font-semibold text-primary">${marketAverage.toLocaleString()}</p>
//         </div>
//         <div className="text-center p-3 bg-muted rounded-lg">
//           <p className="text-xs text-muted-foreground mb-1">Market High</p>
//           <p className="font-semibold text-foreground">${marketHigh.toLocaleString()}</p>
//         </div>
//       </div>

//       <div
//         className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
//           isCompetitive ? 'bg-brand-green/10' : 'bg-accent/10'
//         }`}
//       >
//         <Icon
//           name={isCompetitive ? 'CheckCircleIcon' : 'InformationCircleIcon'}
//           size={20}
//           className={isCompetitive ? 'text-brand-green' : 'text-accent'}
//         />
//         <div>
//           <p className="font-medium text-foreground mb-1">
//             {isCompetitive ? 'Competitive Budget' : 'Below Average Budget'}
//           </p>
//           <p className="text-sm text-muted-foreground">
//             {isCompetitive
//               ? 'This project budget is at or above market average, likely to attract quality proposals.' :'This project budget is below market average. Consider adjusting expectations or budget.'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarketRateComparison;