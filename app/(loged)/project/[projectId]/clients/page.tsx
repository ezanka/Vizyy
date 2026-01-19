import RemoveClientButton from "@/src/components/button/remove-client-button";
import { Button } from "@/src/components/ui/shadcn/button";
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

    const clients = await prisma.member.findMany({
        where: {
            organizationId: projectId,
            role: MemberRole.CLIENT
        },
        include: {
            user: true,
        }
    });

    async function removeClient(clientId: string) {
        await prisma.member.deleteMany({
            where: {
                organizationId: projectId,
                userId: clientId,
            }
        });
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Clients</h1>
            <p>Contenu de la page des clients.</p>
            <ul>
                {clients.map(client => (
                    <li key={client.id}>{client.user.name} <RemoveClientButton clientId={client.user.id} projectId={projectId} /></li>
                ))}
            </ul>
        </div>
    )
}