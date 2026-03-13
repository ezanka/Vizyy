import { ClientInvitationTable } from "@/src/components/table/client-invitation-table";
import { ClientTable } from "@/src/components/table/client-table";
import { Separator } from "@/src/components/ui/shadcn/separator";
import { MemberRole } from "@/src/generated/prisma/enums";
import { getUser } from "@/src/lib/auth-server";
import { prisma } from "@/src/lib/prisma"
import { redirect } from "next/navigation";

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

    if (!user) {
        redirect('/auth/signin');
    }

    const isMaker = await prisma.member.findUnique({
        where: {
            userId_organizationId: {
                userId: user.id!,
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
        <div className="flex flex-col gap-6 my-4">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle">
                        Projet
                    </p>
                    <h1 className="text-2xl font-extrabold tracking-tight">Clients</h1>
                    <p className="text-sm text-foreground-muted">
                        {clients.length} {clients.length > 1 ? 'clients' : 'client'}
                    </p>
                </div>
            <ClientTable clients={clients.map(client => client.user)} isMaker={isMaker} projectId={projectId} />
            <Separator className="my-4" />
            <ClientInvitationTable invitations={invitations} projectId={projectId} />
        </div>
    )
}