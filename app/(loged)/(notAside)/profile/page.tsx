import { getUser } from "@/src/lib/auth-server";
import { prisma } from "@/src/lib/prisma";
import { Mail, Building2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import EditProfileForm from "@/src/components/form/edit-profile-form";
import { Separator } from "@/src/components/ui/shadcn/separator";

export default async function ProfilePage() {
    const user = await getUser();

    if (!user) {
        return (
            <div className="flex flex-col gap-4 my-4 justify-between flex-1">
                <p>Vous devez être connecté pour voir votre profil.</p>
            </div>
        );
    }

    const memberCount = await prisma.member.count({
        where: { userId: user.id },
    });

    return (
        <div className="flex flex-col gap-6 my-8 w-full max-w-lg">
            <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-white text-3xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
            </div>

            <Separator />

            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                    {user.emailVerified && (
                        <span className="text-xs bg-green-950 border border-green-800 text-green-500 px-2 py-0.5 rounded-full">
                            Vérifié
                        </span>
                    )}
                </div>
                {user.company && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{user.company}</span>
                    </div>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membre depuis le {format(user.createdAt, "dd MMMM yyyy", { locale: fr })}</span>
                </div>
            </div>

            <div className="flex gap-4 text-sm">
                <div className="flex-1 rounded-md border border-border p-3 text-center">
                    <p className="text-2xl font-bold">{memberCount}</p>
                    <p className="text-muted-foreground">Projet{memberCount > 1 ? "s" : ""}</p>
                </div>
            </div>

            <Separator />

            <div>
                <h2 className="text-lg font-semibold mb-4">Modifier le profil</h2>
                <EditProfileForm
                    initialName={user.name}
                    initialCompany={user.company}
                />
            </div>
        </div>
    );
}
