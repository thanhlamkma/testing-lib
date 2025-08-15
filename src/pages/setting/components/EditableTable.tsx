/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputRef, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ColumnsType, TableProps } from 'antd/es/table';
import React, { useContext, useEffect, useRef, useState } from 'react';

export interface Item {
  key: string;
  [key: string]: any;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const form = useContext(EditableContext)!;
  const inputRef = useRef<InputRef>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (err) {
      console.log('Save failed:', err);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div style={{ paddingRight: 24, cursor: 'pointer' }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface EditableTableProps extends TableProps<Item> {
  onDataChange?: (data: Item[]) => void;
}

export const EditableTable: React.FC<EditableTableProps> = ({ onDataChange, ...props }) => {
  const [dataSource, setDataSource] = useState<Item[]>(Array.from(props.dataSource ?? []));

  const handleSave = (row: Item) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      setDataSource(newData);
      onDataChange?.(newData);
    }
  };

  const mergedColumns: ColumnsType<Item> = (props.columns || []).map((col) => {
    // Only process columns that are not group columns and are editable
    if (!('editable' in col) || !col.editable || !('dataIndex' in col)) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        editable: col.editable,
        dataIndex: (col as any).dataIndex as keyof Item,
        // Ensure title is a string or undefined
        title: typeof col.title === 'string' ? col.title : undefined,
        handleSave
      })
    };
  });

  return (
    <Table
      {...props}
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell
        }
      }}
      columns={mergedColumns as ColumnsType<Item>}
      dataSource={dataSource}
    />
  );
};
