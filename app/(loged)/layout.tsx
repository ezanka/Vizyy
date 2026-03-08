import { getUser } from "@/src/lib/auth-server";
import { SidebarProvider } from "@/src/components/ui/shadcn/sidebar"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { toast } from "sonner";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUser();

    if (!user) {
        const headersList = await headers();
        const pathname = headersList.get("x-pathname") || "";
        const search = headersList.get("x-search") || "";
        const callbackUrl = pathname + search;
        toast.error("Vous devez être connecté pour accéder à cette page.")

        redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    return (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    )
}