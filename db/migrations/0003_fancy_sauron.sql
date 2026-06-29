ALTER TABLE "late_arrival" DROP CONSTRAINT "late_arrival_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "leave" DROP CONSTRAINT "leave_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "late_arrival" ADD CONSTRAINT "late_arrival_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave" ADD CONSTRAINT "leave_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;