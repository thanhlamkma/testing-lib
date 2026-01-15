import { useEditorSearch } from '@/pages/setting/hooks/useEditorSearch';
import { IData, OptionType, VALUE_TYPE } from '@/pages/setting/types';
import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Flex } from 'antd';
import { useState } from 'react';

const getTagColor = (type: string) => {
  if (type === VALUE_TYPE.VARIABLE) return 'bg-violet-100 border-violet-600';
  if (type === VALUE_TYPE.FUNCTION) return 'bg-sky-100 border-sky-600';
  return 'bg-lime-100 border-lime-600';
};

const insertTagAtCaret = (option: OptionType) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // remove "@xxx"
  range.setStart(range.startContainer, range.startOffset - option.label.length - 1);
  range.deleteContents();

  const tag = document.createElement('span');
  tag.contentEditable = 'false';
  tag.className = `inline-block px-2 py-1 rounded border text-xs mr-1 ${getTagColor(option.type)}`;
  tag.innerText = option.label;

  range.insertNode(tag);

  const space = document.createTextNode(' ');
  tag.after(space);

  range.setStartAfter(space);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

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
      className='fixed z-50 bg-white border rounded shadow'
      style={{ left: position.x, top: position.y }}
    >
      {options.map((opt) => (
        <div
          key={opt.value}
          className='px-2 py-1 text-sm cursor-pointer hover:bg-gray-100'
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(opt);
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
};

const TransformCellRender = () => {
  const { open, options, position, handleInput, setOpen } = useEditorSearch();

  return (
    <div className='relative'>
      <div
        contentEditable
        suppressContentEditableWarning
        className='px-2 py-1 min-h-[28px] border rounded'
        onInput={handleInput}
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

const Setting = () => {
  const [data, setData] = useState<IData[]>([
    {
      key: '1',
      name: 'Order Type',
      transform: [
        {
          id: 'transform-1',
          type: 'variable',
          value: 'orderType'
        }
      ],
      variableId: 'orderType',
      existVariableId: 'EXIST'
    }
  ]);

  const [columnDefs, setColumnDefs] = useState<ColDef<IData>[]>([
    {
      field: 'name',
      width: 280
    },
    {
      headerName: 'Transform',
      field: 'transform',
      minWidth: 16,
      width: 160,
      cellClass: '!p-0',
      cellRenderer: TransformCellRender
    },
    {
      headerName: 'Variable',
      field: 'variableId',
      width: 160
    },
    {
      headerName: 'Exist',
      field: 'existVariableId',
      width: 160
    }
  ]);

  return (
    <Flex className='h-full setting' align='center' vertical gap={16}>
      {/* <h2>Setting</h2> */}

      <AgGridReact<IData> className='w-1/3' rowData={data} columnDefs={columnDefs} />

      {/* <div style={{ flex: '1 1 auto' }}>
        <TreeView />
      </div> */}
    </Flex>
  );
};

export default Setting;
