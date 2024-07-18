import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ComponentProps } from "react";

export function AlertCard({title, message, ...props}: {title: string, message?: string | undefined} & ComponentProps<typeof Alert>) {
  return (
    <Alert {...props}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  )
}