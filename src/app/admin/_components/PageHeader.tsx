import { ReactNode } from "react";

export default function PageHeader({ children }: {children: ReactNode}) {
  return <h1 className="text-2xl font-bold">{children}</h1>
}
