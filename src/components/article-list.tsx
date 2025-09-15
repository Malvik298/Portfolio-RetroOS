
"use client";

import React, { useState } from 'react';
import articlesData from '@/data/articles-data.json';
import { FileText, Folder as FolderIcon, CornerUpLeft } from 'lucide-react';
import { Button } from './ui/button';
import type { PortfolioItemConfig } from '@/app/portfolio.config';
import { PortfolioItemContent } from './portfolio-item-content';
import * as LucideIcons from 'lucide-react';

type ArticleMetadata = {
  id: string;
  title: string;
  summary: string;
  filePath: string;
};

type Topic = {
  id: string;
  title: string;
  articles: ArticleMetadata[];
};

type ArticleListProps = {
  openWindow: (config: PortfolioItemConfig) => void;
};

export const ArticleList: React.FC<ArticleListProps> = ({ openWindow }) => {
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  const handleArticleClick = (articleMetadata: ArticleMetadata) => {
    if (openWindow) {
        const articleConfig: PortfolioItemConfig = {
          id: `article-${articleMetadata.id}`,
          title: articleMetadata.title,
          Icon: LucideIcons.BookText,
          component: PortfolioItemContent,
          componentProps: { filePath: articleMetadata.filePath },
          defaultSize: { width: 640, height: 480 },
        };
        openWindow(articleConfig);
    } else {
        console.error(`openWindow is not defined.`);
    }
  };

  const handleTopicClick = (topic: Topic) => {
    setCurrentTopic(topic);
  };

  const handleBackClick = () => {
    setCurrentTopic(null);
  };

  return (
    <div className="p-4 window-content h-full flex flex-col overflow-y-auto">
      {currentTopic && (
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="mb-4 self-start"
          >
            <CornerUpLeft className="mr-2 h-4 w-4" /> Back to Topics
          </Button>
      )}
      <div className="flex flex-wrap gap-4">
        {!currentTopic ? (
          articlesData.topics.map((topic) => (
            <div
              key={topic.id}
              className="flex flex-col items-center justify-center text-center w-24 h-24 p-2 rounded-md cursor-pointer hover:bg-primary/20"
              onClick={() => handleTopicClick(topic)}
              onDoubleClick={() => handleTopicClick(topic)}
            >
              <FolderIcon className="w-12 h-12 text-primary pointer-events-none flex-shrink-0" />
              <span className="mt-2 text-sm text-foreground break-words pointer-events-none select-none">
                {topic.title}
              </span>
            </div>
          ))
        ) : (
          currentTopic.articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col items-center justify-center text-center w-24 h-24 p-2 rounded-md cursor-pointer hover:bg-primary/20"
              onClick={() => handleArticleClick(article)}
              onDoubleClick={() => handleArticleClick(article)}
            >
              <FileText className="w-12 h-12 text-primary pointer-events-none flex-shrink-0" />
              <span className="mt-2 text-sm text-foreground break-words pointer-events-none select-none">
                {article.title}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
