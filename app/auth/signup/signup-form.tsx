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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/shadcn/select"
import { Checkbox } from "@/src/components/ui/shadcn/checkbox"
import { Progress } from "@/src/components/ui/shadcn/progress"
import { authClient } from "@/src/lib/auth-client"
import Link from "next/link"
import { Github, ArrowLeft } from "lucide-react"
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
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
        role: "",
        company: "",
        acceptTerms: false
    })

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas")
            return
        }
        if (formData.password.length < 8) {
            alert("Le mot de passe doit contenir au moins 8 caractères")
            return
        }
        setStep(2)
    }

    const handleStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.acceptTerms) {
            alert("Vous devez accepter les conditions d'utilisation")
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

    const progress = (step / 2) * 100

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 rounded-xl">
                <CardContent>
                    <div className="px-6 pt-6 md:px-8 md:pt-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">
                                Étape {step} sur 2
                            </span>
                            <span className="text-sm font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleStep1Submit} className="p-6 md:p-8">
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
                                        Continuer
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
                    )}

                    {step === 2 && (
                        <form onSubmit={handleStep2Submit} className="p-6 md:p-8">
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">Informations supplémentaires</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Quelques détails pour finaliser votre compte.
                                    </p>
                                </div>

                                <Field>
                                    <FieldLabel htmlFor="role">Type de compte</FieldLabel>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) => handleInputChange("role", value)}
                                        required
                                    >
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Sélectionnez un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="client">
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">Client</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Réserver des rendez-vous
                                                    </span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="maker">
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">Maker</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Gérer un salon/entreprise
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {formData.role === "client" && (
                                    <Field>
                                        <FieldLabel htmlFor="company">Entreprise</FieldLabel>
                                        <Input
                                            id="company"
                                            type="text"
                                            placeholder="Nom de votre entreprise"
                                            value={formData.company}
                                            onChange={(e) => handleInputChange("company", e.target.value)}
                                        />
                                        <FieldDescription>
                                            Optionnel - Si vous réservez pour une entreprise
                                        </FieldDescription>
                                    </Field>
                                )}

                                <Field>
                                    <div className="flex items-start gap-2">
                                        <Checkbox
                                            id="terms"
                                            checked={formData.acceptTerms}
                                            onCheckedChange={(checked) =>
                                                handleInputChange("acceptTerms", checked as boolean)
                                            }
                                            required
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Accepter les conditions
                                            </label>
                                            <p className="text-sm text-muted-foreground">
                                                J'accepte les{" "}
                                                <Link href="/terms-of-service" className="underline">
                                                    Conditions d'utilisation
                                                </Link>{" "}
                                                et la{" "}
                                                <Link href="/privacy-policy" className="underline">
                                                    Politique de confidentialité
                                                </Link>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                </Field>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        className="flex-1"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Précédent
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        Créer mon compte
                                    </Button>
                                </div>
                            </FieldGroup>
                        </form>
                    )}
                </CardContent>
            </Card>

            {step === 1 && (
                <FieldDescription className="px-6 text-center">
                    En créant un compte, vous acceptez nos{" "}
                    <Link href="/terms-of-service">Conditions d'utilisation</Link> et notre{" "}
                    <Link href="/privacy-policy">Politique de confidentialité</Link>.
                </FieldDescription>
            )}
        </div>
    )
}