import React from "react";

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Section,
  Heading,
  Link,
} from "@react-email/components";
import { Button } from "../ui/button";

interface EmailTemplateProps {
  url: string;
}

export const MagicLinkEmailTemplate = ({ url }: EmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Click the link to login to HRM!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section>
          <Heading as="h1" style={heading}>
            Your Magic Link
          </Heading>
          <Text style={text}>
            Please use the following magic link to log in:
          </Text>
          <Button asChild>
            <Link
              style={buttonStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, {});
              }}
              href={url}
            >
              Click Me
            </Link>
          </Button>
          <Text style={text}>
            This link is valid for the next 5 minutes. If you did not request
            this, please ignore this email.
          </Text>
          <Text style={footer}>— HR Management System</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f4f4f4",
  padding: "40px 0",
  fontFamily: "Helvetica, Arial, sans-serif",
} as const;

const container = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "600px",
  margin: "0 auto",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
} as const;

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#333",
} as const;

const text = {
  fontSize: "16px",
  color: "#555",
  lineHeight: "1.5",
  marginBottom: "20px",
} as const;

const buttonStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#ffffff",
  textAlign: "center",
  margin: "20px 0",
  letterSpacing: "1px",
  padding: "12px 24px",
  background: "linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
} as const;

const buttonHoverStyle = {
  transform: "scale(1.05)",
  boxShadow: "0 4px 12px rgba(0, 112, 243, 0.3)",
};

const footer = {
  fontSize: "14px",
  color: "#888",
  marginTop: "40px",
  textAlign: "center",
} as const;
