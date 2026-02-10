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

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    IN_PROGRESS: { label: "En cours", variant: "default" },
    PENDING: { label: "En attente", variant: "secondary" },
    DONE: { label: "Terminé", variant: "default" },
    BLOCKED: { label: "Bloqué", variant: "destructive" },
    DRAFT: { label: "Brouillon", variant: "outline" },
};

const typeLabels: Record<string, { label: string; color: string }> = {
    FEATURE: { label: "Fonctionnalité", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    DESIGN: { label: "Design", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    DEPLOY: { label: "Déploiement", color: "bg-green-500/10 text-green-500 border-green-500/20" },
    BUGFIX: { label: "Correction", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    OTHER: { label: "Autre", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
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

    const statusConfig = statusLabels[update.status] || { label: update.status, variant: "outline" as const };
    const typeConfig = typeLabels[update.type] || { label: update.type, color: "bg-gray-500/10 text-gray-500 border-gray-500/20" };

    return (
        <div className="flex flex-col gap-6 my-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/project/${projectId}/updates`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Détails de l&apos;update</h1>
            </div>

            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight">{update.title}</h2>
                                {!isClient && !update.valid ? (
                                    <Button size="sm" asChild variant="link">
                                        <Link href={`/project/${projectId}/updates/${updateId}/edit`}>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : !isClient && update.valid ? (
                                    <Tooltip>
                                        <TooltipTrigger disabled className="text-primary/70">
                                            <PencilOff className="h-4 w-4" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Impossible de modifier après validation</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : isClient && (
                                    <Tooltip>
                                        <TooltipTrigger disabled className="text-primary/70">
                                            <PencilOff className="h-4 w-4" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Non authorisé</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant={statusConfig.variant}>
                                    {statusConfig.label}
                                </Badge>
                                <Badge className={typeConfig.color}>
                                    {typeConfig.label}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Créé le {format(new Date(update.createdAt), "PPP HH:mm", { locale: fr })} par {author?.name}</span>
                        </div>
                        {
                            update.updatedAt && (
                                <div className="flex items-center gap-2">
                                    <CalendarCog className="h-4 w-4" />
                                    <span>Mis à jour le {format(new Date(update.updatedAt), "PPP HH:mm", { locale: fr })} par {updater?.name}</span>
                                </div>
                            )
                        }

                        {update.timeSpent && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{update.timeSpent}h de travail</span>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-foreground leading-relaxed whitespace-pre-line">
                            {update.content}
                        </p>
                    </div>

                    {update.previewLink && (
                        <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Lien de prévisualisation :</span>
                            <a
                                href={update.previewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline underline-offset-4"
                            >
                                {update.previewLink}
                            </a>
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-3">Validation</h3>
                        {update.valid ? (
                            <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                        Validé par {update.validatedBy?.name || "Utilisateur inconnu"}
                                    </p>
                                    {update.validatedAt && (
                                        <p className="text-xs text-muted-foreground">
                                            Le {format(new Date(update.validatedAt), "PPP 'à' HH:mm", { locale: fr })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
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
