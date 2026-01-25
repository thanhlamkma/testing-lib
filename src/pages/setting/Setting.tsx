import ResizableHeaderCell, { MIN_WIDTH_COL } from '@/pages/setting/components/ResizableHeaderCell';
import TagInput from '@/pages/setting/components/TagInput';
import TransformInputV2, { TransformNodeV2 } from '@/pages/setting/components/TransformInput2';
import {
  functionOptions,
  recordedOptions,
  VALUE_TYPE,
  variableOptions
} from '@/pages/setting/types';
import { Flex, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * TASKS
 * 1. Resize colum of table
 * 2. Resize < 30px => show only column name
 * 3. Custom input in cell
 * 4. Custom tag in input
 * 5. Custom input in tag
 */

/**
 * QUESTION:
 * 1. Có requirement nào cho việc nhập giá trị không?
 * ví dụ nhập: [0-9]+ rồi nhập @ chọn variable có được không
 */

/**
 * Các khó khăn:
 * 1. Resize cột nhỏ hơn 30px sẽ hiện 1 cột custom chỉ có tên cột
 * 2. Chọn tag lồng tag
 */

/* ===================== TYPES ===================== */

interface OptionType {
  label: string;
  value: string;
  type: string;
}

interface TransformType {
  id: string;
  type: string;
  value: string;
}

interface IData {
  key: string;
  name: string;
  transform: TransformType[];
  variableId: string;
  existVariableId: string;
}

/* ===================== MOCK OPTIONS ===================== */
const allOptions = [...variableOptions, ...functionOptions, ...recordedOptions];

/* ===================== HELPERS ===================== */

const getTagColor = (type: string) => {
  if (type === VALUE_TYPE.VARIABLE) return 'bg-violet-100 border-violet-600';
  if (type === VALUE_TYPE.FUNCTION) return 'bg-sky-100 border-sky-600';
  return 'bg-lime-100 border-lime-600';
};

const isEditorEmpty = (el: HTMLDivElement | null) => {
  if (!el) return true;

  // có tag
  if (el.querySelector('span')) return false;

  return true;

  // có text
  // const text = el.innerText.replace(/\u00A0/g, '').trim();
  // return text.length === 0;
};

/* ===================== DROPDOWN ===================== */

const EditorDropdown = ({
  open,
  options,
  position,
  onSelect
}: {
  open: boolean;
  options: OptionType[];
  position: { x: number; y: number };
  onSelect: (opt: OptionType) => void;
}) => {
  if (!open) return null;

  return (
    <div
      className='fixed z-50 bg-white border border-neutral-400 shadow min-w-[150px]'
      style={{ left: position.x, top: position.y }}
    >
      {options.map((opt) => (
        <div
          key={opt.value}
          className='px-3 py-2 text-sm cursor-pointer hover:bg-neutral-100'
          onMouseDown={(e) => {
            e.preventDefault(); // keep selection
            onSelect(opt);
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
};

/* ===================== CELL EDITOR ===================== */

const TransformCellRender = ({ data }: { data: TransformType[] }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [options, setOptions] = useState<OptionType[]>([]);

  /* ---------- init content ---------- */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.innerHTML = data
      .map(
        (item) => `
        <span
          contenteditable="false"
          data-tag="true"
          class="relative inline-block px-2 py-1 mr-1 rounded border text-xs ${getTagColor(
            item.type
          )}"
        >
          ${allOptions.find((v) => v.value === item.value)?.label ?? ''}
          <button
            type="button"
            data-delete="true"
            class="absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center border rounded-full border-neutral-400 bg-white text-[8px] leading-[5px]"
          >
            &times;
          </button>
        </span>
      `
      )
      .join('');
  }, [data]);

  /* ---------- selection ---------- */
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      selectionRef.current = sel.getRangeAt(0);
    }
  };

  /* ---------- delete tag (SINGLE SOURCE) ---------- */
  const deleteTag = (tagEl?: HTMLElement) => {
    const editor = editorRef.current;
    if (!editor) return;

    if (tagEl) {
      tagEl.remove();
      return;
    }

    editor.innerHTML = '';
  };

  /* ---------- insert tag ---------- */
  const insertTagAtCaret = (option: OptionType) => {
    const editor = editorRef.current;
    const range = selectionRef.current;
    if (!editor || !range) return;

    if (!isEditorEmpty(editor)) {
      setOpen(false);
      return;
    }

    editor.innerText = ''; // remove trigger

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    const tag = document.createElement('span');
    tag.contentEditable = 'false';
    tag.className = `relative inline-block px-2 py-1 mr-1 rounded border text-xs ${getTagColor(
      option.type
    )}`;
    tag.innerText = option.label;

    const close = document.createElement('button');
    close.type = 'button';
    close.dataset.delete = 'true';
    close.className =
      'absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center border rounded-full border-neutral-400 bg-white text-[8px] leading-[5px]';
    close.innerHTML = '&times;';

    tag.appendChild(close);
    range.insertNode(tag);
    range.collapse(true);
  };

  /* ---------- BACKSPACE DELETE TAG ---------- */
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.dataset.delete) {
      const tag = target.closest('[data-tag]') as HTMLElement;
      deleteTag(tag);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const editor = editorRef.current;
    if (!editor) return;

    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if (!isEditorEmpty(editor) && !allowed.includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (e.key !== 'Backspace') return;

    const sel = window.getSelection();
    if (!sel?.rangeCount) return;

    const range = sel.getRangeAt(0);
    if (!range.collapsed) return;

    const node = range.startContainer;
    const prev =
      node.nodeType === Node.TEXT_NODE
        ? node.previousSibling
        : editor.childNodes[range.startOffset - 1];

    if (prev instanceof HTMLElement && prev.dataset.tag) {
      e.preventDefault();
      deleteTag(prev);
    }
  };

  /* ---------- trigger dropdown (example @) ---------- */
  const handleInput = () => {
    saveSelection();

    const editor = editorRef.current;
    const range = selectionRef.current;
    if (!editor || !range) return;

    if (!isEditorEmpty(editor)) {
      setOpen(false);
      return;
    }

    const text = range.startContainer.textContent?.slice(0, range.startOffset) || '';
    const match = text.match(/([@$#])([\w]*)$/);

    if (match) {
      const [, trigger] = match;
      if (trigger === '@') setOptions(variableOptions);
      if (trigger === '$') setOptions(functionOptions);
      if (trigger === '#') setOptions(recordedOptions);
    } else {
      setOptions(allOptions.filter((i) => i.label.toLowerCase().includes(text.toLowerCase())));
    }

    const rect = range.getBoundingClientRect();
    const fallback = editor.getBoundingClientRect();

    setPosition({
      x: rect.left || fallback.left + 8,
      y: rect.bottom || fallback.bottom - 5
    });
    setOpen(true);
  };

  const handleFocus = () => {
    const editor = editorRef.current;

    if (!isEditorEmpty(editor) || !editor) {
      setOpen(false);
      return;
    }
    const fallback = editor.getBoundingClientRect();
    console.log('🚀 ~ handleInput ~ fallback:', fallback);

    setPosition({
      x: fallback.left + 8,
      y: fallback.bottom - 5
    });
    setOptions(allOptions);
    setOpen(true);
  };

  return (
    <div className='relative'>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className='px-2 py-1 min-h-[28px]'
        tabIndex={0}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={() => setOpen(false)}
      />

      <EditorDropdown
        open={open}
        options={options}
        position={position}
        onSelect={(opt) => {
          insertTagAtCaret(opt);
          setOpen(false);
        }}
      />
    </div>
  );
};

/* ===================== PAGE ===================== */
type CustomColumnsType<T> = (ColumnsType<T>[number] & {
  collapsed?: boolean;
})[];

const CollapsedColumn = ({ title }: { title: React.ReactNode }) => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontSize: 12,
          whiteSpace: 'nowrap'
        }}
      >
        {title}
      </div>
    </div>
  );
};

const Setting = () => {
  const [data] = useState<IData[]>([
    {
      key: '1',
      name: 'Order Type',
      transform: [{ id: '1', type: VALUE_TYPE.VARIABLE, value: 'orderType' }],
      variableId: 'orderType',
      existVariableId: 'EXIST'
    },
    {
      key: '2',
      name: 'Sale Organization',
      transform: [],
      variableId: 'saleOrganization',
      existVariableId: ''
    }
  ]);

  const initColumns: CustomColumnsType<IData> = [
    { title: 'Name', dataIndex: 'name', ellipsis: true, width: 200 },
    {
      title: 'Transform',
      dataIndex: 'transform',
      ellipsis: true,
      className: 'relative border border-transparent focus-within:!border-sky-500',
      width: 220,
      render: (value) => <TransformCellRender data={value} />
    },
    { title: 'Variable', dataIndex: 'variableId', width: 160, render: () => <TagInput /> },
    { title: 'Exist', dataIndex: 'existVariableId', width: 160 }
  ];

  const [columns, setColumns] = useState<CustomColumnsType<IData>>(initColumns);

  const handleResize = useCallback(
    (index: number) =>
      (width: number): void => {
        setColumns((prev) => {
          const next = [...prev];
          next[index] = {
            ...next[index],
            width,
            collapsed: width <= MIN_WIDTH_COL
          };
          return next;
        });
      },
    []
  );

  const cols: CustomColumnsType<IData> = useMemo(() => {
    const mapped = columns.map((col, index) => {
      if (col.collapsed) {
        return {
          ...col,
          width: MIN_WIDTH_COL
        };
      }
      return {
        ...col,
        onHeaderCell: () => ({
          width: col.width,
          onResize: handleResize(index)
        })
      };
    });

    return mapped;
  }, [columns, handleResize]);

  const [transformData, setTransformData] = useState<{ root: TransformNodeV2 | null }>({
    root: {
      type: 'function',
      functionId: 'ifElse',
      args: [
        {
          type: 'hashtag',
          value: 'Input'
        },
        {
          type: 'function',
          functionId: 'concat',
          args: [
            {
              type: 'variable',
              variableId: 'Order Number'
            },
            {
              type: 'hashtag',
              value: 'Input'
            }
          ]
        }
      ]
    }
  });

  return (
    <Flex className='setting' align='center' vertical gap={16}>
      <Table
        className='w-[500px]'
        components={{
          header: {
            cell: ResizableHeaderCell
          }
        }}
        bordered
        size='small'
        scroll={{ x: 500, y: 500 }}
        columns={cols}
        dataSource={data}
        pagination={false}
      />

      <Flex gap={12}>
        <TransformInputV2
          value={transformData.root}
          onChange={(val) => setTransformData({ root: val })}
        />

        <pre className='p-4 mt-2 overflow-auto text-green-400 bg-gray-800 rounded max-h-96'>
          {JSON.stringify(transformData, null, 2)}
        </pre>
      </Flex>
    </Flex>
  );
};

export default Setting;
