import { GripVertical, Calendar, Tag, CalendarCog } from 'lucide-react';
import { useSortable } from '@dnd-kit/react/sortable';
import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Prisma } from '@/src/generated/prisma/client';

type TodoWithAssignee = Prisma.TodoGetPayload<{ include: { assignee: true } }>;

const priorityConfig = {
    LOW: { label: 'Basse', class: 'bg-success-bg text-success border-success-border' },
    MEDIUM: { label: 'Moyenne', class: 'bg-warning-bg text-warning border-warning-border' },
    HIGH: { label: 'Élevée', class: 'bg-destructive-bg text-destructive border-destructive-border' },
    CRITICAL: { label: 'Critique', class: 'bg-destructive-bg text-destructive border-destructive-border' },
} as const;

const typeConfig = {
    DEVELOPMENT: { label: 'Dev', class: 'bg-info-bg text-info border-info-border' },
    BUG: { label: 'Bug', class: 'bg-destructive-bg text-destructive border-destructive-border' },
    DESIGN: { label: 'Design', class: 'bg-primary-ghost text-primary border-primary/20' },
    DOCUMENTATION: { label: 'Docs', class: 'bg-cyan-dim text-cyan border-cyan-border' },
    TEST: { label: 'Test', class: 'bg-warning-bg text-warning border-warning-border' },
    OTHER: { label: 'Autre', class: 'bg-muted text-muted-foreground border-border' },
} as const;

export function Item({ projectId, todo, index, column, authorized }: { projectId: string, todo: TodoWithAssignee, index: number, column: string, authorized?: boolean }) {
    const { ref, handleRef, isDragging } = useSortable({
        id: todo.id,
        index,
        type: 'item',
        accept: 'item',
        group: column
    });

    const priority = priorityConfig[todo.priority as keyof typeof priorityConfig];
    const type = typeConfig[todo.type as keyof typeof typeConfig];

    return (
        <Link
            href={`/project/${projectId}/todos/${todo.id}`}
            ref={ref}
            data-dragging={isDragging}
            className={cn(
                "group flex flex-col bg-card border border-border rounded-lg overflow-hidden text-sm",
                "hover:border-primary/30 hover:shadow-md transition-all duration-200",
                isDragging && "opacity-40 shadow-xl rotate-1 scale-[1.02]"
            )}
        >
            <div className="flex items-start gap-2 px-3 pt-3 pb-2">
                <span className="flex-1 font-medium text-foreground leading-snug line-clamp-2">
                    {todo.title}{todo.assignee && <span className="text-xs text-muted-foreground font-normal"> — {todo.assignee.name}</span>}
                </span>
                {authorized && (
                    <GripVertical
                        ref={handleRef}
                        className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 mt-0.5 cursor-grab active:cursor-grabbing transition-colors"
                    />
                )}
            </div>

            {todo.description && (
                <p className="px-3 pb-2.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 overflow-y-hidden max-h-10">
                    {todo.description}
                </p>
            )}

            <div className="flex items-center justify-between gap-2 px-3 py-2 mt-auto border-t border-border/60 bg-muted/30">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {type && (
                        <span className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border",
                            type.class
                        )}>
                            <Tag className="size-2.5" />
                            {type.label}
                        </span>
                    )}
                    {priority && (
                        <span className={cn(
                            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border tracking-wide uppercase",
                            priority.class
                        )}>
                            {priority.label}
                        </span>
                    )}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/70 shrink-0">
                    <Calendar className="size-2.5" />
                    {format(todo.createdAt, 'd MMM yyyy HH:mm', { locale: fr })}
                </span>
                {
                    todo.updatedAt && todo.updatedAt > todo.createdAt && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/70 shrink-0">
                            <CalendarCog className="size-2.5" />
                            {format(todo.updatedAt, 'd MMM yyyy HH:mm', { locale: fr })}
                        </span>
                    )
                }
            </div>
        </Link>
    );
}
