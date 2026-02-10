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
                <p>Vous devez être connecté pour voir les notifications.</p>
            </div>
        );
    }

    const notifications = await prisma.invitation.findMany({
        where: {
            email: user.email,
        },
        include: {
            organization: true,
        },
    });

    return (
        <div className="flex flex-col gap-4 my-4 justify-between flex-1 max-w-4xl mx-auto">
            {notifications.length === 0 ? (
                <p>Vous n'avez aucune notification.</p>
            ) : (
                <ul className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Invitation à rejoindre {notification.organization.name}</p>
                                <p>Vous avez été invité à rejoindre l'organisation {notification.organization.name}.</p>
                            </div>
                            {
                                notification.expiresAt && notification.expiresAt < new Date() ? (
                                    <Button className="bg-red-950 border border-red-800 text-red-800" disabled>
                                        Cette invitation a expiré
                                    </Button>
                                ) : (
                                    notification.status === InvitationStatus.PENDING ? (
                                        <AcceptInvitationButton invitationId={notification.id} projectId={notification.organizationId} />
                                    ) : notification.status === InvitationStatus.ACCEPTED && (
                                        <Button disabled className="bg-green-950 border border-green-800 text-green-800">
                                            Invitation déjà acceptée
                                        </Button>
                                    )

                                )
                            }

                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
}