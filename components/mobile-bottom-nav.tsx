"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn, getRoleStatues } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { userItems, managerItems, adminItems, adminPFItems } from "@/constants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SessionType } from "@/types";
import type { Dispatch, SetStateAction } from "react";

export const MobileBottomNav = ({ session }: { session: SessionType }) => {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { isManager, isAdmin } = getRoleStatues(session);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <>
      <nav className="fixed mx-2 rounded-2xl mb-2 bottom-0 left-0 right-0 z-50 md:hidden bg-sidebar/50 backdrop-blur-sm border-t border-sidebar-border">
        <div className="flex items-stretch h-16">
          {[userItems[0], userItems[1], userItems[2]].map((item) => {
            const active = isActive(item.url);
            return (
              <Link
                key={item.url + item.title}
                href={item.url}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 px-1 transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="size-5 shrink-0" />
                <span className="text-xs leading-tight text-center truncate w-full px-0.5">
                  {item.title}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 px-1 transition-colors",
              moreOpen
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <MoreHorizontal className="size-5 shrink-0" />
            <span className="text-xs leading-tight">More</span>
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] px-4 overflow-y-auto rounded-t-2xl"
        >
          <SheetHeader className="pb-2">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>

          <GroupedLinks
            label="Dashboard"
            links={userItems}
            setMoreOpen={setMoreOpen}
          />

          {(isManager || isAdmin) && (
            <GroupedLinks
              label="Team Management"
              links={managerItems}
              setMoreOpen={setMoreOpen}
            />
          )}

          {isAdmin && (
            <GroupedLinks
              label="Administrator"
              links={adminItems}
              setMoreOpen={setMoreOpen}
            />
          )}

          {isAdmin && (
            <GroupedLinks
              label="PF Management"
              links={adminPFItems}
              setMoreOpen={setMoreOpen}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

const GroupedLinks = ({
  label,
  links,
  setMoreOpen,
}: {
  label: string;
  links: typeof userItems;
  setMoreOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();

  return (
    <div className="space-y-5 pb-6">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
          {label}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {links.map((item) => {
            const active =
              item.url === "/"
                ? pathname === "/"
                : pathname.startsWith(item.url);
            return (
              <Link
                key={item.url}
                href={item.url}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/60 text-foreground hover:bg-muted",
                )}
              >
                <item.icon className="size-5 shrink-0" />
                <span className="text-xs text-center leading-tight">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
