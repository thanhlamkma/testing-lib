import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'model';
  content: string;
  isTyping?: boolean;
}

export const useSSEStream = (url: string, prompt?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!prompt) return;

    const startStream = async () => {
      try {
        // Send POST request to get stream ID
        console.log('Sending POST with prompt:', prompt);
        const response = await axios.post(
          url,
          { prompt },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        console.log('POST successful:', response.data);
        const { streamId } = response.data;

        // Connect to SSE with stream ID
        const sseUrl = `${url}/connect?streamId=${streamId}`;
        console.log('Connecting to SSE at:', sseUrl);
        const eventSource = new EventSource(sseUrl);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log('SSE connection opened');
        };

        eventSource.addEventListener('user', (e) => {
          try {
            console.log('User event:', e);
            const { content } = JSON.parse(e.data);
            setMessages((prev) => [...prev, { role: 'user', content }]);
          } catch (err) {
            console.error('Error parsing user event:', err);
            setError('Invalid user data');
          }
        });

        eventSource.addEventListener('model', (e) => {
          try {
            console.log('Model event:', e);
            const { content } = JSON.parse(e.data);
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.role === 'model') {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, content: lastMessage.content + '\n' + content, isTyping: true }
                ];
              }
              return [...prev, { role: 'model', content, isTyping: true }];
            });
          } catch (err) {
            console.error('Error parsing model event:', err);
            setError('Invalid model data');
          }
        });

        eventSource.addEventListener('end', () => {
          console.log('End event received');
          setIsTyping(false);
          setMessages((prev) =>
            prev.map((msg) => (msg.isTyping ? { ...msg, isTyping: false } : msg))
          );
          eventSource.close();
        });

        eventSource.addEventListener('error', (e) => {
          console.error('SSE error event:', e);
          setIsTyping(false);
          setError('Stream error occurred');
          eventSource.close();
        });

        eventSource.onerror = (err) => {
          console.error('SSE connection error:', err);
          setIsTyping(false);
          setError('Connection to server lost');
          eventSource.close();
        };
      } catch (err) {
        console.error('Failed to start stream:', err);
        setError('Failed to start streaming: ' + (err as Error).message);
        setIsTyping(false);
      }
    };

    startStream();

    return () => {
      if (eventSourceRef.current) {
        console.log('Closing SSE connection');
        eventSourceRef.current.close();
      }
    };
  }, [url, prompt]);

  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  return { messages, isTyping, error, setMessages };
};
