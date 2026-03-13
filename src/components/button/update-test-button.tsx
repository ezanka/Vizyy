"use client";

import { Update } from "@/src/generated/prisma/client";
import { Button } from "@/src/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/shadcn/spinner";
import React from "react";
import { updateTest } from "@/src/actions/update-test-actions";
import { TestEnvironment, TestStatus, TestType } from "@/src/generated/prisma/enums"
import { toast } from "sonner";

export default function UpdateTestButton({ projectId, name, type, statut, actions, results, environment, update, authorized, test }: { projectId: string, name: string, type: TestType, statut: TestStatus, actions: string, results: string, environment: TestEnvironment, update?: Update, authorized: boolean, test: { id: string } }) {

    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const handleUpdateTest = () => {
        setIsLoading(true);
        if (!authorized) {
            toast.error("Vous n'êtes pas autorisé à mettre à jour un test");
            setIsLoading(false);
            return;
        }

        if (!update) {
            toast.error("Vous devez avoir un update sélectionné pour mettre à jour un test");
            setIsLoading(false);
            return;
        }
        const result = updateTest(projectId, test.id, name, type, statut, actions, results, environment, update);

        if (!result) {
            toast.error("Une erreur est survenue lors de la mise à jour du test");
            setIsLoading(false);
            return;
        }

        router.push(`/project/${projectId}/test`);
    }

    return (
        <>
            <Button disabled={!authorized || isLoading} type="button" onClick={handleUpdateTest}>{isLoading ? <><Spinner /> Mise à jour en cours</> : "Mettre à jour le test"}</Button>
        </>
    )
}