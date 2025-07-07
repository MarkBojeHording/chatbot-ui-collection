export interface ChatMessage {
  id: string;
  question: string;
  answer?: string;
  confidence?: number;
  sources?: Source[];
  needs_escalation?: boolean;
  timestamp: Date;
  isUser: boolean;
  isLoading?: boolean;
}

export interface Source {
  title: string;
  page?: number;
  url?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

export interface AnalyticsData {
  totalQuestions: number;
  averageConfidence: number;
  escalationRate: number;
  popularQuestions: Array<{
    question: string;
    count: number;
  }>;
  dailyUsage: Array<{
    date: string;
    questions: number;
  }>;
}