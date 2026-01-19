"use client";

import { Button } from "@/src/components/ui/shadcn/button";
import { removeClient } from "@/src/actions/remove-client-actions";

export default function RemoveClientButton({ clientId, projectId }: { clientId: string, projectId: string }) {

    return (
        <Button onClick={() => removeClient(clientId, projectId)}>Remove</Button>
    )
}