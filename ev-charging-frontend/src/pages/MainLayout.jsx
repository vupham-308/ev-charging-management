import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import AppFooter from './AppFooter';

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0 24px' }}>

        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;