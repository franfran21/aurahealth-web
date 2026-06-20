import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const FertilityChart = ({ currentDay = 1 }) => {
  // Generate curve peaking on day 14 (ovulation)
  const chartData = Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    let probability = 5;
    
    if (day >= 10 && day <= 16) {
      const dist = Math.abs(day - 14);
      probability = 95 - dist * 22; // Day 14: 95%, Day 13/15: 73%, Day 12/16: 51%, Day 11/17: 29%
    } else if (day >= 7 && day <= 9) {
      probability = 12;
    } else if (day >= 17 && day <= 21) {
      probability = 18 - (day - 17) * 3;
    }
    
    return {
      day: day,
      label: `Día ${day}`,
      'Probabilidad (%)': probability,
      'Día Actual': day === currentDay ? probability : null,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-accent-pink/15 rounded-xl shadow-md text-xs">
          <p className="font-bold text-text-primary mb-1">Día {payload[0].payload.day} del Ciclo</p>
          <p className="text-brand-primary font-semibold">
            Probabilidad: {payload[0].value}%
          </p>
          {payload[0].payload.day === currentDay && (
            <p className="text-xs text-accent-purple font-medium mt-1">📌 Estás aquí hoy</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorFertility" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B2252" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#8B2252" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="day" 
            stroke="#7A4A5A" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickCount={7}
          />
          <YAxis 
            stroke="#7A4A5A" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="Probabilidad (%)" 
            stroke="#8B2252" 
            strokeWidth={2.5} 
            fillOpacity={1} 
            fill="url(#colorFertility)" 
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between items-center text-[10px] text-text-secondary/60 mt-2 px-6">
        <span>Menstruación (Día 1-5)</span>
        <span className="text-[#C0527A] font-semibold">Fértil / Ovulación (Día 11-16)</span>
        <span>Lútea (Día 17-28)</span>
      </div>
    </div>
  );
};

export default FertilityChart;
