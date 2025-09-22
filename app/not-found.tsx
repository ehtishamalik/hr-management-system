import React from "react";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const NotFound = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  } else {
    redirect("/");
  }

  return <div>NotFound</div>;
};

export default NotFound;
