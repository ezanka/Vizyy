
import { getUser } from "@/src/lib/auth-server"
import { prisma } from "@/src/lib/prisma"
import Link from "next/link"
import { Card, CardContent } from "@/src/components/ui/shadcn/card";
import { Button } from "@/src/components/ui/shadcn/button";
import FooterSidebar from "@/src/components/layout/sidebar/footer-sidebar";
import { FolderOpen, Plus, Users } from "lucide-react";

export default async function ProjectsPage() {
    const user = await getUser();

    if (!user) {
        return (
            <div className="flex flex-col gap-4 my-4 justify-between flex-1">
                <p>Vous devez être connecté pour voir vos projets.</p>
            </div>
        );
    }

    const projects = await prisma.organization.findMany({
        where: {
            members: {
                some: {
                    userId: user?.id,
                },
            },
        },
        include: {
            _count: {
                select: { members: true },
            },
        },
    });

    return (
        <div className="bg-card rounded-lg space-y-8 w-full m-2 border">
            <div className="mt-8 p-8 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Vos projets</h1>
                    <Button asChild className="hidden sm:flex">
                        <Link href="/project/new">
                            Créer un projet
                        </Link>
                    </Button>
                    <Button asChild className="fixed bottom-4 right-4 sm:hidden">
                        <Link href="/project/new">
                            Créer un projet
                        </Link>
                    </Button>
                </div>

                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 rounded-xl border border-dashed border-border text-center">
                        <FolderOpen className="size-8 text-muted-foreground/40" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Aucun projet pour le moment</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Créez votre premier projet pour commencer</p>
                        </div>
                        <Button asChild size="sm" variant="outline" className="mt-1 border-border-md hover:border-border-hi gap-1.5">
                            <Link href="/project/new">
                                <Plus size={13} />
                                Nouveau projet
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {projects.map((project) => (
                            <Link key={project.id} href={`/project/${project.id}/dashboard`} className="block">
                                <Card className="bg-card border-border group hover:border-border-hi hover:shadow-2xl transition-all overflow-hidden relative py-0">
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                        style={{ background: "radial-gradient(ellipse at top left, var(--primary-ghost), transparent 60%)" }}
                                    />
                                    <CardContent className="flex flex-col gap-3 p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="size-9 rounded-lg grid place-items-center border border-border-md bg-popover text-foreground-muted shrink-0">
                                                <FolderOpen size={16} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[13px] font-semibold tracking-tight leading-snug">
                                                {project.name}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                                                <Users size={11} />
                                                <span>
                                                    {project._count.members} membre{project._count.members > 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
                <div className="w-full h-px bg-muted my-8">
                    <div className="pt-4">
                        <FooterSidebar userName={user.name || ""} userEmail={user.email || ""} userInitial={user.name ? user.name.charAt(0).toUpperCase() : ""} projectId="" />
                    </div>
                </div>

            </div>
        </div>
    )
}