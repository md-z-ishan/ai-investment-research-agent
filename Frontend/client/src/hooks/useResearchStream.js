import { useState, useRef, useEffect } from 'react';
import { researchApi } from '../services/researchApi';

export const useResearchStream = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressLogs, setProgressLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState('');
  const eventSourceRef = useRef(null);

  const analyzeCompany = (query) => {
    const trimmedQuery = query?.trim();
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setError('Please enter a valid company name (at least 2 characters).');
      return;
    }

    setIsLoading(true);
    setError('');
    setData(null);
    setProgressLogs([]);
    setCurrentStep('');

    // Clear any existing SSE sessions
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const sseUrl = `${apiUrl}/api/research?companyName=${encodeURIComponent(trimmedQuery)}`;

    console.log(`Connecting to SSE stream: ${sseUrl}`);
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('progress', (event) => {
      try {
        const log = JSON.parse(event.data);
        setProgressLogs((prev) => {
          // Prevent duplicates by checking timestamp/message if needed, or just append
          if (prev.some(p => p.message === log.message && p.node === log.node)) {
            return prev;
          }
          return [...prev, log];
        });
        setCurrentStep(log.node);
      } catch (err) {
        console.error('Failed to parse progress log:', err);
      }
    });

    eventSource.addEventListener('complete', (event) => {
      try {
        console.log('SSE Stream Completed!');
        const payload = JSON.parse(event.data);
        const normalized = researchApi.normalizeResponse(payload, trimmedQuery);
        
        setData(normalized);
        setIsLoading(false);
        eventSource.close();
      } catch (err) {
        console.error('Failed to parse final data payload:', err);
        setError('Analysis completed but the data failed to format correctly.');
        setIsLoading(false);
        eventSource.close();
      }
    });

    eventSource.addEventListener('error', (event) => {
      console.error('EventSource error occurred:', event);
      
      // Attempt to extract specific error messages pushed from backend
      let errorMessage = 'An error occurred during multi-agent research execution.';
      if (event.data) {
        try {
          const parsed = JSON.parse(event.data);
          errorMessage = parsed.message || errorMessage;
        } catch (e) {
          // ignore
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      eventSource.close();
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    progressLogs,
    currentStep,
    analyzeCompany,
  };
};
