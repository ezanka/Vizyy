"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { Check, LinkIcon } from "lucide-react";
import React from "react";

export default function CopyInvitationButton({ link }: { link: string }) {
    const [isCopied, setIsCopied] = React.useState(false);  

    const handleCopyInvitation = async () => {
        await navigator.clipboard.writeText(link);
    };

    return (
        <Button type="button" variant={"ghost"} className="w-full text-left" onClick={() => { handleCopyInvitation(); setIsCopied(true); }}>{isCopied ? <>Lien copié <Check /></> : <>Copier le lien <LinkIcon /></>}</Button>
    )
}