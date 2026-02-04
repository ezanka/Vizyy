"use client";

import { UpdateValidUpdate } from "@/src/actions/update-valid-update-actions";
import { Button } from "@/src/components/ui/shadcn/button";

export default function ValidUpdateButton({ condition, updateId, projectId }: { condition: boolean, updateId: string, projectId: string }) {

    const handleUpdateValid = () => {
        UpdateValidUpdate(updateId, projectId);
    }

    return (
        <>
            {condition && <Button type="button" onClick={handleUpdateValid}>Valider l'update</Button>}
        </>
    )
}