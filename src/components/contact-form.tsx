
"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Send, CheckCircle } from 'lucide-react';

const TO_ADDRESS = "your-email@example.com"; // Change this to your email

export const ContactForm: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        
        const formData = new FormData(e.target as HTMLFormElement);
        const subject = formData.get('subject') as string;
        const body = formData.get('body') as string;
        
        // Simulate sending for 1 second, then open mailto link
        setTimeout(() => {
            const mailtoLink = `mailto:${TO_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink, '_blank');
            setStatus('sent');
        }, 1000);
    };

    if (status === 'sent') {
        return (
            <div className="p-4 window-content h-full flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-16 h-16 text-primary mb-4" />
                <h2 className="text-xl font-bold mb-2">Message Handled!</h2>
                <p className="text-muted-foreground">Your default email client has been opened.</p>
                <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => setStatus('idle')}
                >
                    Compose Another Message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 window-content h-full flex flex-col space-y-3">
            <div className="flex items-center space-x-2 border-b pb-2">
                <Label htmlFor="to" className="w-20 text-right text-muted-foreground">To:</Label>
                <Input id="to" name="to" type="email" readOnly value={TO_ADDRESS} className="border-0 bg-transparent h-8 focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>
            <div className="flex items-center space-x-2 border-b pb-2">
                <Label htmlFor="from" className="w-20 text-right text-muted-foreground">From:</Label>
                <Input id="from" name="from" type="email" required placeholder="your-email@example.com" className="border-0 bg-transparent h-8 focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>
            <div className="flex items-center space-x-2 border-b pb-2">
                <Label htmlFor="subject" className="w-20 text-right text-muted-foreground">Subject:</Label>
                <Input id="subject" name="subject" required placeholder="Regarding your portfolio" className="border-0 bg-transparent h-8 focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>
            <div className="flex-grow flex flex-col">
                <Textarea
                    id="body"
                    name="body"
                    required
                    placeholder="Your message here..."
                    className="flex-grow resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                />
            </div>
            <div className="flex justify-end pt-2 border-t">
                <Button type="submit" disabled={status === 'sending'}>
                    <Send className="mr-2" />
                    {status === 'sending' ? 'Sending...' : 'Send'}
                </Button>
            </div>
        </form>
    );
};
