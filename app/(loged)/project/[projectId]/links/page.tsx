
import { LinkTable } from "@/src/components/table/link-table";
import { getUser } from "@/src/lib/auth-server";
import { prisma } from "@/src/lib/prisma"

type Params = {
    projectId: string;
}

export default async function LinksPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId } = await params;
    const user = await getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const IsMaker = await prisma.member.findFirst({
        where: {
            organizationId: projectId,
            userId: user.id,
            role: 'MAKER',
        },
    });

    if (!IsMaker) {
        throw new Error("Unauthorized");
    }

    const invitationLinks = await prisma.invitationLink.findMany({
        where: {
            organizationId: projectId,
        },
        include: {
            joiner: true,
            user: true,
        },
    });

    return (
        <div className="p-4">
            <LinkTable invitationLinks={invitationLinks} projectId={projectId} />
        </div>
    )
}