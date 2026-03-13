"use client";

import React from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, Delete, Eye, Megaphone, UserIcon } from "lucide-react";
import { Button } from "./ui/shadcn/button";
import { Timeline as TimelineType, Update, Member, User } from "@/src/generated/prisma/client";
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/src/components/ui/shadcn/dialog"
import { Input } from "./ui/shadcn/input";
import { Calendar } from "@/src/components/ui/shadcn/calendar"
import { Field, FieldLabel } from "@/src/components/ui/shadcn/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/shadcn/popover"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/shadcn/select"
import CreateTimelineButton from "./button/create-timeline-button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/shadcn/sheet"
import { fr } from "date-fns/locale/fr";
import Link from "next/link";
import UpdateTimelineButton from "./button/update-timeline-button";
import DeleteTimelineButton from "./button/delete-timeline-button";
import { Separator } from "./ui/shadcn/separator";

type MemberWithUser = Member & { user: User | null }

interface EventFormFieldsProps {
    name: string;
    setName: (v: string) => void;
    startDate: Date | null;
    setStartDate: (d: Date | null) => void;
    endDate: Date | null;
    setEndDate: (d: Date | null) => void;
    updateId: string;
    setUpdateId: (v: string) => void;
    assignedTo: MemberWithUser | null;
    setAssignedTo: (m: MemberWithUser | null) => void;
    members: MemberWithUser[];
    updates: Update[];
    projectId: string;
    authorized: boolean;
    showUpdateLink?: boolean;
}

