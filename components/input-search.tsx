import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export const InputSearch = ({
  className = "md:max-w-sm",
  onClear,
  ...props
}: React.ComponentProps<"input"> & {
  onClear?: () => void;
}) => {
  return (
    <InputGroup className={className}>
      <InputGroupInput
        id="seached-value"
        name="seached-value"
        placeholder="Search by employee name or email..."
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="outline" onClick={onClear}>
          Clear
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon align="inline-start">
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
};
