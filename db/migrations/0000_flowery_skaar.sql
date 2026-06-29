CREATE TYPE "public"."leave_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'APPROVED', 'REJECTED', 'SUSPENDED', 'LATE');--> statement-breakpoint
CREATE TYPE "public"."leave_type_enum" AS ENUM('PAID', 'UNPAID');--> statement-breakpoint
CREATE TYPE "public"."pf_contribution_type_enum" AS ENUM('fixed', 'match_employee');--> statement-breakpoint
CREATE TYPE "public"."pf_transaction_type_enum" AS ENUM('monthly_contribution', 'withdrawal');--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('USER', 'MANAGER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "emergency_contact" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"relation" varchar(120) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "emergency_contact_phone_format" CHECK ("emergency_contact"."phone" ~ '^\+92 \d{3} \d{7}$')
);
--> statement-breakpoint
CREATE TABLE "late_arrival" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"arrival_time" time NOT NULL,
	"comment" text,
	"resolved" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_remark" (
	"id" text PRIMARY KEY NOT NULL,
	"leave_id" text NOT NULL,
	"user_id" text NOT NULL,
	"remark" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"leave_type_id" text NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"reason" text NOT NULL,
	"leave_status" "leave_status_enum" DEFAULT 'PENDING' NOT NULL,
	"number_of_days" integer NOT NULL,
	"leave_year" varchar(4) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_expense" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "medical_limit_year_unique" UNIQUE("year")
);
--> statement-breakpoint
CREATE TABLE "pf_ledger" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"transaction_type" "pf_transaction_type_enum" NOT NULL,
	"employee_contribution" numeric(12, 2) DEFAULT '0' NOT NULL,
	"company_contribution" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_contribution" numeric(12, 2) DEFAULT '0' NOT NULL,
	"withdrawal_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"reference_id" text,
	"remarks" text,
	"processed_by" text,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"employee_monthly_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"company_contribution_enabled" boolean DEFAULT false NOT NULL,
	"company_contribution_type" "pf_contribution_type_enum" DEFAULT 'fixed',
	"company_contribution_amount" numeric(12, 2) DEFAULT '0',
	"effective_from" date NOT NULL,
	"status" "status_enum" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pf_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "policy" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(255) NOT NULL,
	"policy" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_detail" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"employee_id" varchar(50) NOT NULL,
	"role" "role_enum" DEFAULT 'USER' NOT NULL,
	"status" "status_enum" DEFAULT 'ACTIVE' NOT NULL,
	"team_lead_id" text,
	"designation" varchar(100),
	"dob" date,
	"cnic" varchar(15),
	"phone" varchar(20),
	"address" text,
	"currency" varchar(3) DEFAULT 'PKR' NOT NULL,
	"salary" numeric(10, 2),
	"tax_amount" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_detail_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "emergency_contact" ADD CONSTRAINT "emergency_contact_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "late_arrival" ADD CONSTRAINT "late_arrival_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "late_arrival" ADD CONSTRAINT "late_arrival_resolved_leave_id_fk" FOREIGN KEY ("resolved") REFERENCES "public"."leave"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_remark" ADD CONSTRAINT "leave_remark_leave_id_leave_id_fk" FOREIGN KEY ("leave_id") REFERENCES "public"."leave"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_remark" ADD CONSTRAINT "leave_remark_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave" ADD CONSTRAINT "leave_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_expense" ADD CONSTRAINT "medical_expense_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_ledger" ADD CONSTRAINT "pf_ledger_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_ledger" ADD CONSTRAINT "pf_ledger_processed_by_user_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_settings" ADD CONSTRAINT "pf_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy" ADD CONSTRAINT "policy_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_detail" ADD CONSTRAINT "user_detail_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_detail" ADD CONSTRAINT "user_detail_team_lead_id_user_id_fk" FOREIGN KEY ("team_lead_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "emergency_contact_user_idx" ON "emergency_contact" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "leave_user_idx" ON "leave" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "leave_year_idx" ON "leave" USING btree ("leave_year");--> statement-breakpoint
CREATE INDEX "leave_user_year_idx" ON "leave" USING btree ("user_id","leave_year");--> statement-breakpoint
CREATE UNIQUE INDEX "medical_expense_user_year_month_idx" ON "medical_expense" USING btree ("user_id","year","month");--> statement-breakpoint
CREATE INDEX "pf_ledger_user_idx" ON "pf_ledger" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pf_ledger_user_year_idx" ON "pf_ledger" USING btree ("user_id","year");--> statement-breakpoint
CREATE INDEX "pf_ledger_year_month_idx" ON "pf_ledger" USING btree ("year","month");--> statement-breakpoint
CREATE INDEX "pf_settings_user_idx" ON "pf_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");