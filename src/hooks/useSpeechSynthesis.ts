import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisProps {
  enabled: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeechSynthesis({ 
  enabled,
  rate = 1,
  pitch = 1,
  volume = 1
}: UseSpeechSynthesisProps) {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Select a default English voice
      const englishVoice = availableVoices.find(
        voice => voice.lang.includes('en-') && !voice.localService
      );
      setSelectedVoice(englishVoice || availableVoices[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [enabled]);

  const speak = useCallback((text: string) => {
    if (!enabled || !selectedVoice || !text.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [enabled, selectedVoice, rate, pitch, volume]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    speaking,
    voices,
    selectedVoice,
    setSelectedVoice
  };
}