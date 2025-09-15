
"use client";

import React, { useState, useRef, useEffect, type MouseEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type DesktopIconProps = {
  id: string;
  Icon: LucideIcon;
  title: string;
  initialPos: { x: number; y: number };
  onClick: () => void;
  onDrag: (id: string, pos: { x: number; y: number }) => void;
};

const DRAG_THRESHOLD = 5; // Pixels

export const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  id, 
  Icon, 
  title, 
  initialPos, 
  onClick, 
  onDrag 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;

    // Prevent drag from starting on right-click
    if (e.button !== 0) return;

    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;

    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);

    if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
      onClick();
    }

    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging || isMobile) return;
      onDrag(id, {
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUpGlobal = (e: globalThis.MouseEvent) => {
        if(isDragging) {
            // We need to call our custom mouseUp to check for click vs drag
            handleMouseUp(e as any);
        }
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      // We use a global mouseup to catch cases where the user releases the mouse outside the icon
      document.addEventListener('mouseup', handleMouseUpGlobal, { once: true });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging, id, onDrag, isMobile, onClick]);

  const style = isMobile ? {} : {
    left: `${initialPos.x}px`,
    top: `${initialPos.y}px`,
    touchAction: 'none'
  };

  return (
    <div
      ref={iconRef}
      className={cn(
        "flex flex-col items-center justify-start text-center w-24 h-24 p-2 rounded-md",
        !isMobile && "absolute cursor-pointer hover:bg-primary/20",
        isMobile && "relative",
        isDragging && "bg-primary/30 z-20"
      )}
      style={style}
      onMouseDown={handleMouseDown}
      onClick={isMobile ? onClick : undefined} // Only use simple onClick for mobile
    >
      <Icon className="w-12 h-12 text-primary pointer-events-none flex-shrink-0" />
      <span className="mt-2 text-sm text-foreground break-words pointer-events-none select-none">{title}</span>
    </div>
  );
};
