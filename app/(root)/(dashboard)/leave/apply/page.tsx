import React from "react";
import LeaveForm from "@/components/LeaveForm";
import ToastError from "@/components/toast-error";

import { getLeaveTypes } from "@/lib/helpers/leave-type";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LeaveApply = async () => {
  const leaveTypes = await getLeaveTypes();

  if (!leaveTypes) {
    return <ToastError message="Error fetching leaves types." />;
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-8">Apply for Leave</h1>
      <section>
        <div className="grid grid-cols-[1fr_1.5fr] gap-4">
          <section>
            <div className="max-w-sm mx-auto">
              <LeaveForm leaveTypes={leaveTypes} calendarDisabled />
            </div>
          </section>
          <section>
            <div className="max-w-md mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {leaveTypes.map((leaveType) => (
                  <AccordionItem key={leaveType.id} value={leaveType.id}>
                    <AccordionTrigger className="bg-muted px-4">
                      <div className="flex items-center gap-2">
                        <p>{leaveType.name}</p>
                        <span className="">({leaveType.category})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground px-4 pt-2 space-y-2">
                      <p>{leaveType.description ?? "No description."}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default LeaveApply;
