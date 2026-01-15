import { functionOptions, OptionType, VALUE_TYPE, variableOptions } from '@/pages/setting/types';
import { useState } from 'react';

export const useEditorSearch = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [keyword, setKeyword] = useState('');

  const handleInput = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const text = range.startContainer.textContent?.slice(0, range.startOffset) || '';

    const match = text.match(/([@$#])([\w]*)$/);
    if (!match) {
      setOpen(false);
      return;
    }

    const [, trigger, value] = match;
    setKeyword(value);

    if (trigger === '@') setOptions(variableOptions);
    if (trigger === '$') setOptions(functionOptions);
    if (trigger === '#')
      setOptions([{ label: 'Recorded Data', value: 'recorded', type: VALUE_TYPE.RECORDED_DATA }]);

    const rect = range.getBoundingClientRect();
    console.log('🚀 ~ handleInput ~ rect:', rect);
    setPosition({ x: rect.height, y: rect.bottom + 4 });
    setOpen(true);
  };

  return { open, options, position, keyword, handleInput, setOpen };
};
