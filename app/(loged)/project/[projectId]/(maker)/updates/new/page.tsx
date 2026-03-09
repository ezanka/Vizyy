
import NewUpdateForm from "@/src/components/form/new-update-form"
import { prisma } from "@/src/lib/prisma"
import { getUser } from "@/src/lib/auth-server"
import { redirect } from "next/navigation"
import { Card } from "@/src/components/ui/shadcn/card"
import { Button } from "@/src/components/ui/shadcn/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Params = {
    projectId: string;
}

export default async function NewUpdatePage({
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

    if (!project?.members.some(member => member.userId === user.id)) {
        redirect('/projects');
    }

    if (!project) {
        return <div>Projet non trouvé</div>
    }

    return (
        <div className="flex flex-col gap-6 my-4">
            <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" asChild
                    className="size-8 border-border-md hover:border-border-hi shrink-0">
                    <Link href={`/project/${projectId}/updates`}>
                        <ArrowLeft size={15} />
                    </Link>
                </Button>
                <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle">Updates</p>
                    <h1 className="text-2xl font-extrabold tracking-tight">Créer un nouvel update</h1>
                </div>
            </div>

            <Card className="w-full max-w-4xl mx-auto bg-card border-border overflow-hidden">
                <NewUpdateForm project={project} />
            </Card>
        </div>
    )
}