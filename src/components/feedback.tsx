
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/src/components/ui/shadcn/input";
import CreateFeedbackButton from "@/src/components/button/create-feedback-button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/shadcn/avatar";
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectValue, SelectItem } from "@/src/components/ui/shadcn/select";
import { MessageSquare } from "lucide-react";
import { Feedback as FeedbackType, Update, User } from "@/src/generated/prisma/client";

interface FeedBackUser extends User {
    image: string | null;
}

interface FeedbackWithUser extends FeedbackType {
    user: FeedBackUser;
}

function UserAvatar({ user }: { user: FeedBackUser }) {
    const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase() ?? "?";
    return (
        <Avatar className="h-8 w-8 shrink-0 ring-2 ring-border">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">{initials}</AvatarFallback>
        </Avatar>
    );
}

export default function Feedback({
    projectId,
    updates,
    feedbacks,
    allFeedbacks,
    selectedUpdateId,
    user,
}: {
    projectId: string;
    updates: Update[];
    feedbacks: FeedbackWithUser[];
    allFeedbacks: { updateId: string }[];
    selectedUpdateId?: string;
    user: User;
}) {
    const [feedback, setFeedback] = useState<string>("");
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Feedback</h1>
                    <p className="text-muted-foreground text-sm">
                        Gérer les retours et les commentaires de votre projet
                    </p>
                </div>
                <Select
                    value={selectedUpdateId || ""}
                    onValueChange={(value) => router.push(`${pathname}?updateId=${value}`)}
                >
                    <SelectTrigger className="min-w-50 max-w-1/2">
                        <SelectValue placeholder="Sélectionner un update" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {updates.map((update) => {
                                const count = allFeedbacks.filter((f) => f.updateId === update.id).length;
                                return (
                                    <SelectItem key={update.id} value={update.id}>
                                        <div className="flex items-center gap-2">
                                            {update.title}
                                            {count > 0 && (
                                                <span className="inline-flex items-center text-xs font-medium border border-primary/20 px-1.5 py-0.5 rounded bg-primary-ghost text-primary">
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
                {!selectedUpdateId ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center p-8">
                        <MessageSquare className="size-8 text-muted-foreground/40" />
                        <p className="text-muted-foreground text-sm">
                            Sélectionnez un update pour voir les feedbacks associés.
                        </p>
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center p-8">
                        <MessageSquare className="size-8 text-muted-foreground/40" />
                        <p className="text-muted-foreground text-sm">Aucun feedback pour le moment.</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
                        {feedbacks.map((fb) => {
                            const isAuthor = fb.userId === user.id;

                            return (
                                <div
                                    key={fb.id}
                                    className={`flex items-end gap-2 ${isAuthor ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <UserAvatar user={fb.user} />
                                    <div className={`flex flex-col gap-1 max-w-[60%] ${isAuthor ? "items-end" : "items-start"}`}>
                                        <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${isAuthor
                                            ? "bg-primary text-primary-foreground rounded-br-sm"
                                            : "bg-muted text-foreground rounded-bl-sm"
                                            }`}>
                                            {fb.content}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground px-1">
                                            {format(new Date(fb.createdAt), "Pp", { locale: fr })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Input
                    disabled={!selectedUpdateId}
                    placeholder={!selectedUpdateId ? "Sélectionnez un update" : "Entrez votre feedback"}
                    className="bg-card"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                <CreateFeedbackButton
                    projectId={projectId}
                    feedback={feedback}
                    updateId={selectedUpdateId}
                    onSend={() => setFeedback("")}
                />
            </div>
        </div>
    );
}