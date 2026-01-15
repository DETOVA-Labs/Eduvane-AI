import React, { useState, useEffect, useRef } from 'react';
import { orchestratorService } from '../services/orchestratorService';
import { ChatMessage, UnifiedInput } from '../types';

interface QuestionWorkspaceProps {
  onExit: () => void;
}

const SimpleFormatter: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};

export const QuestionWorkspace: React.FC<QuestionWorkspaceProps> = ({ onExit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Initial system greeting removed. UI waits for user interaction or Engine event.
    // Focusing input
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userText = inputValue;
    setInputValue('');
    setIsProcessing(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      type: 'text',
      content: userText
    };
    setMessages(prev => [...prev, userMsg]);

    const responseId = crypto.randomUUID();
    setMessages(prev => [...prev, {
        id: responseId,
        role: 'model',
        type: 'text',
        content: '',
        isStreaming: true
    }]);

    try {
        // Use Orchestrator (Gateway) instead of direct service call
        // This enforces the architectural path
        const input: UnifiedInput = { text: userText };
        // Guest mode assumed false or inherited context for QWorkspace in MVP
        const stream = orchestratorService.processInput(input, false); 

        let fullResponseText = '';

        for await (const event of stream) {
            if (event.type === 'STREAM_CHUNK') {
                fullResponseText += event.text;
                setMessages(prev => prev.map(m => 
                    m.id === responseId 
                        ? { ...m, content: fullResponseText } 
                        : m
                ));
            } else if (event.type === 'ERROR') {
                 setMessages(prev => prev.map(m => 
                    m.id === responseId 
                        ? { ...m, type: 'error', content: event.message, isStreaming: false } 
                        : m
                ));
            }
        }

        setMessages(prev => prev.map(m => 
            m.id === responseId 
                ? { ...m, isStreaming: false } 
                : m
        ));

    } catch (e) {
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'model',
            type: 'error',
            content: "System Error: Unable to reach Intelligence Layer."
        }]);
    } finally {
        setIsProcessing(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 animate-fade-in relative">
      {/* Header */}
      <div className="flex-none flex items-center justify-between mb-2 pb-4 border-b border-brand-border/30">
        <div>
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                Question Workspace
            </h2>
            <p className="text-sm text-brand-muted mt-1">Generating practice material.</p>
        </div>
        <button 
            onClick={onExit}
            className="text-sm text-brand-muted hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:border-brand-border/50 transition-colors"
        >
            Close Workspace
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto min-h-0 mb-6 pr-2 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 {/* Error Bubble Special Styling */}
                 {msg.type === 'error' ? (
                    <div className="text-red-400 text-sm bg-red-900/10 border border-red-500/20 px-4 py-2 rounded-xl max-w-2xl">
                        {msg.content}
                    </div>
                 ) : (
                    <div 
                        className={`
                            max-w-3xl rounded-xl p-5 text-sm md:text-base border
                            ${msg.role === 'user' 
                                ? 'bg-brand-surface border-brand-border/50 text-white' 
                                : 'bg-brand-card/50 border-brand-border/20 text-brand-text'
                            }
                        `}
                    >
                        {msg.role === 'model' ? (
                            <SimpleFormatter text={msg.content || ''} />
                        ) : (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                    </div>
                 )}
            </div>
        ))}
        {isProcessing && (
            <div className="flex justify-start animate-pulse">
                 <div className="bg-brand-card/50 border border-brand-border/20 px-4 py-3 rounded-xl flex gap-2 items-center">
                    <div className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none relative bg-brand-card border border-brand-border rounded-2xl p-2 shadow-lg flex items-end gap-2 z-10">
        <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the topic (e.g., 'Linear equations for Grade 10')..."
            className="flex-grow bg-transparent text-white py-3 px-2 outline-none resize-none placeholder-brand-muted/50 max-h-32 min-h-[48px]"
            rows={1}
        />
        <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="p-3 flex-shrink-0 text-brand-teal hover:bg-brand-teal/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </div>
  );
};
