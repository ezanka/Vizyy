"use client"

import React from "react"
import { TodoPriority, TodoStatus, TodoType } from "@/src/generated/prisma/enums"
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "../ui/shadcn/select"
import { Textarea } from "../ui/shadcn/textarea"
import { Todo, Update, User, Task } from "@/src/generated/prisma/client"
import { Input } from "../ui/shadcn/input"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/shadcn/field"
import { Button } from "../ui/shadcn/button"
import UpdateTodoButton from "../button/update-todo-button"
import DeleteTodoButton from "../button/delete-todo-button"
import { Trash, Calendar, Plus } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function EditTodoForm({
    projectId,
    todo,
    tasks,
    makers,
    updates,
    authorized,
}: {
    projectId: string
    todo: Todo
    tasks: Task[]
    makers: User[]
    updates: Update[]
    authorized?: boolean
}) {
    const [title, setTitle] = React.useState<string>(todo.title)
    const [description, setDescription] = React.useState<string>(todo.description ?? "")
    const [type, setType] = React.useState<TodoType>(todo.type as TodoType)
    const [status, setStatus] = React.useState<TodoStatus>(todo.status as TodoStatus)
    const [priority, setPriority] = React.useState<TodoPriority>(todo.priority as TodoPriority)
    const [assignedTo, setAssignedTo] = React.useState<User | undefined>(
        makers.find(m => m.id === todo.assigneeId)
    )
    const [update, setUpdate] = React.useState<Update | undefined>(
        updates.find(u => u.id === todo.updateId)
    )
    const [task, setTask] = React.useState<string>("")
    const [tasksList, setTasksList] = React.useState<Task[]>([...tasks])

    return (
        <div className="flex justify-center w-full">
            <div className="flex flex-col gap-6 max-w-2xl w-full">

                <FieldGroup className="flex flex-col gap-6">

                    <div className="grid grid-cols-2 gap-4">
                        <Field className="flex flex-col gap-2">
                            <FieldLabel className="text-xs font-bold tracking-wide text-foreground-muted">
                                Nom de la todo
                            </FieldLabel>
                            <Input
                                placeholder="Nom"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-card-elevated border-border-md placeholder:text-foreground-subtle focus-visible:border-primary focus-visible:ring-ring transition-colors"
                            />
                        </Field>

                        <Field className="flex flex-col gap-2">
                            <FieldLabel className="text-xs font-bold tracking-wide text-foreground-muted">
                                Assigné à
                            </FieldLabel>
                            <Select
                                value={assignedTo?.id ?? "none"}
                                onValueChange={(value) => setAssignedTo(value === "none" ? undefined : makers.find(m => m.id === value))}
                            >
                                <SelectTrigger className="bg-card-elevated border-border-md focus:border-primary focus:ring-ring transition-colors">
                                    <SelectValue placeholder="Assigné à" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="none">Personne</SelectItem>
                                        <SelectSeparator className="border-b border-border" />
                                        {makers.map((m) => (
                                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field className="flex flex-col gap-2">
                        <FieldLabel className="text-xs font-bold tracking-wide text-foreground-muted">
                            Actions à réaliser
                        </FieldLabel>
                        <Textarea
                            placeholder="Décrivez les actions à réaliser..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="bg-card-elevated border-border-md placeholder:text-foreground-subtle focus-visible:border-primary focus-visible:ring-ring transition-colors resize-none"
                        />
                    </Field>

                    <FieldSet className="rounded-xl border border-border bg-card-elevated overflow-hidden">
                        <div className="px-5 pt-4 border-b border-border">
                            <FieldLegend className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-foreground-subtle">
                                Classification
                            </FieldLegend>
                        </div>
                        <FieldGroup className="px-5 pb-4 flex flex-col gap-4">
                            <div className="grid grid-cols-3 gap-4">
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel className="text-xs font-bold tracking-wide text-foreground-muted">Type</FieldLabel>
                                    <Select value={type} onValueChange={(value) => setType(value as TodoType)}>
                                        <SelectTrigger className="bg-card border-border-md focus:border-primary focus:ring-ring transition-colors">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.values(TodoType).map((t) => {
                                                    const label =
                                                        t === TodoType.DEVELOPMENT ? "Développement" :
                                                            t === TodoType.BUG ? "Bug" :
                                                                t === TodoType.DESIGN ? "Design" :
                                                                    t === TodoType.DOCUMENTATION ? "Documentation" :
                                                                        t === TodoType.TEST ? "Test" :
                                                                            t === TodoType.OTHER ? "Autre" : t
                                                    return <SelectItem key={t} value={t}>{label}</SelectItem>
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field className="flex flex-col gap-2">
                                    <FieldLabel className="text-xs font-bold tracking-wide text-foreground-muted">Statut</FieldLabel>
                                    <Select value={status} onValueChange={(value) => setStatus(value as TodoStatus)}>
                                        <SelectTrigger className="bg-card border-border-md focus:border-primary focus:ring-ring transition-colors">
                                            <SelectValue placeholder="Statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.values(TodoStatus).map((t) => {
                                                    const label =
                                                        t === TodoStatus.TODO ? "À faire" :
                                                            t === TodoStatus.IN_PROGRESS ? "En cours" :
                                                                t === TodoStatus.DONE ? "Terminé" : t
                                                    return <SelectItem key={t} value={t}>{label}</SelectItem>
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field className="flex flex-col gap-2">
                                    <FieldLabel className="text-xs font-bold tracking-wide text-foreground-muted">Priorité</FieldLabel>
                                    <Select value={priority} onValueChange={(value) => setPriority(value as TodoPriority)}>
                                        <SelectTrigger className="bg-card border-border-md focus:border-primary focus:ring-ring transition-colors">
                                            <SelectValue placeholder="Priorité" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.values(TodoPriority).map((t) => {
                                                    const label =
                                                        t === TodoPriority.LOW ? "Basse" :
                                                            t === TodoPriority.MEDIUM ? "Moyenne" :
                                                                t === TodoPriority.HIGH ? "Élevée" :
                                                                    t === TodoPriority.CRITICAL ? "Critique" : t
                                                    return <SelectItem key={t} value={t}>{label}</SelectItem>
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>

                            <Field className="flex flex-col gap-2">
                                <FieldLabel className="text-xs font-bold tracking-wide text-foreground-muted">
                                    Lier à un update
                                </FieldLabel>
                                <Select
                                    value={update?.id ?? "none"}
                                    onValueChange={(value) => setUpdate(value === "none" ? undefined : updates.find(u => u.id === value))}
                                >
                                    <SelectTrigger className="bg-card border-border-md focus:border-primary focus:ring-ring transition-colors">
                                        <SelectValue placeholder="Lier à un update" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="none">Aucun</SelectItem>
                                            {updates.length > 0 ? (
                                                <>
                                                    <SelectSeparator className="border-b border-border" />
                                                    {updates.map((u) => (
                                                        <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    <SelectSeparator className="border-b border-border" />
                                                    <SelectItem value="disabled" disabled>Aucun update disponible</SelectItem>
                                                </>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                        </FieldGroup>
                    </FieldSet>

                    <FieldSet className="rounded-xl border border-border bg-card-elevated overflow-hidden">
                        <div className="px-5 pt-4 border-b border-border">
                            <FieldLegend className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-foreground-subtle">
                                Tâches réalisées
                            </FieldLegend>
                        </div>
                        <FieldGroup className="px-5 pb-4 flex flex-col gap-3">

                            <div className="flex gap-2">
                                <Input
                                    value={task}
                                    onChange={(e) => setTask(e.target.value)}
                                    placeholder="Décrire une tâche réalisée..."
                                    className="bg-card border-border-md placeholder:text-foreground-subtle focus-visible:border-primary focus-visible:ring-ring transition-colors"
                                />
                                <Button
                                    size="sm"
                                    disabled={!authorized || !task}
                                    className="gap-1.5 shrink-0"
                                    onClick={() => {
                                        if (!authorized || !task) return
                                        setTasksList([...tasksList, {
                                            id: crypto.randomUUID(),
                                            content: task,
                                            todoId: todo.id,
                                            authorId: assignedTo?.id ?? "",
                                            createdAt: new Date(),
                                            updatedAt: new Date(),
                                        }])
                                        setTask("")
                                    }}
                                >
                                    <Plus size={13} />
                                    Ajouter
                                </Button>
                            </div>

                            {tasksList.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    {tasksList.map((t) => (
                                        <div
                                            key={t.id}
                                            className="flex flex-col bg-card border border-border rounded-lg overflow-hidden"
                                        >
                                            <div className="flex items-start gap-2 px-3 pt-3 pb-2">
                                                <span className="flex-1 text-[13px] font-medium text-foreground leading-snug">
                                                    {t.content}
                                                </span>
                                                {authorized && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        type="button"
                                                        className="size-6 shrink-0 -mt-0.5 -mr-0.5 text-foreground-subtle hover:text-destructive hover:bg-destructive-bg transition-colors"
                                                        onClick={() => setTasksList(tasksList.filter(task => task.id !== t.id))}
                                                    >
                                                        <Trash size={12} />
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-2 border-t border-border bg-card-elevated">
                                                <Calendar size={10} className="text-foreground-subtle" />
                                                <span className="text-[10px] text-foreground-subtle">
                                                    {format(new Date(t.createdAt), "dd MMM yyyy · HH:mm", { locale: fr })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </FieldGroup>
                    </FieldSet>

                    <div className="flex items-center justify-between pt-2">
                        {authorized ? (
                            <>
                                <DeleteTodoButton projectId={projectId} todoId={todo.id} authorized={authorized} />
                                <UpdateTodoButton
                                    projectId={projectId}
                                    todoId={todo.id}
                                    title={title}
                                    description={description}
                                    type={type}
                                    status={status}
                                    priority={priority}
                                    assignedTo={assignedTo}
                                    update={update}
                                    tasks={tasksList}
                                    authorized={authorized}
                                />
                            </>
                        ) : (
                            <>
                                <Button variant="outline" className="border-border-md text-foreground-subtle" disabled>
                                    Supprimer la todo
                                </Button>
                                <Button disabled>
                                    Mettre à jour
                                </Button>
                            </>
                        )}
                    </div>

                </FieldGroup>
            </div>
        </div>
    )
}