import { Button } from "@/src/components/ui/shadcn/button"
import { Card, CardContent, CardHeader } from "@/src/components/ui/shadcn/card"
import { Progress } from "@/src/components/ui/shadcn/progress"
import { MemberRole, UpdateType } from "@/src/generated/prisma/enums"
import { prisma } from "@/src/lib/prisma"
import { ArrowRight, BugOff, ClockAlert, Flag, Gauge, HardDriveDownload, ListPlus, MailWarning, MessageCircleWarning, Paintbrush, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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

    return (
        <div className="flex flex-col gap-4 my-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Welcome to your Dashboard !</h1>
                    <p className="text-sm text-muted-foreground">"Prêt à faire avancer {projectInfo?.name || "None"} ?"</p>
                </div>
                <Button asChild><Link href={`/project/${projectId}/updates/new`}><Plus /> Nouvelle update</Link></Button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
                <Card className="border bg-background rounded-md flex flex-col justify-between">
                    <CardHeader className="flex items-center justify-between">
                        <p className="text-xs ">Updates</p>
                        <MailWarning className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-bold">{projectInfo?.updates.length || 0}</p>
                        <p className="text-xs text-muted-foreground">Dernière update posté le {projectInfo?.updates[0] ? format(new Date(projectInfo.updates[0].createdAt), "P", { locale: fr }) : "N/A"}</p>
                    </CardContent>
                </Card>
                <Card className="border bg-background rounded-md flex flex-col justify-between">
                    <CardHeader className="flex items-center justify-between">
                        <p className="text-xs ">Feedbacks en attente</p>
                        <MessageCircleWarning className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-bold">3</p>
                        <p className="text-xs text-muted-foreground">13/16 feedbacks terminées</p>
                    </CardContent>
                </Card>
                <Card className="border bg-background rounded-md flex flex-col justify-between">
                    <CardHeader className="flex items-center justify-between">
                        <p className="text-xs ">Deadline</p>
                        <ClockAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-bold">{projectInfo?.deadline ? format(new Date(projectInfo.deadline), "P", { locale: fr }) : "Aucune deadline"}</p>
                        <p className="text-xs text-muted-foreground">Commencé le {format(new Date(projectInfo?.createdAt || ""), "P", { locale: fr })}</p>
                    </CardContent>
                </Card>
                <Card className="border bg-background rounded-md flex flex-col justify-between">
                    <CardHeader className="flex items-center justify-between">
                        <p className="text-xs ">Progression</p>
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-bold">{projectInfo?.progress || 0}%</p>
                        <Progress value={projectInfo?.progress || 0} className="mt-2" />
                    </CardContent>
                </Card>
            </div>
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold mb-2">Clients</h3>
                    <Link href={`/project/${projectId}/clients`} className="flex items-center gap-2 hover:underline">Tous <ArrowRight className="w-4 h-4" /></Link>
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
                                <Card key={member.id} className="border rounded-md py-2">
                                    <CardContent className="px-2 flex items-center gap-4">
                                        <div className="h-10 aspect-square rounded-full bg-amber-900 flex items-center justify-center">{memberInfo?.name.split(" ").map(n => n[0]).join("")}</div>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">{memberInfo?.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {memberInfo?.company}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold mb-2">Updates</h3>
                    <Link href={`/project/${projectId}/updates`} className="flex items-center gap-2 hover:underline">Tous <ArrowRight className="w-4 h-4" /></Link>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {
                        projectInfo?.updates.slice(0, 3).map((update) => {

                            const author = projectInfo.members.find(m => m.userId === update.authorId);

                            return (
                                <Card className="border rounded-md min-w-75" key={update.id}>
                                    <CardContent className="flex items-center gap-4 h-full">
                                        <div className="flex-1 flex flex-col justify-between h-full">
                                            <p className="text-sm font-medium">{update.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Le {format(new Date(update.createdAt), "d MMM yyyy", { locale: fr })} par {author?.user.name || "Inconnu"}
                                            </p>
                                        </div>
                                        {
                                            update.type === UpdateType.FEATURE ? (
                                                <ListPlus className="h-6 w-6 text-muted-foreground" />
                                            ) : update.type === UpdateType.DESIGN ? (
                                                <Paintbrush className="h-6 w-6 text-muted-foreground" />
                                            ) : update.type === UpdateType.DEPLOY ? (
                                                <HardDriveDownload className="h-6 w-6 text-muted-foreground" />
                                            ) : update.type === UpdateType.BUGFIX ? (
                                                <BugOff className="h-6 w-6 text-muted-foreground" />
                                            ) : update.type === UpdateType.OTHER ? (
                                                <ClockAlert className="h-6 w-6 text-muted-foreground" />
                                            ) : (
                                                <Flag className="h-6 w-6 text-muted-foreground" />
                                            )
                                        }
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
