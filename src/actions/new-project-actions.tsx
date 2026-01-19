"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { MemberRole } from "../generated/prisma/enums";

function generateSlug(length: number = 15): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += letters[Math.floor(Math.random() * letters.length)];
    }
    
    return result;
}


export async function createProject(name: string, logo: string) {
    const user = await getUser();

    if (!user) {
        return { error: "Vous devez être connecté pour créer un projet" };
    }

    const newProject = await prisma.organization.create({
        data: {
            id: randomUUID(),
            name: name,
            slug: generateSlug(),
            logo: logo,
            createdAt: new Date(),
        },
    });

    await prisma.member.create({
        data: {
            id: randomUUID(),
            userId: user.id,
            organizationId: newProject.id,
            role: MemberRole.MAKER,
            createdAt: new Date(),
        },
    });

    revalidatePath(`/project/${newProject.id}/dashboard`);

    return { success: true, project: newProject };
}
