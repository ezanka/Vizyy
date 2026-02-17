
import { isMaker } from "@/src/actions/is-maker-actions";
import NewTestForm from "@/src/components/form/new-test-form";
import { prisma } from "@/src/lib/prisma";

type Params = {
    projectId: string;
}

export default async function NewPage({ params }: { params : Promise<Params> }) {
    const { projectId } = await params;
    const authorized = (await isMaker(projectId)).isMaker;

    const updates = await prisma.update.findMany({
        where: {
            organizationId: projectId,
        }
    })

    return (
        <div className="w-full flex-1 flex justify-center items-center">
            <NewTestForm updates={updates} projectId={projectId} authorized={authorized || false} />
        </div>
    )
}