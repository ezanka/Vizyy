"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import { ChevronRight, Home, Plus } from "lucide-react"
import { SidebarTrigger } from "@/src/components/ui/shadcn/sidebar"

const routeLabels: Record<string, string> = {
    dashboard: "Tableau de bord",
    new: "Nouveau",
    updates: "Updates",
    settings: "Paramètres",
    profile: "Profil",
    timeline: "Timeline",
    team: "Équipe",
}

export default function Header() {
    const pathname = usePathname()

    const pathSegments = pathname.split('/').filter(segment => segment !== '')

    const projectIndex = pathSegments.findIndex(segment => segment === 'project')
    const projectId = projectIndex !== -1 ? pathSegments[projectIndex + 1] : null

    if (projectId && pathname === `/project/${projectId}/dashboard`) {
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

    const relevantSegments = projectId
        ? pathSegments.slice(projectIndex + 2)
        : pathSegments

    const breadcrumbs = relevantSegments.map((segment, index) => {
        const relativePath = relevantSegments.slice(0, index + 1).join('/')
        const fullPath = projectId
            ? `/project/${projectId}/${relativePath}`
            : `/${relativePath}`

        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        const isLast = index === relevantSegments.length - 1

        return { path: fullPath, label, isLast }
    })

    const homeUrl = projectId ? `/project/${projectId}/dashboard` : "/projects"

    return (
        <div className="flex items-center justify-between px-4 py-2 h-12">
            <div className="flex items-center h-full gap-4">
                <div className="flex items-center justify-center h-full rounded-sm border bg-background aspect-square">
                    <SidebarTrigger className="w-8 h-8" />
                </div>
                <div className="flex items-center h-full gap-2 border rounded-sm">
                    <Link
                        href={homeUrl}
                        className="flex items-center justify-between h-full rounded-sm text-muted-foreground hover:text-foreground transition-colors aspect-square px-2 gap-2"
                    >
                        <Home className="w-5 h-5" />
                    </Link>
                    <ChevronRight className="w-3 h-3" />

                    {breadcrumbs.map((crumb) => (
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
                                        className="flex items-center justify-between h-full rounded-sm  px-2 gap-2"
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
        </div >
    )
}