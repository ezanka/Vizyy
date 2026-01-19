"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import { ChevronRight, Home } from "lucide-react"
import { SidebarTrigger } from "@/src/components/ui/shadcn/sidebar"

const routeLabels: Record<string, string> = {
    "/": "Accueil",
    "/new": "Nouveau projet",
    "/updates": "Updates",
    "/updates/new": "Nouvelle",
    "/settings": "Paramètres",
    "/profile": "Profil",
}

export default function Header() {
    const pathname = usePathname()

    if (pathname === "/dashboard") {
        return (
            <div className="flex items-center justify-between px-4 py-2 h-12">
                <div className="flex items-center h-full gap-4">
                    <div className="flex items-center justify-center h-full rounded-sm border bg-background aspect-square">
                        <SidebarTrigger className="w-8 h-8" />
                    </div>
                    <div className="flex items-center justify-between h-full rounded-sm border text-muted-foreground aspect-square px-2 gap-2">
                        <Home className="w-5 h-5" />
                    </div>
                </div>
            </div>
        )
    }

    const pathSegments = pathname.split('/').filter(segment => segment !== '')

    const breadcrumbs = pathSegments.map((_, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`
        const label = routeLabels[path] || pathSegments[index].charAt(0).toUpperCase() + pathSegments[index].slice(1)
        const isLast = index === pathSegments.length - 1

        return { path, label, isLast }
    })

    return (
        <div className="flex items-center justify-between px-4 py-2 h-12">
            <div className="flex items-center h-full gap-4">
                <div className="flex items-center justify-center h-full rounded-sm border bg-background aspect-square">
                    <SidebarTrigger className="w-8 h-8" />
                </div>
                <div className="flex items-center h-full gap-2 border">
                    <Link href="/" className="flex items-center justify-between h-full rounded-sm text-muted-foreground hover:text-foreground transition-colors aspect-square px-2 gap-2">
                        <Home className="w-5 h-5" />
                    </Link>
                    <ChevronRight className="w-3 h-3" />

                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.path} className="flex items-center h-full gap-2">
                            {crumb.isLast ? (
                                <div className="flex items-center h-full rounded-sm px-3">
                                    <span className="text-sm font-medium">
                                        {crumb.label}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={crumb.path}
                                        className="flex items-center justify-between h-full rounded-sm bg-background px-2 gap-2"
                                    >
                                        <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                            {crumb.label}
                                        </span>
                                    </Link>
                                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}