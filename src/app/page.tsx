
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import type { PortfolioItemConfig } from './portfolio.config';
import { portfolioItems } from './portfolio.config';
import { DesktopIcon } from '@/components/desktop-icon';
import { Taskbar } from '@/components/taskbar';
import { Window } from '@/components/window';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { BootScreen } from '@/components/boot-screen';
import { ContextMenu, type ContextMenuItem } from '@/components/context-menu';
import { SquaresBackground } from '@/components/squares-background';
import type { LucideIcon } from 'lucide-react';
import { ArticleList } from '@/components/article-list';
import { Terminal } from '@/components/terminal';

export type WindowState = {
  id: string;
  title: string;
  pos: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMaximized: boolean;
  component: React.ComponentType<any>;
  componentProps?: { [key: string]: any };
  isInitialRender: boolean; // Flag for initial positioning
};

type IconState = {
  id: string;
  title: string;
  Icon: LucideIcon;
  pos: { x: number; y: number };
  itemConfig: PortfolioItemConfig;
};

export default function Home() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [icons, setIcons] = useState<IconState[]>([]);
  const isMobile = useIsMobile();
  const [booting, setBooting] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    setIcons(
      portfolioItems.map((item, index) => {
        const gridCols = isMobile ? 4 : 1;
        const col = index % gridCols;
        const row = Math.floor(index / gridCols);
        const xPos = isMobile ? 0 : 16 + col * 96;
        const yPos = isMobile ? 0 : 16 + row * 96;
        return {
          id: item.id,
          title: item.title,
          Icon: item.Icon,
          pos: { x: xPos, y: yPos },
          itemConfig: item,
        };
      })
    );
  }, [isClient, isMobile]);

  const openWindow = useCallback((itemConfig: PortfolioItemConfig) => {
    setWindows(currentWindows => {
        const existingWindow = currentWindows.find(w => w.id === itemConfig.id);
        const maxZIndex = currentWindows.length > 0 ? Math.max(...currentWindows.map(w => w.zIndex)) : 9;

        if (existingWindow) {
            return currentWindows.map(w =>
                w.id === itemConfig.id ? { ...w, zIndex: maxZIndex + 1 } : w
            );
        }
        
        const defaultSize = itemConfig.defaultSize ?? { width: 640, height: 480 };

        const newWidth = Math.min(defaultSize.width, window.innerWidth * 0.5);
        const newHeight = Math.min(defaultSize.height, window.innerHeight * 0.6);

        const newWindow: WindowState = {
            id: itemConfig.id,
            title: itemConfig.title,
            component: itemConfig.component,
            componentProps: itemConfig.componentProps || {},
            pos: { x: 0, y: 0 }, // Will be centered by useEffect
            size: { width: newWidth, height: newHeight },
            zIndex: maxZIndex + 1,
            isMaximized: false,
            isInitialRender: true,
        };
        
        const otherWindows = isMobile ? [] : currentWindows;

        return [...otherWindows, newWindow];
    });
  }, [isMobile]);

  useEffect(() => {
    if (windows.some(w => w.isInitialRender)) {
        setTimeout(() => {
            setWindows(currentWindows =>
                currentWindows.map(w => {
                    if (w.isInitialRender) {
                        const newPos = {
                            x: (window.innerWidth / 2) - (w.size.width / 2),
                            y: (window.innerHeight / 2) - (w.size.height / 2) - 50,
                        };
                        return { ...w, pos: newPos, isInitialRender: false };
                    }
                    return w;
                })
            );
        }, 0);
    }
  }, [windows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(currentWindows => currentWindows.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(currentWindows => {
      const maxZIndex = Math.max(...currentWindows.map(w => w.zIndex));
      if (currentWindows.find(w => w.id === id)?.zIndex === maxZIndex) {
        return currentWindows;
      }
      return currentWindows.map(w =>
        w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w
      );
    });
  }, []);

  const handleWindowDrag = useCallback((id: string, pos: { x: number; y: number }) => {
    setWindows(currentWindows =>
      currentWindows.map(w => (w.id === id ? { ...w, pos, isInitialRender: false } : w))
    );
  }, []);

  const handleWindowResize = useCallback((id: string, size: { width: number, height: number }) => {
    setWindows(currentWindows => 
      currentWindows.map(w => {
        if (w.id === id) {
          // Keep the original position, only update size
          return { ...w, size, isInitialRender: false }
        }
        return w;
      })
    )
  }, []);
  
  const handleWindowMaximize = useCallback((id: string, isMaximized: boolean) => {
    setWindows(currentWindows =>
      currentWindows.map(w => (w.id === id ? { ...w, isMaximized } : w))
    );
  }, []);

  const handleIconDrag = useCallback((id: string, pos: { x: number; y: number }) => {
    if (isMobile) return;
    setIcons(currentIcons =>
      currentIcons.map(icon => (icon.id === id ? { ...icon, pos } : icon))
    );
  }, [isMobile]);
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isMobile) return;
    setContextMenu({ x: e.clientX, y: e.clientY, show: true });
  };

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, show: false }));
  };
  
  const contextMenuItems: ContextMenuItem[] = [
    { label: "Refresh", onClick: () => { if (isClient) window.location.reload(); } },
    { label: "About", onClick: () => {
        const aboutItem = portfolioItems.find(item => item.id === 'about');
        if (aboutItem) openWindow(aboutItem);
    }},
    { label: "Change Background", onClick: () => alert("Functionality not implemented yet!"), disabled: true },
  ];

  if (!isClient) {
    return <BootScreen onFinished={() => {}} />;
  }
  
  if (booting) {
    return <BootScreen onFinished={() => setBooting(false)} />;
  }
  
  const hasOpenWindowOnMobile = isMobile && windows.length > 0;

  const renderWindowContent = (win: WindowState) => {
      const ContentComponent = win.component;
      if (ContentComponent) {
          if (win.id === 'articles') {
              return <ArticleList openWindow={openWindow} />;
          }
          if (win.id === 'terminal') {
              return <Terminal />;
          }
          return <ContentComponent {...win.componentProps} />;
      }
      return null;
  }

  return (
    <main 
      className="h-screen w-screen overflow-hidden relative"
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      <SquaresBackground 
        direction="diagonal"
        speed={0.3}
        squareSize={30}
        borderColor="hsl(var(--primary) / 0.2)"
        hoverFillColor="hsl(var(--primary) / 0.1)"
      />
      <div className={cn(
        "absolute top-0 left-0 w-full h-[calc(100%-40px)] z-10", 
        hasOpenWindowOnMobile && "hidden", 
        isMobile ? "p-4 grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] auto-rows-min gap-y-2 justify-items-center overflow-y-auto" : ""
      )}>
        {icons.map(icon => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            Icon={icon.Icon}
            title={icon.title}
            initialPos={icon.pos}
            onClick={() => openWindow(icon.itemConfig)}
            onDrag={handleIconDrag}
          />
        ))}
      </div>

      {windows.map(win => {
        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            initialPos={win.pos}
            initialSize={win.size}
            zIndex={win.zIndex}
            isMaximized={win.isMaximized}
            onClose={closeWindow}
            onFocus={focusWindow}
            onDrag={handleWindowDrag}
            onResize={handleWindowResize}
            onMaximize={handleWindowMaximize}
          >
            {renderWindowContent(win)}
          </Window>
        );
      })}

      <ContextMenu 
        x={contextMenu.x}
        y={contextMenu.y}
        show={contextMenu.show}
        items={contextMenuItems}
        onClose={closeContextMenu}
      />
      
      <Taskbar />
    </main>
  );
}
