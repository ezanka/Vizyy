import { ClientInvitationTable } from "@/src/components/table/client-invitation-table";
import { ClientTable } from "@/src/components/table/client-table";
import { Separator } from "@/src/components/ui/shadcn/separator";
import { MemberRole } from "@/src/generated/prisma/enums";
import { getUser } from "@/src/lib/auth-server";
import { prisma } from "@/src/lib/prisma"

type Params = {
    projectId: string;
}

export default async function ClientsPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId } = await params;
    const user = await getUser();

    const isMaker = await prisma.member.findUnique({
        where: {
            userId_organizationId: {
                userId: user?.id!,
                organizationId: projectId,
            }
        }
    }).then(member => member?.role === MemberRole.MAKER);

    const clients = await prisma.member.findMany({
        where: {
            organizationId: projectId,
            role: MemberRole.CLIENT
        },
        include: {
            user: true,
        }
    });

    const invitations = await prisma.invitation.findMany({
        where: {
            organizationId: projectId,
            role: MemberRole.CLIENT
        },
        include: {
            user: true,
        }
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Clients</h1>
            <p>Contenu de la page des clients.</p>
            <ClientTable clients={clients.map(client => client.user)} isMaker={isMaker} projectId={projectId} />
            <Separator className="my-4" />
            <ClientInvitationTable invitations={invitations} projectId={projectId} />
        </div>
    )
}