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
import { MemberRole, UpdateStatus } from "@/src/generated/prisma/enums";
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
        <div className="flex flex-col gap-6 my-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle">
                        Projet
                    </p>
                    <h1 className="text-2xl font-extrabold tracking-tight">Updates</h1>
                    <p className="text-sm text-foreground-muted">
                        {updates.length} {updates.length > 1 ? 'updates' : 'update'}
                    </p>
                </div>
                {isMaker && (
                    <Button asChild className="gap-2 shrink-0">
                        <Link href={`/project/${projectId}/updates/new`}>
                            <Plus size={14} />
                            Nouvelle update
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
                            key={update.id}
                            className="group bg-card border-border hover:border-border-hi hover:shadow-2xl transition-all duration-200 overflow-hidden relative"
                        >
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: "radial-gradient(ellipse at top left, var(--primary-ghost), transparent 60%)" }}
                            />

                            <CardHeader className="pb-3 relative">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                                            <h2 className="text-[15px] font-bold tracking-tight truncate">
                                                {update.title}
                                            </h2>
                                            {update.valid ? (
                                                <Badge className="gap-1 shrink-0 bg-success-bg text-success border border-success-border text-[10px] font-bold">
                                                    <CheckCircle2 size={10} />
                                                    Validé
                                                </Badge>
                                            ) : (
                                                <Badge className="gap-1 shrink-0 bg-warning-bg text-warning border border-warning-border text-[10px] font-bold">
                                                    <Clock size={10} />
                                                    En attente
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                                                <Calendar size={11} />
                                                <span>
                                                    {format(new Date(update.createdAt), "d MMM yyyy", { locale: fr })}
                                                    {" à "}
                                                    {format(new Date(update.createdAt), "HH:mm", { locale: fr })}
                                                </span>
                                            </div>

                                            <span className="text-foreground-subtle/40 text-[10px]">•</span>

                                            <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                                                <User size={11} />
                                                <span>{authorName}</span>
                                            </div>

                                            {update.updatedAt && new Date(update.updatedAt).getTime() !== new Date(update.createdAt).getTime() && (
                                                <>
                                                    <span className="text-foreground-subtle/40 text-[10px]">•</span>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                                                        <CalendarCog size={11} />
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

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="shrink-0 gap-1.5 text-foreground-subtle hover:text-foreground"
                                        asChild
                                    >
                                        <Link href={`/project/${projectId}/updates/${update.id}`}>
                                            <span className="hidden sm:inline text-xs font-semibold">Voir</span>
                                            <ChevronRight size={14} />
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="py-0 pb-3 relative">
                                <div className="bg-card-elevated border border-border rounded-lg px-3.5 py-3">
                                    <p className="text-[13px] text-foreground-muted leading-relaxed whitespace-pre-line line-clamp-3">
                                        {update.content}
                                    </p>
                                    {update.content.length > 150 && (
                                        <Link
                                            href={`/project/${projectId}/updates/${update.id}`}
                                            className="text-[11px] font-semibold text-primary-light hover:text-primary hover:underline underline-offset-4 mt-2 inline-block transition-colors"
                                        >
                                            Lire la suite →
                                        </Link>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="pt-3 pb-3.5 border-t border-border relative">
                                {update.status === UpdateStatus.DRAFT && isMaker ? (
                                    <Badge className="bg-card-elevated text-foreground-muted border border-border-md text-[10px] font-bold">
                                        Brouillon
                                    </Badge>
                                ) : update.valid ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-2 cursor-default">
                                                <Avatar className="size-5 border border-success-border">
                                                    <AvatarFallback className="text-[9px] font-extrabold bg-success-bg text-success">
                                                        {validatorName.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-[11px] text-foreground-subtle">
                                                    Validé par{" "}
                                                    <span className="font-semibold text-foreground">{validatorName}</span>
                                                    {" · "}
                                                    {update.validatedAt
                                                        ? format(new Date(update.validatedAt), "d MMM yyyy 'à' HH:mm", { locale: fr })
                                                        : "date inconnue"
                                                    }
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        {validatorEmail && (
                                            <TooltipContent>
                                                <p>{validatorEmail}</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-[11px] italic text-foreground-subtle">
                                            En attente de validation client
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
                    <Card className="bg-card border-border">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                            <div className="size-12 rounded-xl bg-card-elevated border border-border flex items-center justify-center">
                                <Calendar size={20} className="text-foreground-subtle" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-semibold">Aucune update pour le moment</p>
                                <p className="text-xs text-foreground-muted max-w-56">
                                    {isMaker
                                        ? "Publiez votre première update pour informer vos clients."
                                        : "Vous serez notifié dès qu'une update sera publiée."
                                    }
                                </p>
                            </div>
                            {isMaker && (
                                <Button asChild size="sm" variant="outline" className="gap-2">
                                    <Link href={`/project/${projectId}/updates/new`}>
                                        <Plus size={13} />
                                        Créer la première update
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}