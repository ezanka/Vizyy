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
import { Update } from "@/src/generated/prisma/client"
import { User } from "@/src/generated/prisma/client"
import { Input } from "../ui/shadcn/input"
import { Field, FieldGroup, FieldLabel } from "../ui/shadcn/field"
import { Button } from "../ui/shadcn/button"
import CreateTodoButton from "../button/create-todo-button"

export default function NewTodoForm({ projectId, makers, updates, authorized }: { projectId: string, makers: User[], updates: Update[], authorized: boolean }) {
    const [title, setTitle] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [type, setType] = React.useState<TodoType>(TodoType.DEVELOPMENT)
    const [status, setStatus] = React.useState<TodoStatus>(TodoStatus.TODO)
    const [priority, setPriority] = React.useState<TodoPriority>(TodoPriority.MEDIUM)
    const [assignedTo, setAssignedTo] = React.useState<User | undefined>(undefined)
    const [update, setUpdate] = React.useState<Update | undefined>(undefined)

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Créer un todo</CardTitle>
                <CardDescription>
                    Remplissez les informations pour créer un nouveau todo
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
                        <div className="flex items-center justify-between gap-1">
                            <Select value={type} onValueChange={(value) => setType(value as TodoType)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Type de todo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(TodoType).map((t) => {
                                            const FieldLabel =
                                                t === TodoType.DEVELOPMENT ? "Développement" :
                                                    t === TodoType.BUG ? "Bug" :
                                                        t === TodoType.DESIGN ? "Design" :
                                                            t === TodoType.DOCUMENTATION ? "Documentation" :
                                                                t === TodoType.TEST ? "Test" :
                                                                    t === TodoType.OTHER ? "Autre" :
                                                                        t

                                            return (
                                                <SelectItem key={t} value={t}>{FieldLabel}</SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel>Statut</FieldLabel>
                        <div className="flex items-center justify-between gap-1">
                            <Select value={status} onValueChange={(value) => setStatus(value as TodoStatus)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Environnement du test" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(TodoStatus).map((t) => {
                                            const FieldLabel =
                                                t === TodoStatus.TODO ? "À faire" :
                                                    t === TodoStatus.IN_PROGRESS ? "En cours" :
                                                        t === TodoStatus.DONE ? "Terminé" : t

                                            return (
                                                <SelectItem key={t} value={t}>{FieldLabel}</SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel>Priorité</FieldLabel>
                        <div className="flex items-center justify-between gap-1">
                            <Select value={priority} onValueChange={(value) => setPriority(value as TodoPriority)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Priorité du test" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(TodoPriority).map((t) => {
                                            const FieldLabel =
                                                t === TodoPriority.LOW ? "Basse" :
                                                    t === TodoPriority.MEDIUM ? "Moyenne" :
                                                        t === TodoPriority.HIGH ? "Élevée" :
                                                            t === TodoPriority.CRITICAL ? "Critique" : t

                                            return (
                                                <SelectItem key={t} value={t}>{FieldLabel}</SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel>Assigné à</FieldLabel>
                        <div className="flex items-center justify-between gap-1">
                            <Select value={assignedTo?.id ?? "none"} onValueChange={(value) => setAssignedTo(value === "none" ? undefined : makers.find(maker => maker.id === value))}>
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
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel>Update</FieldLabel>
                        <div className="flex items-center justify-between gap-1">
                            <Select value={update?.id ?? "undefined"} onValueChange={(value) => setUpdate(value === "undefined" ? undefined : updates.find(u => u.id === value))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Lier à un update" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="undefined">Aucun</SelectItem>
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
                                                <SelectItem value="none" disabled>Aucun update disponible</SelectItem>
                                            </>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </Field>

                    <div className="w-full flex items-center justify-end">
                        {authorized ? (
                            <CreateTodoButton projectId={projectId} title={title} description={description} type={type} status={status} priority={priority} assignedTo={assignedTo} update={update} authorized={authorized} />
                        ) : (
                            <Button className="text-sm text-muted-foreground" disabled>Créer la todo</Button>
                        )}
                    </div>
                </FieldGroup>
            </CardContent>
        </Card>
    )
}