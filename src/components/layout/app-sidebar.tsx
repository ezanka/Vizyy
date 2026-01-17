import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/src/components/ui/shadcn/sidebar"
import {
    Home,
    Settings,
    LogOut,
    Plus,
    CalendarDays,
    Files,
    MessagesSquare,
    ClipboardCheck,
    LinkIcon,
    FilePlusCorner,
    LayersPlus,
    Globe,
    Palette,
    Gauge,
    ChevronsUpDown,
    Sparkles,
    User,
    CreditCard,
    Bell
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
import { Button } from "../ui/shadcn/button"

async function handleSignout() {
    'use server'

    await auth.api.signOut({
        headers: await headers()
    })

    redirect("/auth/signin")
}

export async function AppSidebar() {
    const user = await getUser()

    const nav = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
        },
        {
            title: "Timeline",
            url: `/timeline`,
            icon: CalendarDays,
        },
        {
            title: "Assets",
            url: "/assets",
            icon: Files,
        },
        {
            title: "Feedback",
            url: "/feedback",
            icon: MessagesSquare,
        },
        {
            title: "Validations",
            url: "/validations",
            icon: ClipboardCheck,
        },
    ]

    const fastNav = [
        {
            title: "Ajouter asset",
            url: "/assets/new",
            icon: FilePlusCorner,
        },
        {
            title: "Créer update",
            url: `/update/new`,
            icon: LayersPlus,
        },
        {
            title: "Partager",
            url: "/share",
            icon: LinkIcon,
        }
    ]

    const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
    const userName = user?.name || 'Utilisateur'
    const userEmail = user?.email || 'user@codizy.com'

    return (
        <Sidebar className="border-none">
            <div className="border-none bg-background w-full flex flex-col h-full">
                <SidebarHeader>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="p-4 cursor-pointer hover:bg-border/50 rounded-sm flex items-center justify-between bg-border/30 border">
                                <div className="flex items-center">
                                    <div className="border bg-accent p-1 flex items-center justify-center rounded-sm mr-2">
                                        <Globe className="inline-block h-4 w-4" />
                                    </div>
                                    <div className="font-medium">Projet actuel</div>
                                </div>
                                <ChevronsUpDown className="w-4 h-4 ml-2" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" className="mt-2">
                            <DropdownMenuItem>
                                <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                    <Globe className="inline-block h-4 w-4" />
                                </div>
                                Projet 1
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                    <Palette className="inline-block h-4 w-4" />
                                </div>
                                Projet 2
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                    <Gauge className="inline-block h-4 w-4" />
                                </div>
                                Projet 3
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                    <Plus className="inline-block h-4 w-4" />
                                </div>
                                <p>Nouveau projet</p>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation du projet</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {nav.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="hover:bg-card">
                                            <Link href={item.url}>
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
                                            <Link href={item.url}>
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