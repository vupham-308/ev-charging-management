import React from "react";
import { Card, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const TermsPrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <Card
        className="max-w-3xl w-full shadow-lg"
        style={{ borderRadius: 16, padding: 24 }}
      >
        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="m-0">
            Terms & Privacy Policy
          </Title>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-500 flex items-center"
          >
            <ArrowLeftOutlined className="mr-1" /> Back
          </button>
        </div>

        <Typography>
          <Paragraph>
            Welcome to our platform! By creating an account, you agree to follow
            these terms and conditions. Please read them carefully.
          </Paragraph>

          <Title level={4}>1. Account Responsibility</Title>
          <Paragraph>
            You are responsible for maintaining the confidentiality of your
            account information and password. Any activity under your account is
            your responsibility.
          </Paragraph>

          <Title level={4}>2. Use of Services</Title>
          <Paragraph>
            Our services are intended for lawful purposes only. You agree not to
            misuse or attempt to harm our system, other users, or the platform.
          </Paragraph>

          <Title level={4}>3. Privacy Policy</Title>
          <Paragraph>
            We value your privacy. We collect personal data (such as name,
            email, and phone number) solely for account creation and service
            purposes. We never sell or share your information with third
            parties, except as required by law.
          </Paragraph>

          <Title level={4}>4. Data Security</Title>
          <Paragraph>
            We use encryption and secure protocols to protect your personal
            information. However, no system is 100% secure, so please use strong
            passwords and safeguard your credentials.
          </Paragraph>

          <Title level={4}>5. Updates to Policy</Title>
          <Paragraph>
            We may update these Terms & Privacy Policy from time to time. Any
            changes will be announced on this page. Continued use of our
            platform means you accept the new terms.
          </Paragraph>

          <Paragraph>
            If you have any questions about these terms, please contact our
            support team.
          </Paragraph>

          <Paragraph strong>
            Thank you for trusting our platform and being part of our community!
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default TermsPrivacyPage;
