import { getUser } from "@/src/lib/auth-server";
import { SidebarProvider } from "@/src/components/ui/shadcn/sidebar"
import { AppSidebar } from "@/src/components/layout/sidebar/app-sidebar"
import Header from "@/src/components/layout/header";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUser();

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="h-screen p-2 w-full">
                <div className="h-full w-full bg-card rounded-lg border border-border overflow-auto px-8">
                    <Header />
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}