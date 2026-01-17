
import { Button } from "@/src/components/ui/shadcn/button"
import { auth } from "@/src/lib/auth"
import { getUser } from "@/src/lib/auth-server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

async function handleSignout() {
    'use server'

    await auth.api.signOut({
        headers: await headers()
    })

    redirect("/auth/signin")
}

export default async function DashboardPage() {
    const user = await getUser()

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            {user && (
                <div className="mt-6 p-4 border rounded-lg">
                    <h2 className="text-2xl font-semibold mb-2">User Info</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            )}

            <Button onClick={handleSignout}>
                Logout
            </Button>
        </div>  
    )
}