import { Button } from "@/src/components/ui/shadcn/button"
import { Card, CardContent, CardHeader } from "@/src/components/ui/shadcn/card"
import { Progress } from "@/src/components/ui/shadcn/progress"
import { prisma } from "@/src/lib/prisma"
import { ArrowRight, ClockAlert, Gauge, MailWarning } from "lucide-react"
import Link from "next/link"

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
            members: true,
            updates: true,
        },
    });

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Welcome to your Dashboard !</h1>
                    <p className="text-sm text-muted-foreground">"Prêt à faire avancer {projectInfo?.name || "None"} ?"</p>
                </div>
                <Button>New Update</Button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
                <Card className="border bg-background rounded-md flex flex-col justify-between">
                    <CardHeader className="flex items-center justify-between">
                        <p className="text-xs ">Updates</p>
                        <MailWarning className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-bold">{projectInfo?.updates.length || 0}</p>
                        <p className="text-xs text-muted-foreground">Dernière update posté le {projectInfo?.updates[0]?.createdAt.toLocaleDateString() || "N/A"}</p>
                    </CardContent>
                </Card>
                <Card className="border bg-background rounded-md flex flex-col justify-between">
                    <CardHeader className="flex items-center justify-between">
                        <p className="text-xs ">Feedbacks en attente</p>
                        <MailWarning className="h-4 w-4 text-muted-foreground" />
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
                        <p className="text-lg font-bold">{projectInfo?.deadline?.toLocaleDateString() || "Aucune deadline"}</p>
                        <p className="text-xs text-muted-foreground">Commencé le {projectInfo?.createdAt.toLocaleDateString() || "N/A"}</p>
                    </CardContent>
                </Card>
                <Card className="border bg-background rounded-md flex flex-col justify-between">
                    <CardHeader className="flex items-center justify-between">
                        <p className="text-xs ">Progression</p>
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-bold">50%</p>
                        <Progress value={50} className="mt-2" />
                    </CardContent>
                </Card>
            </div>
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold mb-2">Clients</h3>
                    <Link href="/clients" className="flex items-center gap-2 hover:underline">Tous <ArrowRight className="w-4 h-4" /></Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Card className="border rounded-md py-2">
                        <CardContent className="px-2 flex items-center gap-4">
                            <div className="h-10 aspect-square rounded-full bg-amber-900 flex items-center justify-center">JD</div>
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">John Doe</p>
                                <p className="text-xs text-muted-foreground">
                                    Ensitech, Cergy
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border rounded-md py-2">
                        <CardContent className="px-2 flex items-center gap-4">
                            <div className="h-10 aspect-square rounded-full bg-amber-900 flex items-center justify-center">JD</div>
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">John Doe</p>
                                <p className="text-xs text-muted-foreground">
                                    Ensitech, Cergy
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold mb-2">Updates</h3>
                    <Link href="/updates" className="flex items-center gap-2 hover:underline">Tous <ArrowRight className="w-4 h-4" /></Link>
                </div>
                <div className="flex items-center gap-4">
                    <Card className="border rounded-md min-w-75">
                        <CardContent className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-sm font-medium">Mise à jour du tableau de bord</p>
                                <p className="text-xs text-muted-foreground">
                                    Le 18/01/2026 par John Doe
                                </p>
                            </div>
                            <Gauge className="h-6 w-6 text-muted-foreground" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
