const BASE_URL = 'http://localhost:8000';

export class ApiService {
  private static async handleResponse(response: Response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${BASE_URL}/`);
      return this.handleResponse(response);
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  static async uploadDocuments(files: FileList): Promise<{ message: string; files: string[] }> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${BASE_URL}/upload-documents`, {
        method: 'POST',
        body: formData,
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  static async askQuestion(question: string): Promise<{
    answer: string;
    confidence: number;
    sources: Array<{ title: string; page?: number }>;
    needs_escalation?: boolean;
  }> {
    try {
      const response = await fetch(`${BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Question failed:', error);
      throw error;
    }
  }

  static async getAnalytics(): Promise<{
    total_questions: number;
    average_confidence: number;
    escalation_rate: number;
    popular_questions: Array<{ question: string; count: number }>;
  }> {
    try {
      const response = await fetch(`${BASE_URL}/analytics`);
      return this.handleResponse(response);
    } catch (error) {
      console.error('Analytics fetch failed:', error);
      throw error;
    }
  }
}