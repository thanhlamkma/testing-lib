import { darkThemeStoreState } from '@/common/stores/ThemeStore';
import AIChatBox from '@/pages/aiChat/components/AIChatBox';
import AIResponse from '@/pages/aiChat/components/AIResponse';
import AISidebar from '@/pages/aiChat/components/AISidebar';
import { geminiService } from '@/pages/aiChat/services/geminiService';
import { AIChatType } from '@/pages/aiChat/types/AIChat';
import { uniqueId } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

const AIChat = () => {
  const themeStore = useRecoilValue(darkThemeStoreState);

  useEffect(() => {
    const bodyElement = document.body;
    if (bodyElement) {
      bodyElement.classList.toggle('dark-theme', themeStore);
      bodyElement.classList.toggle('light-theme', !themeStore);
    }
  }, [themeStore]);

  const [resData, setResData] = useState<AIChatType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (message: string) => {
    setIsLoading(true);
    const userReq = {
      id: uniqueId(),
      role: 'user',
      content: message
    };
    const response = await geminiService.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message
    });
    console.log('🚀 ~ handleSubmit ~ response:', response);
    const modelRes = {
      id: uniqueId(),
      role: 'model',
      content: response.candidates?.[0].content?.parts?.[0].text || 'No response available'
    };
    setResData((prev) => [...prev, userReq, modelRes]);
    setIsLoading(false);
  };

  return (
    <div className='ai-chat flex gap-[100px] h-full w-full overflow-hidden'>
      <AISidebar />

      <div className='flex flex-col gap-6 ai-chat__main'>
        <AIResponse data={resData} isLoading={isLoading} />
        <AIChatBox handleSubmit={handleSubmit} />
      </div>

      <div className='ai-chat__right'>
        <div className='ai-chat__right-panel__header'>Right Panel</div>
        <div className='ai-chat__right-panel__content'>Right Panel Content</div>
      </div>
    </div>
  );
};

export default AIChat;
