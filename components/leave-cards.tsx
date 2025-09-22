import React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LeaveCardsProps {
  userLeaves: {
    id: string;
    name: string;
    maxAllowed: number | null;
    taken: number;
  }[];
}

export const LeaveCards = ({ userLeaves }: LeaveCardsProps) => {
  if (userLeaves.length === 0) {
    return (
      <section className="mb-8">
        <p>
          An Error Occured while fetching user leave stats, please refresh and
          try again.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4">
        {userLeaves.map((userLeave) => (
          <Card key={userLeave.id} className="gap-4">
            <CardHeader>
              <CardTitle className="text-2xl">
                {userLeave.taken}
                {userLeave.maxAllowed ? `/${userLeave.maxAllowed}` : ``}
              </CardTitle>
              <CardDescription>{userLeave.name}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};
