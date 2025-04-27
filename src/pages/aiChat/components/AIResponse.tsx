/* eslint-disable @typescript-eslint/no-unused-vars */
import { AIChatType } from '@/pages/aiChat/types/AIChat';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { FC } from 'react';
import Markdown from 'react-markdown';

interface AIResponseProps {
  data: AIChatType[];
  isLoading: boolean;
}

const AIResponse: FC<AIResponseProps> = ({ data, isLoading }) => {
  return (
    <div className='response-container'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center loading-overlay'>
          <Loading3QuartersOutlined style={{ fontSize: 30 }} spin className='loading-icon' />
        </div>
      )}
      {!isLoading && !data && <div className='no-response'>No response available</div>}

      {!isLoading && data && (
        <div className='response-content'>
          {data.map((item, index) =>
            item.role === 'user' ? (
              <div key={index} className='flex justify-end w-full'>
                <div className='response-user'>{item.content}</div>
              </div>
            ) : (
              <div className='response-model' key={index}>
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
                  {item.content}
                </Markdown>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AIResponse;
