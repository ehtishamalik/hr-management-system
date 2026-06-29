ALTER TABLE "late_arrival" DROP CONSTRAINT "late_arrival_resolved_leave_id_fk";
--> statement-breakpoint
ALTER TABLE "late_arrival" ADD CONSTRAINT "late_arrival_resolved_leave_id_fk" FOREIGN KEY ("resolved") REFERENCES "public"."leave"("id") ON DELETE set null ON UPDATE no action;