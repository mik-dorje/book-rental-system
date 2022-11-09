import Icon, {
  ApiFilled,
  BookFilled,
  CodeSandboxCircleFilled,
  FolderOpenFilled,
  IdcardFilled,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SkinFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Layout, Menu, Typography } from "antd";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../images/3dlogo.png";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "1",
    icon: FolderOpenFilled,
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
    icon: SkinFilled,
    label: "Member",
    path: "/bookrent/member",
  },
  {
    key: "5",
    icon: ApiFilled,
    label: "Book Transaction",
    path: "/bookrent/booktransaction",
  },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{ borderRight: "1px solid gray" }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="logo-box">
          <img src={logo} alt="Logo" width="55px" />
        </div>
        {/* <div className="logo-box">
          <CodeSandboxCircleFilled
            style={{ color: "white", fontSize: "45px" }}
          />
        </div> */}

        {/* <Divider /> */}
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
            style={{ marginTop: "8px" }}
          >
            <>
              {menuItems.map((item) => (
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
            </>
          </Menu>
          <Menu theme="dark" mode="inline">
            <Menu.Item key={null}>
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

          {/* {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )} */}

          <Typography.Title level={3} style={{ color: "white" }}>
            Book Rental System
          </Typography.Title>

          <Avatar
            size="large"
            style={{ backgroundColor: "#87d068", marginRight: "8px" }}
            icon={<UserOutlined />}
          />
        </Header>
        <Content
          className="content"
          style={{
            margin: "10px 6px",
            padding: "10px",
            minHeight: `calc(100vh - 80px)`,
            borderRadius: "6px",
            backgroundColor: "#eaeaea",
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
