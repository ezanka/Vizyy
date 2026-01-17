"use client"

import { authClient } from "@/src/lib/auth-client"


export default function DashboardPage() {

    const { data: activeOrganization } = authClient.useActiveOrganization()

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard !</h1>
            <p>Active Project: {activeOrganization?.name || "None"}</p>
        </div>  
    )
}