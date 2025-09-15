"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export type ContextMenuItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type ContextMenuProps = {
  x: number;
  y: number;
  show: boolean;
  items: ContextMenuItem[];
  onClose: () => void;
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, show, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="fixed bg-card border border-primary/50 rounded-md shadow-lg p-1 z-[100]"
      style={{ top: y, left: x }}
    >
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Button
              variant="ghost"
              className="w-full justify-start h-8 px-2 text-sm"
              onClick={() => {
                item.onClick();
                onClose();
              }}
              disabled={item.disabled}
            >
              {item.label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
