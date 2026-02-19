"use client"

import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/shadcn/button"
import { Card, CardContent } from "@/src/components/ui/shadcn/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/src/components/ui/shadcn/field"
import { Input } from "@/src/components/ui/shadcn/input"
import { authClient } from "@/src/lib/auth-client"
import Link from "next/link"
import { Github } from "lucide-react"
import { useState } from "react"

const signUpWithGitHub = async () => {
    await authClient.signIn.social({
        provider: "github"
    })
}

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas")
            return
        }
        if (formData.password.length < 8) {
            alert("Le mot de passe doit contenir au moins 8 caractères")
            return
        }

        try {
            const { data, error } = await authClient.signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                callbackURL: "/projects",
            })

            if (error) {
                alert(error.message || "Erreur lors de l'inscription")
                return
            }

            window.location.href = "/projects"
        } catch (err) {
            console.error("Erreur d'inscription:", err)
            alert("Une erreur est survenue lors de l'inscription")
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 rounded-xl">
                <CardContent>
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Créer un compte</h1>
                                <p className="text-muted-foreground text-balance">
                                    Entrez vos informations pour commencer.
                                </p>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="name">Nom complet</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Jean Dupont"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                />
                                <FieldDescription>
                                    Minimum 8 caractères
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="confirmPassword">
                                    Confirmer le mot de passe
                                </FieldLabel>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                />
                            </Field>

                            <Field>
                                <Button type="submit" className="w-full">
                                    Créer mon compte
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Ou continuer avec
                            </FieldSeparator>

                            <Field className="gap-4">
                                <Button variant="outline" type="button" onClick={signUpWithGitHub}>
                                    <Github />
                                    <span className="sr-only">S'inscrire avec GitHub</span>
                                </Button>
                            </Field>

                            <FieldDescription className="text-center">
                                Vous avez déjà un compte ?{" "}
                                <Link href="/auth/signin" className="underline">
                                    Se connecter
                                </Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                En créant un compte, vous acceptez nos{" "}
                <Link href="/terms-of-service">Conditions d'utilisation</Link> et notre{" "}
                <Link href="/privacy-policy">Politique de confidentialité</Link>.
            </FieldDescription>
        </div>
    )
}