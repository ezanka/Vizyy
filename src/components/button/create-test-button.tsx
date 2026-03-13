"use client";

import { Update } from "@/src/generated/prisma/client";
import { Button } from "@/src/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { createTest } from "@/src/actions/create-test-actions";
import { TestEnvironment, TestStatus, TestType } from "@/src/generated/prisma/enums"
import { toast } from "sonner";

export default function CreateTestButton({ projectId, name, actions, results, type, environment, statut, update, authorized }: { projectId: string, name: string, actions: string, results: string, type: TestType, environment: TestEnvironment, statut: TestStatus, update?: Update, authorized: boolean }) {

    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const handleCreateTest = () => {
        setIsLoading(true);
        if (!authorized) {
            toast.error("Vous n'êtes pas autorisé à créer un test");
            setIsLoading(false);
            return;
        }

        if (!update) {
            toast.error("Vous devez avoir un update sélectionné pour créer un test");
            setIsLoading(false);
            return;
        }

        if (!name) {
            toast.error("Vous devez avoir un nom de test pour créer un test");
            setIsLoading(false);
            return;
        }

        if (!actions) {
            toast.error("Vous devez avoir des actions pour créer un test");
            setIsLoading(false);
            return;
        }

        if (!results) {
            toast.error("Vous devez avoir des résultats pour créer un test");
            setIsLoading(false);
            return;
        }

        const result = createTest(projectId, name, actions, results, type, statut, environment, update);

        if (!result) {
            toast.error("Une erreur est survenue lors de la création du test");
            setIsLoading(false);
            return;
        }

        router.push(`/project/${projectId}/test`);
    }

    return (
        <>
            <Button disabled={!authorized || isLoading} type="button" onClick={handleCreateTest}>{isLoading ? <><Spinner /> Création en cours</> : "Créer le test"}</Button>
        </>
    )
}