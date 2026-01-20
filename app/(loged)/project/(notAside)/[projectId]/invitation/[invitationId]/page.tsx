import AcceptInvitationButton from "@/src/components/button/accept-invitation-button";
import { Button } from "@/src/components/ui/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/shadcn/card";
import { InvitationStatus } from "@/src/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";

type Params = {
    projectId: string;
    invitationId: string;
}

export default async function InvitationPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId, invitationId } = await params;

    const project = await prisma.organization.findUnique({
        where: {
            id: projectId,
        },
    });

    const invitation = await prisma.invitationLink.findUnique({
        where: {
            id: invitationId,
        },
        include: {
            user: true,
        },
    });

    if ((invitation?.expiresAt && invitation.expiresAt < new Date()) || !invitation || invitation.status !== InvitationStatus.PENDING) {
        return (
            <Card className="w-full max-w-2xl mx-auto mt-10">
                <CardHeader>
                    <h1>Invitation invalide</h1>
                </CardHeader>
                <CardContent>
                    <p>L'invitation que vous essayez d'accepter est invalide ou a expiré.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto mt-10">
            <CardHeader>
                <h1>Invitation pour : {project?.name}</h1>
            </CardHeader>
            <CardContent>
                {invitation?.user?.name ? (
                    <p>Vous avez été invité en tant que {invitation.role.toLowerCase()} par {invitation.user.name} ({invitation.user.email})</p>
                ) : (
                    <p>Vous avez été invité en tant que {invitation?.role.toLowerCase()} par {invitation?.user?.email}</p>
                )}
            </CardContent>
            <CardFooter>
                <AcceptInvitationButton invitationId={invitationId} projectId={projectId} />
            </CardFooter>
        </Card>
    )
}