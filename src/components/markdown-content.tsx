
"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

type MarkdownContentProps = {
  content: string;
};

const basePath = process.env.basePath || '';

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  if (content === undefined) {
    return <div className="p-4">Loading...</div>; // Or some other loading state
  }
  
  return (
    <div className="p-4 space-y-4 window-content h-full overflow-y-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({node, ...props}) => <h2 className="text-2xl text-accent font-bold border-b-2 border-accent/50 pb-1 mb-3" {...props} />,
          p: ({node, ...props}) => <p className="mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2" {...props} />,
          li: ({node, ...props}) => <li className="pl-2" {...props} />,
          a: ({node, ...props}) => <a className="text-accent hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
          strong: ({node, ...props}) => <strong className="text-primary font-bold" {...props} />,
          em: ({node, ...props}) => <em className="italic" {...props} />,
          img: ({node, ...props}) => {
            const src = props.src?.startsWith('/') ? `${basePath}${props.src}` : props.src;
            return (
              <Image 
                src={src || ''} 
                alt={props.alt || ''}
                width={600}
                height={400}
                className="rounded-md my-4 max-w-full h-auto"
                unoptimized
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
