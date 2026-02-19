import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/shadcn/button";

export default async function Home() {

    const user = await getUser();

    if (user) {
        redirect("/projects");
    }

    return (
        <div>
            <Button variant="outline" className="mb-4 flex gap-6">
                <Link href="/auth/signup" className="hover:underline">
                    S'inscrire
                </Link>
            </Button>

            <Button variant="outline" className="mb-4">
                <Link href="/auth/signin" className="hover:underline">
                    Se connecter
                </Link>
            </Button>
        </div>
    );
}
