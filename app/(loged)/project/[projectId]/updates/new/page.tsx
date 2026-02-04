
import NewUpdateForm from "@/src/components/form/new-update-form"
import { prisma } from "@/src/lib/prisma"
import { getUser } from "@/src/lib/auth-server"
import { redirect } from "next/navigation"

type Params = {
    projectId: string;
}

export default async function NewUpdatePage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId } = await params;
    const user = await getUser();

    if (!user) {
        redirect('/auth/signin');
    }

    const project = await prisma.organization.findUnique({
        where: { id: projectId },
        include: {
            members: true,
        },
    })

    if (!project?.members.some(member => member.userId === user.id)) {
        redirect('/projects');
    }

    if (!project) {
        return <div>Projet non trouvé</div>
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Créer une nouvelle mise à jour</h1>            
            <NewUpdateForm project={project} />
        </div>
    )
}