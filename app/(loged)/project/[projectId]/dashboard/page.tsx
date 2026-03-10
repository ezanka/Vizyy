import { Button } from "@/src/components/ui/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/src/components/ui/shadcn/card"
import { Progress } from "@/src/components/ui/shadcn/progress"
import { MemberRole, UpdateStatus, UpdateType } from "@/src/generated/prisma/enums"
import { prisma } from "@/src/lib/prisma"
import { ArrowRight, BugOff, Calendar, CalendarDays, ClockAlert, Flag, Gauge, HardDriveDownload, ListPlus, MailWarning, MessageCircleWarning, MessageSquare, Paintbrush, Plus } from "lucide-react"
import Link from "next/link"
import { differenceInDays, format } from "date-fns"
import { fr } from "date-fns/locale"
import { isMaker } from "@/src/actions/is-maker-actions"
import { GradientText } from "@/src/components/ui/gradient-text"
import { Badge } from "@/src/components/ui/shadcn/badge"

type Params = {
    projectId: string;
}

export default async function DashboardPage({
    params,
}: {
    params: Promise<Params>;
}) {

    const { projectId } = await params;

    const projectInfo = await prisma.organization.findUnique({
        where: {
            id: projectId,
        },
        include: {
            members: { include: { user: true } },
            updates: true,
        },
    });

    const authorized = (await isMaker(projectId)).isMaker;

    return (
        <div className="flex flex-col gap-4 my-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Welcome to your Dashboard !</h1>
                    <p className="text-sm text-muted-foreground mt-1">"Prêt à faire avancer {projectInfo?.name || "None"} ?"</p>
                </div>
                {authorized && <Button asChild><Link href={`/project/${projectId}/updates/new`}><Plus /> Nouvelle update</Link></Button>}
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
                <Card className="border-border bg-card group hover:border-border-hi hover:shadow-2xl transition-all overflow-hidden relative">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: "radial-gradient(ellipse at top left, var(--primary-ghost), transparent 60%)" }} />
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <CardDescription className="text-[10.5px] font-bold tracking-windest uppercase">Updates publiées</CardDescription>
                            <div className="size-9 rounded-[6px] grid place-items-center border border-border-md bg-popover text-foreground-muted">
                                <MessageSquare size={16} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <GradientText className="text-[2rem] font-black tracking-[-0.05em] leading-none">{projectInfo?.updates.filter((f) => f.status !== UpdateStatus.DRAFT).length || 0}</GradientText>
                        <p className="text-[11.5px] text-foreground-subtle mt-2 flex items-center gap-2">
                            Dernière le {projectInfo?.updates[0]?.createdAt ? format(new Date(projectInfo?.updates[0]?.createdAt || ""), "Pp", { locale: fr }) : "Jamais"}
                            <Badge className="bg-success-bg text-success border-success-border text-[9.5px]">↑ +3</Badge>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card group hover:border-border-hi hover:shadow-2xl transition-all flex justify-between">
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <CardDescription className="text-[10.5px] font-bold tracking-windest uppercase">Tests</CardDescription>
                            <Badge className="bg-success-bg text-success border-success-border text-[10px]">6 / 8</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[2rem] font-black tracking-[-0.05em] leading-none">
                            75<span className="text-[1.1rem] font-medium text-foreground-subtle">%</span>
                        </p>
                        <p className="text-[11.5px] text-foreground-subtle mt-2">6 réussis · 2 en attente</p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card group hover:border-border-hi hover:shadow-2xl transition-all overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <CardDescription className="text-[10.5px] font-bold tracking-windest uppercase">Deadline</CardDescription>
                            <div className="size-9 rounded-[6px] grid place-items-center border border-border-md bg-popover text-foreground-muted">
                                <CalendarDays size={16} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[1.8rem] font-black tracking-[-0.03em] leading-none">{projectInfo?.deadline ? format(new Date(projectInfo?.deadline || ""), "d MMM") : "Pas de date limite"}</p>
                        <p className="text-[11.5px] text-foreground-subtle mt-2 flex items-center gap-2">

                            {differenceInDays(new Date(projectInfo?.deadline || ""), new Date()) > 7 ? (
                                <>
                                    {differenceInDays(new Date(projectInfo?.deadline || ""), new Date())} jours restants
                                    <Badge className="bg-success-bg text-success border-success-border text-[9.5px]">✓ En avance</Badge>
                                </>
                            ) : differenceInDays(new Date(projectInfo?.deadline || ""), new Date()) > 0 ? (
                                <>
                                    {differenceInDays(new Date(projectInfo?.deadline || ""), new Date())} jours restants
                                    <Badge className="bg-warning-bg text-warning border-warning-border text-[9.5px]">✓ Presque atteint</Badge>
                                </>
                            ) : (
                                <>
                                    En retard de {differenceInDays(new Date(projectInfo?.deadline || ""), new Date())} jours
                                    <Badge className="bg-destructive-bg text-destructive border-destructive-border text-[9.5px]">✓ En retard</Badge>
                                </>

                            )}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card group hover:border-border-hi hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <CardDescription className="text-[10.5px] font-bold tracking-windest uppercase">Progression</CardDescription>
                            <Badge variant="outline" className="text-[10px]">{projectInfo?.progress || 0}%</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[2rem] font-black tracking-[-0.05em] leading-none mb-3">
                            {projectInfo?.progress || 0}<span className="text-[1.1rem] font-medium text-foreground-subtle">%</span>
                        </p>
                        <Progress value={projectInfo?.progress || 0} className="h-1.5" />
                        <p className="text-[11.5px] text-foreground-subtle mt-2">Avancement global estimé</p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold tracking-tight">Clients</h3>
                    <Link
                        href={`/project/${projectId}/clients`}
                        className="flex items-center gap-1.5 text-[11px] text-foreground-subtle hover:text-primary-light transition-colors"
                    >
                        Tous <ArrowRight size={11} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {
                        projectInfo?.members.map(async (member) => {
                            if (member.role !== MemberRole.CLIENT) return null;

                            const memberInfo = await prisma.user.findUnique({
                                where: {
                                    id: member.userId,
                                },
                            });

                            return (
                                <Card key={member.id} className="flex items-center gap-3.5 px-4.5 py-3.25 rounded-xl border cursor-default hover:brightness-110 transition-all">
                                    <CardContent className="px-2 flex items-center gap-4 justify-between w-full">
                                        <div className="flex-1 flex items-center gap-3.5 px-2 py-1">
                                            <div className="size-8 rounded-lg grid place-items-center text-[13px] shrink-0 text-foreground bg-popover">{memberInfo?.name.split(" ").map(n => n[0]).join("")}</div>
                                            <div className="flex-1">
                                                <span className="text-[12.5px] font-bold block text-foreground">{memberInfo?.name}</span>
                                                <span className="text-[11px] text-foreground-subtle">{memberInfo?.company ? memberInfo.company : "Entreprise inconnue"}</span>
                                            </div>
                                        </div>
                                        <Button variant="secondary" size={"sm"}>
                                            <Link href={`mailto:${memberInfo?.email}`}>Contacter</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold tracking-tight">Updates</h3>
                    <Link
                        href={`/project/${projectId}/updates`}
                        className="flex items-center gap-1.5 text-[11px] text-foreground-subtle hover:text-primary-light transition-colors"
                    >
                        Tous <ArrowRight size={11} />
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {projectInfo?.updates.slice(0, 4).map((update) => {
                        const author = projectInfo.members.find(m => m.userId === update.authorId);

                        if (update.status === UpdateStatus.DRAFT) return null;

                        const typeIcon = update.type === UpdateType.FEATURE ? <ListPlus size={15} />
                            : update.type === UpdateType.DESIGN ? <Paintbrush size={15} />
                                : update.type === UpdateType.DEPLOY ? <HardDriveDownload size={15} />
                                    : update.type === UpdateType.BUGFIX ? <BugOff size={15} />
                                        : <ClockAlert size={15} />;

                        const typeStyle = update.type === UpdateType.FEATURE ? "bg-info-bg text-info border-info-border"
                            : update.type === UpdateType.DESIGN ? "bg-primary-ghost text-primary-light border-primary/30"
                                : update.type === UpdateType.DEPLOY ? "bg-success-bg text-success border-success-border"
                                    : update.type === UpdateType.BUGFIX ? "bg-warning-bg text-warning border-warning-border"
                                        : "bg-card-elevated text-foreground-muted border-border-md";

                        return (
                            <Link key={update.id} href={`/project/${projectId}/updates/${update.id}`} className="col-span-1">
                                <Card
                                    key={update.id}
                                    className="bg-card border-border group hover:border-border-hi hover:shadow-2xl transition-all overflow-hidden relative py-0"
                                >
                                    <div
                                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ background: "radial-gradient(ellipse at top left, var(--primary-ghost), transparent 60%)" }}
                                    />
                                    <CardContent className="flex flex-col gap-3 p-4">
                                        <div className={`self-start flex items-center justify-center size-8 rounded-lg border ${typeStyle}`}>
                                            {typeIcon}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[13px] font-semibold tracking-tight leading-snug">{update.title}</p>
                                            <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                                                <Calendar size={11} />
                                                <span>{format(new Date(update.createdAt), "d MMM yyyy", { locale: fr })}</span>
                                                <span className="text-foreground-subtle/40">•</span>
                                                <span>{author?.user.name || "Inconnu"}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                        );
                    })}
                </div>
            </div>
        </div>
    )
}
