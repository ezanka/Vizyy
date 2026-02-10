
import { prisma } from "@/src/lib/prisma";
import Feedback from "@/src/components/feedback";
import { getUser } from "@/src/lib/auth-server";

type Params = {
    projectId: string;
}

type SearchParams = {
    updateId?: string;
}

export default async function FeedbackPage({
    params,
    searchParams,
}: {
    params: Promise<Params>;
    searchParams: Promise<SearchParams>;
}) {
    const { projectId } = await params;
    const { updateId } = await searchParams;
    const user = await getUser();

    if (!user) {
        return <div className="flex flex-col gap-4 my-4 justify-between flex-1">
            <p>Vous devez être connecté pour voir les feedbacks.</p>
        </div>
    }

    const updates = await prisma.update.findMany({
        where: {
            organizationId: projectId,
        },
    });

    const feedbacks = updateId
        ? await prisma.feedback.findMany({
            where: {
                updateId: updateId,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        })
        : [];

    return (
        <div className="flex flex-col gap-4 my-4 justify-between flex-1">
            <Feedback projectId={projectId} updates={updates} feedbacks={feedbacks} selectedUpdateId={updateId} user={user} />
        </div>
    )
}