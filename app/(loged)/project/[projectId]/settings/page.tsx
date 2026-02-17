import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/shadcn/card";
import { MemberRole } from "@/src/generated/prisma/enums";
import { getUser } from "@/src/lib/auth-server";
import { prisma } from "@/src/lib/prisma";
import EditProjectForm from "@/src/components/form/edit-project-form";
import DeleteProjectForm from "@/src/components/form/delete-project-form";

type Params = {
    projectId: string;
}

export default async function SettingsPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId } = await params;

    const user = await getUser();

    if (!user) {
        return (
            <div className="p-4">
                <p className="text-sm text-muted-foreground">Vous devez être connecté.</p>
            </div>
        );
    }

    const authorized = await prisma.member.findFirst({
        where: {
            userId: user.id,
            organizationId: projectId,
            role: MemberRole.MAKER,
        },
    });

    if (!authorized) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
                <p className="text-sm text-muted-foreground">Vous n&apos;avez pas accès aux paramètres de ce projet.</p>
            </div>
        );
    }

    const project = await prisma.organization.findUnique({
        where: { id: projectId },
    });

    if (!project) {
        return (
            <div className="p-4">
                <p className="text-sm text-muted-foreground">Projet introuvable.</p>
            </div>
        );
    }

    return (
        <div className="my-4 flex flex-col gap-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">Paramètres</h1>
                <p className="text-sm text-muted-foreground mt-1">Gérez les paramètres de votre projet.</p>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Informations générales</CardTitle>
                        <CardDescription>Modifiez les informations de base de votre projet.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EditProjectForm
                            projectId={projectId}
                            initialName={project.name}
                            initialLogo={project.logo}
                            initialDeadline={project.deadline}
                            initialProgress={project.progress}
                        />
                    </CardContent>
                </Card>

                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Zone de danger</CardTitle>
                        <CardDescription>
                            La suppression du projet est définitive et irréversible.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DeleteProjectForm projectId={projectId} projectName={project.name} />
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
