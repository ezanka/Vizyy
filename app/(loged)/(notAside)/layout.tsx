"use client"

import { Button } from "@/src/components/ui/shadcn/button";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    return (
        <div className="w-full h-screen p-2">
            <div className="h-full w-full bg-card rounded-lg border border-border overflow-auto px-8 flex flex-col relative">
                <Button variant="outline" className="absolute top-2 left-2 flex items-center gap-2" onClick={() => router.push("/projects")}>
                    <Undo2 /> Retour
                </Button>
                <div className="flex h-[80vh] items-start justify-center p-4">
                    {children}
                </div>
            </div>
        </div>

    )
}