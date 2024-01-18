import {
  Button,
  Card,
  Form,
  Image,
  Input,
  List,
  message,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { searchApps, checkout } from "../utils";
import PostApps from "./PostApps";

const { TabPane } = Tabs;
const { Text } = Typography;

const BrowseApps = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const resp = await searchApps(query);
      setData(resp || []);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    //除了展示用户app的card之外还需要提供搜索功能, 那么搜索也是要收集用户填入的数据,就需要Form这个component
    //<Form.Item>里面一定要放一个<Input/>,因为Form.Item是包裹在外面的,真正输字的地方是在input里面
    <>
      <Form onFinish={handleSearch} layout="inline">
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
      <List
        //与上面那个search的框有20的距离
        style={{ marginTop: 20 }}
        loading={loading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        //list里面最重要的两个部分: dataSource是把源数据这个数组拿过来,
        //data是一个javaScript object, 是通过utils.js最后那句 return response.json()把后端返回的json string立体化成object
        //renderItem是把dataSource里面的数据一个一个的转化成jsx
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card
              key={item.id}
              title={
                //Tooltip是鼠标放在title浮现的对话框
                <Tooltip title={item.description}>
                  <Text ellipsis={true} style={{ maxWidth: 150 }}>
                    {item.title}
                  </Text>
                </Tooltip>
              }
              extra={<Text type="secondary">${item.price}</Text>}
              //这个为什么是一个array?
              //在Antd的List.Item组件中，actions使用数组是因为它可以定义一个或多个组件应该如何渲染。
              actions={[
                <Button
                  shape="round"
                  type="primary"
                  onClick={() => checkout(item.id)}
                >
                  Checkout
                </Button>,
              ]}
            >
              <Image src={item.url} width="100%" />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

const HomePage = () => {
  return (
    //用Tabs这个component两个分页器,分为两个分页
    <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
      <TabPane tab="Browse Apps" key="1">
        <BrowseApps />
      </TabPane>
      <TabPane tab="Post Apps" key="2">
        <PostApps />
      </TabPane>
    </Tabs>
  );
};

export default HomePage;
