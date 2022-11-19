import Icon, {
  ApiFilled,
  BookFilled,
  DatabaseFilled,
  DesktopOutlined,
  FallOutlined,
  FolderOpenFilled,
  IdcardFilled,
  InteractionFilled,
  LaptopOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  PieChartOutlined,
  RiseOutlined,
  SkinFilled,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
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
    path: "/bookrent/member",
  },
];

const subItems = [
  {
    key: "6",
    icon: InteractionFilled,
    label: "History",
    path: "/bookrent/booktransaction",
  },
  {
    key: "7",
    icon: RiseOutlined,
    label: "Rent Book",
    path: "/bookrent/booktransaction/rent-book",
  },
  {
    key: "8",
    icon: FallOutlined,
    label: "Return Book",
    path: "/bookrent/booktransaction/return-book",
  },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

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
            // backgroundColor: "#eaeaea",
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
