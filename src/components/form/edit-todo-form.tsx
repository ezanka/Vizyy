"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/shadcn/card"
import React from "react"
import { TodoPriority, TodoStatus, TodoType } from "@/src/generated/prisma/enums"
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "../ui/shadcn/select"
import { Textarea } from "../ui/shadcn/textarea"
import { Todo, Update, User, Task } from "@/src/generated/prisma/client"
import { Input } from "../ui/shadcn/input"
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "../ui/shadcn/field"
import { Button } from "../ui/shadcn/button"
import UpdateTodoButton from "../button/update-todo-button"
import DeleteTodoButton from "../button/delete-todo-button"
import { Trash, Calendar } from "lucide-react"
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
    updates: Update[],
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
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Modifier la todo</CardTitle>
                <CardDescription>
                    Modifiez les informations de la todo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup className="flex-1 gap-4">
                    <Field>
                        <FieldLabel>Nom de la todo</FieldLabel>
                        <Input placeholder="Nom" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Field>

                    <Field>
                        <FieldLabel>Actions à réalisées</FieldLabel>
                        <Textarea placeholder="Actions à réalisées" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Field>

                    <Field>
                        <FieldLabel>Type</FieldLabel>
                        <Select value={type} onValueChange={(value) => setType(value as TodoType)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Type de todo" />
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

                    <Field>
                        <FieldLabel>Statut</FieldLabel>
                        <Select value={status} onValueChange={(value) => setStatus(value as TodoStatus)}>
                            <SelectTrigger className="w-full">
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

                    <Field>
                        <FieldLabel>Priorité</FieldLabel>
                        <Select value={priority} onValueChange={(value) => setPriority(value as TodoPriority)}>
                            <SelectTrigger className="w-full">
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

                    <Field>
                        <FieldLabel>Assigné à</FieldLabel>
                        <Select
                            value={assignedTo?.id ?? "none"}
                            onValueChange={(value) => setAssignedTo(value === "none" ? undefined : makers.find(m => m.id === value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Assigné à" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="none">Personne</SelectItem>
                                    <SelectSeparator />
                                    {makers.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel>Update</FieldLabel>
                        <Select
                            value={update?.id ?? "none"}
                            onValueChange={(value) => setUpdate(value === "none" ? undefined : updates.find(u => u.id === value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Lier à un update" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="none">Aucun</SelectItem>
                                    {updates.length > 0 ? (
                                        <>
                                            <SelectSeparator />
                                            {updates.map((u) => (
                                                <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <SelectSeparator />
                                            <SelectItem value="disabled" disabled>Aucun update disponible</SelectItem>
                                        </>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <FieldSeparator />
                    <Field>
                        <FieldLabel>Tâches réalisées</FieldLabel>
                        <div className="flex gap-2">
                            <Input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Ajouter une tâche réalisée" />
                            <Button disabled={!authorized || !task} onClick={() => {
                                if (!authorized) {
                                    alert("Vous n'êtes pas autorisé à créer une tâche");
                                    return;
                                }

                                if (!task) {
                                    alert("Vous devez avoir un contenu pour créer une tâche");
                                    return;
                                }

                                setTasksList([...tasksList, { id: crypto.randomUUID(), content: task, todoId: todo.id, authorId: assignedTo?.id ?? "", createdAt: new Date(), updatedAt: new Date() }]);
                                setTask("");
                            }}>Ajouter</Button>
                        </div>
                        <div className="mt-2 flex flex-col gap-2">
                            {tasksList.map((t) => (
                                <div key={t.id} className="flex flex-col bg-card border border-border rounded-lg overflow-hidden">
                                    <div className="flex items-start gap-2 px-3 pt-3 pb-2">
                                        <span className="flex-1 text-sm font-medium text-foreground leading-snug">{t.content}</span>
                                        {authorized && (
                                            <Button variant="ghost" size="sm" type="button" className="shrink-0 -mt-1 -mr-1 text-muted-foreground hover:text-destructive" onClick={() => setTasksList(tasksList.filter(task => task.id !== t.id))}>
                                                <Trash className="size-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-2 border-t border-border/60 bg-muted/30">
                                        <Calendar className="size-2.5 text-muted-foreground/70" />
                                        <span className="text-[10px] text-muted-foreground/70">
                                            {format(new Date(t.createdAt), "dd MMM yyyy", { locale: fr })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Field>
                    <FieldSeparator />

                    <div className="w-full flex items-center justify-between">
                        {authorized ? (
                            <>
                                <DeleteTodoButton projectId={projectId} todoId={todo.id} authorized={authorized} />
                                <UpdateTodoButton projectId={projectId} todoId={todo.id} title={title} description={description} type={type} status={status} priority={priority} assignedTo={assignedTo} update={update} tasks={tasksList} authorized={authorized} />
                            </>
                        ) : (
                            <>
                                <Button variant={"destructive"} disabled>Supprimer la todo</Button>
                                <Button disabled>Mettre à jour la todo</Button>
                            </>
                        )}
                    </div>
                </FieldGroup>
            </CardContent>
        </Card>
    )
}
