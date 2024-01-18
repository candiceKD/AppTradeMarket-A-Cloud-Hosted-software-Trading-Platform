import React, { useRef, useState } from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import { uploadApp } from "../utils";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}; //这个antd就是控制整体的布局的

const PostApps = () => {
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null); //Ref这是react的概念, useRef是一个hook, 这一句是初始化fileInputRef这个object
  //先要创建一个ref,就用useRef

  const handleFormSubmit = async (data) => {
    const { files } = fileInputRef.current;
    //然后当用户去填这个信息,会在这里拿到这个files

    setLoading(true);

    try {
      await uploadApp(data, files[0]);
      //前端设计为只能选择一个文件，那么 files[0] 就会是那个唯一的文件
      message.success("upload successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    //<Input/>是antd的component,而小写的<input/>是浏览器自带的
    //Antd Form组件，rules 属性接受一个数组，这个数组定义了一组验证规则（validation rules），用来对表单项进行校验。
    //prefix="$": 这个属性为输入框设置了一个前缀，即在用户输入的数值前会显示一个美元
    //precision={2}: 这个属性定义了数值的精度。在这个例子中，精度被设置为2，意味着输入的数值会被限制为有两位小数。
    <Form
      {...layout}
      onFinish={handleFormSubmit}
      style={{ maxWidth: 1000, margin: "auto" }}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
      </Form.Item>
      <Form.Item name="picture" label="Picture" rules={[{ required: true }]}>
        <input
          type="file"
          accept="image/png, image/jpeg" //还可以加application/zip,video/mp4
          ref={fileInputRef} //把fileInputRef这个object赋给input的ref props
        />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, type: "number", min: 0 }]}
      >
        <InputNumber prefix="$" precision={2} />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostApps;
