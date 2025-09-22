"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ToastError = ({
  message,
  description,
  redirectPath,
}: {
  message: string;
  description?: string;
  redirectPath?: string;
}) => {
  const router = useRouter();
  const error = "Please login again or refresh the page.";

  useEffect(() => {
    toast.error(message, {
      description: description ? description : error,
    });

    if (!redirectPath) return;

    const timeout = setTimeout(() => {
      router.push(redirectPath);
    }, 200);

    return () => clearTimeout(timeout);
  });

  return null;
};

export default ToastError;
