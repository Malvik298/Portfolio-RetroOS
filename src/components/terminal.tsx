
"use client";

import React, { useState, useEffect, useRef } from 'react';
import portfolioData from '@/data/portfolio-data.json';
import commandsData from '@/data/commands.json';
import { PortfolioItemContent } from '@/components/portfolio-item-content';

type CommandHistory = {
  command: string;
  output: React.ReactNode;
};

type Command = {
  command: string;
  description: string;
  type: 'component' | 'text' | 'special';
  content?: string;
};

const generateHelpText = (commands: Command[]): React.ReactNode => (
  <div>
    <p>Available commands:</p>
    <ul className="list-disc list-inside ml-4">
      {commands.map(cmd => (
        <li key={cmd.command}>
          <span className="text-accent">{cmd.command}</span> - {cmd.description}
        </li>
      ))}
    </ul>
  </div>
);

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [input, setInput] = useState('');
  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (commandStr: string) => {
    let output: React.ReactNode;
    const lowerCaseCommand = commandStr.toLowerCase().trim();

    const command = commandsData.commands.find(c => c.command === lowerCaseCommand);

    if (!command) {
        output = `Command not found: ${lowerCaseCommand}. Type 'help' for a list of commands.`;
    } else {
        switch (command.type) {
            case 'component':
                const portfolioItem = portfolioData.items.find(item => item.id === command.content);
                if (portfolioItem) {
                    output = <PortfolioItemContent filePath={portfolioItem.filePath} />;
                } else {
                    output = `Configuration error for command: ${lowerCaseCommand}. No portfolio item with id "${command.content}" found.`;
                }
                break;
            case 'text':
                output = command.content;
                break;
            case 'special':
                if (command.content === 'help') {
                    output = generateHelpText(commandsData.commands);
                } else if (command.content === 'date') {
                    output = new Date().toString();
                } else if (command.content === 'clear') {
                    setHistory([]);
                    return; // Don't add to history
                }
                break;
            default:
                output = `Command type not recognized: ${lowerCaseCommand}.`;
        }
    }

    setHistory(prev => [...prev, { command: input, output }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div 
      className="bg-black/80 text-foreground w-full h-full p-2 font-code text-sm overflow-y-auto break-words"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-output">
        <p className="text-accent">RetroShell v1.0.0</p>
        <p>Welcome to my interactive portfolio. Type 'help' to get started.</p>
        <br />
        {history.map((entry, index) => (
          <div key={index}>
            <div className="flex items-center">
              <span className="text-accent">user@retroshell:~$</span>
              <span className="ml-2">{entry.command}</span>
            </div>
            <div>{entry.output}</div>
            <br/>
          </div>
        ))}
        <div ref={endOfTerminalRef} />
      </div>
      <div className="flex items-center">
        <span className="text-accent">user@retroshell:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="bg-transparent border-none outline-none text-foreground flex-grow ml-2"
          autoFocus
        />
      </div>
    </div>
  );
};
