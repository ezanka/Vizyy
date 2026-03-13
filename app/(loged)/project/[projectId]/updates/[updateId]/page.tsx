import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/src/components/ui/shadcn/card";
import { Badge } from "@/src/components/ui/shadcn/badge";
import { Button } from "@/src/components/ui/shadcn/button";
import { ArrowLeft, Calendar, Clock, ExternalLink, CheckCircle, AlertCircle, Pencil, CalendarCog, PencilOff } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { MemberRole } from "@/src/generated/prisma/enums";
import ValidUpdateButton from "@/src/components/button/valid-update-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/shadcn/tooltip";

type Params = {
    projectId: string;
    updateId: string;
}

const statusLabels: Record<string, { label: string; className: string }> = {
    IN_PROGRESS: { label: "En cours",  className: "bg-primary-ghost text-primary-light border border-primary/30" },
    PENDING:     { label: "En attente",className: "bg-warning-bg text-warning border border-warning-border" },
    DONE:        { label: "Terminé",   className: "bg-success-bg text-success border border-success-border" },
    BLOCKED:     { label: "Bloqué",    className: "bg-destructive-bg text-destructive border border-destructive-border" },
    DRAFT:       { label: "Brouillon", className: "bg-card-elevated text-foreground-muted border border-border-md" },
};

const typeLabels: Record<string, { label: string; className: string }> = {
    FEATURE: { label: "Fonctionnalité", className: "bg-info-bg text-info border border-info-border" },
    DESIGN:  { label: "Design",         className: "bg-primary-ghost text-primary-light border border-primary/30" },
    DEPLOY:  { label: "Déploiement",    className: "bg-success-bg text-success border border-success-border" },
    BUGFIX:  { label: "Correction",     className: "bg-warning-bg text-warning border border-warning-border" },
    OTHER:   { label: "Autre",          className: "bg-card-elevated text-foreground-muted border border-border-md" },
};

export default async function UpdatePage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId, updateId } = await params;
    const user = await getUser();

    if (!user) {
        redirect('/auth/signin');
    }

    const update = await prisma.update.findUnique({
        where: {
            id: updateId,
            organizationId: projectId,
        },
        include: {
            validatedBy: true,
            organization: {
                include: {
                    members: {
                        include: {
                            user: true,
                        },
                    },
                },
            },
        },
    });

    if (!update) {
        notFound();
    }

    const isClient = update.organization.members.some(
        member => member.userId === user.id && member.role === MemberRole.CLIENT
    );

    const author = await prisma.user.findUnique({
        where: { id: update.authorId },
    });

    const updater = await prisma.user.findUnique({
        where: { id: update.updaterId || "" },
    });

    const statusConfig = statusLabels[update.status] ?? { label: update.status, className: "bg-card-elevated text-foreground-muted border border-border-md" };
    const typeConfig   = typeLabels[update.type]     ?? { label: update.type,   className: "bg-card-elevated text-foreground-muted border border-border-md" };

    return (
        <div className="flex flex-col gap-6 my-4">

            <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" aria-label="Retour aux updates" asChild className="size-8 border-border-md hover:border-border-hi shrink-0">
                    <Link href={`/project/${projectId}/updates`}>
                        <ArrowLeft size={15} />
                    </Link>
                </Button>
                <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle">Updates</p>
                    <h1 className="text-2xl font-extrabold tracking-tight">Détails de l&apos;update</h1>
                </div>
            </div>

            <Card className="w-full max-w-4xl mx-auto bg-card border-border overflow-hidden">

                <CardHeader className="pb-4 space-y-4">

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">

                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-[22px] font-extrabold tracking-tight leading-tight">
                                    {update.title}
                                </h2>
                                {!isClient && !update.valid ? (
                                    <Button size="icon" aria-label="Modifier l'update" variant="ghost" asChild
                                        className="size-8 text-foreground-subtle hover:text-foreground shrink-0">
                                        <Link href={`/project/${projectId}/updates/${updateId}/edit`}>
                                            <Pencil size={14} />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Tooltip>
                                        <TooltipTrigger disabled className="size-8 grid place-items-center text-foreground-subtle/50 shrink-0">
                                            <PencilOff size={14} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isClient ? "Non autorisé" : "Impossible de modifier après validation"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`text-[10px] font-bold ${statusConfig.className}`}>
                                    {statusConfig.label}
                                </Badge>
                                <Badge className={`text-[10px] font-bold ${typeConfig.className}`}>
                                    {typeConfig.label}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                            <Calendar size={12} />
                            <span>
                                Créé le {format(new Date(update.createdAt), "PPP HH:mm", { locale: fr })} par{" "}
                                <span className="text-foreground font-medium">{author?.name}</span>
                            </span>
                        </div>

                        {update.updatedAt && (
                            <>
                                <span className="text-foreground-subtle/30 text-[10px]">•</span>
                                <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                                    <CalendarCog size={12} />
                                    <span>
                                        Mis à jour le {format(new Date(update.updatedAt), "PPP HH:mm", { locale: fr })} par{" "}
                                        <span className="text-foreground font-medium">{updater?.name}</span>
                                    </span>
                                </div>
                            </>
                        )}

                        {update.timeSpent && (
                            <>
                                <span className="text-foreground-subtle/30 text-[10px]">•</span>
                                <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                                    <Clock size={12} />
                                    <span>{update.timeSpent}h de travail</span>
                                </div>
                            </>
                        )}
                    </div>

                </CardHeader>

                <CardContent className="space-y-5">

                    <div className="bg-card-elevated border border-border rounded-lg px-4 py-3.5">
                        <p className="text-[13.5px] text-foreground-muted leading-relaxed whitespace-pre-line">
                            {update.content}
                        </p>
                    </div>

                    {update.previewLink && (
                        <div className="flex items-center gap-2 px-1">
                            <ExternalLink size={13} className="text-foreground-subtle shrink-0" />
                            <span className="text-[11.5px] text-foreground-subtle">Lien de prévisualisation :</span>
                            <a
                                href={update.previewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11.5px] font-semibold text-primary-light hover:text-primary hover:underline underline-offset-4 transition-colors truncate"
                            >
                                {update.previewLink}
                            </a>
                        </div>
                    )}

                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle">
                            Validation
                        </p>

                        {update.valid ? (
                            <div className="flex items-center gap-3 px-4 py-3 bg-success-bg rounded-lg border border-success-border">
                                <CheckCircle size={16} className="text-success shrink-0" />
                                <div className="flex-1">
                                    <p className="text-[13px] font-semibold text-success">
                                        Validé par{" "}
                                        <span className="font-bold">{update.validatedBy?.name ?? "Utilisateur inconnu"}</span>
                                    </p>
                                    {update.validatedAt && (
                                        <p className="text-[11px] text-success/70 mt-0.5">
                                            Le {format(new Date(update.validatedAt), "PPP 'à' HH:mm", { locale: fr })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-warning-bg rounded-lg border border-warning-border">
                                <div className="flex items-center gap-3">
                                    <AlertCircle size={16} className="text-warning shrink-0" />
                                    <p className="text-[13px] font-semibold text-warning">
                                        En attente de validation
                                    </p>
                                </div>
                                <ValidUpdateButton
                                    condition={isClient}
                                    updateId={update.id}
                                    projectId={projectId}
                                />
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}