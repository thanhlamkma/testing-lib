import { useExpressionSearch } from '@/pages/setting/hooks/useExpressionSearch';
import { Flex, Select, SelectProps, Tag } from 'antd';

// @, $, #
// @: Variable list
// $: Built-in function list
// #: Direct value of cell
const PREFIX = {
  VARIABLE: 'variable___',
  FUNCTION: 'function___'
} as const;

const variableOptions: SelectProps['options'] = [
  { label: 'Order Type', value: `${PREFIX.VARIABLE}orderType` },
  { label: 'Division', value: `${PREFIX.VARIABLE}division` },
  { label: 'Channel', value: `${PREFIX.VARIABLE}channel` }
];

const functionOptions: SelectProps['options'] = [
  {
    label: 'regexValue',
    value: `${PREFIX.FUNCTION}regexValue`
  }
];

type TagRender = SelectProps['tagRender'];

const tagRender: TagRender = (props) => {
  const { label, value, closable, onClose } = props;

  const isFunction = typeof value === 'string' && value.startsWith(PREFIX.FUNCTION);

  const getTagColor = (value?: string) => {
    if (!value) return 'green';
    if (value.startsWith(PREFIX.VARIABLE)) return 'cyan';
    if (value.startsWith(PREFIX.FUNCTION)) return 'lime';
    return 'green';
  };

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={getTagColor(value)}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {isFunction ? <FunctionTag label={label} /> : label}
    </Tag>
  );
};

const ArgumentSelect = () => {
  const argumentOptions = [...variableOptions, ...functionOptions];

  const { options, onSearch } = useExpressionSearch(
    argumentOptions,
    variableOptions,
    functionOptions
  );

  return (
    <Select
      size='small'
      mode='multiple'
      showSearch
      filterOption={false}
      variant='borderless'
      className='min-w-[120px] augment-select'
      options={options}
      onSearch={onSearch}
      tagRender={tagRender}
    />
  );
};

const FunctionTag = ({ label }: { label: React.ReactNode }) => {
  return (
    <span className='inline-flex items-center gap-1'>
      <span>{label}</span>
      <span>(</span>
      <ArgumentSelect />
      <span>,</span>
      <ArgumentSelect />
      <span>)</span>
    </span>
  );
};

const Setting = () => {
  // const [data, setData] = useState<Item[]>([
  //   { key: '1', name: 'John', age: 25 },
  //   { key: '2', name: 'Jane', age: 30 }
  // ]);

  // const columns = [
  //   {
  //     title: 'Name',
  //     dataIndex: 'name',
  //     editable: true
  //   },
  //   {
  //     title: 'Age',
  //     dataIndex: 'age',
  //     editable: true
  //   }
  // ];

  const allOptions = [...variableOptions, ...functionOptions];

  const { options, onSearch } = useExpressionSearch(allOptions, variableOptions, functionOptions);

  return (
    <Flex className='setting' style={{ height: '100%' }} vertical gap={16}>
      <h2>Setting</h2>

      <Select
        mode='multiple'
        showSearch
        filterOption={false}
        options={options}
        onSearch={onSearch}
        tagRender={tagRender}
        style={{ width: '100%' }}
        placeholder='Type @ for variables, $ for functions, # for input'
      />

      {/* <EditableTable
        columns={columns}
        dataSource={data}
        onDataChange={(newData) => setData(newData)}
        pagination={false}
      /> */}

      {/* <div style={{ flex: '1 1 auto' }}>
        <TreeView />
      </div> */}
    </Flex>
  );
};

export default Setting;
