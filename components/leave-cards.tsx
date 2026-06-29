"use client";

import useEmblaCarousel from "embla-carousel-react";

import { useCallback, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  Briefcase,
  Calendar,
  Clock,
  Palmtree,
  Umbrella,
} from "lucide-react";

import type { LeaveCardItem } from "@/types";

const getLeaveIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("sick")) return <Activity className="size-5" />;
  if (n.includes("annual")) return <Umbrella className="size-5" />;
  if (n.includes("casual")) return <Palmtree className="size-5" />;
  if (n.includes("compassionate")) return <Briefcase className="size-5" />;
  return <Calendar className="size-5" />;
};

const LeaveCard = ({ item }: { item: LeaveCardItem }) => {
  const { name, taken, maxAllowed } = item;
  const percentage = maxAllowed ? Math.min((taken / maxAllowed) * 100, 100) : 0;
  const isHigh = percentage >= 90;
  const isMedium = percentage >= 70 && percentage < 90;

  return (
    <Card className="group relative overflow-hidden gap-4 transition-all hover:shadow-md hover:border-primary/20 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-3 text-muted-foreground/10 group-hover:text-primary/20 transition-colors">
        {getLeaveIcon(name)}
      </div>
      <CardHeader>
        <CardTitle className="text-muted-foreground">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight">{taken}</span>
            {maxAllowed && (
              <span className="text-sm font-medium text-muted-foreground">
                / {maxAllowed}
              </span>
            )}
            <span className="text-[10px] font-medium text-muted-foreground ml-1">
              Days
            </span>
          </div>
        </div>

        {maxAllowed ? (
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  isHigh
                    ? "bg-destructive/60"
                    : isMedium
                      ? "bg-orange-500/60"
                      : "bg-primary/60",
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-medium">
              <span
                className={cn(
                  "text-xs",
                  isHigh
                    ? "text-destructive/80"
                    : isMedium
                      ? "text-orange-500/80"
                      : "text-muted-foreground/80",
                )}
              >
                {Math.round(percentage)}% used
              </span>
              {isHigh && (
                <AlertCircle className="size-3 text-destructive animate-pulse" />
              )}
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-border/20 flex items-center gap-1.5">
            <Clock className="size-3 text-muted-foreground/50" />
            <span className="text-[10px] font-medium text-muted-foreground italic">
              No limit defined
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const LeaveCards = ({ leaves }: { leaves: LeaveCardItem[] }) => {
  const isMobile = useIsMobile();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: false,
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Desktop grid view
  if (!isMobile) {
    return (
      <section>
        <div className="grid-flexible">
          {leaves.map((item) => (
            <LeaveCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    );
  }

  // Mobile swiper view
  return (
    <section>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 touch-pan-y">
          {leaves.map((item) => (
            <div
              key={item.id}
              className="flex-[0_0_85%] min-w-0"
              style={{ flex: "0 0 85%" }}
            >
              <LeaveCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/20 w-1.5"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export const LeaveCardsSkeleton = () => {
  return (
    <section>
      <div className="grid-flexible">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
};
