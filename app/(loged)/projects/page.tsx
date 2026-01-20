
import { getUser } from "@/src/lib/auth-server"
import { prisma } from "@/src/lib/prisma"
import { LogOut } from "lucide-react";
import Link from "next/link"
import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

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
    });

    return (
        <div className="flex items-center gap-6 p-6 flex-wrap">
            {projects.map((project) => (
                <Link href={`/project/${project.id}/dashboard`} key={project.id} className="border rounded-lg p-6">
                    <h2 className="text-xl font-bold">{project.name}</h2>
                    <p className="text-muted-foreground">{project.deadline?.toLocaleDateString()}</p>
                </Link>
            ))}
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
    )
}