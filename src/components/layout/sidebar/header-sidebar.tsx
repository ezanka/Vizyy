"use client"

import { Globe, Palette, Gauge, Sparkles, Plus, ChevronsUpDown } from "lucide-react"
import {
    SidebarHeader,
} from "@/src/components/ui/shadcn/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/shadcn/dropdown-menu"
import { authClient } from "@/src/lib/auth-client";
import { Skeleton } from "../../ui/shadcn/skeleton";

interface HeaderSidebarProps {
    projects: { id: string; name: string; logo: string | null }[];
}

export default function headerSideBar({ projects }: HeaderSidebarProps) {

    async function handleProjectSwitch(projectId: string) {

        await authClient.organization.setActive({
            organizationId: projectId,
        });
    }

    const iconMap: { [key: string]: any } = {
        Globe,
        Palette,
        Gauge,
        Sparkles,
    };

    const { data: activeOrganization } = authClient.useActiveOrganization()

    const CurrentIcon = activeOrganization?.logo && iconMap[activeOrganization.logo] ? iconMap[activeOrganization.logo] : Globe;

    return (
        <SidebarHeader>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="p-4 cursor-pointer hover:bg-border/50 rounded-sm flex items-center justify-between bg-border/30 border">
                        <div className="flex items-center">
                            <div className="border bg-accent p-1 flex items-center justify-center rounded-sm mr-2">
                                <CurrentIcon className="inline-block h-4 w-4" />
                            </div>
                            <div className="font-medium">{activeOrganization?.name || <Skeleton className="h-5 w-25 rounded-full" />}</div>
                        </div>
                        <ChevronsUpDown className="w-4 h-4 ml-2" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="mt-2">
                    {projects.map((project) => {
                        const LogoIcon = project.logo && iconMap[project.logo] ? iconMap[project.logo] : Globe;

                        return (
                            <DropdownMenuItem key={project.id} onClick={() => handleProjectSwitch(project.id)}>
                                <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                    <LogoIcon className="inline-block h-4 w-4" />
                                </div>
                                {project.name}
                            </DropdownMenuItem>
                        )
                    })}
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
    )
}