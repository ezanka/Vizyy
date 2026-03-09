import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarFooter,
} from "@/src/components/ui/shadcn/sidebar"
import { Settings } from "lucide-react"
import { getUser } from "@/src/lib/auth-server"
import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import HeaderSidebar from "./header-sidebar"
import { MemberRole } from "@/src/generated/prisma/enums"
import FooterSidebar from "./footer-sidebar"
import { SidebarMainNav, SidebarGestionNav } from "./sidebar-nav"

export async function AppSidebar({ projectId }: { projectId: string }) {
    const user = await getUser()

    const userRole = await prisma.member.findFirst({
        where: {
            userId: user?.id,
            organization: {
                id: projectId || undefined
            }
        }
    });

    const isClient = userRole?.role === MemberRole.CLIENT;

    const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
    const userName = user?.name || 'Utilisateur'
    const userEmail = user?.email || 'user@vizyy.com'

    return (
        <Sidebar className="border-none">
            <div className="border-none bg-background w-full flex flex-col h-full">
                <HeaderSidebar projectId={projectId} />

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation du projet</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMainNav projectId={projectId} />
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {!isClient && (
                        <SidebarGroup>
                            <SidebarGroupLabel>Gestions du projet</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarGestionNav projectId={projectId} />
                            </SidebarGroupContent>
                        </SidebarGroup>
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