function EventFormFields({
    name, setName,
    startDate, setStartDate,
    endDate, setEndDate,
    updateId, setUpdateId,
    assignedTo, setAssignedTo,
    members, updates, projectId,
    authorized, showUpdateLink = false,
}: EventFormFieldsProps) {
    return (
        <div className="grid gap-3">
            <Field className="mx-auto">
                <FieldLabel htmlFor="name">* Nom</FieldLabel>
                <Input
                    required id="name" name="name"
                    value={name} onChange={(e) => setName(e.target.value)}
                    disabled={!authorized}
                />
            </Field>

            <div className="flex w-full gap-4">
                <Field className="mx-auto">
                    <FieldLabel htmlFor="date-picker-start">* Date de début</FieldLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="date-picker-start" className="justify-start font-normal" disabled={!authorized}>
                                {startDate ? format(startDate, "PPPP", { locale: fr }) : <span>Choisir une date de début</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={startDate || undefined} onSelect={setStartDate} defaultMonth={startDate || undefined} required />
                        </PopoverContent>
                    </Popover>
                </Field>

                <Field className="mx-auto">
                    <FieldLabel htmlFor="date-picker-end">* Date de fin</FieldLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="date-picker-end" className="justify-start font-normal" disabled={!startDate || !authorized}>
                                {endDate ? format(endDate, "PPPP", { locale: fr }) : <span>Choisir une date de fin</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={endDate || undefined} onSelect={setEndDate} defaultMonth={endDate || undefined} disabled={{ before: new Date(startDate || 0) }} required />
                        </PopoverContent>
                    </Popover>
                </Field>
            </div>

            <Field className="mx-auto">
                <FieldLabel htmlFor="update">Associer un update</FieldLabel>
                <div className="flex items-center gap-1">
                    {showUpdateLink && updateId && (
                        <Button asChild variant="outline">
                            <Link href={`/project/${projectId}/updates/${updateId}`}>
                                <Eye size={16} />
                            </Link>
                        </Button>
                    )}
                    <Select value={updateId} onValueChange={setUpdateId} disabled={!authorized}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Choisir un update" /></SelectTrigger>
                        <SelectContent>
                            {updates.map((u) => <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {updateId && (
                        <Button disabled={!authorized} onClick={() => setUpdateId("")} variant="outline"><Delete /></Button>
                    )}
                </div>
            </Field>

            <Field className="mx-auto">
                <FieldLabel htmlFor="assigned-to">Assigné à un membre</FieldLabel>
                <div className="flex items-center gap-1">
                    <Select
                        value={assignedTo?.id || ""}
                        onValueChange={(id) => setAssignedTo(members.find((m) => m.id === id) || null)}
                        disabled={!authorized}
                    >
                        <SelectTrigger className="w-full"><SelectValue placeholder="Choisir un membre" /></SelectTrigger>
                        <SelectContent>
                            {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.user?.name ?? "Utilisateur supprimé"}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {assignedTo && (
                        <Button disabled={!authorized} onClick={() => setAssignedTo(null)} variant="outline"><Delete /></Button>
                    )}
                </div>
            </Field>
        </div>
    );
}

interface TimelineEventSheetProps {
    event: TimelineType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    name: string; setName: (v: string) => void;
    startDate: Date | null; setStartDate: (d: Date | null) => void;
    endDate: Date | null; setEndDate: (d: Date | null) => void;
    updateId: string; setUpdateId: (v: string) => void;
    assignedTo: MemberWithUser | null; setAssignedTo: (m: MemberWithUser | null) => void;
    members: MemberWithUser[];
    updates: Update[];
    projectId: string;
    authorized: boolean;
    onEditClick: () => void;
    onSuccess: () => void;
    startsBeforeWeek: boolean;
    endsAfterWeek: boolean;
    leftPosition: number;
    width: number;
    top: number;
}

function TimelineEventSheet({
    event, open, onOpenChange,
    name, setName, startDate, setStartDate, endDate, setEndDate,
    updateId, setUpdateId, assignedTo, setAssignedTo,
    members, updates, projectId, authorized,
    onEditClick, onSuccess,
    startsBeforeWeek, endsAfterWeek, leftPosition, width, top,
}: TimelineEventSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <div
                    className="absolute h-10 bg-primary hover:bg-primary/90 transition-all rounded-lg cursor-pointer overflow-hidden"
                    style={{ left: `${leftPosition}%`, width: `${width}%`, top: `${top}px` }}
                    title={`${event.name} (${new Date(event.startDate).toLocaleDateString("fr-FR")} - ${new Date(event.endDate).toLocaleDateString("fr-FR")})`}
                    onClick={onEditClick}
                >
                    {startsBeforeWeek && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground/40" />}
                    <div className="relative flex items-center gap-2 px-3 h-full">
                        <span className="truncate text-primary-foreground text-sm font-medium flex-1">{event.name}</span>
                        {event.assigneeId && (
                            <div className="shrink-0 w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                <UserIcon size={12} className="text-primary-foreground" />
                            </div>
                        )}
                        {event.updateId && (
                            <div className="shrink-0 w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                <Megaphone size={12} className="text-primary-foreground" />
                            </div>
                        )}
                    </div>
                    {endsAfterWeek && <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-foreground/40" />}
                </div>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{authorized ? "Modifier un événement" : "Détails de l'événement"}</SheetTitle>
                    <SheetDescription>{event.name}</SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 mb-4 mx-5">
                    <EventFormFields
                        name={name} setName={setName}
                        startDate={startDate} setStartDate={setStartDate}
                        endDate={endDate} setEndDate={setEndDate}
                        updateId={updateId} setUpdateId={setUpdateId}
                        assignedTo={assignedTo} setAssignedTo={setAssignedTo}
                        members={members} updates={updates}
                        projectId={projectId} authorized={authorized}
                        showUpdateLink
                    />
                </div>

                <SheetFooter>
                    {authorized ? (
                        <>
                            <div className="flex items-center justify-between gap-2 flex-1 w-full">
                                <UpdateTimelineButton
                                    projectId={projectId} name={name}
                                    startDate={startDate!} endDate={endDate!}
                                    updateId={updateId} timelineId={event.id}
                                    assignedTo={assignedTo?.user?.id || undefined}
                                    onSuccess={onSuccess}
                                />
                                <DeleteTimelineButton projectId={projectId} timelineId={event.id} onSuccess={onSuccess} />
                            </div>
                        </>
                    ) : null}
                    <SheetClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default function Timeline({ timeline, members, updates, projectId, authorized, deadline }: {
    timeline: TimelineType[], members: MemberWithUser[], updates: Update[],
    projectId: string, authorized: boolean, deadline: Date | null
}) {
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const [currentDate, setCurrentDate] = React.useState(getStartOfWeek(new Date()));
    const [name, setName] = React.useState("");
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [updateId, setUpdateId] = React.useState("");
    const [assignedTo, setAssignedTo] = React.useState<MemberWithUser | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [openSheetId, setOpenSheetId] = React.useState<string | null>(null);

    const resetForm = () => {
        setIsCreateDialogOpen(false);
        setName(""); setStartDate(null); setEndDate(null);
        setUpdateId(""); setAssignedTo(null);
    };

    const goToPreviousWeek = () => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
    const goToNextWeek = () => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });
    const goToToday = () => setCurrentDate(getStartOfWeek(new Date()));

    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentDate);
        d.setDate(currentDate.getDate() + i);
        return d;
    });

    const weekLabel = (() => {
        const s = dates[0], e = dates[6];
        const sMonth = s.toLocaleDateString("fr-FR", { month: "long" });
        const eMonth = e.toLocaleDateString("fr-FR", { month: "long" });
        const year = e.getFullYear();
        return s.getMonth() === e.getMonth()
            ? `${s.getDate()} - ${e.getDate()} ${sMonth} ${year}`
            : `${s.getDate()} ${sMonth} - ${e.getDate()} ${eMonth} ${year}`;
    })();

    const sortedTimeline = [...timeline].sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return (
        <div className="w-full px-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1" />
                <div className="flex items-center gap-3 flex-1">
                    <Button onClick={goToPreviousWeek} variant="secondary"><ChevronLeft size={20} /></Button>
                    <div className="min-w-75 text-center">
                        <span className="text-lg font-semibold text-foreground capitalize">{weekLabel}</span>
                    </div>
                    <Button onClick={goToNextWeek} variant="secondary"><ChevronRight size={20} /></Button>
                    <Button onClick={goToToday} variant="outline">Aujourd'hui</Button>
                </div>
                <div className="flex justify-end flex-1">
                    {authorized && (
                        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) resetForm(); }}>
                            <DialogTrigger asChild>
                                <Button><CalendarPlus size={16} /> Nouvelle événement</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Créer un nouvel événement</DialogTitle>
                                    <DialogDescription>Remplissez le formulaire ci-dessous pour ajouter un événement.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 mb-4">
                                    <EventFormFields
                                        name={name} setName={setName}
                                        startDate={startDate} setStartDate={setStartDate}
                                        endDate={endDate} setEndDate={setEndDate}
                                        updateId={updateId} setUpdateId={setUpdateId}
                                        assignedTo={assignedTo} setAssignedTo={setAssignedTo}
                                        members={members} updates={updates}
                                        projectId={projectId} authorized={true}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Annuler</Button>
                                    </DialogClose>
                                    <CreateTimelineButton
                                        projectId={projectId} name={name}
                                        startDate={startDate!} endDate={endDate!}
                                        updateId={updateId} assignedTo={assignedTo?.user?.id || ""}
                                        onSuccess={resetForm}
                                    />
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <div className="flex overflow-x-auto border-b border-border pb-2 w-full gap-1">
                {dates.map((date, i) => {
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isToday = new Date().toDateString() === date.toDateString();
                    return (
                        <div key={i} className={`flex-1 text-center min-w-20 ${isWeekend ? "bg-muted/30 rounded-md mt-1" : ""} ${isToday ? "bg-primary/10 rounded-md" : ""}`}>
                            <div className="text-[10px] text-muted-foreground uppercase mb-1">
                                {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                            </div>
                            <div className={`text-sm font-semibold ${isToday ? "text-primary" : "text-foreground"}`}>
                                {date.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="relative mt-1">
                {timeline.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        <p>Aucun événement.</p>
                    </div>
                ) : (
                    <div className="relative" style={{ height: `${sortedTimeline.length * 48}px`, minHeight: "48px" }}>
                        {deadline && (() => {
                            const idx = dates.findIndex(d => d.toDateString() === new Date(deadline).toDateString());
                            if (idx === -1) return null;
                            return (
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10 pointer-events-none"
                                    style={{ left: `${((idx + 0.5) / 7) * 100}%` }}
                                    title={`Deadline : ${new Date(deadline).toLocaleDateString("fr-FR")}`}
                                />
                            );
                        })()}

                        {sortedTimeline.map((event, index) => {
                            const eventStart = new Date(event.startDate);
                            const eventEnd = new Date(event.endDate);
                            const weekStart = dates[0];
                            const weekEnd = dates[6];

                            if (eventStart > weekEnd) return null;

                            const startDay = eventStart < weekStart ? 0 : dates.findIndex(d => d.toDateString() === eventStart.toDateString());
                            const endDay = eventEnd > weekEnd ? 6 : dates.findIndex(d => d.toDateString() === eventEnd.toDateString());

                            const startsBeforeWeek = new Date(eventStart.getTime() + 86400000) < weekStart;
                            const endsAfterWeek = new Date(eventEnd.getTime() - 86400000) > weekEnd;

                            return (
                                <React.Fragment key={event.id}>
                                    <TimelineEventSheet
                                        event={event}
                                        open={openSheetId === event.id}
                                        onOpenChange={(open) => setOpenSheetId(open ? event.id : null)}
                                        name={name} setName={setName}
                                        startDate={startDate} setStartDate={setStartDate}
                                        endDate={endDate} setEndDate={setEndDate}
                                        updateId={updateId} setUpdateId={setUpdateId}
                                        assignedTo={assignedTo} setAssignedTo={setAssignedTo}
                                        members={members} updates={updates}
                                        projectId={projectId} authorized={authorized}
                                        onEditClick={() => {
                                            setName(event.name);
                                            setStartDate(event.startDate);
                                            setEndDate(event.endDate);
                                            setOpenSheetId(event.id);
                                            setUpdateId(event.updateId ?? "");
                                            setAssignedTo(members.find(m => m.userId === event.assigneeId) || null);
                                        }}
                                        onSuccess={() => setOpenSheetId(null)}
                                        startsBeforeWeek={startsBeforeWeek}
                                        endsAfterWeek={endsAfterWeek}
                                        leftPosition={(startDay / 7) * 100}
                                        width={((endDay - startDay + 1) / 7) * 100}
                                        top={index * 48}
                                    />
                                    {index < sortedTimeline.length - 1 && (
                                        <Separator className="absolute left-0 right-0" style={{ top: `${(index + 1) * 48 - 4}px` }} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}