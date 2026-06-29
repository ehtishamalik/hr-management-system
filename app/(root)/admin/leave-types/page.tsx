import Headline from "@/components/headline";

import { Badge } from "@/components/ui/badge";
import { getAllLeaveTypes } from "@/services/leave-type";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LeaveTypes = async () => {
  const leaveTypes = await getAllLeaveTypes();

  return (
    <>
      <Headline>Leaves Management</Headline>

      <section className="grid-flexible">
        {leaveTypes.map((leave) => (
          <Card key={leave.id}>
            <CardHeader>
              <CardTitle>{leave.name}</CardTitle>
              <CardDescription>
                {leave.description ?? "No description."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 mt-auto">
              <p className="text-sm font-medium">
                Max Allowed:{" "}
                <span className="font-semibold">
                  {leave.maxAllowed ?? "No limit"}
                </span>
              </p>
            </CardContent>
            <CardFooter className="justify-between ">
              <p className="text-sm font-medium">
                Type: <span className="font-semibold">{leave.category}</span>
              </p>
              {!leave.userCanApply && <Badge>Private</Badge>}
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  );
};

export default LeaveTypes;
