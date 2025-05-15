"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext<{
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}>({
  expanded: true,
  setExpanded: () => {},
})

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return <SidebarContext.Provider value={{ expanded, setExpanded }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { expanded } = useSidebar()

  return (
    <aside
      className={cn("h-full border-r bg-white transition-all duration-300", expanded ? "w-64" : "w-16", className)}
    >
      <div className="h-full flex flex-col">{children}</div>
    </aside>
  )
}

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-4", className)}>{children}</div>
}

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>
}

export function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-4 border-t", className)}>{children}</div>
}

export function SidebarMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-1 p-2", className)}>{children}</div>
}

export function SidebarMenuItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>
}

export function SidebarMenuButton({
  children,
  isActive,
  onClick,
  className,
}: {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
}) {
  const { expanded } = useSidebar()

  return (
    <button
      className={cn(
        "flex items-center w-full rounded-md p-2 text-sm transition-colors",
        isActive
          ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        expanded ? "justify-start space-x-3" : "justify-center",
        className,
      )}
      onClick={onClick}
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          // 第一个子元素是图标
          return child
        }
        if (!expanded) {
          // 如果侧边栏折叠，不显示文本
          return null
        }
        return child
      })}
    </button>
  )
}

export function SidebarSeparator({ className }: { className?: string }) {
  return <div className={cn("border-t my-2", className)} />
}
