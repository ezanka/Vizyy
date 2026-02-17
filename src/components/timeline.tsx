"use client";

import React from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, Delete, Eye, Megaphone } from "lucide-react";
import { Button } from "./ui/shadcn/button";
import { Timeline as TimelineType, Update } from "@/src/generated/prisma/client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/shadcn/dialog"
import { Input } from "./ui/shadcn/input";
import { Calendar } from "@/src/components/ui/shadcn/calendar"
import { Field, FieldLabel } from "@/src/components/ui/shadcn/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/shadcn/popover"
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/shadcn/select"
import NewTimelineButton from "./button/new-timeline-button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/src/components/ui/shadcn/sheet"
import { fr } from "date-fns/locale/fr";
import Link from "next/link";
import UpdateTimelineButton from "./button/update-timeline-button";
import DeleteTimelineButton from "./button/delete-timeline-button";
import { Separator } from "./ui/shadcn/separator";

export default function Timeline({ timeline, updates, projectId, authorized }: { timeline: TimelineType[], updates: Update[], projectId: string, authorized: boolean }) {
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const [currentDate, setCurrentDate] = React.useState(getStartOfWeek(new Date()));
    const [name, setName] = React.useState<string>("")
    const [startDate, setStartDate] = React.useState<Date | null>(null)
    const [endDate, setEndDate] = React.useState<Date | null>(null)
    const [updateId, setUpdateId] = React.useState<string>("")
    const [timelineId, setTimelineId] = React.useState<string>("")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isUpdateSheetOpen, setIsUpdateSheetOpen] = React.useState(false);

    const submitForm = () => {
        setIsCreateDialogOpen(false);
        setName("");
        setStartDate(null);
        setEndDate(null);
        setUpdateId("");
    }

    const editSubmitForm = (name: string, startDate: Date, endDate: Date, timelineId: string, updateId: string | null) => {
        setName(name);
        setStartDate(startDate);
        setEndDate(endDate);
        setTimelineId(timelineId);
        setUpdateId(updateId ?? "");
    }

    const goToPreviousWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    };

    const goToNextWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(getStartOfWeek(new Date()));
    };

    const generateDates = () => {
        const dates = [];
        const startOfWeek = new Date(currentDate);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }

        return dates;
    };

    const dates = generateDates();

    const weekLabel = (() => {
        const startOfWeek = dates[0];
        const endOfWeek = dates[6];

        const startDay = startOfWeek.getDate();
        const endDay = endOfWeek.getDate();
        const startMonth = startOfWeek.toLocaleDateString("fr-FR", { month: "long" });
        const endMonth = endOfWeek.toLocaleDateString("fr-FR", { month: "long" });
        const year = endOfWeek.getFullYear();

        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
            return `${startDay} - ${endDay} ${startMonth} ${year}`;
        } else {
            return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
        }
    })();

    const getDayName = (date: Date) => {
        return date.toLocaleDateString("fr-FR", { weekday: "short" });
    };

    const sortedTimeline = [...timeline].sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const totalHeight = sortedTimeline.length * 48;

    return (
        <div className="w-full px-4">
            <div className="flex items-center justify-between mb-4 max-w-full">
                <div className="flex-1">

                </div>
                <div className="flex items-center gap-3 flex-1">
                    <Button
                        onClick={goToPreviousWeek}
                        variant={"secondary"}
                    >
                        <ChevronLeft size={20} />
                    </Button>

                    <div className="min-w-75 text-center">
                        <span className="text-lg font-semibold text-foreground capitalize">
                            {weekLabel}
                        </span>
                    </div>

                    <Button
                        onClick={goToNextWeek}
                        variant={"secondary"}
                    >
                        <ChevronRight size={20} />
                    </Button>

                    <Button
                        onClick={goToToday}
                        variant={"outline"}
                    >
                        Aujourd'hui
                    </Button>
                </div>

                <div className="flex justify-end flex-1">
                    {authorized && (
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <CalendarPlus size={16} /> Nouvelle événement
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Créer un nouvel événement</DialogTitle>
                                    <DialogDescription>
                                        Remplissez le formulaire ci-dessous pour ajouter un nouvel événement à la timeline.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 mb-4">
                                    <div className="grid gap-3">
                                        <Field className="mx-auto">
                                            <FieldLabel htmlFor="name">* Nom</FieldLabel>
                                            <Input required id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                        </Field>
                                        <div className="flex w-full gap-4">
                                            <Field className="mx-auto">
                                                <FieldLabel htmlFor="date-picker-start">* Date de début</FieldLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="date-picker-start"
                                                            className="justify-start font-normal"
                                                        >
                                                            {startDate ? format(startDate, "PPPP", { locale: fr }) : <span>Choisir une date de début</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={startDate || undefined}
                                                            onSelect={setStartDate}
                                                            defaultMonth={startDate || undefined}
                                                            required
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </Field>
                                            <Field className="mx-auto">
                                                <FieldLabel htmlFor="date-picker-end">* Date de fin</FieldLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="date-picker-end"
                                                            className="justify-start font-normal"
                                                            disabled={!startDate}
                                                        >
                                                            {endDate ? format(endDate, "PPPP", { locale: fr }) : <span>Choisir une date de fin</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={endDate || undefined}
                                                            onSelect={setEndDate}
                                                            defaultMonth={endDate || undefined}
                                                            disabled={{
                                                                before: new Date(startDate || 0),
                                                            }}
                                                            required
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </Field>
                                        </div>
                                        <Field className="mx-auto">
                                            <FieldLabel htmlFor="update">Associer un update</FieldLabel>
                                            <Select value={updateId} onValueChange={setUpdateId}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisir un update" />
                                                </SelectTrigger>
                                                <SelectContent id="update">
                                                    {updates.map((update) => (
                                                        <SelectItem key={update.id} value={update.id}>
                                                            {update.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Annuler</Button>
                                    </DialogClose>
                                    <NewTimelineButton projectId={projectId} name={name} startDate={startDate!} endDate={endDate!} updateId={updateId} onSuccess={submitForm} />
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
            <div className="flex overflow-x-auto border-b border-border pb-2 w-full gap-1">
                {dates.map((date, index) => {
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isToday = new Date().toDateString() === date.toDateString();
                    return (
                        <div
                            key={index}
                            className={`flex-1 text-center min-w-20 ${isWeekend ? "bg-muted/30 rounded-md mt-1" : ""
                                } ${isToday ? "bg-primary/10 rounded-md" : ""
                                }`}
                        >
                            <div className="text-[10px] text-muted-foreground uppercase mb-1">
                                {getDayName(date)}
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
                    <div className="relative" style={{ height: `${totalHeight}px`, minHeight: '48px' }}>
                        {sortedTimeline.map((event, index) => {
                            const eventStartDate = new Date(event.startDate);
                            const eventStartDateNextDay = new Date(eventStartDate);
                            eventStartDateNextDay.setDate(eventStartDateNextDay.getDate() + 1);
                            const eventEndDate = new Date(event.endDate);
                            const eventEndDatePreviousDay = new Date(eventEndDate);
                            eventEndDatePreviousDay.setDate(eventEndDatePreviousDay.getDate() - 1);
                            const weekStart = dates[0];
                            const weekEnd = dates[6];

                            const startsBeforeWeek = eventStartDateNextDay < weekStart;
                            const endsAfterWeek = eventEndDatePreviousDay > weekEnd;

                            const isVisible = eventStartDate <= weekEnd;

                            if (!isVisible) return null;

                            const startDay = eventStartDate < weekStart ? 0 : dates.findIndex(d => d.toDateString() === eventStartDate.toDateString());
                            const endDay = eventEndDate > weekEnd ? 6 : dates.findIndex(d => d.toDateString() === eventEndDate.toDateString());

                            const leftPosition = (startDay / 7) * 100;
                            const width = ((endDay - startDay + 1) / 7) * 100;

                            if (!authorized) {
                                return (
                                    <React.Fragment key={event.id}>
                                        <Sheet open={isUpdateSheetOpen && timelineId === event.id} onOpenChange={setIsUpdateSheetOpen}>
                                            <SheetTrigger asChild>
                                                <div
                                                    className="absolute h-10 bg-primary hover:bg-primary/90 transition-all rounded-lg cursor-pointer group overflow-hidden"
                                                    style={{
                                                        left: `${leftPosition}%`,
                                                        width: `${width}%`,
                                                        top: `${index * 48}px`,
                                                    }}
                                                    title={`${event.name} (${new Date(event.startDate).toLocaleDateString("fr-FR")} - ${new Date(event.endDate).toLocaleDateString("fr-FR")})`}
                                                    onClick={() => editSubmitForm(event.name, event.startDate, event.endDate, event.id, event.updateId)}
                                                >
                                                    {startsBeforeWeek && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground/40" />
                                                    )}

                                                    <div className="relative flex items-center gap-2 px-3 h-full">
                                                        <span className="truncate text-primary-foreground text-sm font-medium flex-1">
                                                            {event.name}
                                                        </span>

                                                        {event.updateId && (
                                                            <div className="shrink-0 w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                                                <Megaphone size={12} className="text-primary-foreground" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {endsAfterWeek && (
                                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-foreground/40" />
                                                    )}
                                                </div>
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>Modifier un événement</SheetTitle>
                                                    <SheetDescription>{event.name}</SheetDescription>
                                                </SheetHeader>
                                                <div className="grid gap-4 mb-4 ml-2 mr-2">
                                                    <div className="grid gap-3">
                                                        <Field className="mx-auto">
                                                            <FieldLabel htmlFor="name">* Nom</FieldLabel>
                                                            <Input required id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!authorized} />
                                                        </Field>
                                                        <Field className="mx-auto">
                                                            <FieldLabel htmlFor="date-picker-start">* Date de début</FieldLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        id="date-picker-start"
                                                                        className="justify-start font-normal"
                                                                        disabled={!authorized}
                                                                    >
                                                                        {startDate ? format(startDate, "PPPP", { locale: fr }) : <span>Choisir une date de début</span>}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={startDate || undefined}
                                                                        onSelect={setStartDate}
                                                                        defaultMonth={startDate || undefined}
                                                                        required
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </Field>
                                                        <Field className="mx-auto">
                                                            <FieldLabel htmlFor="date-picker-end">* Date de fin</FieldLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        id="date-picker-end"
                                                                        className="justify-start font-normal"
                                                                        disabled={!startDate || !authorized}
                                                                    >
                                                                        {endDate ? format(endDate, "PPPP", { locale: fr }) : <span>Choisir une date de fin</span>}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={endDate || undefined}
                                                                        onSelect={setEndDate}
                                                                        defaultMonth={endDate || undefined}
                                                                        disabled={{
                                                                            before: new Date(startDate || 0),
                                                                        }}
                                                                        required
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </Field>
                                                        <Field className="mx-auto">
                                                            <FieldLabel htmlFor="update">Associer un update</FieldLabel>
                                                            <div className="flex items-center gap-1">
                                                                {updateId && (
                                                                    <Button asChild disabled={!updateId} variant="outline">
                                                                        <Link href={`/project/${projectId}/updates/${updateId}`}>
                                                                            <Eye size={16} />
                                                                        </Link>
                                                                    </Button>
                                                                )}
                                                                <Select value={updateId || ""} onValueChange={setUpdateId}>
                                                                    <SelectTrigger className="w-full" disabled={!authorized}>
                                                                        <SelectValue placeholder="Choisir un update" />
                                                                    </SelectTrigger>
                                                                    <SelectContent id="update">
                                                                        {updates.map((update) => (
                                                                            <SelectItem key={update.id} value={update.id}>
                                                                                {update.title}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {updateId && (
                                                                    <Button disabled={!updateId || !authorized} onClick={() => setUpdateId("")} variant="outline">
                                                                        <Delete />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </Field>
                                                    </div>
                                                </div>
                                                <SheetFooter>
                                                    <SheetClose asChild>
                                                        <Button variant="outline">Fermer</Button>
                                                    </SheetClose>
                                                </SheetFooter>
                                            </SheetContent>
                                        </Sheet>
                                        {index < sortedTimeline.length - 1 && (
                                            <Separator
                                                className="absolute left-0 right-0"
                                                style={{ top: `${(index + 1) * 48 - 4}px` }}
                                            />
                                        )}
                                    </React.Fragment>
                                )
                            }

                            return (
                                <React.Fragment key={event.id}>
                                    <Sheet open={isUpdateSheetOpen && timelineId === event.id} onOpenChange={setIsUpdateSheetOpen}>
                                        <SheetTrigger asChild>
                                            <div
                                                className="absolute h-10 bg-primary hover:bg-primary/90 transition-all rounded-lg cursor-pointer group overflow-hidden"
                                                style={{
                                                    left: `${leftPosition}%`,
                                                    width: `${width}%`,
                                                    top: `${index * 48}px`,
                                                }}
                                                title={`${event.name} (${new Date(event.startDate).toLocaleDateString("fr-FR")} - ${new Date(event.endDate).toLocaleDateString("fr-FR")})`}
                                                onClick={() => editSubmitForm(event.name, event.startDate, event.endDate, event.id, event.updateId)}
                                            >
                                                {startsBeforeWeek && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground/40" />
                                                )}

                                                <div className="relative flex items-center gap-2 px-3 h-full">
                                                    <span className="truncate text-primary-foreground text-sm font-medium flex-1">
                                                        {event.name}
                                                    </span>

                                                    {event.updateId && (
                                                        <div className="shrink-0 w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                                            <Megaphone size={12} className="text-primary-foreground" />
                                                        </div>
                                                    )}
                                                </div>

                                                {endsAfterWeek && (
                                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-foreground/40" />
                                                )}
                                            </div>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle>Modifier un événement</SheetTitle>
                                                <SheetDescription>{event.name}</SheetDescription>
                                            </SheetHeader>
                                            <div className="grid gap-4 mb-4 mx-5">
                                                <div className="grid gap-3 max-w-full">
                                                    <Field className="mx-auto">
                                                        <FieldLabel htmlFor="name">* Nom</FieldLabel>
                                                        <Input required id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                                    </Field>
                                                    <Field className="mx-auto">
                                                        <FieldLabel htmlFor="date-picker-start">* Date de début</FieldLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    id="date-picker-start"
                                                                    className="justify-start font-normal"
                                                                >
                                                                    {startDate ? format(startDate, "PPPP", { locale: fr }) : <span>Choisir une date de début</span>}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={startDate || undefined}
                                                                    onSelect={setStartDate}
                                                                    defaultMonth={startDate || undefined}
                                                                    required
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </Field>
                                                    <Field className="mx-auto">
                                                        <FieldLabel htmlFor="date-picker-end">* Date de fin</FieldLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    id="date-picker-end"
                                                                    className="justify-start font-normal"
                                                                    disabled={!startDate}
                                                                >
                                                                    {endDate ? format(endDate, "PPPP", { locale: fr }) : <span>Choisir une date de fin</span>}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={endDate || undefined}
                                                                    onSelect={setEndDate}
                                                                    defaultMonth={endDate || undefined}
                                                                    disabled={{
                                                                        before: new Date(startDate || 0),
                                                                    }}
                                                                    required
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </Field>
                                                    <Field className="mx-auto">
                                                        <FieldLabel htmlFor="update">Associer un update</FieldLabel>
                                                        <div className="flex items-center gap-1">
                                                            {updateId && (
                                                                <Button asChild disabled={!updateId} variant="outline">
                                                                    <Link href={`/project/${projectId}/updates/${updateId}`}>
                                                                        <Eye size={16} />
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                            <Select value={updateId || ""} onValueChange={setUpdateId}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Choisir un update" />
                                                                </SelectTrigger>
                                                                <SelectContent id="update">
                                                                    {updates.map((update) => (
                                                                        <SelectItem key={update.id} value={update.id}>
                                                                            {update.title}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {updateId && (
                                                                <Button disabled={!updateId} onClick={() => setUpdateId("")} variant="outline">
                                                                    <Delete />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </Field>
                                                </div>
                                            </div>
                                            <SheetFooter>
                                                <div className="flex items-center justify-between gap-2 flex-1 w-full">
                                                    <UpdateTimelineButton projectId={projectId} name={name} startDate={startDate!} endDate={endDate!} updateId={updateId} timelineId={timelineId} onSuccess={() => setIsUpdateSheetOpen(false)} />
                                                    <DeleteTimelineButton projectId={projectId} timelineId={timelineId} onSuccess={() => setIsUpdateSheetOpen(false)} />
                                                </div>
                                                <SheetClose asChild>
                                                    <Button variant="outline">Fermer</Button>
                                                </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet>
                                    {index < sortedTimeline.length - 1 && (
                                        <Separator
                                            className="absolute left-0 right-0"
                                            style={{ top: `${(index + 1) * 48 - 4}px` }}
                                        />
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