import { Button } from "@/components/ui/button";
import { LoaderPinwheel } from "lucide-react";
import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";


export default function FormButton({BtnName, ...props}: {BtnName: string} & ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button {...props} type="submit" disabled={pending}>
      {pending ? <LoaderPinwheel className="animate-spin" /> : BtnName}
    </Button>
  );
}
