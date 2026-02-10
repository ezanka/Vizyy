"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { removeMaker } from "@/src/actions/remove-maker-actions";

export default function RemoveMakerButton({ userId, projectId, isOwner }: { userId: string, projectId: string, isOwner: boolean }) {

    return (
        <Button type="button" variant={"ghost"} className="w-full text-left" disabled={isOwner} onClick={() => removeMaker(userId, projectId)}>Retirer le créateur</Button>
    )
}