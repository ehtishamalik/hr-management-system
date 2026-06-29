import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary text-primary-foreground shadow-xs",
          "hover:bg-primary/80",
        ),
        suspend: cn("bg-chart-3 text-white", "hover:bg-chart-3/80"),
        approve: cn("bg-chart-2 text-white", "hover:bg-chart-2/80"),
        destructive: cn(
          "bg-destructive text-white shadow-xs",
          "hover:bg-destructive/80",
          "focus-visible:ring-destructive/20",
        ),
        outline: cn(
          "border bg-background shadow-xs",
          "hover:bg-accent hover:text-accent-foreground",
          "dark:bg-input/30 dark:border-input",
          "dark:hover:bg-input/50",
        ),
        secondary: cn(
          "bg-secondary text-secondary-foreground shadow-xs",
          "hover:bg-secondary/60",
        ),
        ghost: cn(
          "hover:bg-accent hover:text-accent-foreground",
          "dark:hover:bg-accent/50",
        ),
        link: cn(
          "text-primary underline-offset-4 p-0! h-auto!",
          "hover:underline",
        ),
        "ghost-destructive": cn(
          "text-destructive",
          "hover:text-destructive hover:bg-accent",
          "dark:hover:bg-accent/50",
        ),
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
