import clsx from "clsx";

const Headline = ({
  children,
  type = "h1",
  className,
}: {
  children: React.ReactNode;
  type?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}) => {
  let classes = "";
  let Comp: React.ElementType = "h1";

  switch (type) {
    case "h1":
      classes = "text-2xl font-medium";
      Comp = "h1";
      break;

    case "h2":
      classes = "text-xl font-medium";
      Comp = "h2";
      break;

    case "h3":
      classes = "text-lg text-muted-foreground font-medium";
      Comp = "h3";
      break;

    case "h4":
      classes = "text-base font-medium text-muted-foreground";
      Comp = "h4";
      break;
  }

  return <Comp className={clsx(classes, className)}>{children}</Comp>;
};

export default Headline;
