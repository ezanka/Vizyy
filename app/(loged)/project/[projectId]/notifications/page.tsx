import { prisma } from "@/src/lib/prisma"
import { getUser } from "@/src/lib/auth-server"

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
        <div>
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            {notifications.length === 0 ? (
                <p>Vous n'avez aucune notification.</p>
            ) : (
                <ul className="space-y-4">
                    {notifications.map((notification) => (
                        <li key={notification.id} className="p-4 border rounded">
                            <p className="font-semibold">Invitation à rejoindre {notification.organization.name}</p>
                            <p>Vous avez été invité à rejoindre l'organisation {notification.organization.name}.</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}