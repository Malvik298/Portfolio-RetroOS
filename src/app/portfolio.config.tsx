
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Terminal } from '@/components/terminal';
import portfolioData from '@/data/portfolio-data.json';
import { PortfolioItemContent } from '@/components/portfolio-item-content';
import { ArticleList } from '@/components/article-list';

export type PortfolioItemConfig = {
  id: string;
  title: string;
  Icon: LucideIcon;
  component: React.ComponentType<any>;
  componentProps?: { [key: string]: any };
  defaultSize?: { width: number; height: number };
};

const Icons = LucideIcons as unknown as { [key: string]: LucideIcon };

const dynamicItems: PortfolioItemConfig[] = portfolioData.items.map((item) => {
    const IconComponent = Icons[item.icon] || LucideIcons.File;
    return {
        id: item.id,
        title: item.title,
        Icon: IconComponent,
        component: PortfolioItemContent,
        componentProps: { filePath: item.filePath },
        defaultSize: item.defaultSize,
    };
});

export const portfolioItems: PortfolioItemConfig[] = [
  ...dynamicItems,
  {
    id: 'articles',
    title: 'Articles',
    Icon: LucideIcons.BookText,
    component: ArticleList,
    defaultSize: { width: 500, height: 400 },
  },
  {
    id: 'terminal',
    title: 'Terminal',
    Icon: LucideIcons.TerminalSquare,
    component: Terminal,
    defaultSize: { width: 640, height: 400 },
  },
];
