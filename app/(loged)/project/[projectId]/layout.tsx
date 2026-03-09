import { AppSidebar } from "@/src/components/layout/sidebar/app-sidebar"
import Header from "@/src/components/layout/header";
import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";
import { connection } from "next/server";

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
    await connection();
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
                <div className="h-full w-full bg-background rounded-lg border border-border overflow-auto px-8 flex flex-col">
                    <Header />
                    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
                        <div className="absolute -top-48 -right-32 w-150 h-150 rounded-full opacity-[0.08] blur-[80px] bg-primary" />
                        <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full opacity-[0.05] blur-[80px] bg-cyan" />
                    </div>
                    <div className="z-10">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}