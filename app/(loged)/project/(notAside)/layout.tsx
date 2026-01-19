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
        <div className="w-full h-full flex items-center justify-center">
            <Button variant="outline" className="absolute top-2 left-2 flex items-center gap-2" onClick={() => router.back()}>
                <Undo2 /> Retour
            </Button>
            {children}
        </div>
    )
}