import Icon, {
  BookFilled,
  DatabaseFilled,
  DiffFilled,
  FolderOpenFilled,
  IdcardFilled,
  InteractionFilled,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import logo from "../images/3dlogo.png";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "1",
    icon: DatabaseFilled,
    label: "Category",
    path: "/bookrental/category",
  },
  {
    key: "2",
    icon: BookFilled,
    label: "Book",
    path: "/bookrental/book",
  },
  {
    key: "3",
    icon: IdcardFilled,
    label: "Author",
    path: "/bookrental/author",
  },
  {
    key: "4",
    icon: SolutionOutlined,
    label: "Member",
    path: "/bookrental/member",
  },
];

const subItems = [
  {
    key: "6",
    icon: InteractionFilled,
    label: "Book History",
    path: "/bookrental/booktransaction",
  },
  {
    key: "7",
    icon: DiffFilled,
    label: "Add Transaction",
    path: "/bookrental/booktransaction/add-book-transaction",
  },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { auth } = useAuth();

  // Find another way
  useEffect(() => {
    if (window.innerWidth < 684) {
      setCollapsed(true);
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        className="my-drawer"
        style={{ borderRight: "1px solid gray" }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="logo-box">
          <img src={logo} alt="Logo" width="55px" />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: `calc(100vh - 60px)`,
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["5"]}
            style={{ marginTop: "8px" }}
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key}>
                <Icon
                  component={item.icon as React.ForwardRefExoticComponent<any>}
                />
                <span>{item.label}</span>
                <Link to={item.path} />
              </Menu.Item>
            ))}

            <Menu.SubMenu
              key={5}
              title="Book Transaction"
              icon={<FolderOpenFilled />}
            >
              {subItems.map((item) => (
                <Menu.Item key={item.key}>
                  <Icon
                    component={
                      item.icon as React.ForwardRefExoticComponent<any>
                    }
                  />
                  <span>{item.label}</span>
                  <Link to={item.path} />
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          </Menu>

          <Menu theme="dark" mode="inline">
            <Menu.Item
              key={null}
              onClick={() => localStorage.removeItem("user")}
            >
              <LogoutOutlined style={{ fontSize: "22px" }} />
              <span>EXIT</span>
              <Link to="/" />
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      <Layout className="site-layout">
        <Header className="header" style={{ padding: 0 }}>
          <div className="trigger">
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />
            )}
          </div>

          <Typography.Title level={3} style={{ color: "white" }}>
            Book Rental System
          </Typography.Title>

          {auth ? (
            <Avatar
              size="large"
              style={{ backgroundColor: "#87d068", marginRight: "8px" }}
            >
              {auth.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar
              size="large"
              style={{ backgroundColor: "#87d068", marginRight: "8px" }}
              icon={<UserOutlined />}
            />
          )}
        </Header>
        <Content
          className="content"
          style={{
            margin: "10px 6px",
            padding: "10px",
            minHeight: `calc(100vh - 80px)`,
            borderRadius: "6px",
            border: "1px solid gray",
            textAlign: "center",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
