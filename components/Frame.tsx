import React from 'react'
import { useRouter, withRouter } from 'next/router';
import { Layout, Menu } from 'antd';
import { routes } from '../configs/routers';
import Icon from './Icon';
import TabRoute from './TabRoute';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


function Frame(props) {
    const router = useRouter();

    const handleClick = (e) => {
        // console.log(e);
        // e.preventDefault()
        if (e.key.indexOf("/") > -1) {
            router.push(e.key)
        }
    }

    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['/']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        {routes.map((route, index) => {
                            if (route.isExpand) {
                                return (
                                    <SubMenu key={route.hasOwnProperty("path") ? route.path : index} icon={<Icon name={route.icon}></Icon>} title={route.title} onClick={handleClick}>
                                        {
                                            route.children.map((subItem, subIndex) =>
                                            (
                                                <Menu.Item key={subItem.hasOwnProperty("path") ? subItem.path : subIndex}>
                                                    {subItem.title}
                                                </Menu.Item>
                                            ))
                                        }
                                    </SubMenu>
                                )
                            } else {
                                return (
                                    <Menu.Item key={route.hasOwnProperty("path") ? route.path : index} icon={<Icon name={route.icon}></Icon>} onClick={handleClick}>
                                        {route.title}
                                    </Menu.Item>
                                )
                            }
                        })}
                    </Menu>
                </Sider>
                <Layout style={{ padding: '16px' }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            backgroundColor: 'white'
                        }}
                    >
                        {/* <TabRoute {...props}></TabRoute> */}
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default withRouter(Frame)
