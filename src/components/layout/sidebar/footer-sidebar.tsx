import {
    SidebarFooter,
} from "@/src/components/ui/shadcn/sidebar"
import {
    Settings,
    LogOut,
    ChevronsUpDown,
    Sparkles,
    User,
    CreditCard,
    Bell,
} from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/shadcn/dropdown-menu"
import { headers } from "next/headers"
import { auth } from "@/src/lib/auth"
import { redirect } from "next/navigation"

export default function FooterSidebar({ userName, userEmail, userInitial, projectId }: { userName: string, userEmail: string, userInitial: string, projectId: string }) {
    async function handleSignout() {
        'use server'

        await auth.api.signOut({
            headers: await headers()
        })

        redirect("/auth/signin")
    }

    return (
        <SidebarFooter className="p-4 mt-auto">
            <Link href={"/settings"} className="py-1 cursor-pointer hover:bg-border/50 rounded-sm flex items-center justify-center bg-border/30 border">
                <Settings className="inline-block h-4 w-4 mr-2" />
                <div className="font-medium">Paramètres</div>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="p-2 cursor-pointer hover:bg-border/50 rounded-sm flex items-center justify-between bg-border/30 border">
                        <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-linear-to-br from-purple-500 to-pink-500 text-white font-semibold">
                                {userInitial}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-medium truncate">{userName}</p>
                                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                            </div>
                        </div>
                        <ChevronsUpDown className="w-4 h-4 ml-2" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="mt-2">
                    <DropdownMenuLabel>
                        <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-linear-to-br from-purple-500 to-pink-500 text-white font-semibold">
                                {userInitial}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-medium truncate">{userName}</p>
                                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                            <Sparkles className="inline-block h-4 w-4" />
                        </div>
                        Passer au forfait supérieur
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                            <User className="inline-block h-4 w-4" />
                        </div>
                        Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                            <CreditCard className="inline-block h-4 w-4" />
                        </div>
                        Facturation
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/notifications`} className="w-full h-full flex items-center">
                            <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                <Bell className="inline-block h-4 w-4" />
                            </div>
                            Notifications
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <button
                            className="rounded-lg hover:bg-border/50 transition-colors flex items-center w-full"
                            onClick={handleSignout}
                        >
                            <div className="border flex items-center justify-center rounded-sm w-6 h-6 mr-2">
                                <LogOut className="h-4 w-4" />
                            </div>
                            Se déconnecter
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
    )
}