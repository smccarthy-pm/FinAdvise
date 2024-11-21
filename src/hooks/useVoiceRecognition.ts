import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  enabled: boolean;
}

export function useVoiceRecognition({ onResult, onError, enabled }: UseVoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      if (onError) onError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors when stopping
        }
      }
    };
  }, [enabled, onError, onResult]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !enabled || isListening) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      if (onError) onError('Failed to start speech recognition');
    }
  }, [enabled, isListening, onError]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      // Ignore errors when stopping
    }
  }, [isListening]);

  return {
    isListening,
    startListening,
    stopListening,
    toggleListening: useCallback(() => {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }, [isListening, startListening, stopListening])
  };
}