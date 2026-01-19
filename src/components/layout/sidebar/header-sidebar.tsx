import { Globe, Palette, Sparkles, Laptop, Monitor, Zap, Brush, Tag, ClipboardList, Plus, ChevronsUpDown } from "lucide-react"
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
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";

interface HeaderSidebarProps {
    projects: { id: string; name: string; logo: string | null }[];
    projectId: string;
}

export default async function headerSideBar({ projects, projectId }: HeaderSidebarProps) {

    const activeOrganization = await prisma.organization.findUnique({
        where: {
            id: projectId,
        }
    });

    const iconMap: { [key: string]: any } = {
        Globe,
        Laptop,
        Monitor,
        Zap,
        Palette,
        Sparkles,
        Brush,
        Tag,
        ClipboardList,
    };

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
                            <div className="font-medium">{activeOrganization?.name || <p className="text-sm">Choisir un projet</p>}</div>
                        </div>
                        <ChevronsUpDown className="w-4 h-4 ml-2" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="mt-2">
                    {projects.map((project) => {
                        const LogoIcon = project.logo && iconMap[project.logo] ? iconMap[project.logo] : Globe;

                        return (
                            <DropdownMenuItem key={project.id} asChild>
                                <Link href={`/project/${project.id}/dashboard`}>
                                    <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                        <LogoIcon className="inline-block h-4 w-4" />
                                    </div>
                                    {project.name}
                                </Link>
                            </DropdownMenuItem>
                        )
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/project/new">
                            <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                <Plus className="inline-block h-4 w-4" />
                            </div>
                            <p>Nouveau projet</p>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarHeader>
    )
}