import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Section,
  Heading,
} from "@react-email/components";

interface EmailTemplateProps {
  otp: string;
}

export const OTPEmailTemplate = ({ otp }: EmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Your One-Time Password (OTP) is here {otp}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section>
          <Heading as="h1" style={heading}>
            Your OTP Code
          </Heading>
          <Text style={text}>
            Please use the following one-time password (OTP) to log in:
          </Text>
          <Text style={otpText}>{otp}</Text>
          <Text style={text}>
            This code is valid for the next 5 minutes. If you did not request
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

const otpText = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#0070f3",
  textAlign: "center",
  margin: "20px 0",
  letterSpacing: "4px",
} as const;

const footer = {
  fontSize: "14px",
  color: "#888",
  marginTop: "40px",
  textAlign: "center",
} as const;
