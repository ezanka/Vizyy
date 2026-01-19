"use client";

import { redirect } from "next/navigation";
import { authClient } from "../lib/auth-client";

export async function changeActiveProject(projectId: string) {
    await authClient.organization.setActive({
        organizationId: projectId,
    });
    
    redirect(`/dashboard`);
}