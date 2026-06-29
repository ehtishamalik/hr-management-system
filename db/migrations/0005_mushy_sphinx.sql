CREATE INDEX "leave_user_idx" ON "leave" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "leave_year_idx" ON "leave" USING btree ("leave_year");--> statement-breakpoint
CREATE INDEX "leave_user_year_idx" ON "leave" USING btree ("user_id","leave_year");