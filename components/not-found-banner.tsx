import Link from "next/link";

import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";

const NotFoundBanner = ({
  headline,
  description,
  button,
}: {
  headline: string;
  description: string;
  button?: {
    label: string;
    href: string;
  };
}) => {
  return (
    <div className="w-full rounded-lg border bg-card py-10 px-6 flex flex-col items-center text-center">
      <h2 className="text-lg font-semibold text-card-foreground mb-2">
        {headline}
      </h2>
      <p className="text-neutral-400 max-w-2xl">{description}</p>
      {button && (
        <Button asChild>
          <Link href={button.href} className="mt-4">
            {button.label}
            <ArrowRightIcon />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default NotFoundBanner;
