import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/react/sortable';
import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { Todo } from '@/src/generated/prisma/client';

const priorityConfig = {
    LOW:    { label: 'Low',    class: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    MEDIUM: { label: 'Medium', class: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    HIGH:   { label: 'High',   class: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    CRITICAL: { label: 'Critical', class: 'bg-red-500/10 text-red-500 border-red-500/20' }
} as const;

export function Item({ projectId, todo, index, column, authorized }: { projectId: string, todo: Todo, index: number, column: string, authorized?: boolean }) {
    const { ref, handleRef, isDragging } = useSortable({
        id: todo.id,
        index,
        type: 'item',
        accept: 'item',
        group: column
    });

    const priority = priorityConfig[todo.priority as keyof typeof priorityConfig];

    return (
        <Link
            href={`/projects/${projectId}/todos/${todo.id}`}
            ref={ref}
            data-dragging={isDragging}
            className={cn(
                "group flex flex-col bg-card border border-border rounded-lg overflow-hidden text-sm",
                "hover:border-border/80 hover:shadow-md transition-all duration-200",
                isDragging && "opacity-40 shadow-xl rotate-1 scale-[1.02]"
            )}
        >
            <div className="flex items-start gap-2 px-3 pt-3 pb-2.5">
                <span className="flex-1 font-medium text-foreground leading-snug line-clamp-2">
                    {todo.title}
                </span>
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    {priority && (
                        <span className={cn(
                            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border tracking-wide uppercase",
                            priority.class
                        )}>
                            {priority.label}
                        </span>
                    )}
                    {authorized && (
                        <GripVertical
                            ref={handleRef}
                            className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 cursor-grab active:cursor-grabbing transition-colors"
                        />
                    )}
                </div>
            </div>

            {todo.description && (
                <>
                    <div className="h-px bg-border mx-3" />
                    <p className="px-3 py-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {todo.description}
                    </p>
                </>
            )}
        </Link>
    );
}