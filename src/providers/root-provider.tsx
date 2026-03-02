"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth-provider"

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
