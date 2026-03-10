
import { Card, CardHeader } from "@/src/components/ui/shadcn/card"
import Timeline from "@/src/components/timeline"
import { prisma } from "@/src/lib/prisma"
import { isMaker } from "@/src/actions/is-maker-actions";

type Params = {
    projectId: string;
}

export default async function timelinePage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId } = await params;
    const authorized = (await isMaker(projectId)).isMaker;

    const deadline = await prisma.organization.findUnique({
        where: {
            id: projectId,
        },
        select: {
            deadline: true,
        },
    })

    const members = await prisma.member.findMany({
        where: {
            organizationId: projectId,
        },
        include: {
            user: true,
        },
    })

    const timeline = await prisma.timeline.findMany({
        where: {
            organizationId: projectId,
        },
    })

    const updates = await prisma.update.findMany({
        where: {
            organizationId: projectId,
        },
    })

    return (
        <Card className="mt-4">
            <CardHeader>
                <Timeline timeline={timeline} members={members} updates={updates} projectId={projectId} authorized={authorized || false} deadline={deadline?.deadline || null} />
            </CardHeader>
        </Card>
    )
}