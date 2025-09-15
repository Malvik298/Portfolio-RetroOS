
"use client";

import React, { useState, useEffect } from 'react';
import { MarkdownContent } from './markdown-content';

type PortfolioItemContentProps = {
  filePath: string;
};

const basePath = process.env.basePath || '';


export const PortfolioItemContent: React.FC<PortfolioItemContentProps> = ({ filePath }) => {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filePath) {
      setError("Error: No file path provided.");
      return;
    }

    const fetchContent = async () => {
      try {
        const fullPath = `${basePath}/${filePath}`;
        const response = await fetch(fullPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(`Error: Content not found at '${filePath}'.`);
        console.error(e);
      }
    };

    fetchContent();
  }, [filePath]);

  if (error) {
    return <div className="p-4 text-destructive">{error}</div>;
  }

  if (content === null) {
    return <div className="p-4">Loading...</div>;
  }

  return <MarkdownContent content={content} />;
};
