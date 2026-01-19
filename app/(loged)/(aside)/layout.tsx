import { AppSidebar } from "@/src/components/layout/sidebar/app-sidebar"
import Header from "@/src/components/layout/header";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <AppSidebar />
            <div className="h-screen p-2 w-full">
                <div className="h-full w-full bg-card rounded-lg border border-border overflow-auto px-8">
                    <Header />
                    {children}
                </div>
            </div>
        </>
    )
}