"use client";

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

type BootScreenProps = {
  onFinished: () => void;
};

const bootSteps = [
  "Initializing RetroShell v1.0.0...",
  "Loading kernel modules...",
  "Checking file system...",
  "Mounting virtual drives...",
  "Starting UI server...",
  "Loading desktop environment...",
  "Finalizing...",
];

export const BootScreen: React.FC<BootScreenProps> = ({ onFinished }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < bootSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
      setProgress(prev => Math.min(prev + 100 / bootSteps.length, 100));
    }, 500);

    const finishTimer = setTimeout(() => {
      clearInterval(interval);
      onFinished();
    }, (bootSteps.length + 1) * 500);

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 bg-black text-lime-400 font-mono flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl mb-4">[RetroShell OS]</h1>
        <div className="h-48 overflow-hidden">
          {bootSteps.slice(0, currentStep + 1).map((step, index) => (
            <p key={index}>
              <span className="text-green-500">[OK]</span> {step}
            </p>
          ))}
        </div>
        <div className="mt-4">
          <p>Loading: {Math.round(progress)}%</p>
          <Progress value={progress} className="h-2 mt-2 bg-lime-900 [&>div]:bg-lime-400" />
        </div>
        <p className="mt-8 text-center animate-pulse">Please wait...</p>
      </div>
    </div>
  );
};
