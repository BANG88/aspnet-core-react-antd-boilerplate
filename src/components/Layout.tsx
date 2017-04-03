import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content } = Layout;
import { Link } from 'react-router';

export interface LayoutProps {
    body: React.ReactElement<any>;
}
export default class AppLayout extends React.Component<LayoutProps, any> {
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        return (
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <div className="logo">
                        <Icon type="windows" />
                        {!this.state.collapsed && <span style={{ marginLeft: 10 }}>ANT DESIGN</span>}
                    </div>
                    <Menu theme="dark" mode="inline">
                        <Menu.Item key="1" style={{ padding: '0!important' }}>
                            <Link to={'/'} style={{ paddingLeft: 24 }} activeClassName='ant-menu-item-selected'>
                                <Icon type="home" />
                                <span className="nav-text">Home</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2" style={{ padding: '0!important' }}>
                            <Link to={'/counter'} style={{ paddingLeft: 24 }} className="menu-item" activeClassName='ant-menu-item-selected'>
                                <Icon type="plus" />
                                <span className="nav-text">Counter</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3" style={{ padding: '0!important' }}>
                            <Link to={'/fetchdata'} style={{ paddingLeft: 24 }} className="menu-item" activeClassName='ant-menu-item-selected'>
                                <Icon type="cloud" />
                                <span className="nav-text">Fetch data</span>
                            </Link>
                        </Menu.Item>

                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                        {this.props.body}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
