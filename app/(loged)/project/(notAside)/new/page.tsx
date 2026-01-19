"use client"

import { Button } from "@/src/components/ui/shadcn/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/shadcn/card"
import { Input } from "@/src/components/ui/shadcn/input"
import { Label } from "@/src/components/ui/shadcn/label"
import { Brush, ClipboardList, Globe, Laptop, Monitor, Palette, Sparkles, Tag, Zap } from "lucide-react"
import { createProject } from "@/src/actions/new-project-actions"
import React from "react"
import { redirect } from "next/navigation"

export default function NewPage() {

    const [projectName, setProjectName] = React.useState<string>("")
    const [selectedLogo, setSelectedLogo] = React.useState<string>("Globe");

    async function handleCreateProject() {
        const result = createProject(projectName, selectedLogo);
        const data = await result;

        redirect(`/project/${data.project?.id}/dashboard`);
    }

    return (
        <div className="flex h-[80vh] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Créer un projet</CardTitle>
                    <CardDescription>
                        Remplissez les informations pour créer un nouveau projet
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" placeholder="Nom du projet" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    </div>

                    <div className="space-y-2 mb-4">
                        <Label htmlFor="logo">Icon</Label>
                        <div className="flex items-center justify-between gap-1">
                            <Button variant="outline" className={`${selectedLogo === "Globe" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setSelectedLogo("Globe")}>
                                <Globe />
                            </Button>
                            <Button variant="outline" className={`${selectedLogo === "Laptop" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setSelectedLogo("Laptop")}>
                                <Laptop />
                            </Button>
                            <Button variant="outline" className={`${selectedLogo === "Monitor" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setSelectedLogo("Monitor")}>
                                <Monitor />
                            </Button>
                            <Button variant="outline" className={`${selectedLogo === "Zap" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setSelectedLogo("Zap")}>
                                <Zap />
                            </Button>
                            <Button variant="outline" className={`${selectedLogo === "Palette" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setSelectedLogo("Palette")}>
                                <Palette />
                            </Button>
                            <Button variant="outline" className={`${selectedLogo === "Sparkles" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setSelectedLogo("Sparkles")}>
                                <Sparkles />
                            </Button>
                            <Button variant="outline" className={`${selectedLogo === "Brush" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setSelectedLogo("Brush")}>
                                <Brush />
                            </Button>
                            <Button variant="outline" className={`${selectedLogo === "Tag" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setSelectedLogo("Tag")}>
                                <Tag />
                            </Button>
                            <Button variant="outline" className={`${selectedLogo === "ClipboardList" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setSelectedLogo("ClipboardList")}>
                                <ClipboardList />
                            </Button>
                        </div>
                    </div>

                    <Button onClick={handleCreateProject} className="w-full">
                        Créer
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}