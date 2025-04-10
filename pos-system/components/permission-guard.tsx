"use client"

import type { ReactNode } from "react"
import { useSession } from "@/components/session-provider"
import { hasPermission } from "@/lib/utils"
import { Shield } from "lucide-react"

interface PermissionGuardProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { user } = useSession()

  if (hasPermission(user, permission)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Shield className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Permission Required</h3>
      <p className="text-muted-foreground max-w-md">
        You don't have permission to access this feature. Please contact your administrator if you need access.
      </p>
    </div>
  )
}
