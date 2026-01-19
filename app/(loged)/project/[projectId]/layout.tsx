import { AppSidebar } from "@/src/components/layout/sidebar/app-sidebar"
import Header from "@/src/components/layout/header";
import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";

type Params = {
    projectId: string;
}

export default async function Layout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<Params>;
}>) {
    const { projectId } = await params;

    const user = await getUser();

    const existingOrInProject = await prisma.organization.findFirst({
        where: {
            AND: [
                { id: projectId },
                {
                    members: {
                        some: {
                            userId: user?.id,
                        },
                    }
                },
            ],
        },
    });

    if (!user || !existingOrInProject) {
        redirect("/projects");
    }

    const projects = await prisma.organization.findMany({
        where: {
            members: {
                some: {
                    userId: user?.id,
                },
            },
        },
    });

    if (projects.length === 0) {
        redirect("/projects");
    }

    return (
        <>
            <AppSidebar projectId={projectId} />
            <div className="h-screen p-2 w-full">
                <div className="h-full w-full bg-card rounded-lg border border-border overflow-auto px-8">
                    <Header />
                    {children}
                </div>
            </div>
        </>
    )
}