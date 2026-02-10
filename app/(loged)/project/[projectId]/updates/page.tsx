import { Button } from "@/src/components/ui/shadcn/button";
import { Badge } from "@/src/components/ui/shadcn/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/shadcn/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/shadcn/avatar";
import {
    Calendar,
    CalendarCog,
    User,
    Plus,
    CheckCircle2,
    Clock,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";
import ValidUpdateButton from "@/src/components/button/valid-update-button";
import { MemberRole, UpdateStatus, UpdateType } from "@/src/generated/prisma/enums";
import { format } from "date-fns"
import { fr } from "date-fns/locale/fr";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/src/components/ui/shadcn/tooltip"

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

    const project = await prisma.organization.findUnique({
        where: { id: projectId },
        include: {
            members: true,
        },
    })

    if (!project) {
        return <div>Projet non trouvé</div>
    }

    const isMaker = project.members.some(member => member.userId === user.id && member.role === MemberRole.MAKER);
    const isClient = project.members.some(member => member.userId === user.id && member.role === MemberRole.CLIENT);

    const updates = await prisma.update.findMany({
        where: {
            organization: {
                id: projectId,
            },
            ...(isMaker ? {} : {
                NOT: {
                    status: UpdateStatus.DRAFT,
                },
            }),
        },
        include: {
            organization: {
                include: {
                    members: {
                        include: {
                            user: true,
                        },
                    }
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });


    const getUserName = (userId: string | null, members: typeof updates[0]['organization']['members']) => {
        if (!userId) return "Utilisateur inconnu";
        const member = members?.find(m => m.userId === userId);
        return member?.user?.name || "Utilisateur inconnu";
    };

    return (
        <div className="flex flex-col gap-4 my-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Updates du projet</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {updates.length} {updates.length > 1 ? 'updates' : 'update'}
                    </p>
                </div>
                {isMaker && (
                    <Button asChild>
                        <Link href={`/project/${projectId}/updates/new`}>
                            <Plus className="h-4 w-4" /> Nouvelle update
                        </Link>
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {updates.map((update) => {
                    const authorName = getUserName(update.authorId, update.organization.members);
                    const updaterName = getUserName(update.updaterId, update.organization.members);
                    const validatorName = getUserName(update.validatedById, update.organization.members);
                    const validatorEmail = update.organization.members?.find(m => m.userId === update.validatedById)?.user?.email;

                    return (
                        <Card
                            className="overflow-hidden hover:shadow-md transition-shadow"
                            key={update.id}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-xl font-semibold tracking-tight truncate">
                                                {update.title}
                                            </h2>
                                            {update.valid ? (
                                                <Badge variant="default" className="gap-1 shrink-0 bg-green-600 hover:bg-green-700">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Validé
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="gap-1 shrink-0 bg-amber-600 hover:bg-amber-700">
                                                    <Clock className="h-3 w-3" />
                                                    En attente
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    {format(new Date(update.createdAt), "d MMM yyyy", { locale: fr })}
                                                    {" à "}
                                                    {format(new Date(update.createdAt), "HH:mm", { locale: fr })}
                                                </span>
                                            </div>

                                            <span className="text-muted-foreground/40">•</span>

                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5" />
                                                <span>{authorName}</span>
                                            </div>

                                            {update.updatedAt && new Date(update.updatedAt).getTime() !== new Date(update.createdAt).getTime() && (
                                                <>
                                                    <span className="text-muted-foreground/40">•</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarCog className="h-3.5 w-3.5" />
                                                        <span>
                                                            Modifié le {format(new Date(update.updatedAt), "d MMM", { locale: fr })}
                                                            {update.updaterId && updaterName !== authorName && ` par ${updaterName}`}
                                                            {" à "}
                                                            {format(new Date(update.updatedAt), "HH:mm", { locale: fr })}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <Button size="sm" variant="ghost" className="shrink-0" asChild>
                                        <Link href={`/project/${projectId}/updates/${update.id}`}>
                                            <span className="hidden sm:inline">Voir détails</span>
                                            <ChevronRight className="h-4 w-4 sm:ml-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="py-2">
                                <div className="bg-muted/30 px-3 py-2.5 rounded-md">
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-3">
                                        {update.content}
                                    </p>
                                    {update.content.length > 150 && (
                                        <Link
                                            href={`/project/${projectId}/updates/${update.id}`}
                                            className="text-xs text-primary hover:underline mt-1.5 inline-block"
                                        >
                                            Lire la suite →
                                        </Link>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="pt-2 pb-3">
                                {update.status === UpdateStatus.DRAFT && isMaker ? (
                                    <Badge variant="outline" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                        Brouillon
                                    </Badge>
                                ) : update.valid ? (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-5 w-5 border">
                                                        <AvatarFallback className="text-[10px]">
                                                            {validatorName.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>
                                                        Validé par <span className="font-medium text-foreground">{validatorName}</span>
                                                        {" à "}
                                                        {update.validatedAt ? format(new Date(update.validatedAt), "d MMM yyyy 'à' HH:mm", { locale: fr }) : "date inconnue"}
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            {validatorEmail && (
                                                <TooltipContent>
                                                    <p>{validatorEmail}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                        {update.validatedAt && (
                                            <>
                                                <span className="text-muted-foreground/40">•</span>
                                                <span>{format(new Date(update.validatedAt), "d MMM yyyy", { locale: fr })}</span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-xs italic text-muted-foreground">
                                            En attente de validation
                                        </span>
                                        {isClient && (
                                            <ValidUpdateButton
                                                condition={true}
                                                updateId={update.id}
                                                projectId={projectId}
                                            />
                                        )}
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}

                {updates.length === 0 && (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground">Aucune update pour le moment</p>
                        {isMaker && (
                            <Button asChild className="mt-4">
                                <Link href={`/project/${projectId}/updates/new`}>
                                    <Plus className="h-4 w-4" /> Créer la première update
                                </Link>
                            </Button>
                        )}
                    </Card>
                )}
            </div>
        </div>
    )
}