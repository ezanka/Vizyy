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
import { Brush, ChevronDownIcon, ClipboardList, Globe, Laptop, Monitor, Palette, Sparkles, Tag, Zap } from "lucide-react"
import React from "react"
import { Field, FieldGroup, FieldLabel } from "@/src/components/ui/shadcn/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/shadcn/popover"
import { format } from "date-fns/format"
import { fr } from "date-fns/locale"
import { Calendar } from "@/src/components/ui/shadcn/calendar"
import { Slider } from "@/src/components/ui/shadcn/slider"
import CreateProjectButton from "@/src/components/button/create-project-button"

export default function NewPage() {

    const [projectName, setProjectName] = React.useState<string>("")
    const [selectedLogo, setSelectedLogo] = React.useState<string>("Globe");

    const [open, setOpen] = React.useState(false)
    const [deadline, setDeadline] = React.useState<Date | undefined>(undefined)

    const [progress, setProgress] = React.useState<number>(0)

    return (
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

                <FieldGroup className="mx-auto w-full flex-row">
                    <Field>
                        <FieldLabel htmlFor="date-picker-optional">Deadline</FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date-picker-optional"
                                    className="w-32 justify-between font-normal"
                                >
                                    {deadline ? format(deadline, "PPPP", { locale: fr }) : "Sélectionner la date"}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={deadline}
                                    captionLayout="dropdown"
                                    defaultMonth={deadline}
                                    onSelect={(date) => {
                                        setDeadline(date)
                                        setOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </Field>
                </FieldGroup>

                <Field>
                    <FieldLabel htmlFor="progress">Progression</FieldLabel>
                    <div className="flex items-center justify-between">
                        <Slider id="progress" defaultValue={[progress]} onValueChange={(value) => setProgress(value[0])} max={100} />
                        <span className="ml-4 w-12 text-right text-sm">{progress}%</span>
                    </div>
                </Field>

                <CreateProjectButton projectName={projectName} selectedLogo={selectedLogo} deadline={deadline} progress={progress} />
            </CardContent>
        </Card>
    )
}