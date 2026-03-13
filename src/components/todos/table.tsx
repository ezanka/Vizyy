"use client";

import { useState, useRef, useEffect } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { ListPlus, Plus } from 'lucide-react';
import { Column, ColumnAccent } from '@/src/components/todos/column';
import { Item } from '@/src/components/todos/items';
import { Button } from '@/src/components/ui/shadcn/button';
import { TodoStatus } from "@/src/generated/prisma/enums";
import { updateTodoStatus } from '@/src/actions/update-todo-statut-actions';
import Link from 'next/link';
import { ButtonGroup } from '../ui/shadcn/button-group';
import { Prisma } from '@/src/generated/prisma/client';

type TodoWithAssignee = Prisma.TodoGetPayload<{ include: { assignee: true } }>;

const PRIORITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const sortByPriority = (todos: TodoWithAssignee[]) =>
    [...todos].sort((a, b) =>
        (PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] ?? 99) -
        (PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] ?? 99)
    );

const COLUMNS: Record<string, { label: string; accent: ColumnAccent }> = {
    [TodoStatus.TODO]: { label: 'À faire', accent: 'info' },
    [TodoStatus.IN_PROGRESS]: { label: 'En cours', accent: 'warning' },
    [TodoStatus.DONE]: { label: 'Terminé', accent: 'success' },
};

type ItemsState = { [TodoStatus.TODO]: string[];[TodoStatus.IN_PROGRESS]: string[];[TodoStatus.DONE]: string[] };
type PendingUpdate = { todoId: string; column: TodoStatus; snapshot: ItemsState };

export default function TodosTable({
    projectId,
    todos,
    authorized,
}: {
    projectId: string;
    todos: TodoWithAssignee[];
    authorized?: boolean;
}) {
    const [items, setItems] = useState({
        [TodoStatus.TODO]: sortByPriority(todos.filter(t => t.status === TodoStatus.TODO)).map(t => t.id),
        [TodoStatus.IN_PROGRESS]: sortByPriority(todos.filter(t => t.status === TodoStatus.IN_PROGRESS)).map(t => t.id),
        [TodoStatus.DONE]: sortByPriority(todos.filter(t => t.status === TodoStatus.DONE)).map(t => t.id),
    });

    const [pendingUpdate, setPendingUpdate] = useState<PendingUpdate | null>(null);
    const dragStartItemsRef = useRef(items);

    useEffect(() => {
        if (!pendingUpdate) return;
        const { todoId, column, snapshot } = pendingUpdate;
        setPendingUpdate(null);
        updateTodoStatus(projectId, todoId, column).catch(() => setItems(snapshot));
    }, [pendingUpdate, projectId]);

    const total = Object.values(items).flat().length;

    return (
        <div className="flex flex-col gap-6 min-h-fit h-full">

            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-2xl font-extrabold tracking-tight">Todos</h1>
                    <p className="text-[11px] text-foreground-subtle">
                        {total} tâche{total !== 1 ? 's' : ''}
                    </p>
                </div>

                {authorized ? (
                    <ButtonGroup>
                        <Button size="sm" variant="outline" asChild className="gap-1.5 border-border-md hover:border-border-hi">
                            <Link href={`/project/${projectId}/todos/proposals`}>
                                <ListPlus size={13} />
                                Propositions client
                            </Link>
                        </Button>
                        <Button size="sm" asChild className="gap-1.5">
                            <Link href={`/project/${projectId}/todos/new`}>
                                <Plus size={13} />
                                Ajouter
                            </Link>
                        </Button>
                    </ButtonGroup>
                ) : (
                    <Button size="sm" asChild className="gap-1.5">
                        <Link href={`/project/${projectId}/todos/proposals/new`}>
                            <Plus size={13} />
                            Faire une proposition
                        </Link>
                    </Button>
                )}
            </div>

            <DragDropProvider
                onDragStart={() => { dragStartItemsRef.current = items; }}
                onDragOver={(event) => { setItems((items) => move(items, event)); }}
                onDragEnd={(event) => {
                    const { source } = event.operation;
                    setItems((currentItems) => move(currentItems, event));
                    if (source) {
                        const todoId = source.id as string;
                        const column = (Object.keys(items) as Array<keyof typeof items>).find(col =>
                            items[col].includes(todoId)
                        );
                        if (column) {
                            setPendingUpdate({ todoId, column: column as TodoStatus, snapshot: dragStartItemsRef.current as ItemsState });
                        }
                    }
                }}
            >
                <div className="flex flex-1 gap-3 min-h-0">
                    {Object.entries(items).map(([column, columnItems]) => (
                        <Column
                            key={column}
                            id={column}
                            label={COLUMNS[column].label}
                            count={columnItems.length}
                            accent={COLUMNS[column as string].accent}
                        >
                            {columnItems.map((id, index) => {
                                const todo = todos.find(t => t.id === id);
                                return todo
                                    ? <Item key={id} projectId={projectId} todo={todo as TodoWithAssignee} index={index} column={column} authorized={authorized} />
                                    : null;
                            })}
                        </Column>
                    ))}
                </div>
            </DragDropProvider>
        </div>
    );
}