import InDev from "@/src/components/ui/indev";

type Params = {
    projectId: string;
}

export default async function AssetsPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { projectId } = await params;

    return (
        <div>
            <InDev projectId={projectId} />
        </div>
    )
}