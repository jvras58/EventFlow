import * as React from "react"

interface ContentLayoutProps {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export function ContentLayout({ title, actions, children }: ContentLayoutProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center py-2 pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight flex-1">{title}</h1>
        {actions && <div className="flex gap-2 items-center">{actions}</div>}
      </div>
      <div className="flex-1 w-full">{children}</div>
    </div>
  )
}
