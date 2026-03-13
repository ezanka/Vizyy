import { prisma } from "@/src/lib/prisma"
import { getUser } from "@/src/lib/auth-server"
import { Button } from "@/src/components/ui/shadcn/button";
import { InvitationStatus } from "@/src/generated/prisma/enums";
import AcceptInvitationButton from "@/src/components/button/accept-invitation-button";

export default async function Notifications() {
    const user = await getUser();

    if (!user) {
        return (
            <div className="flex flex-col gap-4 my-4 justify-between flex-1">
                <p className="text-muted-foreground">Vous devez être connecté pour voir les notifications.</p>
            </div>
        );
    }

    const notifications = await prisma.invitation.findMany({
        where: { email: user.email },
        include: { organization: true },
    });

    return (
        <div className="flex flex-col gap-4 my-4 flex-1 max-w-4xl mx-auto">
            {notifications.length === 0 ? (
                <p className="text-muted-foreground">Vous n'avez aucune notification.</p>
            ) : (
                <ul className="space-y-4">
                    {notifications.map((notification) => {
                        const isExpired = notification.expiresAt && notification.expiresAt < new Date();

                        return (
                            <li key={notification.id} className="p-4 border border-border rounded-lg flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold">
                                        Invitation à rejoindre {notification.organization.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Envoyée à {user.email}
                                    </p>
                                </div>
                                {isExpired ? (
                                    <Button
                                        disabled
                                        className="bg-destructive-bg border border-destructive-border text-destructive hover:bg-destructive-bg"
                                    >
                                        Invitation expirée
                                    </Button>
                                ) : notification.status === InvitationStatus.ACCEPTED ? (
                                    <Button
                                        disabled
                                        className="bg-success-bg border border-success-border text-success hover:bg-success-bg"
                                    >
                                        Déjà acceptée
                                    </Button>
                                ) : (
                                    <AcceptInvitationButton
                                        invitationId={notification.id}
                                        projectId={notification.organizationId}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}