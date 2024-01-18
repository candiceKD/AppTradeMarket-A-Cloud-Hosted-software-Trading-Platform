import { Button, Modal, Form, Input, message } from "antd";
import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { register } from "../utils";

//signup和login component最重要的要用到是form组件,就是填表
//因为注册和登录不能在同一个页面显示两张表,所以将不常用的注册做成modal弹窗
const SignupButton = () => {
  //凡是弹窗必定要有一个modalVisible的state
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  //modal必定要有个开关来控制状态开关
  const handleRegisterOnClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);

    try {
      await register(data);
      message.success("Sign up successfully");
      setModalVisible(false);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  //弹窗必定要有个入口:button,还要有个窗modal,两个是并列关系
  //Form的结构,外面必定有一个Form,里面每有一个用户需要填的必定对应一个Form.Item
  //Form的提交按钮必须也要对应一个Form.Item,而且Form.Item里面的Button必须有htmlType=Submit才能触发form的onFinish完成
  return (
    <>
      <Button
        type="link"
        style={{ padding: 0 }}
        onClick={handleRegisterOnClick}
      >
        Register Now!
      </Button>
      <Modal
        title="Sign Up"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form onFinish={handleFormSubmit}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              disabled={loading}
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password disabled={loading} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SignupButton;
