import { ArrowUpOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { FC } from 'react';

interface AIChatBoxProps {
  handleSubmit: (message: string) => void;
}

const AIChatBox: FC<AIChatBoxProps> = ({ handleSubmit }) => {
  const [form] = Form.useForm();

  const onSubmit = (values: { message: string }) => {
    handleSubmit(values.message);
    form.resetFields();
  };

  return (
    <div className=' chat-container'>
      <Form form={form} className='flex flex-col h-full gap-4' onFinish={onSubmit}>
        <Form.Item name='message' noStyle>
          <Input.TextArea
            className='chat-input'
            placeholder='Type your message...'
            autoSize={{
              minRows: 1,
              maxRows: 4
            }}
          />
        </Form.Item>

        <div className='flex justify-between gap-4'>
          <Button type='text' icon={<UploadOutlined style={{ fontSize: 20 }} />} />
          <Button
            type='primary'
            htmlType='submit'
            icon={<ArrowUpOutlined style={{ fontSize: 16 }} />}
          />
        </div>
      </Form>
    </div>
  );
};

export default AIChatBox;
