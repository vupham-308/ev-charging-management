import React from 'react';
import { Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import './AppFooter.css';

const { Title, Text } = Typography;

const AppFooter = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <Title level={5}>Trạm Sạc Xe Điện</Title>
          <Text>Hệ thống trạm sạc xe điện hàng đầu Việt Nam, cung cấp dịch vụ sạc nhanh, an toàn và tiện lợi trên toàn quốc.</Text>

        </div>
        <div className="footer-section">
          <Title level={5}>Hỗ trợ</Title>
          <Text>Câu hỏi thường gặp</Text><br />
          <Text>Báo cáo sự cố</Text><br />
          <Text>Chính sách bảo mật</Text><br />
          <Text>Điều khoản sử dụng</Text><br />
        </div>
        <div className="footer-section">
          <Title level={5}>Liên hệ</Title>
          <Text><MailOutlined /> support@tramsacxedien.vn</Text>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;