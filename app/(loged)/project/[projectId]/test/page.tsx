import { isMaker } from "@/src/actions/is-maker-actions";
import { TestTable } from "@/src/components/table/test-table";
import { getUser } from "@/src/lib/auth-server";
import { prisma } from "@/src/lib/prisma";

type Params = {
    projectId: string;
}

export default async function TestPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const user = await getUser()
    const { projectId } = await params;
    const authorized = (await isMaker(projectId)).isMaker;

    if (!user) {
        return (
            <div className="flex flex-col gap-4 my-4 justify-between flex-1">
                <p>Vous devez être connecté pour voir cette page.</p>
            </div>
        );
    }

    const tests = await prisma.test.findMany({
        where: {
            projectId: projectId,
        },
        include: {
            update: {
                include: {
                    organization: {
                        include: { 
                            members: {
                                include: {
                                    user: true,
                                }
                            } 
                        }
                    }
                },
            },
        }
    })

    const updates = await prisma.update.findMany({
        where: {
            organizationId: projectId,
        }
    })

    return (
        <div className="flex flex-col gap-4 my-4 flex-1">
            <TestTable tests={tests} projectId={projectId} updates={updates} authorized={authorized || false} />
        </div>
    );
}