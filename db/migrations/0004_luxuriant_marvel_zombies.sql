CREATE TYPE "public"."pf_contribution_type_enum" AS ENUM('fixed', 'match_employee');--> statement-breakpoint
CREATE TYPE "public"."pf_transaction_type_enum" AS ENUM('monthly_contribution', 'withdrawal');--> statement-breakpoint
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
ALTER TABLE "pf_ledger" ADD CONSTRAINT "pf_ledger_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_ledger" ADD CONSTRAINT "pf_ledger_processed_by_user_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_settings" ADD CONSTRAINT "pf_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pf_ledger_user_idx" ON "pf_ledger" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pf_ledger_user_year_idx" ON "pf_ledger" USING btree ("user_id","year");--> statement-breakpoint
CREATE INDEX "pf_ledger_year_month_idx" ON "pf_ledger" USING btree ("year","month");--> statement-breakpoint
CREATE INDEX "pf_settings_user_idx" ON "pf_settings" USING btree ("user_id");