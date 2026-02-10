"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/src/components/ui/shadcn/input";
import CreateFeedbackButton from "@/src/components/button/create-feedback-button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/shadcn/avatar";
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectValue, SelectItem } from "@/src/components/ui/shadcn/select";
import { Feedback as FeedbackType, Update, User } from "@/src/generated/prisma/client";

interface FeedBackUser extends User {
    image: string | null;
}

interface FeedbackWithUser extends FeedbackType {
    user: FeedBackUser;
}

export default function Feedback({
    projectId,
    updates,
    feedbacks,
    selectedUpdateId,
    user,
}: {
    projectId: string;
    updates: Update[];
    feedbacks: FeedbackWithUser[];
    selectedUpdateId?: string;
    user: User;
}) {
    const [feedback, setFeedback] = useState<string>("");
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="flex flex-col gap-4 h-full">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Feedback</h1>
                        <p className="text-muted-foreground">Gérer les retours et les commentaires de votre projet</p>
                    </div>
                    <Select value={selectedUpdateId || ""} onValueChange={(value) => router.push(`${pathname}?updateId=${value}`)}>
                        <SelectTrigger className="min-w-50 max-w-1/2">
                            <SelectValue placeholder="Sélectionner un update" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {updates.map((update) => (
                                    <SelectItem key={update.id} value={update.id} className="flex items-center">
                                        {update.title}
                                        {feedbacks.some((f) => f.updateId === update.id) && (
                                            <div className="inline-flex items-center text-xs font-medium border px-2 py-1 rounded-md bg-accent text-white ml-2">
                                                {feedbacks.filter((f) => f.updateId === update.id).length}
                                            </div>
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full h-full flex-1 bg-background rounded-lg border p-4">
                    {!selectedUpdateId ? (
                        <p className="text-muted-foreground text-center">Sélectionnez un update pour voir les feedbacks associés.</p>
                    ) : (
                        feedbacks.length === 0 ? (
                            <p className="text-muted-foreground text-center">Aucun feedback pour le moment.</p>
                        ) : (
                            feedbacks.map((feedback) => {
                                const isAuthor = feedback.userId === user.id;

                                if (isAuthor) {
                                    return (
                                        <div className="w-full flex justify-end" key={feedback.id}>
                                            <div className="flex flex-col max-w-2/3 w-fit">
                                                <div className="mr-12 flex items-center gap-2 justify-end">
                                                    <p className="bg-blue-500 p-2 rounded-lg text-white w-fit">{feedback.content}</p>
                                                </div>
                                                <div className="relative left-0 bottom-2 flex items-center gap-2 justify-end">
                                                    <p className="text-foreground/80 text-xs relative top-2">{format(new Date(feedback.createdAt), "Pp", { locale: fr })}</p>
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={feedback.user.image ?? undefined} />
                                                        <AvatarFallback>{feedback.user.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                return (
                                    <div className="w-full flex justify-start" key={feedback.id}>
                                        <div className="flex flex-col max-w-2/3 w-fit">
                                            <div className="ml-12">
                                                <p className="bg-accent p-2 rounded-lg text-white w-fit">{feedback.content}</p>
                                            </div>
                                            <div className="relative bottom-2 flex items-center gap-2">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={feedback.user.image ?? undefined} />
                                                    <AvatarFallback>{feedback.user.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <p className="text-foreground/80 text-xs relative top-2">{format(new Date(feedback.createdAt), "Pp", { locale: fr })}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ))}
                </div>
            </div>
            <div className="flex items-center justify-between gap-2">
                <Input disabled={!selectedUpdateId} placeholder={!selectedUpdateId ? "Sélectionnez un update" : "Entrez votre feedback"} className="bg-accent" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                <CreateFeedbackButton projectId={projectId} feedback={feedback} updateId={selectedUpdateId} onSend={() => setFeedback("")} />
            </div>
        </>

    )
}
