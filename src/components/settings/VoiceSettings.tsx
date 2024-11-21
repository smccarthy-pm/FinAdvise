import React from 'react';
import { Mic, Volume2, VolumeX } from 'lucide-react';

interface VoiceSettingsProps {
  voiceEnabled: boolean;
  voiceInput: boolean;
  voiceOutput: boolean;
  onToggleVoice: () => void;
  onToggleVoiceInput: () => void;
  onToggleVoiceOutput: () => void;
}

export function VoiceSettings({
  voiceEnabled,
  voiceInput,
  voiceOutput,
  onToggleVoice,
  onToggleVoiceInput,
  onToggleVoiceOutput
}: VoiceSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Voice Features</p>
            <p className="text-sm text-gray-500">Enable or disable voice capabilities</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={onToggleVoice}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {voiceEnabled && (
        <div className="space-y-3 pl-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Voice Input</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceInput}
                onChange={onToggleVoiceInput}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {voiceOutput ? (
                <Volume2 className="w-4 h-4 text-gray-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-700">Voice Output</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceOutput}
                onChange={onToggleVoiceOutput}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}