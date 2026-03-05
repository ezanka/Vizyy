
import NewTodoForm from "@/src/components/form/new-todo-form";
import { MemberRole } from "@/src/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";

type Params = {
    projectId: string;
}

export default async function NewTodoPage({ params }: { params: Promise<Params> }) {
    const { projectId } = await params;

    const makers = await prisma.member.findMany({
        where: {
            organization: {
                id: projectId,
            },
            role: MemberRole.MAKER
        },
        include: {
            user: true
        }
    }).then(members => members.map(member => member.user));

    const updates = await prisma.update.findMany({
        where: {
            organizationId: projectId,
        }
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Créer un nouveau todo</h1>
            <NewTodoForm projectId={projectId} makers={makers} updates={updates} authorized={true} />
        </div>
    );
}