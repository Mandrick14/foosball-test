import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

export function Slider({ label, value, onChange, min, max, step = 1 }: SliderProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-gray-400">
        {label} ({value})
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-gray-700 appearance-none rounded-lg h-2 cursor-pointer"
      />
    </div>
  );
}