"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/shadcn/button";
import { Input } from "@/src/components/ui/shadcn/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/shadcn/dialog";
import { deleteProject } from "@/src/actions/delete-project-actions";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteProjectForm({
    projectId,
    projectName,
}: {
    projectId: string;
    projectName: string;
}) {
    const [confirmation, setConfirmation] = useState("");
    const [loading, setLoading] = useState(false);

    const isConfirmed = confirmation === projectName;

    async function handleDelete() {
        setLoading(true);
        await deleteProject(projectId);
        setLoading(false);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer le projet
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Supprimer le projet</DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible. Toutes les données du projet seront supprimées définitivement (updates, feedbacks, tests, timeline, membres...).
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <p className="text-sm">
                        Tapez <span className="font-semibold">{projectName}</span> pour confirmer la suppression.
                    </p>
                    <Input
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        placeholder={projectName}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={!isConfirmed || loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Suppression...
                            </>
                        ) : (
                            "Supprimer définitivement"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
