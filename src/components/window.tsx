
"use client";

import React, { useState, useRef, useEffect, type MouseEvent } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type WindowProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPos: { x: number; y: number };
  initialSize: { width: number; height: number };
  zIndex: number;
  isMaximized: boolean;
  onClose: (id: string) => void;
  onFocus: (id:string) => void;
  onDrag: (id: string, pos: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  onMaximize: (id: string, isMaximized: boolean) => void;
};

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  initialPos,
  initialSize,
  zIndex,
  isMaximized,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  
  const offset = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const windowRef = useRef<HTMLDivElement>(null);
  const initialResizeState = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleTitleBarMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile || isMaximized) return;

    // Ensure we are not clicking on a button inside the title bar
    if (e.target instanceof Element && e.target.closest('button')) {
      return;
    }
    
    if (!windowRef.current) return;
    
    onFocus(id);

    const rect = windowRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
    e.preventDefault();
  };

  const handleResizeMouseDown = (e: MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus(id);
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      initialResizeState.current = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
    setIsResizing(direction);
  };

  const toggleMaximize = () => {
    if (isMobile) return;
    onMaximize(id, !isMaximized);
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging && !isMaximized) {
        onDrag(id, {
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      } else if (isResizing && windowRef.current && !isMaximized) {
        let newWidth = initialResizeState.current.width;
        let newHeight = initialResizeState.current.height;
        let newX = initialResizeState.current.x;
        let newY = initialResizeState.current.y;

        if (isResizing.includes('right')) {
          newWidth = Math.max(e.clientX - newX, MIN_WIDTH);
        }
        if (isResizing.includes('bottom')) {
          newHeight = Math.max(e.clientY - newY, MIN_HEIGHT);
        }
        if (isResizing.includes('left')) {
          const newRight = newX + newWidth;
          newX = Math.min(e.clientX, newRight - MIN_WIDTH);
          newWidth = newRight - newX;
        }
        if (isResizing.includes('top')) {
          const newBottom = newY + newHeight;
          newY = Math.min(e.clientY, newBottom - MIN_HEIGHT);
          newHeight = newBottom - newY;
        }
        
        onResize(id, {width: newWidth, height: newHeight});
        onDrag(id, {x: newX, y: newY});
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, isDragging, isResizing, isMaximized, onDrag, onResize]);

  if (isMobile) {
    return (
      <div
        className="absolute inset-0 flex flex-col bg-card"
        style={{ zIndex: 100 }}
      >
        <div
          className="flex items-center justify-between h-10 px-4 bg-primary text-primary-foreground flex-shrink-0"
        >
          <span className="font-bold text-sm truncate">{title}</span>
          <button
            onClick={() => onClose(id)}
            className="p-1 rounded-sm hover:bg-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  const windowStyle: React.CSSProperties = isMaximized ? {
    left: '0px',
    top: '0px',
    width: '100vw',
    height: 'calc(100vh - 40px)',
    zIndex,
  } : {
    left: `${initialPos.x}px`,
    top: `${initialPos.y}px`,
    width: `${initialSize.width}px`,
    height: `${initialSize.height}px`,
    zIndex,
  };

  const resizeHandles = [
    { direction: 'top', className: 'cursor-n-resize top-0 left-1/2 -translate-x-1/2 h-2 w-full' },
    { direction: 'bottom', className: 'cursor-s-resize bottom-0 left-1/2 -translate-x-1/2 h-2 w-full' },
    { direction: 'left', className: 'cursor-w-resize left-0 top-1/2 -translate-y-1/2 h-full w-2' },
    { direction: 'right', className: 'cursor-e-resize right-0 top-1/2 -translate-y-1/2 h-full w-2' },
    { direction: 'top-left', className: 'cursor-nw-resize top-0 left-0 h-3 w-3' },
    { direction: 'top-right', className: 'cursor-ne-resize top-0 right-0 h-3 w-3' },
    { direction: 'bottom-left', className: 'cursor-sw-resize bottom-0 left-0 h-3 w-3' },
    { direction: 'bottom-right', className: 'cursor-se-resize bottom-0 right-0 h-3 w-3' },
  ];

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute flex flex-col border border-primary bg-card shadow-lg",
        isMaximized ? 'rounded-none' : 'rounded-t-lg',
        'transition-none'
      )}
      style={windowStyle}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className={cn(
            "flex items-center justify-between h-8 px-2 bg-primary text-primary-foreground flex-shrink-0",
            isMaximized ? 'rounded-none' : 'rounded-t-md',
            !isMaximized && "cursor-move"
        )}
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={toggleMaximize}
      >
        <span className="font-bold text-sm truncate pointer-events-none">{title}</span>
        <div className="flex items-center">
            <button
                onClick={toggleMaximize}
                className="p-1 rounded-sm hover:bg-black/20"
                aria-label={isMaximized ? "Minimize" : "Maximize"}
            >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
                onClick={() => onClose(id)}
                className="p-1 rounded-sm hover:bg-red-500"
                aria-label="Close"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto relative">
        {!isMaximized && !isMobile && resizeHandles.map(handle => (
          <div
            key={handle.direction}
            data-resize-handle={handle.direction}
            className={cn('absolute z-10', handle.className)}
            onMouseDown={(e) => handleResizeMouseDown(e, handle.direction)}
          />
        ))}
        <div className="h-full w-full">
            {children}
        </div>
      </div>
    </div>
  );
};
