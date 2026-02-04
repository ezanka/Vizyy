import { Button } from "@/src/components/ui/shadcn/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/src/components/ui/shadcn/empty"
import { Construction } from "lucide-react"
import Link from "next/link"

export default function InDev({projectId}: {projectId?: string}) {

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Construction />
                </EmptyMedia>
                <EmptyTitle>Page en développement</EmptyTitle>
                <EmptyDescription>
                    Cette fonctionnalité est actuellement en cours de développement. Veuillez revenir plus tard !
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                <Button><Link href={`/project/${projectId}/dashboard`}>Retour au tableau de bord</Link></Button>
                <Button variant="outline"><Link href="/projects">Liste des projets</Link></Button>
            </EmptyContent>
        </Empty>
    )
}