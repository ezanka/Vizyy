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
import type { Organization, Update } from "@/src/generated/prisma/client"
import { UpdateType, UpdateStatus } from "@/src/generated/prisma/enums"
import UpdateUpdateButton from "@/src/components/button/update-update-button"
import React from "react"
import Link from "next/link"

export default function EditUpdateForm({ project, update }: { project: Organization, update: Update }) {

    const [title, setTitle] = React.useState<string>(update.title)
    const [content, setContent] = React.useState<string>(update.content)
    const [type, setType] = React.useState<UpdateType>(update.type)
    const [status, setStatus] = React.useState<UpdateStatus>(update.status)
    const [needvalidation, setNeedValidation] = React.useState<boolean>(update.needsValidation);
    const [previewLink, setPreviewLink] = React.useState<string>(update.previewLink || "");
    const [timeSpent, setTimeSpent] = React.useState<number | undefined>(update.timeSpent || undefined);
    const [progress, setProgress] = React.useState<number>(project.progress || 0);

    return (
        <div className="flex justify-center w-full">
            <form className="space-y-6 max-w-2xl w-full">
                <Field>
                    <FieldLabel htmlFor="title">Titre de l'update</FieldLabel>
                    <Input id="title" placeholder="Entrez le titre de l'update" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="content">Contenu de l'update</FieldLabel>
                    <Textarea
                        id="content"
                        placeholder="Écrivez le contenu de l'update ici..."
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="status">Type de l'update</FieldLabel>
                    <Select defaultValue={type} onValueChange={(value) => setType(value as UpdateType)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={UpdateType.DESIGN}>Design</SelectItem>
                                <SelectItem value={UpdateType.FEATURE}>Fonctionnalités</SelectItem>
                                <SelectItem value={UpdateType.DEPLOY}>Deployement</SelectItem>
                                <SelectItem value={UpdateType.BUGFIX}>Correction de bugs</SelectItem>
                                <SelectItem value={UpdateType.OTHER}>Autres</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>

                <Field>
                    <FieldLabel htmlFor="status">Statut de l'update</FieldLabel>
                    <Select defaultValue={status} onValueChange={(value) => setStatus(value as UpdateStatus)}>
                        <SelectTrigger>
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

                <FieldSet>
                    <FieldLegend>Options supplémentaires</FieldLegend>
                    <FieldSeparator />
                    <FieldGroup>
                        <Field orientation="horizontal">
                            <Checkbox
                                id="request-validation"
                                defaultChecked={needvalidation}
                                onCheckedChange={(checked) => setNeedValidation(!!checked)}
                            />
                            <FieldLabel
                                htmlFor="request-validation"
                                className="font-normal"
                            >
                                Demander la validation
                            </FieldLabel>
                        </Field>

                        <Field>
                            <FieldLabel
                                htmlFor="preview-link"
                                className="font-normal"
                            >
                                Lien de prévisualisation
                            </FieldLabel>
                            <Input type="url" id="preview-link" placeholder="Lien de prévisualisation" defaultValue={previewLink} onChange={(e) => setPreviewLink(e.target.value)} />
                        </Field>

                        <Field>
                            <FieldLabel
                                htmlFor="time-spent"
                                className="font-normal"
                            >
                                Temps passé (en heures)
                            </FieldLabel>
                            <Input type="number" min={0} id="time-spent" placeholder="8h" defaultValue={timeSpent} onChange={(e) => setTimeSpent(Number(e.target.value))} />
                        </Field>

                        <Field orientation="vertical">
                            <FieldLabel
                                htmlFor="related-link"
                                className="font-normal min-w-fit"
                            >
                                Progression globale du projet
                            </FieldLabel>
                            <div className="flex items-center">
                                <Slider defaultValue={[progress]} max={100} step={1} onValueChange={(value) => setProgress(value[0])} />
                                <FieldDescription className="ml-4 w-8">{progress}%</FieldDescription>
                            </div>
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <div className="flex items-center justify-between">
                    <Button variant={"outline"} asChild>
                        <Link href={`/project/${project.id}/updates/${update.id}`}>
                            Annuler
                        </Link>
                    </Button>
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