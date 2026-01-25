import React, { useState } from 'react';

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
  args: (TransformNodeV2 | null)[]; // Các tham số có thể chưa được điền (null)
}

// Type tổng hợp cho toàn bộ cây dữ liệu
export type TransformNodeV2 = VariableNode | HashtagNode | LiteralNode | FunctionNode;

// Định nghĩa cấu trúc cho danh sách gợi ý
export interface OptionItem {
  id: string;
  label: string;
  type: TransformType;
  params?: number; // Chỉ dành cho function
}

// Dữ liệu mẫu (thực tế sẽ fetch từ API)
const VARIABLES: OptionItem[] = [
  { id: 'v1', label: 'Order Number', type: 'variable' },
  { id: 'v2', label: 'Customer Name', type: 'variable' }
];

const FUNCTIONS: OptionItem[] = [
  { id: 'ifElse', label: 'ifElse', type: 'function', params: 2 },
  { id: 'concat', label: 'concat', type: 'function', params: 2 }
];

interface Props {
  value: TransformNodeV2 | null;
  onChange: (newValue: TransformNodeV2 | null) => void;
}

const TransformInputV2: React.FC<Props> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<'@' | '#' | '$' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.endsWith('@')) setFilterType('@');
    else if (val.endsWith('#')) setFilterType('#');
    else if (val.endsWith('$')) setFilterType('$');
    else if (val === '') setFilterType(null);

    setShowDropdown(val.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      // Nếu không chọn từ list, coi như là Direct Input (literal)
      onChange({
        type: 'literal',
        valueType: 'string',
        value: inputValue.replace(/[@#$]/g, '')
      });
      setInputValue('');
    }
  };

  const selectOption = (opt: OptionItem) => {
    let newNode: TransformNodeV2;

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
    setInputValue('');
    setShowDropdown(false);
  };

  // Logic lọc dữ liệu dựa trên symbol gõ vào
  const getFilteredOptions = (): OptionItem[] => {
    const search = inputValue.replace(/[@#$]/g, '').toLowerCase();
    const pool: OptionItem[] = [];

    if (!filterType || filterType === '@') pool.push(...VARIABLES);
    if (!filterType || filterType === '#')
      pool.push({ id: 'input', label: 'Input', type: 'hashtag' });
    if (!filterType || filterType === '$') pool.push(...FUNCTIONS);

    return pool.filter((item) => item.label.toLowerCase().includes(search));
  };

  // RENDER TAG MODE
  if (value) {
    return (
      <div className='w-[500px] flex flex-col pl-2 my-2 ml-2 border-l-2 border-blue-400 rounded-r bg-slate-50'>
        <div className='flex items-center gap-2 px-2 py-1 bg-white border rounded shadow-sm w-fit'>
          <span className='text-sm font-semibold text-blue-600'>
            {value.type === 'function'
              ? value.functionId
              : value.type === 'variable'
                ? value.variableId
                : value.value}
          </span>
          <button
            onClick={() => onChange(null)}
            className='text-gray-400 transition-colors hover:text-red-500'
          >
            x
          </button>
        </div>

        {/* Đệ quy: Nếu là function, render các argument inputs */}
        {value.type === 'function' && (
          <div className='flex flex-col gap-2 mt-2 ml-4'>
            {value.args.map((arg, index) => (
              <div key={index} className='flex flex-col'>
                <span className='text-[10px] uppercase text-gray-400 font-bold'>
                  Arg {index + 1}
                </span>
                <TransformInputV2
                  value={arg}
                  onChange={(newArg) => {
                    const newArgs = [...value.args];
                    newArgs[index] = newArg;
                    onChange({ ...value, args: newArgs });
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // RENDER INPUT MODE
  return (
    <div className='relative w-full max-w-md'>
      <input
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className='w-full border rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none'
        placeholder='Type @ (Var), # (Input), $ (Fn)...'
      />

      {showDropdown && (
        <div className='absolute z-50 w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg'>
          {getFilteredOptions().map((opt) => (
            <div
              key={opt.id}
              onClick={() => selectOption(opt)}
              className='flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-blue-50'
            >
              <span>{opt.label}</span>
              <span className='text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 uppercase'>
                {opt.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransformInputV2;
