"use client";

import { Update } from "@/src/generated/prisma/client";
import { Button } from "@/src/components/ui/shadcn/button";
import { redirect } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { createTest } from "@/src/actions/create-test-actions";
import { TestStatus, TestType } from "@/src/generated/prisma/enums"

export default function CreateTestButton({ projectId, type, statut, details, update, authorized }: { projectId: string, type: TestType, statut: TestStatus, details: string, update?: Update, authorized: boolean }) {

    const [isLoading, setIsLoading] = React.useState(false);

    const handleCreateTest = () => {
        setIsLoading(true);
        if (!authorized) {
            alert("Vous n'êtes pas autorisé à créer un test");
            setIsLoading(false);
            return;
        }

        if (!update) {
            alert("Vous devez avoir un update sélectionné pour créer un test");
            setIsLoading(false);
            return;
        }
        const result = createTest(projectId, type, statut, details, update);

        if (!result) {
            alert("Une erreur est survenue lors de la création du test");
            setIsLoading(false);
            return;
        }

        redirect(`/project/${projectId}/test`);
    }

    return (
        <>
            <Button disabled={!authorized || isLoading} type="button" onClick={handleCreateTest}>{isLoading ? <><Spinner /> Création en cours</> : "Créer le test"}</Button>
        </>
    )
}