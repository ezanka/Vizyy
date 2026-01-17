
import { getUser } from "@/src/lib/auth-server"


export default async function DashboardPage() {
    const user = await getUser()

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard, {user?.name}!</h1>
        </div>  
    )
}