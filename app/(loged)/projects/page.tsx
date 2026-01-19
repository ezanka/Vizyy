
import { getUser } from "@/src/lib/auth-server"
import { prisma } from "@/src/lib/prisma"
import Link from "next/link"

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
        </div>
    )
}