import React from 'react';
import { Camera } from 'lucide-react';

export function CameraView() {
  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Camera Feed Placeholder</p>
          <p className="text-sm text-gray-500">Overhead Table View</p>
        </div>
      </div>
    </div>
  );
}