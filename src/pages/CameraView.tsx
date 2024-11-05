import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, Settings } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Slider } from '../components/Slider';

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

export function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { game, trackingSettings, updateScore } = useGame();
  const previousFrameRef = useRef<ImageData | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment',
          },
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Unable to access camera. Please ensure you have granted camera permissions.');
      }
    }

    setupCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const detectBall = (imageData: ImageData, ctx: CanvasRenderingContext2D) => {
    const { data, width, height } = imageData;
    const ballPositions: { x: number; y: number }[] = [];
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const [h, s, l] = rgbToHsl(r, g, b);
        
        // Check if color is within yellow range
        if (h >= trackingSettings.yellowMin.h && h <= trackingSettings.yellowMax.h &&
            s >= trackingSettings.yellowMin.s && s <= trackingSettings.yellowMax.s &&
            l >= trackingSettings.yellowMin.l && l <= trackingSettings.yellowMax.l) {
          
          // Check surrounding pixels to confirm ball size
          let ballPixels = 0;
          for (let dy = -trackingSettings.minBallSize; dy <= trackingSettings.minBallSize; dy++) {
            for (let dx = -trackingSettings.minBallSize; dx <= trackingSettings.minBallSize; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const ni = (ny * width + nx) * 4;
                const [nh, ns, nl] = rgbToHsl(data[ni], data[ni + 1], data[ni + 2]);
                if (nh >= trackingSettings.yellowMin.h && nh <= trackingSettings.yellowMax.h &&
                    ns >= trackingSettings.yellowMin.s && ns <= trackingSettings.yellowMax.s &&
                    nl >= trackingSettings.yellowMin.l && nl <= trackingSettings.yellowMax.l) {
                  ballPixels++;
                }
              }
            }
          }
          
          if (ballPixels > (trackingSettings.minBallSize * trackingSettings.minBallSize)) {
            ballPositions.push({ x, y });
          }
        }
      }
    }

    // Draw detected balls
    ballPositions.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    return ballPositions;
  };

  const detectMotion = (currentFrame: ImageData, previousFrame: ImageData | null) => {
    if (!previousFrame) return 0;

    const { data: current } = currentFrame;
    const { data: previous } = previousFrame;
    let motionPixels = 0;

    for (let i = 0; i < current.length; i += 4) {
      const rDiff = Math.abs(current[i] - previous[i]);
      const gDiff = Math.abs(current[i + 1] - previous[i + 1]);
      const bDiff = Math.abs(current[i + 2] - previous[i + 2]);
      
      if (rDiff + gDiff + bDiff > trackingSettings.motionSensitivity * 3) {
        motionPixels++;
      }
    }

    return motionPixels;
  };

  useEffect(() => {
    if (!isTracking || !videoRef.current || !canvasRef.current) return;

    let animationFrame: number;
    const ctx = canvasRef.current.getContext('2d');

    const processFrame = () => {
      if (!ctx || !videoRef.current || !canvasRef.current) return;

      // Match canvas size to video
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Draw the current video frame
      ctx.drawImage(videoRef.current, 0, 0);

      // Get the frame data
      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Detect ball positions
      const ballPositions = detectBall(imageData, ctx);
      
      // Detect motion
      const motionAmount = detectMotion(imageData, previousFrameRef.current);
      previousFrameRef.current = imageData;

      // Draw tracking overlay
      ctx.font = '16px Arial';
      ctx.fillStyle = '#ffff00';
      ctx.fillText(`Balls detected: ${ballPositions.length}`, 10, 30);
      ctx.fillText(`Motion: ${motionAmount}`, 10, 50);

      // Draw goal lines
      const goalWidth = canvasRef.current.width * 0.1;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, goalWidth, canvasRef.current.height);
      ctx.strokeRect(
        canvasRef.current.width - goalWidth,
        0,
        goalWidth,
        canvasRef.current.height
      );

      animationFrame = requestAnimationFrame(processFrame);
    };

    if (game.status === 'active') {
      animationFrame = requestAnimationFrame(processFrame);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isTracking, game.status, trackingSettings]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Camera Error</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: isTracking ? 'block' : 'none' }}
        />
        {!videoRef.current?.srcObject && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`px-6 py-2 rounded-lg font-semibold ${
            isTracking
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-2">Camera Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400">Tracking Status</p>
            <p className="text-white font-semibold">
              {isTracking ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400">Game Status</p>
            <p className="text-white font-semibold capitalize">
              {game.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}