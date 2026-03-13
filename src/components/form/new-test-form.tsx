"use client"

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/src/components/ui/shadcn/field"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/shadcn/card"
import { Input } from "@/src/components/ui/shadcn/input"
import { Textarea } from "@/src/components/ui/shadcn/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/shadcn/select"
import { Update } from "@/src/generated/prisma/client"
import { TestEnvironment, TestStatus, TestType } from "@/src/generated/prisma/enums"
import CreateTestButton from "../button/create-test-button"
import React from "react"

const inputClass = "bg-input border-border-md placeholder:text-foreground-subtle focus-visible:border-primary focus-visible:ring-ring transition-colors"
const labelClass = "text-xs font-bold tracking-wide text-foreground-muted"

const TEST_TYPE_LABELS: Record<TestType, string> = {
    [TestType.ACCEPTANCE]: "Recette",
    [TestType.CONFIGURATION]: "Configuration",
    [TestType.E2E]: "End-to-End",
    [TestType.FUNCTIONAL]: "Fonctionnel",
    [TestType.INTEGRATION]: "Intégration",
    [TestType.PERFORMANCE]: "Performance",
    [TestType.REGRESSION]: "Régression",
    [TestType.STRESS]: "Stress",
    [TestType.UI]: "Interface utilisateur",
    [TestType.UNIT]: "Unitaire",
    [TestType.OTHER]: "Autre",
}

const TEST_ENV_LABELS: Record<TestEnvironment, string> = {
    [TestEnvironment.DEVELOPMENT]: "Développement",
    [TestEnvironment.PRODUCTION]: "Production",
    [TestEnvironment.STAGING]: "Staging",
}

const TEST_STATUS_LABELS: Record<TestStatus, string> = {
    [TestStatus.PENDING]: "En attente",
    [TestStatus.FAILED]: "Échoué",
    [TestStatus.PASSED]: "Réussi",
    [TestStatus.BLOCKED]: "Bloqué",
}

export default function NewTestForm({
    updates,
    projectId,
    authorized,
}: {
    updates: Update[]
    projectId: string
    authorized: boolean
}) {
    const [name, setName] = React.useState("")
    const [type, setType] = React.useState<TestType>(TestType.INTEGRATION)
    const [status, setStatus] = React.useState<TestStatus>(TestStatus.PENDING)
    const [environment, setEnvironment] = React.useState<TestEnvironment>(TestEnvironment.DEVELOPMENT)
    const [update, setUpdate] = React.useState<Update>()
    const [actions, setActions] = React.useState("")
    const [results, setResults] = React.useState("")

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Créer un test</CardTitle>
                <CardDescription>
                    Remplissez les informations pour créer un nouveau test
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">

                <FieldSet className="rounded-xl border border-border bg-card-elevated overflow-hidden">
                    <div className="px-5 pt-4 border-b border-border">
                        <FieldLegend className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-foreground-subtle">
                            Identification
                        </FieldLegend>
                    </div>
                    <FieldGroup className="px-5 py-4 flex flex-col gap-5">

                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="name" className={labelClass}>
                                Nom du test
                            </FieldLabel>
                            <Input
                                id="name"
                                placeholder="Nom du test"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field className="flex flex-col gap-2">
                                <FieldLabel htmlFor="type" className={labelClass}>
                                    Type
                                </FieldLabel>
                                <Select value={type} onValueChange={(v) => setType(v as TestType)}>
                                    <SelectTrigger id="type" className={inputClass}>
                                        <SelectValue placeholder="Type de test" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Object.values(TestType).map((t) => (
                                                <SelectItem key={t} value={t}>{TEST_TYPE_LABELS[t]}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field className="flex flex-col gap-2">
                                <FieldLabel htmlFor="environment" className={labelClass}>
                                    Environnement
                                </FieldLabel>
                                <Select value={environment} onValueChange={(v) => setEnvironment(v as TestEnvironment)}>
                                    <SelectTrigger id="environment" className={inputClass}>
                                        <SelectValue placeholder="Environnement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Object.values(TestEnvironment).map((t) => (
                                                <SelectItem key={t} value={t}>{TEST_ENV_LABELS[t]}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field className="flex flex-col gap-2">
                                <FieldLabel htmlFor="status" className={labelClass}>
                                    Statut
                                </FieldLabel>
                                <Select value={status} onValueChange={(v) => setStatus(v as TestStatus)}>
                                    <SelectTrigger id="status" className={inputClass}>
                                        <SelectValue placeholder="Statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Object.values(TestStatus).map((t) => (
                                                <SelectItem key={t} value={t}>{TEST_STATUS_LABELS[t]}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="update" className={labelClass}>
                                Update associé
                            </FieldLabel>
                            <Select
                                value={update?.id || ""}
                                onValueChange={(v) => setUpdate(updates.find((u) => u.id === v))}
                            >
                                <SelectTrigger id="update" className={inputClass}>
                                    <SelectValue placeholder="Sélectionner un update" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {updates.map((u) => (
                                            <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                    </FieldGroup>
                </FieldSet>

                <FieldSet className="rounded-xl border border-border bg-card-elevated overflow-hidden">
                    <div className="px-5 pt-4 border-b border-border">
                        <FieldLegend className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-foreground-subtle">
                            Contenu du test
                        </FieldLegend>
                    </div>
                    <FieldGroup className="px-5 py-4 flex flex-col gap-5">

                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="actions" className={labelClass}>
                                Actions réalisées
                            </FieldLabel>
                            <Textarea
                                id="actions"
                                placeholder="Décrivez les actions effectuées durant le test"
                                value={actions}
                                onChange={(e) => setActions(e.target.value)}
                                className={`${inputClass} min-h-24 resize-y`}
                            />
                        </Field>

                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="results" className={labelClass}>
                                Résultats obtenus
                            </FieldLabel>
                            <Textarea
                                id="results"
                                placeholder="Décrivez les résultats observés"
                                value={results}
                                onChange={(e) => setResults(e.target.value)}
                                className={`${inputClass} min-h-24 resize-y`}
                            />
                        </Field>

                    </FieldGroup>
                </FieldSet>

                <CreateTestButton
                    projectId={projectId}
                    name={name}
                    actions={actions}
                    results={results}
                    type={type}
                    environment={environment}
                    statut={status}
                    update={update}
                    authorized={authorized}
                />

            </CardContent>
        </Card>
    )
}