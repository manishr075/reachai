"use client"

import { createContext, useContext, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Megaphone,
  ChartLine,
  Plus,
  Menu,
  X,
  Sparkles,
  Search,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { ThemeToggle } from "@/components/theme-toggle"

const nav = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Analytics", href: "/analytics", icon: ChartLine },
]

type CampaignSearchContextValue = {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const CampaignSearchContext = createContext<CampaignSearchContextValue | null>(null)

export function useCampaignSearch() {
  const context = useContext(CampaignSearchContext)
  if (!context) throw new Error("useCampaignSearch must be used inside AppShell")
  return context
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-2 bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-base font-semibold tracking-tight">ReachAI</span>
          <span className="text-xs text-muted-foreground">Outbound platform</span>
        </div>
      </div>

      <div className="px-3 pb-2">
        <Button
          render={<Link href="/campaigns/new" onClick={onNavigate} />}
          nativeButton={false}
          className="w-full justify-start"
          size="sm"
        >
          <Plus data-icon="inline-start" />
          New campaign
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {nav.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-xl border border-primary/15 bg-primary/[0.045] p-3 backdrop-blur-sm">
        <p className="text-xs font-semibold tracking-wide text-foreground">
          Evidence-driven drafting
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Strands Agent · Powered by Amazon Bedrock
        </p>
      </div>

      <div className="flex items-center gap-3 border-t px-4 py-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            AM
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-medium">Alex Morgan</span>
          <span className="truncate text-xs text-muted-foreground">
            alex@reachai.com
          </span>
        </div>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <CampaignSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
    <div className="flex min-h-svh w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 border-r shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 text-muted-foreground"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/80 bg-background/85 px-4 shadow-[0_1px_0_oklch(0.5_0.02_274_/_0.04)] backdrop-blur-xl sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>

          <div className="hidden w-full max-w-sm sm:block">
            <InputGroup>
              <InputGroupInput
                aria-label="Search prospects and campaigns"
                placeholder="Search prospects, campaigns..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="size-5" />
            </Button>
            <Button
              render={<Link href="/campaigns/new" />}
              nativeButton={false}
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Plus data-icon="inline-start" />
              New campaign
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
    </CampaignSearchContext.Provider>
  )
}
