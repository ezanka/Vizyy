import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/src/components/ui/shadcn/sidebar"
import {
    Home,
    Settings,
    LogOut,
    CalendarDays,
    Files,
    LinkIcon,
    FilePlusCorner,
    LayersPlus,
    ChevronsUpDown,
    Sparkles,
    User,
    CreditCard,
    Bell,
    Mail,
    Megaphone,
    Users
} from "lucide-react"
import { getUser } from "@/src/lib/auth-server"
import { headers } from "next/headers"
import { auth } from "@/src/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/shadcn/dropdown-menu"
import { prisma } from "@/src/lib/prisma"
import HeaderSidebar from "./header-sidebar"
import { MemberRole } from "@/src/generated/prisma/enums"

async function handleSignout() {
    'use server'

    await auth.api.signOut({
        headers: await headers()
    })

    redirect("/auth/signin")
}

export async function AppSidebar({projectId}: {projectId: string}) {
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
            title: "Feedback",
            url: `/feedback`,
            icon: Mail,
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
    const userEmail = user?.email || 'user@codizy.com'

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
                    )}

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
                </SidebarContent>

                <SidebarFooter className="p-4 mt-auto">
                    <Link href={"/settings"} className="py-1 cursor-pointer hover:bg-border/50 rounded-sm flex items-center justify-center bg-border/30 border">
                        <Settings className="inline-block h-4 w-4 mr-2" />
                        <div className="font-medium">Paramètres</div>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="p-2 cursor-pointer hover:bg-border/50 rounded-sm flex items-center justify-between bg-border/30 border">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-linear-to-br from-purple-500 to-pink-500 text-white font-semibold">
                                        {userInitial}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-medium truncate">{userName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                                    </div>
                                </div>
                                <ChevronsUpDown className="w-4 h-4 ml-2" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" className="mt-2">
                            <DropdownMenuLabel>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-linear-to-br from-purple-500 to-pink-500 text-white font-semibold">
                                        {userInitial}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-medium truncate">{userName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                    <Sparkles className="inline-block h-4 w-4" />
                                </div>
                                Passer au forfait supérieur
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                    <User className="inline-block h-4 w-4" />
                                </div>
                                Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                    <CreditCard className="inline-block h-4 w-4" />
                                </div>
                                Facturation
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                    <Bell className="inline-block h-4 w-4" />
                                </div>
                                Notifications
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <button
                                    className="rounded-lg hover:bg-border/50 transition-colors flex items-center w-full"
                                    onClick={handleSignout}
                                >
                                    <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                        <LogOut className="h-4 w-4" />
                                    </div>
                                    Se déconnecter
                                </button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
            </div>
        </Sidebar>
    )
}