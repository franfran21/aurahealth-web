import React, { useState } from 'react';
import { api } from '../api/client';
import CycleLogForm from '../components/cyclelog/CycleLogForm';

export const CycleLogPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLogSubmit = async (payload) => {
    setLoading(true);
    try {
      await api.post('/cycle/log', payload);
      return true;
    } catch (err) {
      console.error('Error logging cycle data:', err);
      alert('No se pudo guardar la información del diario. Intenta de nuevo.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-text-primary">
          Registrar en mi Diario
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
          Alimenta la base de conocimientos de Luna registrando tus síntomas, dolores y estado de ánimo diarios.
        </p>
      </div>

      <CycleLogForm onSubmit={handleLogSubmit} loading={loading} />
    </div>
  );
};

export default CycleLogPage;
