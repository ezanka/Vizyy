import { getUser } from "@/src/lib/auth-server";
import { SidebarProvider } from "@/src/components/ui/shadcn/sidebar"
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUser();

    if (!user) {
        redirect("/auth/signin");
    }

    return (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    )
}