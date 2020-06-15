import React, { useEffect } from "react";
import IconFont from "../common/iconfont";
import { Menu } from "antd";
import { connect } from "react-redux";
// import Icons from "./icon";

import { NavLink } from "react-router-dom";

import { GetSidebarItems, clickLogout, updateState } from "../../actions/header_actions";

const { SubMenu } = Menu;

const AppMenu = props => {
  const { sidebarItems, department, isAuthenticated } = props;
  const { GetSidebarItems, clickLogout, updateState } = props;

  useEffect(() => {
    // if (isAuthenticated) {
    GetSidebarItems();
    // }
    return () => {};
  }, [GetSidebarItems, isAuthenticated]);

  return (
    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
      {sidebarItems.map(item => {
        if (item.allow_department.includes(department)) {
          if (item.link) {
            // const IconTorender = Icons["AccountBookFilled"];
            return (
              <Menu.Item style={{ marginTop: 0 }} key={item.name}>
                <IconFont type={item.icon} />
                <NavLink
                  to={item.link}
                  className="nav-text"
                  onClick={() => updateState("currentPath", [item.name])}
                ></NavLink>
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
                    <NavLink
                      to={subitem.link}
                      className="nav-text"
                      onClick={() => updateState("currentPath", [item.name, subitem.name])}
                    ></NavLink>
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
    currentPath: HeaderReducer.currentPath,
  };
};

export default connect(mapStateToProps, { GetSidebarItems, clickLogout, updateState })(AppMenu);
