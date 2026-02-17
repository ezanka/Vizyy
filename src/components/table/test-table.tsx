"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, Box, ChevronDown, CircleCheck, CircleX, Clock, FlaskConical, Funnel, GitMerge, ListChecks, ListRestart, MonitorCheck, Plus, SquarePen } from "lucide-react"

import { Button } from "@/src/components/ui/shadcn/button"
import { Checkbox } from "@/src/components/ui/shadcn/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/shadcn/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/shadcn/table"
import { Test, Update } from "@/src/generated/prisma/client"
import { TestStatus, TestType } from "@/src/generated/prisma/enums"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { ButtonGroup } from "../ui/shadcn/button-group"
import { Input } from "../ui/shadcn/input"
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
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/shadcn/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/shadcn/select"
import { Textarea } from "../ui/shadcn/textarea"
import { updateTest } from "@/src/actions/update-test-actions"
import { Prisma } from "@/src/generated/prisma/client"

export type TestWithRelations = Prisma.TestGetPayload<{
    include: {
        update: {
            include: {
                organization: {
                    include: {
                        members: {
                            include: {
                                user: true
                            }
                        };
                    };
                };
            };
        };
    };
}>;

function EditTestSheet({ test, projectId, updates }: {
    test: TestWithRelations;
    projectId: string;
    updates: Update[];
}) {
    const [open, setOpen] = React.useState(false)
    const [status, setStatus] = React.useState<TestStatus>(test.status)
    const [type, setType] = React.useState<TestType>(test.type)
    const [details, setDetails] = React.useState<string>(test.details ?? "")
    const [updateId, setUpdateId] = React.useState<string>(test.updateId ?? "")

    React.useEffect(() => {
        setStatus(test.status)
        setType(test.type)
        setDetails(test.details ?? "")
        setUpdateId(test.updateId ?? "")
    }, [test])

    const handleSave = () => {
        const update = updates.find(u => u.id === updateId) ?? test.update
        if (!update) return

        updateTest(projectId, test.id, type, status, details, update)
        setOpen(false)
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="flex items-center justify-center">
                <SquarePen className="w-4 h-4" />
            </SheetTrigger>
            <SheetContent
                onInteractOutside={(e) => {
                    const target = e.target as HTMLElement
                    if (target?.closest("[data-radix-popper-content-wrapper]")) {
                        e.preventDefault()
                    }
                }}
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement
                    if (target?.closest("[data-radix-popper-content-wrapper]")) {
                        e.preventDefault()
                    }
                }}
            >
                <SheetHeader>
                    <SheetTitle>Modifier le test</SheetTitle>
                    <SheetDescription>{test.details}</SheetDescription>
                </SheetHeader>

                <FieldSet className="mx-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="statut">Statut</FieldLabel>
                            <Select value={status} onValueChange={(v) => setStatus(v as TestStatus)}>
                                <SelectTrigger id="statut" className="w-full">
                                    <SelectValue placeholder="Statut du test" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(TestStatus).map((t) => {
                                            const label =
                                                t === TestStatus.PENDING ? "En attente" :
                                                    t === TestStatus.FAILED ? "Échoué" :
                                                        t === TestStatus.PASSED ? "Réussi" : t
                                            return <SelectItem key={t} value={t}>{label}</SelectItem>
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="type">Type</FieldLabel>
                            <Select value={type} onValueChange={(v) => setType(v as TestType)}>
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Type du test" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(TestType).map((t) => {
                                            const label =
                                                t === TestType.INTEGRATION ? "Intégration" :
                                                    t === TestType.UNIT ? "Unitaire" :
                                                        t === TestType.E2E ? "E2E" :
                                                            t === TestType.OTHER ? "Autre" : t
                                            return <SelectItem key={t} value={t}>{label}</SelectItem>
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="update">Update</FieldLabel>
                            <Select value={updateId} onValueChange={setUpdateId}>
                                <SelectTrigger id="update" className="w-full">
                                    <SelectValue placeholder="Update du test" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {updates.map((u) => (
                                            <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="details">Détails</FieldLabel>
                            <Textarea
                                id="details"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="w-full"
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <SheetFooter className="flex flex-row items-center w-full justify-between">
                    <SheetClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </SheetClose>
                    <Button onClick={handleSave}>Modifier le test</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export function TestTable({ tests, projectId, updates, authorized }: {
    tests?: TestWithRelations[];
    projectId: string;
    updates: Update[];
    authorized: boolean;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnFiltersStatus, setColumnFiltersStatus] = React.useState<TestStatus[]>([])
    const [columnFiltersStatusOpen, setColumnFiltersStatusOpen] = React.useState(false)
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const columns = React.useMemo<ColumnDef<TestWithRelations>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "type",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Type <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("type") === TestType.UNIT ? <span className="flex items-center"><Box className="w-4 h-4 mr-1 text-gray-500" /> Unit</span> :
                        row.getValue("type") === TestType.INTEGRATION ? <span className="flex items-center"><GitMerge className="w-4 h-4 mr-1 text-gray-500" /> Intégration</span> :
                            row.getValue("type") === TestType.E2E ? <span className="flex items-center"><MonitorCheck className="w-4 h-4 mr-1 text-gray-500" /> E2E</span> :
                                row.getValue("type") === TestType.OTHER ? <span className="flex items-center"><FlaskConical className="w-4 h-4 mr-1 text-gray-500" /> Autre</span> : ""}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: () => <div>Statut</div>,
            filterFn: (row, columnId, filterValue: TestStatus[]) => filterValue.includes(row.getValue(columnId)),
            cell: ({ row }) => (
                <div>
                    {row.getValue("status") === TestStatus.PENDING ? <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-amber-500" /> En attente</span> :
                        row.getValue("status") === TestStatus.FAILED ? <span className="flex items-center"><CircleX className="w-4 h-4 mr-1 text-red-500" /> Échoué</span> :
                            row.getValue("status") === TestStatus.PASSED ? <span className="flex items-center"><CircleCheck className="w-4 h-4 mr-1 text-green-500" /> Réussi</span> : ""}
                </div>
            ),
        },
        {
            accessorKey: "updateId",
            header: () => <div>Update</div>,
            cell: ({ row }) => {
                const update = row.original.update
                return (
                    <Button variant="link" className="p-0" disabled={!update}>
                        <Link href={`/project/${projectId}/updates/${update?.id}`}>
                            <div className="capitalize">{update?.title ?? row.getValue("updateId")}</div>
                        </Link>
                    </Button>
                )
            },
        },
        {
            accessorKey: "updatedAt",
            header: () => <div>Réalisé le</div>,
            cell: ({ row }) => (
                <div className="capitalize">
                    {!row.getValue("updatedAt")
                        ? <span className="text-gray-500">Non réalisé</span>
                        : format(new Date(row.getValue("updatedAt") as string | Date), "Pp", { locale: fr })}
                </div>
            ),
        },
        {
            accessorKey: "updatedById",
            header: () => <div>Réalisé par</div>,
            cell: ({ row }) => {
                const members = row.original.update?.organization?.members ?? [];
                const updatedBy = members.find(m => m.userId === row.getValue("updatedById"));;

                return (
                    <div className="capitalize">
                        {!row.getValue("updatedById")
                            ? <span className="text-gray-500">Non réalisé</span>
                            : updatedBy?.user?.name ?? row.getValue("updatedById")}
                    </div>
                );
            },
        },
        {
            accessorKey: "details",
            header: () => <div>Détails</div>,
            cell: ({ row }) => <div>{row.getValue("details")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                authorized ? <EditTestSheet
                    test={row.original}
                    projectId={projectId}
                    updates={updates}
                /> : null
            ),
        },
    ], [projectId, updates])

    const table = useReactTable({
        data: tests ?? [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    React.useEffect(() => {
        if (columnFiltersStatus.length === 0) {
            table.getColumn("status")?.setFilterValue(undefined)
        } else {
            table.getColumn("status")?.setFilterValue(columnFiltersStatus)
        }
        table.resetPageIndex()
    }, [columnFiltersStatus, table])

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Filtrer par détails..."
                        value={(table.getColumn("details")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("details")?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu open={columnFiltersStatusOpen} onOpenChange={setColumnFiltersStatusOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline"><Funnel /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Statut</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="flex w-full justify-evenly gap-2">
                                <Button size="sm" variant="outline" onClick={() => setColumnFiltersStatus([])}>
                                    <ListRestart />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setColumnFiltersStatus(Object.values(TestStatus))}>
                                    <ListChecks />
                                </Button>
                            </div>
                            <DropdownMenuSeparator />
                            {Object.values(TestStatus).map((s) => {
                                const label =
                                    s === TestStatus.FAILED ? "Échoué" :
                                        s === TestStatus.PASSED ? "Réussi" :
                                            s === TestStatus.PENDING ? "En attente" : s
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={s}
                                        className="text-start capitalize"
                                        checked={columnFiltersStatus.includes(s)}
                                        onCheckedChange={(checked) =>
                                            setColumnFiltersStatus((prev) =>
                                                checked ? [...prev, s] : prev.filter((x) => x !== s)
                                            )
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        {label}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <ButtonGroup className="ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Colonnes <ChevronDown /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {authorized && <Button asChild><Link href={`/project/${projectId}/test/new`}><Plus /> Nouveau test</Link></Button>}
                </ButtonGroup>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucun test pour ce projet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} sur{" "}
                    {table.getFilteredRowModel().rows.length} ligne(s) sélectionné.
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Précédent
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    )
}