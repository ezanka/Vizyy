
import { getUser } from "@/src/lib/auth-server"
import { prisma } from "@/src/lib/prisma"
import { LogOut } from "lucide-react";
import Link from "next/link"
import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/shadcn/card";
import { Button } from "@/src/components/ui/shadcn/button";

async function handleSignout() {
    'use server'

    await auth.api.signOut({
        headers: await headers()
    })

    redirect("/auth/signin")
}

export default async function ProjectsPage() {
    const user = await getUser();

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
                        <Link href="/project/create">
                            Créer un projet
                        </Link>
                    </Button>
                    <Button asChild className="fixed bottom-4 right-4 sm:hidden">
                        <Link href="/project/create">
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
                <button
                    className="rounded-lg hover:bg-border/50 transition-colors flex items-center w-full"
                    onClick={handleSignout}
                >
                    <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                        <LogOut className="h-4 w-4" />
                    </div>
                    Se déconnecter
                </button>
            </div>

        </div>
    )
}