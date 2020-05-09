import React, { useEffect } from "react";
import { createFromIconfontCN } from "@ant-design/icons";
import { Menu } from "antd";
import { connect } from "react-redux";

import { NavLink } from "react-router-dom";

import { GetSidebarItems, clickLogout } from "../../actions/header_actions";
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1807831_b5n855l0bav.js",
});

const { SubMenu } = Menu;

const AppMenu = props => {
  const { sidebarItems, department, isAuthenticated } = props;
  const { GetSidebarItems, clickLogout } = props;

  useEffect(() => {
    if (isAuthenticated) {
      GetSidebarItems();
    }
    return () => {};
  }, [GetSidebarItems, isAuthenticated]);

  return (
    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
      {sidebarItems.map(item => {
        if (item.allow_department.includes(department)) {
          if (item.link) {
            return (
              <Menu.Item style={{ marginTop: 0 }} key={item.name}>
                <IconFont type={item.icon} />
                <NavLink to={item.link} className="nav-text"></NavLink>
                {item.name}
              </Menu.Item>
            );
          } else {
            return (
              <SubMenu key={item.name} title={item.name} icon={<IconFont type={item.icon} />}>
                {/* <IconFont type={item.icon} /> */}
                {item.items.map(subitem => (
                  <Menu.Item style={{ marginTop: 0 }} key={subitem.link}>
                    <IconFont type={subitem.icon} />
                    <NavLink to={subitem.link} className="nav-text"></NavLink>
                    {subitem.name}
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          }
        }
        return null;
      })}

      <Menu.Item style={{ marginTop: 0 }} onClick={clickLogout}>
        <IconFont type="icon-kehu" />
        登出
      </Menu.Item>
    </Menu>
  );
};

const mapStateToProps = ({ HeaderReducer }) => {
  return {
    sidebarItems: HeaderReducer.sidebarItems,
    department: HeaderReducer.department,
    isAuthenticated: HeaderReducer.isAuthenticated,
  };
};

export default connect(mapStateToProps, { GetSidebarItems, clickLogout })(AppMenu);
