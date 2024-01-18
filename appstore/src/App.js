import { Layout, Dropdown, Menu, Button, message } from "antd";
//这是import一个图标库
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";

//用一个解构语法将这两个component从Layout component里面拿出来
const { Header, Content } = Layout;

const App = () => {
  //登陆与否这个状态肯定是最顶端的状态, 那么就要放在最顶端的component里面
  const [authed, setAuthed] = useState();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthed(authToken !== null);
    //这是个缩写,把条件放在state里面来判断, 符合条件设为true,否则设为false
  }, []);
  //在第一次render之后执行一次, 直接在useEffect我们经常会做一些API调用拉取数据的操作,也可以在功能代码运行之前做一些初始化的工作
  //这里我们做的是把Token拿出来

  useEffect(() => {
    //这个是来处理当checkout成功跳转到成功页面的时候给用户一些提示
    //window.location.search就是用来拿query string的,
    //这个string会很长, 所以我们要用URLSearchParams的方法来处理query string, 去找关键词
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      message.success("Order Placed!");
    }
  }, []);

  const handleLoginSuccess = () => {
    setAuthed(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    setAuthed(false);
    //没有这一行代码,状态不会改变, 就不会re-render, 所以页面就不会刷新
  };
  //是在前端的代码里面在logout的时候把token拿掉了
  //logout写在这里是因为logout不call后端的api,主要是与页面的UI状态有关

  const renderContent = () => {
    if (authed === undefined) {
      return <></>;
    }

    if (!authed) {
      return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }
    //如果没登录就展示登录页面
    //如果登录了就展示homepage

    return <HomePage />;
  };

  const userMenu = (
    //menu就是做出菜单栏的效果
    <Menu>
      <Menu.Item key="logout" onClick={handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    //组装      vh是viewHeight,100vh就是撑满整个可视区域
    //flex是flex-box语法, 这一行能够做的事情是header部分的内部两个框框成对称分布
    //header里面分别定义了两个框框的css, 第二个只要authed的state为true那么就展示一个登出的dropdown,
    //然后把登出的jsx定义在外面,因为防止return部分的jsx过长
    <Layout style={{ height: "100vh" }}>
      <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
          App Store
        </div>
        {authed && (
          <div>
            <Dropdown trigger="click" overlay={userMenu}>
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          </div>
        )}
      </Header>
      <Content
        style={{ height: "calc(100% - 64px)", padding: 20, overflow: "auto" }}
      >
        {renderContent()}
        {/*content这里也是引出一个jsx到外面,没有放在里面*/}
      </Content>
    </Layout>
  );
};

export default App;
