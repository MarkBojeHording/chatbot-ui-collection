import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../../types';
import { ApiService } from '../../services/api';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      question: inputValue,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await ApiService.askQuestion(inputValue);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        question: inputValue,
        answer: response.answer,
        confidence: response.confidence,
        sources: response.sources,
        needs_escalation: response.needs_escalation,
        timestamp: new Date(),
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        question: inputValue,
        answer: 'Sorry, I encountered an error while processing your request. Please try again or contact support.',
        confidence: 0,
        needs_escalation: true,
        timestamp: new Date(),
        isUser: false,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Customer Support Chat</h2>
        <p className="text-sm text-gray-500">Ask me anything about your account or our services</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to SupportAI</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              I'm here to help you with any questions about your account, billing, features, or technical issues.
              Just type your question below to get started.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;