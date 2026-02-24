import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
} from "@/src/components/ui/shadcn/sidebar"
import {
    Home,
    CalendarDays,
    Files,
    LinkIcon,
    FilePlusCorner,
    LayersPlus,
    Megaphone,
    Users,
    MessageCircleMore,
    UserRoundCog,
    Settings,
    Bug
} from "lucide-react"
import { getUser } from "@/src/lib/auth-server"
import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import HeaderSidebar from "./header-sidebar"
import { MemberRole } from "@/src/generated/prisma/enums"
import FooterSidebar from "./footer-sidebar"

export async function AppSidebar({ projectId }: { projectId: string }) {
    const user = await getUser()

    const projects = await prisma.organization.findMany({
        where: {
            members: {
                some: {
                    userId: user?.id
                }
            }
        }
    })

    const userRole = await prisma.member.findFirst({
        where: {
            userId: user?.id,
            organization: {
                id: projectId || undefined
            }

        }
    });

    const isClient = userRole?.role === MemberRole.CLIENT;

    const nav = [
        {
            title: "Dashboard",
            url: `/dashboard`,
            icon: Home,
        },
        {
            title: "Updates",
            url: `/updates`,
            icon: Megaphone,
        },
        {
            title: "Assets",
            url: `/assets`,
            icon: Files,
        },
        {
            title: "Test",
            url: `/test`,
            icon: Bug,
        },
        {
            title: "Feedback",
            url: `/feedback`,
            icon: MessageCircleMore,
        },
        {
            title: "Timeline",
            url: `/timeline`,
            icon: CalendarDays,
        },
    ]

    const fastNav = [
        {
            title: "Ajouter asset",
            url: `/assets/new`,
            icon: FilePlusCorner,
        },
        {
            title: "Créer update",
            url: `/update/new`,
            icon: LayersPlus,
        },
        {
            title: "Partager",
            url: `/share`,
            icon: LinkIcon,
        }
    ]

    const gestionNav = [
        {
            title: "Clients",
            url: `/clients`,
            icon: UserRoundCog,
        },
        {
            title: "Équipe",
            url: `/team`,
            icon: Users,
        },
        {
            title: "Liens",
            url: `/links`,
            icon: LinkIcon,
        }
    ]

    const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
    const userName = user?.name || 'Utilisateur'
    const userEmail = user?.email || 'user@wizyy.com'

    return (
        <Sidebar className="border-none">
            <div className="border-none bg-background w-full flex flex-col h-full">
                <HeaderSidebar projects={projects} projectId={projectId} />

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation du projet</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {nav.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="hover:bg-card">
                                            <Link href={`/project/${projectId}/${item.url}`}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {!isClient && (
                        <>
                            <SidebarGroup>
                                <SidebarGroupLabel>Gestions du projet</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {gestionNav.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild className="hover:bg-card">
                                                    <Link href={`/project/${projectId}/${item.url}`}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarGroup>
                                <SidebarGroupLabel>Actions rapides</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {fastNav.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild className="hover:bg-card">
                                                    <Link href={`/project/${projectId}/${item.url}`}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </>
                    )}
                </SidebarContent>

                <SidebarFooter className="p-4 mt-auto">
                    {!isClient &&
                        <Link href={`/project/${projectId}/settings`} className="py-1 cursor-pointer hover:bg-border/50 rounded-sm flex items-center justify-center bg-border/30 border">
                            <Settings className="inline-block h-4 w-4 mr-2" />
                            <div className="font-medium">Paramètres</div>
                        </Link>
                    }
                    <FooterSidebar userName={userName} userEmail={userEmail} userInitial={userInitial} projectId={projectId} />
                </SidebarFooter>
            </div>
        </Sidebar>
    )
}