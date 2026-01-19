import { Button } from "@/src/components/ui/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/shadcn/card";
import { Calendar, Eye, User } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";

type Params = {
    projectId: string;
}

export default async function UpdatesPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId } = await params;
    const user = await getUser();

    if (!user) {
        redirect('/auth/signin');
    }

    const updates = await prisma.update.findMany({
        where: {
            organization: {
                id: projectId,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="flex flex-col gap-6 mt-4">
            {updates.map((update) => (
                <Card className="overflow-hidden transition-all hover:shadow-lg" key={update.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold tracking-tight mb-2">{update.title}</h2>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Publié le {update.createdAt.toLocaleDateString()}</span>
                                </div>
                            </div>
                            <Button className="gap-2 shadow-sm">
                                <Eye className="h-4 w-4" />
                                Détails
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="bg-background mx-3 py-2 rounded-md">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {update.content}
                        </p>
                    </CardContent>

                    <CardFooter>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {update.valid ? (
                                <>
                                    <User className="h-4 w-4" />
                                    <span>Validé par</span>
                                    <Link
                                        href="/profile"
                                        className="font-medium text-foreground hover:underline underline-offset-4 transition-colors"
                                    >
                                        {update.validatedById}
                                    </Link>
                                </>
                            ) : (
                                <span className="italic">En attente de validation</span>
                            )}

                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}