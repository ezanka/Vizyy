import { AppSidebar } from "@/src/components/layout/sidebar/app-sidebar"
import Header from "@/src/components/layout/header";

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