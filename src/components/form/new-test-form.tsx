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

export default function NewTestForm({ updates, projectId, authorized }: { updates: Update[], projectId: string, authorized: boolean }) {
    const [name, setName] = React.useState<string>("")
    const [type, setType] = React.useState<TestType>(TestType.INTEGRATION)
    const [status, setStatus] = React.useState<TestStatus>(TestStatus.PENDING)
    const [environment, setEnvironment] = React.useState<TestEnvironment>(TestEnvironment.DEVELOPMENT)
    const [details, setDetails] = React.useState<string>("")
    const [update, setUpdate] = React.useState<Update>()
    const [actions, setActions] = React.useState<string>("")
    const [results, setResults] = React.useState<string>("")

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Créer un test</CardTitle>
                <CardDescription>
                    Remplissez les informations pour créer un nouveau test
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="flex-1 space-y-4">
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="name">Nom du test</Label>
                        <Input id="name" placeholder="Nom du test" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Type</Label>
                        <div className="flex items-center justify-between gap-1">
                            <Select value={type} onValueChange={(value) => setType(value as TestType)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Type de test" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(TestType).map((t) => {
                                            const label =
                                                t === TestType.ACCEPTANCE ? "Recette" :
                                                    t === TestType.CONFIGURATION ? "Configuration" :
                                                        t === TestType.E2E ? "End-to-End" :
                                                            t === TestType.FUNCTIONAL ? "Fonctionnel" :
                                                                t === TestType.INTEGRATION ? "Intégration" :
                                                                    t === TestType.PERFORMANCE ? "Performance" :
                                                                        t === TestType.REGRESSION ? "Régression" :
                                                                            t === TestType.STRESS ? "Stress" :
                                                                                t === TestType.UI ? "Interface utilisateur" :
                                                                                    t === TestType.UNIT ? "Unitaire" :
                                                                                        t === TestType.OTHER ? "Autre" :
                                                                                            t

                                            return (
                                                <SelectItem key={t} value={t}>{label}</SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="actions">Actions réalisées</Label>
                        <Textarea id="actions" placeholder="Actions du test" value={actions} onChange={(e) => setActions(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="results">Résultats obtenus</Label>
                        <Textarea id="results" placeholder="Résultats du test" value={results} onChange={(e) => setResults(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Environnement</Label>
                        <div className="flex items-center justify-between gap-1">
                            <Select value={environment} onValueChange={(value) => setEnvironment(value as TestEnvironment)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Environnement du test" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(TestEnvironment).map((t) => {
                                            const label =
                                                t === TestEnvironment.DEVELOPMENT ? "Développement" :
                                                    t === TestEnvironment.PRODUCTION ? "Production" :
                                                        t === TestEnvironment.STAGING ? "Staging" : t

                                            return (
                                                <SelectItem key={t} value={t}>{label}</SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Statut</Label>
                        <div className="flex items-center justify-between gap-1">
                            <Select value={status} onValueChange={(value) => setStatus(value as TestStatus)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Statut du test" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(TestStatus).map((t) => {
                                            const label =
                                                t === TestStatus.PENDING ? "En attente" :
                                                    t === TestStatus.FAILED ? "Échoué" :
                                                        t === TestStatus.PASSED ? "Réussi" :
                                                            t === TestStatus.BLOCKED ? "Bloqué" : t

                                            return (
                                                <SelectItem key={t} value={t}>{label}</SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Update</Label>
                        <div className="flex items-center justify-between gap-1">
                            <Select value={update?.id || ""} onValueChange={(value) => setUpdate(updates.find(u => u.id === value))}>
                                <SelectTrigger className="w-full">
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
                        </div>
                    </div>

                    <div>
                        <CreateTestButton projectId={projectId} name={name} actions={actions} results={results} type={type} environment={environment} statut={status} update={update} authorized={authorized} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}