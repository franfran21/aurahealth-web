import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const PHASE_COLORS = {
  menstruacion: 'bg-[#8B2252] text-white',
  ovulacion: 'bg-[#C0527A] text-white',
  fertil: 'bg-[#F2C4D0] text-brand-primary',
  lutea: 'bg-[#534AB7] text-white',
  folicular: 'bg-[#FDFAF9] text-text-primary border border-accent-pink/15',
  normal: 'bg-white text-text-primary border border-gray-100',
};

export const PHASE_LABELS = {
  menstruacion: 'Menstruación',
  folicular: 'Fase Folicular',
  ovulacion: 'Ovulación',
  fertil: 'Ventana Fértil',
  lutea: 'Fase Lútea',
};

export const CycleCalendar = ({
  currentYear,
  currentMonth,
  daysData,
  selectedDay,
  onDayClick,
  onPrevMonth,
  onNextMonth,
  today,
}) => {
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const getDayData = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return daysData.find((d) => d.date === dateStr);
  };

  const isTodayDate = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  return (
    <div className="bg-white border border-accent-pink/10 rounded-2xl p-6 shadow-md">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-xl font-bold text-text-primary">
          {MONTHS_ES[currentMonth]} {currentYear}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-background-primary rounded-full text-brand-primary transition-colors border border-accent-pink/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-background-primary rounded-full text-brand-primary transition-colors border border-accent-pink/10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Color Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6 bg-background-primary/30 p-4 rounded-xl border border-accent-pink/10">
        {Object.entries(PHASE_LABELS).map(([key, label]) => {
          let dotColor = 'bg-[#FDFAF9] border border-accent-pink/20';
          if (key === 'menstruacion') dotColor = 'bg-[#8B2252]';
          if (key === 'ovulacion') dotColor = 'bg-[#C0527A]';
          if (key === 'fertil') dotColor = 'bg-[#F2C4D0]';
          if (key === 'lutea') dotColor = 'bg-[#534AB7]';
          
          return (
            <div key={key} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className={`w-3.5 h-3.5 rounded-full ${dotColor} flex-shrink-0 shadow-sm`} />
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Weekday Titles */}
      <div className="grid grid-cols-7 text-center gap-1 mb-2">
        {DAY_LABELS.map((lbl) => (
          <div key={lbl} className="text-xs font-semibold text-text-secondary/60 py-1">
            {lbl}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Blanks */}
        {blanks.map((b) => (
          <div key={`blank-${b}`} className="aspect-square" />
        ))}

        {/* Month Days */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const data = getDayData(day);
          const phase = data?.phase || 'normal';
          const isSelected = selectedDay === day;
          const isToday = isTodayDate(day);
          
          const phaseColorClass = PHASE_COLORS[phase] || PHASE_COLORS.normal;

          // Soften the color if not selected, and color heavily if period/ovulation
          let finalBgClass = phaseColorClass;
          if (phase === 'fertil') {
            finalBgClass = 'bg-[#F2C4D0]/50 text-brand-primary border border-accent-pink/30';
          } else if (phase === 'normal') {
            finalBgClass = 'bg-white text-text-primary hover:bg-background-primary';
          } else if (phase === 'folicular') {
            finalBgClass = 'bg-[#FDFAF9] text-text-primary border border-accent-pink/5 hover:bg-background-primary';
          }
          
          if (isSelected) {
            finalBgClass = 'bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-[1.03] z-10 border border-brand-primary';
          }

          return (
            <button
              key={day}
              onClick={() => onDayClick(day)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-between p-1.5 transition-all relative group text-sm font-semibold active:scale-95 ${finalBgClass}`}
            >
              {/* Highlight if Today */}
              {isToday && !isSelected && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-brand-primary" />
              )}
              
              <span className="m-auto">{day}</span>

              {/* Indicator dots for registered details */}
              <div className="flex gap-0.5 justify-center w-full min-h-[4px]">
                {data?.isOvulation && (
                  <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#C0527A]'}`} />
                )}
                {data?.isPeriod && (
                  <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#8B2252]'}`} />
                )}
                {data?.symptoms && data.symptoms.length > 0 && (
                  <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-success'}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CycleCalendar;
