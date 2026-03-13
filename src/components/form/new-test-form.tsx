"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/shadcn/card"
import { Label } from "@/src/components/ui/shadcn/label"
import React from "react"
import { TestEnvironment, TestStatus, TestType } from "@/src/generated/prisma/enums"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/shadcn/select"
import { Textarea } from "../ui/shadcn/textarea"
import { Update } from "@/src/generated/prisma/client"
import CreateTestButton from "../button/create-test-button"
import { Input } from "../ui/shadcn/input"

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

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            {children}
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-border-md bg-card-elevated p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {title}
            </p>
            {children}
        </div>
    )
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
    const [details, setDetails] = React.useState("")
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
            <CardContent className="space-y-4">

                <Section title="Identification">
                    <Field id="name" label="Nom du test">
                        <Input
                            id="name"
                            placeholder="Nom du test"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Field id="type" label="Type">
                            <Select value={type} onValueChange={(v) => setType(v as TestType)}>
                                <SelectTrigger id="type" className="w-full">
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
                        <Field id="environment" label="Environnement">
                            <Select value={environment} onValueChange={(v) => setEnvironment(v as TestEnvironment)}>
                                <SelectTrigger id="environment" className="w-full">
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
                        <Field id="status" label="Statut">
                            <Select value={status} onValueChange={(v) => setStatus(v as TestStatus)}>
                                <SelectTrigger id="status" className="w-full">
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
                    <Field id="update" label="Update associé">
                        <Select
                            value={update?.id || ""}
                            onValueChange={(v) => setUpdate(updates.find((u) => u.id === v))}
                        >
                            <SelectTrigger id="update" className="w-full">
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
                </Section>

                <Section title="Contenu du test">
                    <Field id="actions" label="Actions réalisées">
                        <Textarea
                            id="actions"
                            placeholder="Décrivez les actions effectuées durant le test"
                            value={actions}
                            onChange={(e) => setActions(e.target.value)}
                            className="min-h-24 resize-y"
                        />
                    </Field>
                    <Field id="results" label="Résultats obtenus">
                        <Textarea
                            id="results"
                            placeholder="Décrivez les résultats observés"
                            value={results}
                            onChange={(e) => setResults(e.target.value)}
                            className="min-h-24 resize-y"
                        />
                    </Field>
                </Section>

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