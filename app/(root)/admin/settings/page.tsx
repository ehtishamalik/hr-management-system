import LeaveYearForm from "@/components/LeaveYearForm";
import React from "react";

const Settings = async () => {
  return (
    <>
      <h1 className="text-2xl font-medium mb-8">Settings</h1>

      <section className="p-4 bg-secondary text-secondary-foreground rounded-md">
        <h2 className="text-lg font-medium mb-4">Leave Settings</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Manage your leave year, start new year.
        </p>

        <div className="flex items-center justify-end">
          <LeaveYearForm />
        </div>
      </section>
    </>
  );
};

export default Settings;
