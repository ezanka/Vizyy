"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { removeClient } from "@/src/actions/remove-client-actions";

export default function RemoveClientButton({ email, projectId }: { email: string, projectId: string }) {

    return (
        <Button type="button" variant={"ghost"} className="w-full text-left" onClick={() => removeClient(email, projectId)}>Retirer le client</Button>
    )
}