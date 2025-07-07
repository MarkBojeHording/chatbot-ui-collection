import React from 'react';
import { AlertTriangle, ExternalLink, User, Bot } from 'lucide-react';
import { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'confidence-low';
    if (confidence >= 0.8) return 'confidence-high';
    if (confidence >= 0.6) return 'confidence-medium';
    return 'confidence-low';
  };

  const formatConfidence = (confidence?: number) => {
    if (!confidence) return '0%';
    return `${Math.round(confidence * 100)}%`;
  };

  if (message.isUser) {
    return (
      <div className="flex justify-end">
        <div className="chat-message user-message">
          <div className="flex items-start space-x-2">
            <div className="flex-1">
              <p className="text-sm">{message.question}</p>
            </div>
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3" />
            </div>
          </div>
          <div className="text-xs text-blue-100 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="chat-message bot-message">
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-3 h-3 text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">{message.answer}</p>
            
            {message.confidence !== undefined && (
              <div className="flex items-center space-x-2 mt-2">
                <span className={`confidence-badge ${getConfidenceColor(message.confidence)}`}>
                  Confidence: {formatConfidence(message.confidence)}
                </span>
                
                {message.needs_escalation && (
                  <div className="flex items-center space-x-1 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-medium">May need human support</span>
                  </div>
                )}
              </div>
            )}

            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">Sources:</p>
                <div className="space-y-1">
                  {message.sources.map((source, index) => (
                    <div key={index} className="flex items-center space-x-1 text-xs text-primary-600">
                      <ExternalLink className="w-3 h-3" />
                      <span>
                        {source.title}
                        {source.page && ` (Page ${source.page})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;