"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/src/components/ui/shadcn/sidebar"
import {
    Home,
    CalendarDays,
    Files,
    LinkIcon,
    Megaphone,
    Users,
    MessageCircleMore,
    UserRoundCog,
    Bug,
    ListTodo,
    Dot,
} from "lucide-react"

const nav = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Updates", url: "/updates", icon: Megaphone },
    { title: "Assets", url: "/assets", icon: Files },
    { title: "Test", url: "/test", icon: Bug },
    { title: "Feedback", url: "/feedback", icon: MessageCircleMore },
    { title: "Timeline", url: "/timeline", icon: CalendarDays },
    { title: "Todos", url: "/todos", icon: ListTodo },
]

const gestionNav = [
    { title: "Clients", url: "/clients", icon: UserRoundCog },
    { title: "Équipe", url: "/team", icon: Users },
    { title: "Liens", url: "/links", icon: LinkIcon },
]

function NavList({ items, projectId }: { items: typeof nav; projectId: string }) {
    const pathname = usePathname()

    return (
        <SidebarMenu>
            {items.map((item) => {
                const href = `/project/${projectId}${item.url}`
                const isActive = pathname === href

                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            className="flex items-center justify-between"
                        >
                            <Link href={href}>
                                <div className="flex items-center gap-2">
                                    <item.icon size={18} />
                                    <span>{item.title}</span>
                                </div>
                                {isActive && (
                                    <Dot />
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )
            })}
        </SidebarMenu>
    )
}

export function SidebarMainNav({ projectId }: { projectId: string }) {
    return <NavList items={nav} projectId={projectId} />
}

export function SidebarGestionNav({ projectId }: { projectId: string }) {
    return <NavList items={gestionNav} projectId={projectId} />
}
