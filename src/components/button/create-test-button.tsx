"use client";

import { Update } from "@/src/generated/prisma/client";
import { Button } from "@/src/components/ui/shadcn/button";
import { redirect } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { createTest } from "@/src/actions/create-test-actions";
import { TestEnvironment, TestStatus, TestType } from "@/src/generated/prisma/enums"

export default function CreateTestButton({ projectId, name, actions, results, type, environment, statut, update, authorized }: { projectId: string, name: string, actions: string, results: string, type: TestType, environment: TestEnvironment, statut: TestStatus, update?: Update, authorized: boolean }) {

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

        if (!name) {
            alert("Vous devez avoir un nom de test pour créer un test");
            setIsLoading(false);
            return;
        }

        if (!actions) {
            alert("Vous devez avoir des actions pour créer un test");
            setIsLoading(false);
            return;
        }

        if (!results) {
            alert("Vous devez avoir des résultats pour créer un test");
            setIsLoading(false);
            return;
        }

        const result = createTest(projectId, name, actions, results, type, statut, environment, update);

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