"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';
import { Badge } from '../ui/shadcn/badge';
import { cn } from '@/src/lib/utils';

interface ColumnProps {
    children: React.ReactNode;
    id: string;
    label: string;
    count: number;
    accent: string;
}

export function Column({ children, id, label, count, accent }: ColumnProps) {
    const { isDropTarget, ref } = useDroppable({
        id,
        type: 'column',
        accept: 'item',
        collisionPriority: CollisionPriority.Low,
    });

    return (
        <div
            className={cn(
                "bg-background border border-border rounded-xl flex-1 flex flex-col min-w-0 transition-colors",
                isDropTarget && "bg-accent/40"
            )}
            ref={ref}
        >
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <div className={cn("size-2 rounded-full shrink-0", accent)} />
                <span className="font-semibold text-sm">{label}</span>
                <Badge variant="secondary" className="ml-auto">{count}</Badge>
            </div>
            <div className="p-3 flex flex-col gap-2 flex-1">
                {children}
            </div>
        </div>
    );
}
