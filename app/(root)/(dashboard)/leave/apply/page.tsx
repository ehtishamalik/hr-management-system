import Headline from "@/components/headline";
import LeaveForm from "@/components/LeaveForm";

import { Button } from "@/components/ui/button";
import { getLeaveTypesForLeave } from "@/services/leave-type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LeaveApply = async () => {
  const leaveTypes = await getLeaveTypesForLeave();

  return (
    <>
      <section className="flex justify-between items-center px-2">
        <Headline>Apply for Leave</Headline>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link">See Leaves Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Available Leave Types</DialogTitle>
              <DialogDescription>
                Here are the available leave types you can apply for:
              </DialogDescription>
            </DialogHeader>
            <Accordion type="single" collapsible className="space-y-4">
              {leaveTypes.map((leaveType) => (
                <AccordionItem key={leaveType.id} value={leaveType.id}>
                  <AccordionTrigger className="bg-muted p-2.5">
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
          </DialogContent>
        </Dialog>
      </section>
      <section className="border p-4 rounded-2xl">
        <LeaveForm leaveTypes={leaveTypes} calendarDisabled />
      </section>
    </>
  );
};

export default LeaveApply;
