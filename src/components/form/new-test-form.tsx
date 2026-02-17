"use client"

import { Button } from "@/src/components/ui/shadcn/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/shadcn/card"
import { Label } from "@/src/components/ui/shadcn/label"
import React from "react"
import { redirect } from "next/navigation"
import { TestStatus, TestType } from "@/src/generated/prisma/enums"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/shadcn/select"
import { Textarea } from "../ui/shadcn/textarea"
import { Update } from "@/src/generated/prisma/client"
import { createTest } from "@/src/actions/create-test-actions"

export default function NewTestForm({ updates, projectId, authorized }: { updates: Update[], projectId: string, authorized: boolean }) {
    const [type, setType] = React.useState<TestType>(TestType.INTEGRATION)
    const [status, setStatus] = React.useState<TestStatus>(TestStatus.PENDING)
    const [details, setDetails] = React.useState<string>("")
    const [update, setUpdate] = React.useState<Update>()

    async function handleCreateTest() {
        if (!update || !authorized) return;
        createTest(projectId, type, status, details, update);

        redirect(`/project/${projectId}/test`);
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Créer un test</CardTitle>
                <CardDescription>
                    Remplissez les informations pour créer un nouveau test
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="space-y-2 mb-4">
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
                                            t === TestType.INTEGRATION ? "Intégration" :
                                                t === TestType.UNIT ? "Unitaire" : t

                                        return (
                                            <SelectItem key={t} value={t}>{label}</SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>


                <div className="space-y-2 mb-4">
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
                                                    t === TestStatus.PASSED ? "Réussi" : t

                                        return (
                                            <SelectItem key={t} value={t}>{label}</SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
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

                <div className="space-y-2">
                    <Label htmlFor="name">Détails</Label>
                    <Textarea id="name" placeholder="Détails du test" value={details} onChange={(e) => setDetails(e.target.value)} />
                </div>

                <Button onClick={handleCreateTest} disabled={!authorized} className="w-full">
                    Créer
                </Button>
            </CardContent>
        </Card>
    )
}