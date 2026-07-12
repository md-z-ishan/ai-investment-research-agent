import { useState } from 'react';
import { researchApi } from '../services/researchApi';

export const useResearch = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyzeCompany = async (query) => {
    setIsLoading(true);
    setError('');
    setData(null);

    try {
      const response = await researchApi.analyzeCompany(query);
      setData(response);
    } catch (err) {
      setError(err.message || 'Unable to analyze company right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, analyzeCompany };
};
