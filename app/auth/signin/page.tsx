import { SignInForm } from "./signin-form"
import { getUser } from "@/src/lib/auth-server"
import { redirect } from "next/navigation"

export default async function SignInPage() {
    const user = await getUser()

    if (user) {
        redirect("/projects")
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-lg">
                <SignInForm />
            </div>
        </div>
    )
}
