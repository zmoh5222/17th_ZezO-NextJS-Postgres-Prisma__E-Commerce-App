'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({children}: {children: ReactNode}) {
  return (
    <nav className="bg-primary text-primary-foreground flex justify-center">{children}</nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathname = usePathname()
  return (
    <Link {...props} className={cn('p-4 hover:bg-secondary hover:text-secondary-foreground', props.href === pathname && 'bg-background text-foreground')}></Link>
  )
}