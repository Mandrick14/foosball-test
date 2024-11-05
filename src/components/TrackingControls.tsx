import React from 'react';
import { Slider } from './Slider';
import { BallTrackingSettings } from '../types';

interface TrackingControlsProps {
  settings: BallTrackingSettings;
  onUpdate: (settings: Partial<BallTrackingSettings>) => void;
}

export function TrackingControls({ settings, onUpdate }: TrackingControlsProps) {
  const updateYellowMin = (key: keyof typeof settings.yellowMin, value: number) => {
    onUpdate({
      yellowMin: {
        ...settings.yellowMin,
        [key]: value
      }
    });
  };

  const updateYellowMax = (key: keyof typeof settings.yellowMax, value: number) => {
    onUpdate({
      yellowMax: {
        ...settings.yellowMax,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-3">Yellow Ball Detection - Minimum</h4>
        <div className="space-y-3">
          <Slider
            label="Hue"
            value={settings.yellowMin.h}
            onChange={(value) => updateYellowMin('h', value)}
            min={0}
            max={360}
          />
          <Slider
            label="Saturation"
            value={settings.yellowMin.s}
            onChange={(value) => updateYellowMin('s', value)}
            min={0}
            max={100}
          />
          <Slider
            label="Lightness"
            value={settings.yellowMin.l}
            onChange={(value) => updateYellowMin('l', value)}
            min={0}
            max={100}
          />
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-3">Yellow Ball Detection - Maximum</h4>
        <div className="space-y-3">
          <Slider
            label="Hue"
            value={settings.yellowMax.h}
            onChange={(value) => updateYellowMax('h', value)}
            min={0}
            max={360}
          />
          <Slider
            label="Saturation"
            value={settings.yellowMax.s}
            onChange={(value) => updateYellowMax('s', value)}
            min={0}
            max={100}
          />
          <Slider
            label="Lightness"
            value={settings.yellowMax.l}
            onChange={(value) => updateYellowMax('l', value)}
            min={0}
            max={100}
          />
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-3">Detection Settings</h4>
        <div className="space-y-3">
          <Slider
            label="Minimum Ball Size"
            value={settings.minBallSize}
            onChange={(value) => onUpdate({ minBallSize: value })}
            min={2}
            max={20}
          />
          <Slider
            label="Motion Sensitivity"
            value={settings.motionSensitivity}
            onChange={(value) => onUpdate({ motionSensitivity: value })}
            min={10}
            max={100}
          />
        </div>
      </div>
    </div>
  );
}