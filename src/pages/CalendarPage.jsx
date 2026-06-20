import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api/client';
import CycleCalendar from '../components/calendar/CycleCalendar';
import DayDetail from '../components/calendar/DayDetail';
import Spinner from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { Calendar, PlusCircle, AlertCircle } from 'lucide-react';

export const CalendarPage = () => {
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [daysData, setDaysData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userCycle, setUserCycle] = useState(null);

  // Generate fallback calendar local values if remote call fails or is empty
  const generateLocalFallback = useCallback((cycleContext) => {
    const days = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const lastPeriod = cycleContext?.lastPeriodDate ? new Date(cycleContext.lastPeriodDate) : null;
    const avgCycle = cycleContext?.avgCycleLength || 28;
    const avgPeriod = cycleContext?.avgPeriodLength || 5;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dDate = new Date(currentYear, currentMonth, d);
      dDate.setHours(0, 0, 0, 0);

      let phase = 'normal';
      let isPeriod = false;
      let isFertile = false;
      let isOvulation = false;

      if (lastPeriod) {
        lastPeriod.setHours(0, 0, 0, 0);
        const diffTime = dDate.getTime() - lastPeriod.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        let cycleDay = 1;
        if (diffDays >= 1) {
          cycleDay = ((diffDays - 1) % avgCycle) + 1;
        } else {
          cycleDay = avgCycle + (diffDays % avgCycle);
        }

        if (cycleDay >= 1 && cycleDay <= avgPeriod) {
          phase = 'menstruacion';
          isPeriod = true;
        } else if (cycleDay >= 11 && cycleDay <= 16) {
          isFertile = true;
          if (cycleDay === avgCycle - 14) {
            phase = 'ovulacion';
            isOvulation = true;
          } else {
            phase = 'fertil';
          }
        } else if (cycleDay > avgCycle - 7 && cycleDay <= avgCycle) {
          phase = 'lutea';
        } else {
          phase = 'folicular';
        }
      } else {
        const dayOfCycle = d % 28;
        phase = dayOfCycle <= 5 ? 'menstruacion' : dayOfCycle <= 13 ? 'folicular' : dayOfCycle <= 16 ? 'ovulacion' : 'lutea';
        isPeriod = dayOfCycle <= 5;
        isFertile = dayOfCycle >= 11 && dayOfCycle <= 16;
        isOvulation = dayOfCycle === 14;
      }

      days.push({
        date: dateStr,
        day: d,
        phase,
        isPeriod,
        isFertile,
        isOvulation,
        energy: null,
        flow: null,
        mood: null,
        symptoms: [],
        intercourse: null,
        protected: null,
        notes: null
      });
    }
    setDaysData(days);
  }, [currentYear, currentMonth]);

  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    let cycleData = userCycle;
    try {
      if (!cycleData) {
        const cycleRes = await api.get('/cycle/current');
        cycleData = cycleRes.data;
        setUserCycle(cycleData);
      }
      const res = await api.get('/cycle/calendar', {
        params: { year: currentYear, month: currentMonth + 1 },
      });
      setDaysData(res.data.days || []);
    } catch (err) {
      console.warn('Backend calendar fetch failed, generating fallback phase math', err);
      generateLocalFallback(cycleData);
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth, userCycle, generateLocalFallback]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleSaveDayLog = async (formData) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    setSaving(true);
    try {
      await api.post('/cycle/day', {
        date: dateStr,
        ...formData,
      });
      await fetchCalendarData();
      return true;
    } catch (err) {
      alert('No se pudo guardar la información del día. Intenta de nuevo.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPeriodToday = async () => {
    const todayStr = today.toISOString().split('T')[0];
    if (window.confirm('¿Deseas marcar que hoy comenzó tu menstruación?')) {
      try {
        setSaving(true);
        await api.post('/cycle/period', { date: todayStr });
        
        // Reset local cache to force cycle reload
        setUserCycle(null);
        await fetchCalendarData();
      } catch (err) {
        alert('Error al registrar periodo.');
      } finally {
        setSaving(false);
      }
    }
  };

  const getSelectedDayData = () => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    return daysData.find((d) => d.date === dateStr);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/60">Calendario</span>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-text-primary mt-1">
            Mis Ciclos Hormonales
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Visualiza y registra síntomas por cada día del mes para calibrar las predicciones.
          </p>
        </div>

        <button
          onClick={handleMarkPeriodToday}
          className="px-6 py-3 bg-[#8B2252] hover:bg-[#a13364] text-white rounded-full font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          Empezó mi Periodo Hoy
        </button>
      </div>

      {/* Main Grid */}
      {loading && daysData.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-3">
            <CycleCalendar
              currentYear={currentYear}
              currentMonth={currentMonth}
              daysData={daysData}
              selectedDay={selectedDay}
              onDayClick={handleDaySelect}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              today={today}
            />
          </div>

          {/* Right Column - Day Details / Logger */}
          <div className="lg:col-span-2">
            <DayDetail
              day={selectedDay}
              month={currentMonth}
              year={currentYear}
              dayData={getSelectedDayData()}
              onSave={handleSaveDayLog}
              saving={saving}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
