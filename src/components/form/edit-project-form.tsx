"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/shadcn/input";
import { Label } from "@/src/components/ui/shadcn/label";
import { Button } from "@/src/components/ui/shadcn/button";
import { Slider } from "@/src/components/ui/shadcn/slider";
import { Calendar } from "@/src/components/ui/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/shadcn/popover";
import { updateProject } from "@/src/actions/update-project-actions";
import { Brush, CalendarIcon, ClipboardList, Globe, Laptop, Loader2, Monitor, Palette, Sparkles, Tag, X, Zap } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

export default function EditProjectForm({
    projectId,
    initialName,
    initialLogo,
    initialDeadline,
    initialProgress,
}: {
    projectId: string;
    initialName: string;
    initialLogo: string | null;
    initialDeadline: Date | null;
    initialProgress: number;
}) {
    const [name, setName] = useState<string>(initialName);
    const [logo, setLogo] = useState<string>(initialLogo ?? "");
    const [deadline, setDeadline] = useState<Date | null>(initialDeadline);
    const [progress, setProgress] = useState(initialProgress);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const hasChanges =
        name !== initialName ||
        logo !== (initialLogo ?? "") ||
        deadline?.getTime() !== initialDeadline?.getTime() ||
        progress !== initialProgress;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await updateProject(projectId, name, logo, deadline, progress);

        if (result.error) {
            setMessage({ type: "error", text: result.error });
        } else {
            setMessage({ type: "success", text: "Projet mis à jour avec succès" });
        }

        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="name">Nom du projet</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom du projet"
                    required
                />
            </div>

            <div className="space-y-2 mb-4">
                <Label htmlFor="logo">Icon</Label>
                <div className="flex items-center gap-1">
                    <Button type="button" variant="outline" className={`${logo === "Globe" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setLogo("Globe")}>
                        <Globe />
                    </Button>
                    <Button type="button" variant="outline" className={`${logo === "Laptop" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setLogo("Laptop")}>
                        <Laptop />
                    </Button>
                    <Button type="button" variant="outline" className={`${logo === "Monitor" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setLogo("Monitor")}>
                        <Monitor />
                    </Button>
                    <Button type="button" variant="outline" className={`${logo === "Zap" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setLogo("Zap")}>
                        <Zap />
                    </Button>
                    <Button type="button" variant="outline" className={`${logo === "Palette" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setLogo("Palette")}>
                        <Palette />
                    </Button>
                    <Button type="button" variant="outline" className={`${logo === "Sparkles" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setLogo("Sparkles")}>
                        <Sparkles />
                    </Button>
                    <Button type="button" variant="outline" className={`${logo === "Brush" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setLogo("Brush")}>
                        <Brush />
                    </Button>
                    <Button type="button" variant="outline" className={`${logo === "Tag" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setLogo("Tag")}>
                        <Tag />
                    </Button>
                    <Button type="button" variant="outline" className={`${logo === "ClipboardList" ? "bg-accent text-white" : ""}`} size="sm" onClick={() => setLogo("ClipboardList")}>
                        <ClipboardList />
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Deadline</Label>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="justify-start font-normal flex-1"
                                type="button"
                            >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {deadline ? format(deadline, "PPP", { locale: fr }) : <span className="text-muted-foreground">Aucune deadline</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={deadline || undefined}
                                onSelect={(date) => setDeadline(date ?? null)}
                                defaultMonth={deadline || undefined}
                            />
                        </PopoverContent>
                    </Popover>
                    {deadline && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeadline(null)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Progression ({progress}%)</Label>
                <Slider
                    value={[progress]}
                    onValueChange={(value) => setProgress(value[0])}
                    max={100}
                    step={1}
                />
            </div>

            {message && (
                <p className={message.type === "success" ? "text-sm text-green-500" : "text-sm text-red-500"}>
                    {message.text}
                </p>
            )}

            <Button type="submit" disabled={loading || !hasChanges} className="w-full">
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enregistrement...
                    </>
                ) : (
                    "Enregistrer les modifications"
                )}
            </Button>
        </form>
    );
}
