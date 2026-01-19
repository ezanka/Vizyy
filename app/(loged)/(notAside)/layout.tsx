import { Button } from "@/src/components/ui/shadcn/button";
import { Undo2 } from "lucide-react";
import Link from "next/link";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Button variant="outline" className="absolute top-2 left-2">
                <Link href="/dashboard" className="flex items-center gap-2"><Undo2 /> Retour au dashboard</Link>
            </Button>
            {children}
        </div>
    )
}