
import EditUpdateForm from "@/src/components/form/edit-update-form"
import { Button } from "@/src/components/ui/shadcn/button";
import { Card } from "@/src/components/ui/shadcn/card";
import { prisma } from "@/src/lib/prisma"
import { ArrowLeft } from "lucide-react";
import Link from "next/dist/client/link";
import { isMaker } from "@/src/actions/is-maker-actions";
import { getUser } from "@/src/lib/auth-server";

type Params = {
    projectId: string;
    updateId: string;
}

export default async function EditUpdatePage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId, updateId } = await params;
    const user = await getUser();

    const project = await prisma.organization.findUnique({
        where: { id: projectId },
        include: {
            members: true,
        },
    })

    if (!project) {
        return <div>Projet non trouvé</div>
    }

    const update = await prisma.update.findUnique({
        where: {
            id: updateId,
            organizationId: projectId,
        },
    })

    if (!update) {
        return <div>Update non trouvée</div>
    }

    if (!user) {
        return <div>Vous devez être connecté pour accéder à cette page</div>
    }

    const authorized = await prisma.update.findUnique({
        where: {
            id: updateId,
            organizationId: projectId,
            authorId: user.id
        },
    })

    const userIsMaker = await isMaker(projectId);

    return (
        <div className="flex flex-col gap-6 my-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/project/${projectId}/updates/${updateId}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Détails de l&apos;update</h1>
            </div>

            <Card className="w-full max-w-4xl mx-auto">
                <EditUpdateForm project={project} update={update} authorized={userIsMaker.isMaker || !!authorized} />
            </Card>
        </div>

    )
}