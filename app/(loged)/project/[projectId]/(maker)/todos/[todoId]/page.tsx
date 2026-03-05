
import { prisma } from "@/src/lib/prisma";
import { MemberRole } from "@/src/generated/prisma/enums";
import EditTodoForm from "@/src/components/form/edit-todo-form";
import { notFound } from "next/navigation";
import { isMaker } from "@/src/actions/is-maker-actions";

type Params = {
    projectId: string;
    todoId: string;
}

export default async function EditTodoPage({
    params
}: {
    params: Promise<Params>;
}) {
    const { projectId, todoId } = await params;

    const [todo, makers, updates, tasks] = await Promise.all([
        prisma.todo.findUnique({ where: { id: todoId } }),
        prisma.member.findMany({
            where: { organization: { id: projectId }, role: MemberRole.MAKER },
            include: { user: true },
        }).then(members => members.map(m => m.user)),
        prisma.update.findMany({ where: { organizationId: projectId } }),
        prisma.task.findMany({ where: { todoId: todoId } })
    ]);

    const authorized = (await isMaker(projectId)).isMaker;

    if (!todo) return notFound();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier la todo</h1>
            <EditTodoForm projectId={projectId} todo={todo} tasks={tasks} makers={makers} updates={updates} authorized={authorized} />
        </div>
    );
}
