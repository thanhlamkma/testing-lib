/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { darkThemeStoreState } from '@/common/stores/ThemeStore';
import AIChatBox from '@/pages/aiChat/components/AIChatBox';
import AISidebar from '@/pages/aiChat/components/AISidebar';
import { useSSEStream } from '@/pages/aiChat/hooks/useSSEStream';
import { FC, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useRecoilValue } from 'recoil';

const ChatMessage: FC<any> = ({ message }) => {
  return (
    <div className={`w-full flex ${message.role === 'user' ? 'justify-end' : ''}`}>
      <div className={`message ${message.role}`}>
        <Markdown
          components={{
            p: ({ node, ...props }) => (
              <p
                style={{
                  margin: '12px 0',
                  lineHeight: '1.8'
                }}
                {...props}
              />
            ),
            h1: ({ node, ...props }) => (
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: '24px 0 16px 0',
                  lineHeight: '2.4'
                }}
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h3
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  margin: '20px 0 14px 0',
                  lineHeight: '2.2'
                }}
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  margin: '18px 0 12px 0',
                  lineHeight: '2.0'
                }}
                {...props}
              />
            ),
            code: ({ node, ...props }) => (
              <code
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9em'
                }}
                {...props}
              />
            ),
            pre: ({ node, ...props }) => (
              <pre
                style={{
                  background: '#1e293b',
                  padding: '16px',
                  borderRadius: '8px',
                  overflowX: 'auto',
                  margin: '16px 0',
                  fontSize: '0.9rem'
                }}
                {...props}
              />
            ),
            a: ({ node, ...props }) => (
              <a
                style={{
                  color: '#6366f1',
                  textDecoration: 'underline',
                  fontWeight: '500'
                }}
                {...props}
              />
            )
          }}
        >
          {message.content}
        </Markdown>
        {message.isTyping && <span className='typing-cursor'>|</span>}
      </div>
    </div>
  );
};

const AIChat = () => {
  const themeStore = useRecoilValue(darkThemeStoreState);

  useEffect(() => {
    const bodyElement = document.body;
    if (bodyElement) {
      bodyElement.classList.toggle('dark-theme', themeStore);
      bodyElement.classList.toggle('light-theme', !themeStore);
    }
  }, [themeStore]);

  const [input, setInput] = useState('');
  const { messages, isTyping, error } = useSSEStream('http://localhost:3000/api/stream', input);

  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;

    // Initiate SSE connection
    setInput(message);
  };

  // const [resData, setResData] = useState<AIChatType[]>([]);
  // const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = async (message: string) => {
  //   setIsLoading(true);
  //   const userReq = {
  //     id: uniqueId(),
  //     role: 'user',
  //     content: message
  //   };
  //   const response = await geminiService.models.generateContent({
  //     model: 'gemini-2.0-flash',
  //     contents: message
  //   });
  //   console.log('🚀 ~ handleSubmit ~ response:', response);
  //   const modelRes = {
  //     id: uniqueId(),
  //     role: 'model',
  //     content: response.candidates?.[0].content?.parts?.[0].text || 'No response available'
  //   };
  //   setResData((prev) => [...prev, userReq, modelRes]);
  //   setIsLoading(false);
  // };

  return (
    <div className='ai-chat flex gap-[100px] h-full w-full overflow-hidden'>
      <AISidebar />

      <div className='flex flex-col gap-6 ai-chat__main'>
        {/* <AIResponse data={resData} isLoading={isLoading} /> */}
        <div className='response-container'>
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
        </div>
        {error && <div className='p-2 text-red-500'>Error: {error}</div>}
        <AIChatBox disabled={isTyping} handleSubmit={handleSubmit} />
      </div>

      <div className='ai-chat__right'>
        <div className='ai-chat__right-panel__header'>Right Panel</div>
        <div className='ai-chat__right-panel__content'>Right Panel Content</div>
      </div>
    </div>
  );
};

export default AIChat;
