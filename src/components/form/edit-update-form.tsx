"use client"

import { Checkbox } from "@/src/components/ui/shadcn/checkbox"
import {
    Field,
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
import type { Organization, Update } from "@/src/generated/prisma/client"
import { UpdateType, UpdateStatus } from "@/src/generated/prisma/enums"
import UpdateUpdateButton from "@/src/components/button/update-update-button"
import React from "react"
import DeleteUpdateButton from "../button/delete-update-button"

const inputClass = "bg-input border-border-md placeholder:text-foreground-subtle focus-visible:border-primary focus-visible:ring-ring transition-colors"
const labelClass = "text-xs font-bold tracking-wide text-foreground-muted"

export default function EditUpdateForm({
    project,
    update,
    authorized,
}: {
    project: Organization
    update: Update
    authorized: boolean
}) {
    const [title, setTitle]               = React.useState<string>(update.title)
    const [content, setContent]           = React.useState<string>(update.content)
    const [type, setType]                 = React.useState<UpdateType>(update.type)
    const [status, setStatus]             = React.useState<UpdateStatus>(update.status)
    const [needvalidation, setNeedValidation] = React.useState<boolean>(update.needsValidation)
    const [previewLink, setPreviewLink]   = React.useState<string>(update.previewLink || "")
    const [timeSpent, setTimeSpent]       = React.useState<number | undefined>(update.timeSpent || undefined)
    const [progress, setProgress]         = React.useState<number>(project.progress || 0)

    return (
        <div className="flex justify-center w-full p-6 md:p-8">
            <form className="flex flex-col gap-6 max-w-2xl w-full">

                <Field>
                    <FieldLabel htmlFor="title" className={labelClass}>
                        Titre de l'update <span className="text-primary-light">*</span>
                    </FieldLabel>
                    <Input
                        id="title"
                        placeholder="Entrez le titre de l'update"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="content" className={labelClass}>
                        Contenu <span className="text-primary-light">*</span>
                    </FieldLabel>
                    <Textarea
                        id="content"
                        placeholder="Écrivez le contenu de l'update ici..."
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={`${inputClass} resize-y`}
                    />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="type" className={labelClass}>
                            Type
                        </FieldLabel>
                        <Select defaultValue={type} onValueChange={(v) => setType(v as UpdateType)}>
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

                    <Field>
                        <FieldLabel htmlFor="status" className={labelClass}>
                            Statut
                        </FieldLabel>
                        <Select defaultValue={status} onValueChange={(v) => setStatus(v as UpdateStatus)}>
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
                        <FieldLegend className="text-xs font-bold tracking-[0.12em] uppercase text-foreground-subtle">
                            Options supplémentaires
                        </FieldLegend>
                    </div>
                    <FieldGroup className="px-5 py-4 gap-5">

                        <Field orientation="horizontal" className="items-center gap-3">
                            <Checkbox
                                id="request-validation"
                                defaultChecked={needvalidation}
                                onCheckedChange={(checked) => setNeedValidation(!!checked)}
                            />
                            <FieldLabel
                                htmlFor="request-validation"
                                className="text-sm font-medium text-foreground cursor-pointer"
                            >
                                Demander la validation client
                            </FieldLabel>
                        </Field>

                        <Field>
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

                        <Field>
                            <FieldLabel htmlFor="time-spent" className={labelClass}>
                                Temps passé (heures)
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

                        <Field orientation="vertical">
                            <div className="flex items-center justify-between mb-2">
                                <FieldLabel htmlFor="progress" className={labelClass}>
                                    Progression globale du projet
                                </FieldLabel>
                                <span className="text-sm font-bold tabular-nums text-primary-light">
                                    {progress}%
                                </span>
                            </div>
                            <Slider
                                defaultValue={[progress]}
                                max={100}
                                step={1}
                                onValueChange={(value) => setProgress(value[0])}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-1.5">
                                <span className="text-[10px] text-foreground-subtle">0%</span>
                                <span className="text-[10px] text-foreground-subtle">100%</span>
                            </div>
                        </Field>

                    </FieldGroup>
                </FieldSet>

                <div className="flex items-center justify-between pt-1">
                    <DeleteUpdateButton
                        projectId={project.id}
                        updateId={update.id}
                        authorized={authorized}
                    />
                    <UpdateUpdateButton
                        projectId={project.id}
                        updateId={update.id}
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