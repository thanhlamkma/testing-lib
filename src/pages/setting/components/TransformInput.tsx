/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';

// Giả định các types đã định nghĩa ở trên...
// Các loại dữ liệu có thể có trong hệ thống
export type TransformType = 'variable' | 'function' | 'hashtag' | 'literal';

export interface VariableNode {
  type: 'variable';
  variableId: string;
}

export interface HashtagNode {
  type: 'hashtag';
  value: 'Input';
}

export interface LiteralNode {
  type: 'literal';
  valueType: 'string';
  value: string;
}

export interface FunctionNode {
  type: 'function';
  functionId: string;
  args: (TransformNode | null)[]; // Các tham số có thể chưa được điền (null)
}

// Type tổng hợp cho toàn bộ cây dữ liệu
export type TransformNode = VariableNode | HashtagNode | LiteralNode | FunctionNode;

// Định nghĩa cấu trúc cho danh sách gợi ý
export interface OptionItem {
  id: string;
  label: string;
  type: TransformType;
  params?: number; // Chỉ dành cho function
}

const VARIABLES: OptionItem[] = [
  { id: 'v1', label: 'Order Number', type: 'variable' },
  { id: 'v2', label: 'Customer Name', type: 'variable' }
];

const FUNCTIONS: OptionItem[] = [
  { id: 'ifElse', label: 'ifElse', type: 'function', params: 2 },
  { id: 'concat', label: 'concat', type: 'function', params: 2 }
];

interface Props {
  value: TransformNode | null;
  onChange: (newValue: TransformNode | null) => void;
}

const TransformInput: React.FC<Props> = ({ value, onChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterType, setFilterType] = useState<'@' | '#' | '$' | null>(null);
  const [searchText, setSearchText] = useState('');

  // Ref để thao tác trực tiếp với DOM của contentEditable
  const editableRef = useRef<HTMLDivElement>(null);

  // Khi xóa tag, cần focus lại vào ô nhập
  useEffect(() => {
    if (!value && editableRef.current) {
      editableRef.current.focus();
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    setSearchText(text);

    // Logic bắt trigger
    if (text.endsWith('@')) setFilterType('@');
    else if (text.endsWith('#')) setFilterType('#');
    else if (text.endsWith('$')) setFilterType('$');
    else if (text === '') setFilterType(null);

    setShowDropdown(text.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn xuống dòng trong contentEditable
      const text = e.currentTarget.textContent?.trim() || '';
      if (text) {
        onChange({ type: 'literal', valueType: 'string', value: text });
        if (editableRef.current) editableRef.current.textContent = '';
      }
    }
  };

  const selectOption = (opt: OptionItem) => {
    let newNode: TransformNode;

    switch (opt.type) {
      case 'variable':
        newNode = { type: 'variable', variableId: opt.label };
        break;
      case 'hashtag':
        newNode = { type: 'hashtag', value: 'Input' };
        break;
      case 'function':
        newNode = {
          type: 'function',
          functionId: opt.id,
          args: Array(opt.params || 0).fill(null)
        };
        break;
      default:
        return;
    }

    onChange(newNode);

    // Reset ô nhập sau khi chọn
    if (editableRef.current) editableRef.current.textContent = '';
    setShowDropdown(false);
  };

  // Logic lọc dữ liệu dựa trên symbol gõ vào
  const getFilteredOptions = (): OptionItem[] => {
    const search = searchText.replace(/[@#$]/g, '').toLowerCase();
    const pool: OptionItem[] = [];

    if (!filterType || filterType === '@') pool.push(...VARIABLES);
    if (!filterType || filterType === '#')
      pool.push({ id: 'input', label: 'Input', type: 'hashtag' });
    if (!filterType || filterType === '$') pool.push(...FUNCTIONS);

    return pool.filter((item) => item.label.toLowerCase().includes(search));
  };

  // --- Render logic ---
  return (
    <div className='relative inline-block w-full min-w-[250px]'>
      <div className='flex flex-wrap items-center gap-2 p-1.5 border rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 min-h-[40px]'>
        {/* HIỂN THỊ TAG NẾU ĐÃ CÓ GIÁ TRỊ */}
        {value ? (
          <div className='flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 animate-in fade-in zoom-in duration-200'>
            <span className='text-sm font-medium leading-none'>
              {value.type === 'function'
                ? `${value.functionId}(...)`
                : value.type === 'variable'
                  ? value.variableId
                  : (value as any).value}
            </span>
            <button onClick={() => onChange(null)} className='hover:bg-blue-200 rounded-full p-0.5'>
              x
            </button>
          </div>
        ) : (
          /* HIỂN THỊ Ô NHẬP NẾU TRỐNG */
          <div
            ref={editableRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className='outline-none flex-1 min-w-[50px] text-sm empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400'
            data-placeholder='Type @, # or $...'
          />
        )}
      </div>

      {/* DROPDOWN (Chỉ hiện khi đang nhập) */}
      {showDropdown && !value && (
        <div className='absolute z-50 w-full mt-1 overflow-auto bg-white border rounded-md shadow-lg max-h-60'>
          {getFilteredOptions().map((opt) => (
            <div
              key={opt.id}
              onClick={() => selectOption(opt)}
              className='flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-slate-50'
            >
              <span>{opt.label}</span>
              <span className='text-[10px] text-gray-400 font-mono'>{opt.type}</span>
            </div>
          ))}
        </div>
      )}

      {/* ĐỆ QUY CHO ARGUMENTS CỦA FUNCTION */}
      {value?.type === 'function' && (
        <div className='pl-4 mt-3 ml-4 space-y-3 border-l-2 border-gray-300 border-dashed'>
          {value.args.map((arg, idx) => (
            <div key={idx} className='flex flex-col gap-1'>
              <label className='text-[10px] font-bold text-gray-500 uppercase'>
                Argument {idx + 1}
              </label>
              <TransformInput
                value={arg}
                onChange={(newArg) => {
                  const newArgs = [...value.args];
                  newArgs[idx] = newArg;
                  onChange({ ...value, args: newArgs });
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransformInput;
