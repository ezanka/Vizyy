import { isMaker } from "@/src/actions/is-maker-actions";
import TodosTable from "@/src/components/todos/table";
import { prisma } from "@/src/lib/prisma";

type Params = {
    projectId: string;
}

export default async function TodosPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId } = await params;
    const imMaker = (await isMaker(projectId)).isMaker;
    
    const todos = await prisma.todo.findMany({
        where: {
            projectId: projectId,
        },
        include: {
            assignee: true,
        }
    });

    return (
        <TodosTable projectId={projectId} todos={todos} authorized={imMaker} />
    )
}
