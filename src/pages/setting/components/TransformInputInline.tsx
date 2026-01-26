/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptionItem } from '@/pages/setting/components/TransformInput';
import React, { useEffect, useRef, useState } from 'react';

const VARIABLES: OptionItem[] = [
  { id: 'v1', label: 'Order Number', type: 'variable' },
  { id: 'v2', label: 'Customer Name', type: 'variable' }
];

const FUNCTIONS: OptionItem[] = [
  { id: 'ifElse', label: 'ifElse', type: 'function', params: 2 },
  { id: 'concat', label: 'concat', type: 'function', params: 2 }
];

// --- Types (Giữ nguyên cấu trúc của bạn) ---
type TransformNode =
  | { type: 'variable'; variableId: string }
  | { type: 'hashtag'; value: 'Input' }
  | { type: 'literal'; valueType: 'string'; value: string }
  | { type: 'function'; functionId: string; args: (TransformNode | null)[] };

interface Props {
  value: TransformNode | null;
  onChange: (newValue: TransformNode | null) => void;
  isRoot?: boolean;
}

const TransformInputInline: React.FC<Props> = ({ value, onChange, isRoot = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterType, setFilterType] = useState<'@' | '#' | '$' | null>(null);
  const [search, setSearch] = useState('');
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value && editableRef.current) editableRef.current.focus();
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    setSearch(text);
    if (text.endsWith('@')) setFilterType('@');
    else if (text.endsWith('#')) setFilterType('#');
    else if (text.endsWith('$')) setFilterType('$');
    else if (text === '') setFilterType(null);
    setShowDropdown(text.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const text = e.currentTarget.textContent?.trim();
      if (text) {
        onChange({ type: 'literal', valueType: 'string', value: text.replace(/[@#$]/g, '') });
        if (editableRef.current) editableRef.current.textContent = '';
      }
    }
  };

  // const selectOption = (type: string, id: string) => {
  //   let newNode: TransformNode;
  //   if (type === 'variable') newNode = { type: 'variable', variableId: id };
  //   else if (type === 'hashtag') newNode = { type: 'hashtag', value: 'Input' };
  //   else {
  //     const fn = FUNCTIONS.find((f) => f.id === id);
  //     newNode = { type: 'function', functionId: id, args: Array(fn?.params || 0).fill(null) };
  //   }
  //   onChange(newNode);
  //   setShowDropdown(false);
  //   if (editableRef.current) editableRef.current.textContent = '';
  // };

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
    const searchTxt = search.replace(/[@#$]/g, '').toLowerCase();
    const pool: OptionItem[] = [];

    if (!filterType || filterType === '@') pool.push(...VARIABLES);
    if (!filterType || filterType === '#')
      pool.push({ id: 'input', label: 'Input', type: 'hashtag' });
    if (!filterType || filterType === '$') pool.push(...FUNCTIONS);

    return pool.filter((item) => item.label.toLowerCase().includes(searchTxt));
  };

  // --- Render logic ---

  // 1. Nếu đã có Tag
  if (value) {
    return (
      <div className='inline-flex items-center group'>
        {/* Render Tag cho Variable, Hashtag, Literal */}
        <div
          className={`
          inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-medium
          ${
            value.type === 'function'
              ? 'text-purple-700 bg-purple-50 border border-purple-200'
              : value.type === 'variable'
                ? 'text-blue-700 bg-blue-50 border border-blue-200'
                : value.type === 'hashtag'
                  ? 'text-green-700 bg-green-50 border border-green-200'
                  : 'text-gray-700 bg-gray-100 border border-gray-200'
          }
        `}
        >
          <span>
            {value.type === 'function'
              ? value.functionId
              : value.type === 'variable'
                ? value.variableId
                : (value as any).value}
          </span>
          <button
            onClick={() => onChange(null)}
            className='transition-opacity opacity-0 hover:text-red-500 group-hover:opacity-100'
          >
            x
          </button>
        </div>

        {/* Nếu là Function, lồng các Arguments ngay trên cùng dòng */}
        {value.type === 'function' && (
          <div className='inline-flex items-center'>
            <span className='mx-0.5 font-bold text-purple-400'>(</span>
            {value.args.map((arg, idx) => (
              <React.Fragment key={idx}>
                <TransformInputInline
                  value={arg}
                  onChange={(newArg) => {
                    const newArgs = [...value.args];
                    newArgs[idx] = newArg;
                    onChange({ ...value, args: newArgs });
                  }}
                />
                {idx < value.args.length - 1 && <span className='mr-2 text-gray-400'>,</span>}
              </React.Fragment>
            ))}
            <span className='mx-0.5 font-bold text-purple-400'>)</span>
          </div>
        )}
      </div>
    );
  }

  // 2. Chế độ nhập liệu (Inline Input)
  return (
    <div className='relative inline-block align-middle'>
      <div
        ref={editableRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className='editable-input min-w-[200px] min-h-10 text-sm px-1 border border-gray-300 focus:border-blue-500 transition-colors inline-flex items-center'
        data-placeholder='...'
      />

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
    </div>
  );
};
export default TransformInputInline;
