"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/shadcn/input";
import { Label } from "@/src/components/ui/shadcn/label";
import { Button } from "@/src/components/ui/shadcn/button";
import { updateProfile } from "@/src/actions/update-profile-actions";
import { Loader2 } from "lucide-react";

export default function EditProfileForm({
    initialName,
    initialCompany,
}: {
    initialName: string;
    initialCompany: string | null;
}) {
    const [name, setName] = useState(initialName);
    const [company, setCompany] = useState(initialCompany ?? "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const hasChanges = name !== initialName || company !== (initialCompany ?? "");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await updateProfile(name, company);

        if (result.error) {
            setMessage({ type: "error", text: result.error });
        } else {
            setMessage({ type: "success", text: "Profil mis à jour avec succès" });
        }

        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Nom de votre entreprise"
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
