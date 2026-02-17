
import { isMaker } from "@/src/actions/is-maker-actions";
import { redirect } from "next/navigation";

type Params = {
    projectId: string;
}

export default async function Layout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<Params>;
}>) {
    const { projectId } = await params;
    const authorized = (await isMaker(projectId)).isMaker;

    if (!authorized) {
        redirect(`/project/${projectId}/dashboard`);
    }

    return (
        <>
            {children}
        </>
    )
}