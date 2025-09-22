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

import type { UserType } from "@/types";
import type { LeaveTableInsertType } from "@/db/types";

interface LeaveRequestEmailProps {
  leave: LeaveTableInsertType;
  user: UserType;
}

export const LeaveRequestEmail = ({ leave, user }: LeaveRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>{user.user.name} just applied for leave.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section>
          <Heading as="h1" style={heading}>
            New Leave Request
          </Heading>
          <Text style={text}>
            <strong>{user.user.name}</strong> ({user.user.email}) has submitted
            a leave request.
          </Text>
          <Text style={text}>Here are the details:</Text>
          <Text style={details}>
            <strong>From:</strong> {leave.fromDate}
            <br />
            <strong>To:</strong> {leave.toDate}
            <br />
            <strong>Days:</strong> {leave.numberOfDays}
            <br />
            <strong>Reason:</strong> {leave.reason}
          </Text>
          <Text style={footer}>
            Please review and take action as required.
            <br />— HR Management System
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f9f9f9",
  padding: "40px 0",
  fontFamily: "Helvetica, Arial, sans-serif",
} as const;

const container = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "8px",
  maxWidth: "600px",
  margin: "0 auto",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
} as const;

const heading = {
  fontSize: "22px",
  color: "#333",
  marginBottom: "20px",
} as const;

const text = {
  fontSize: "16px",
  color: "#444",
  marginBottom: "10px",
  lineHeight: "1.6",
} as const;

const details = {
  fontSize: "16px",
  backgroundColor: "#f1f1f1",
  padding: "15px",
  borderRadius: "6px",
  color: "#333",
  lineHeight: "1.6",
} as const;

const footer = {
  fontSize: "14px",
  color: "#999",
  marginTop: "30px",
  textAlign: "center",
} as const;
