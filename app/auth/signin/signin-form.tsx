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

const signInWithGitHub = async () => {
    await authClient.signIn.social({
        provider: "github"
    })
}

export function SignInForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 rounded-xl">
                <CardContent>
                    <form className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Se connecter</h1>
                                <p className="text-muted-foreground text-balance">
                                    Connectez-vous à votre compte pour continuer.
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <Input id="password" type="password" required />
                            </Field>
                            <Field>
                                <Button type="submit">Se connecter</Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Ou continuer avec
                            </FieldSeparator>
                            <Field className="gap-4">
                                <Button variant="outline" type="button" onClick={signInWithGitHub}>
                                    <Github />
                                    <span className="sr-only">Se connecter avec GitHub</span>
                                </Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Vous n'avez pas de compte ? <Link href="/auth/signup">S'inscrire</Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                En cliquant sur continuer, vous acceptez nos <Link href="/terms-of-service">Conditions d'utilisation</Link>{" "}
                et notre <Link href="/privacy-policy">Politique de confidentialité</Link>.
            </FieldDescription>
        </div>
    )
}
