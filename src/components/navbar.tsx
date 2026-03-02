import * as React from "react"
import Link from "next/link"

import { ThemeToggle } from "./theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 w-full">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Link href="/" className="flex items-center space-x-2 ml-2">
            <span className="font-bold sm:inline-block text-primary">EventFlow</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
