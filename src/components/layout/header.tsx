import { ChevronRight, Home } from "lucide-react"
import { SidebarTrigger } from "@/src/components/ui/shadcn/sidebar"

export default function Header() {
    return (
        <div className="flex items-center justify-between px-4 py-2 h-12">
            <div className="flex items-center h-full gap-4">
                <div className="flex items-center justify-center h-full rounded-sm border bg-background aspect-square">
                    <SidebarTrigger className="w-8 h-8" />
                </div>
                <div className="flex items-center justify-between h-full rounded-sm border text-input aspect-square px-2 gap-2">
                    <Home className="w-5 h-5" />
                    <ChevronRight className="w-3 h-3" />                    
                </div>
            </div>
        </div>
    )
}