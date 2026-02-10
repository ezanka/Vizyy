
import { TeamInvitationTable } from "@/src/components/table/team-invitation-table";
import { TeamTable } from "@/src/components/table/team-table";
import { Separator } from "@/src/components/ui/shadcn/separator";
import { MemberRole } from "@/src/generated/prisma/enums";
import { getUser } from "@/src/lib/auth-server";
import { prisma } from "@/src/lib/prisma"

type Params = {
    projectId: string;
}

export default async function TeamPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId } = await params;
    
    const project = await prisma.organization.findUnique({
        where: {
            id: projectId,
        }
    });

    if (!project) {
        throw new Error("Project not found");
    }

    const makers = await prisma.member.findMany({
        where: {
            organizationId: projectId,
            role: MemberRole.MAKER
        },
        include: {
            user: true,
        }
    });

    const invitations = await prisma.invitation.findMany({
        where: {
            organizationId: projectId,
            role: MemberRole.MAKER
        },
        include: {
            user: true,
        }
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Équipe</h1>
            <p>Créateur dans l'équipe.</p>
            <TeamTable makers={makers.map(maker => maker.user)} projectId={projectId} ownerId={project?.ownerId} />
            <Separator className="my-4" />
            <TeamInvitationTable invitations={invitations} projectId={projectId} />
        </div>
    )
}