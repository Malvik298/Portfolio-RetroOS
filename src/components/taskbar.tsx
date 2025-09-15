"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Power, RefreshCw, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';

export const Taskbar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRestart = () => {
    window.location.reload();
  };

  const handleShutdown = () => {
    window.close();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-card border-t border-primary/50 flex items-center justify-between px-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 text-primary hover:text-accent hover:bg-transparent font-bold">
            <Power className="w-5 h-5" />
            <span>START</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mb-2" side="top" align="start">
          <DropdownMenuItem onClick={handleRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Restart</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShutdown}>
            <XCircle className="mr-2 h-4 w-4" />
            <span>Shutdown</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="text-accent text-sm font-bold">
        {format(time, 'hh:mm:ss a')}
      </div>
    </div>
  );
};
