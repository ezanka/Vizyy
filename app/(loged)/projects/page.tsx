
import { getUser } from "@/src/lib/auth-server"
import { prisma } from "@/src/lib/prisma"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/shadcn/card";
import { Button } from "@/src/components/ui/shadcn/button";
import FooterSidebar from "@/src/components/layout/sidebar/footer-sidebar";

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.length === 0 ? (
                        <p className="col-span-full text-center text-muted-foreground">
                            Aucune organisation trouvée
                        </p>
                    ) : (
                        projects.map((project) => (
                            <Link key={project.id} href={`/project/${project.id}/dashboard`} className="block h-full">
                                <Card className="bg-background hover:bg-background/90 transition h-24">
                                    <CardHeader>
                                        <CardTitle className="text-md">{project.name}</CardTitle>
                                        <CardDescription>
                                            {project._count.members} membre{project._count.members > 1 ? "s" : ""}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
                <div className="w-full h-px bg-muted my-8">
                    <div className="pt-4">
                        <FooterSidebar userName={user.name || ""} userEmail={user.email || ""} userInitial={user.name ? user.name.charAt(0).toUpperCase() : ""} projectId="" />
                    </div>
                </div>

            </div>
        </div>
    )
}