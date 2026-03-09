"use client"

import { Button } from "@/src/components/ui/shadcn/button"
import { Checkbox } from "@/src/components/ui/shadcn/checkbox"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/src/components/ui/shadcn/field"
import { Input } from "@/src/components/ui/shadcn/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/shadcn/select"
import { Textarea } from "@/src/components/ui/shadcn/textarea"
import { Slider } from "@/src/components/ui/shadcn/slider"
import type { Organization } from "@/src/generated/prisma/client"
import { UpdateType, UpdateStatus } from "@/src/generated/prisma/enums"
import CreateUpdateButton from "@/src/components/button/create-update-button"
import React from "react"
import Link from "next/link"

const inputClass = "bg-input border-border-md placeholder:text-foreground-subtle focus-visible:border-primary focus-visible:ring-ring transition-colors"
const labelClass = "text-xs font-bold tracking-wide text-foreground-muted"

export default function NewUpdateForm({ project }: { project: Organization }) {

    const [title, setTitle] = React.useState<string>("")
    const [content, setContent] = React.useState<string>("")
    const [type, setType] = React.useState<UpdateType>(UpdateType.FEATURE)
    const [status, setStatus] = React.useState<UpdateStatus>(UpdateStatus.DRAFT)
    const [needvalidation, setNeedValidation] = React.useState<boolean>(true)
    const [previewLink, setPreviewLink] = React.useState<string>("")
    const [timeSpent, setTimeSpent] = React.useState<number>()
    const [progress, setProgress] = React.useState<number>(project.progress || 0)

    return (
        <div className="flex justify-center w-full p-6 md:p-8">
            <form className="flex flex-col gap-6 max-w-2xl w-full">

                <Field className="flex flex-col gap-2">
                    <FieldLabel htmlFor="title" className={labelClass}>
                        Titre de l'update
                    </FieldLabel>
                    <Input
                        id="title"
                        placeholder="Entrez le titre de l'update"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field className="flex flex-col gap-2">
                    <FieldLabel htmlFor="content" className={labelClass}>
                        Contenu de l'update
                    </FieldLabel>
                    <Textarea
                        id="content"
                        placeholder="Écrivez le contenu de l'update ici..."
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field className="flex flex-col gap-2">
                        <FieldLabel htmlFor="type" className={labelClass}>
                            Type de l'update
                        </FieldLabel>
                        <Select defaultValue={type} onValueChange={(value) => setType(value as UpdateType)}>
                            <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Sélectionnez le type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={UpdateType.DESIGN}>Design</SelectItem>
                                    <SelectItem value={UpdateType.FEATURE}>Fonctionnalités</SelectItem>
                                    <SelectItem value={UpdateType.DEPLOY}>Déploiement</SelectItem>
                                    <SelectItem value={UpdateType.BUGFIX}>Correction de bugs</SelectItem>
                                    <SelectItem value={UpdateType.OTHER}>Autres</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field className="flex flex-col gap-2">
                        <FieldLabel htmlFor="status" className={labelClass}>
                            Statut de l'update
                        </FieldLabel>
                        <Select defaultValue={status} onValueChange={(value) => setStatus(value as UpdateStatus)}>
                            <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Sélectionnez le statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={UpdateStatus.DRAFT}>Brouillon</SelectItem>
                                    <SelectItem value={UpdateStatus.IN_PROGRESS}>En cours</SelectItem>
                                    <SelectItem value={UpdateStatus.PENDING}>En attente de validation</SelectItem>
                                    <SelectItem value={UpdateStatus.DONE}>Terminé</SelectItem>
                                    <SelectItem value={UpdateStatus.BLOCKED}>Bloqué</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>

                <FieldSet className="rounded-xl border border-border bg-card-elevated overflow-hidden">
                    <div className="px-5 pt-4 border-b border-border">
                        <FieldLegend className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-foreground-subtle">
                            Options supplémentaires
                        </FieldLegend>
                    </div>
                    <FieldGroup className="px-5 py-4 flex flex-col gap-5">

                        <Field orientation="horizontal" className="flex items-center gap-3">
                            <Checkbox
                                id="request-validation"
                                defaultChecked={needvalidation}
                                onCheckedChange={(checked) => setNeedValidation(!!checked)}
                            />
                            <FieldLabel htmlFor="request-validation" className={labelClass}>
                                Demander la validation du client
                            </FieldLabel>
                        </Field>

                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="preview-link" className={labelClass}>
                                Lien de prévisualisation
                            </FieldLabel>
                            <Input
                                type="url"
                                id="preview-link"
                                placeholder="https://..."
                                defaultValue={previewLink}
                                onChange={(e) => setPreviewLink(e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="time-spent" className={labelClass}>
                                Temps passé (en heures)
                            </FieldLabel>
                            <Input
                                type="number"
                                min={0}
                                id="time-spent"
                                placeholder="8"
                                defaultValue={timeSpent}
                                onChange={(e) => setTimeSpent(Number(e.target.value))}
                                className={inputClass}
                            />
                        </Field>

                        <Field className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <FieldLabel htmlFor="progress" className={labelClass}>
                                    Progression globale du projet
                                </FieldLabel>
                                <span className="text-xs font-bold tabular-nums text-primary-light">{progress}%</span>
                            </div>
                            <Slider
                                defaultValue={[progress]}
                                max={100}
                                step={1}
                                onValueChange={(value) => setProgress(value[0])}
                                className="w-full"
                            />
                            <div className="flex justify-between">
                                <FieldDescription className="text-[11px] text-foreground-subtle">0%</FieldDescription>
                                <FieldDescription className="text-[11px] text-foreground-subtle">100%</FieldDescription>
                            </div>
                        </Field>

                    </FieldGroup>
                </FieldSet>

                <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" asChild className="border-border-md hover:border-border-hi">
                        <Link href={`/project/${project.id}/updates`}>
                            Annuler
                        </Link>
                    </Button>
                    <CreateUpdateButton
                        projectId={project.id}
                        title={title}
                        content={content}
                        type={type}
                        statut={status}
                        needvalidation={needvalidation}
                        previewLink={previewLink}
                        timeSpent={timeSpent}
                        progress={progress}
                    />
                </div>

            </form>
        </div>
    )
}