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
import { ArrowUpDown, ChevronDown, Delete, MailPlus, MoreHorizontal } from "lucide-react"

import { Button } from "@/src/components/ui/shadcn/button"
import { Checkbox } from "@/src/components/ui/shadcn/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/shadcn/dropdown-menu"
import { Input } from "@/src/components/ui/shadcn/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/shadcn/table"
import { ButtonGroup } from "@/src/components/ui/shadcn/button-group"
import { InvitationStatus, User } from "@/src/generated/prisma/client"
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
import { Label } from "@/src/components/ui/shadcn/label"
import RemoveClientButton from "../button/remove-client-button"
import { generateInvitationLink } from "@/src/actions/generate-invitation-link-actions";
import { InvitationLink } from "@/src/generated/prisma/client"
import { DataTableColumnToggle } from "./data-table-column-toggle"
import DeleteInvitationButton from "../button/delete-invitation-button";
import CopyInvitationButton from "../button/copy-invitation-button"

type InvitationLinkWithUser = InvitationLink & {
    joiner: User | null;
    user: User | null;
};

export function LinkTable({ invitationLinks, projectId }: { invitationLinks?: InvitationLinkWithUser[], projectId: string }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [openInviteDialog, setOpenInviteDialog] = React.useState<boolean>(false);
    const [invitationLink, setInvitationLink] = React.useState<string | null>(null);

    async function createInvitationLink() {
        const result = await generateInvitationLink(projectId);
        if (result.success) {
            setInvitationLink(result.invitationLink.link);
            setOpenInviteDialog(true);
        }
    }
    const columns: ColumnDef<InvitationLinkWithUser>[] = [
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
            accessorKey: "createdAt",
            header: "Crée le",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"));
                return (
                    <div className="capitalize">
                        {date.toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })}
                    </div>
                );
            },
        },
        {
            accessorKey: "expiresAt",
            header: "Expire le",
            cell: ({ row }) => {
                const date = new Date(row.getValue("expiresAt"));
                return (
                    <div className="capitalize">
                        {date.toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            filterFn: (row, id, filterValue: InvitationStatus[]) => {
                if (!filterValue || filterValue.length === 0) return true
                const value = row.getValue<InvitationStatus>(id as "status")
                return filterValue.includes(value)
            },
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Statut
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="capitalize ml-4">
                    {
                        row.getValue("status") === "PENDING" ? "En attente" :
                        row.getValue("status") === "ACCEPTED" ? "Acceptée" :
                        row.getValue("status") === "EXPIRED" ? "Expirée" :
                        "Inconnu"
                    }
                </div>
            ),
        },
        {
            accessorKey: "inviterId",
            header: "Invité par",
            cell: ({ row }) => {
                const inviter = row.original.user;

                if (!inviter) {
                    return <div className="italic text-muted-foreground">Inconnu</div>;
                }

                return (
                    <div>{inviter.email}</div>
                )
            },
        },
        {
            accessorKey: "joinerId",
            header: "Rejoint par",
            cell: ({ row }) => {
                const joiner = row.original.joiner;

                if (!joiner) {
                    return <div className="italic text-muted-foreground">Pas encore rejoint</div>;
                }

                return (
                    <div>{joiner.email}</div>
                )
            },
        },
        {
            accessorKey: "company",
            header: () => <div>Entreprise</div>,
            cell: ({ row }) => {
                const company = row.original.joiner?.company as string | null;

                if (!company) {
                    return <div className="italic text-muted-foreground">Non renseigné</div>;
                }

                return <div className="capitalize">{company}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const invitationId = row.original.id;
                const status = row.original.status;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><CopyInvitationButton link={row.original.link} /></DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <DeleteInvitationButton invitationId={invitationId} projectId={projectId} isAccepted={status === "ACCEPTED"} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: invitationLinks ?? [],
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

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                {/* <Input
                    placeholder="Filtrer par email..."
                    value={(table.getColumn("joiner")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("joiner")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                /> */}
                <ButtonGroup className="ml-auto">
                    <DataTableColumnToggle table={table} />

                    <Dialog open={openInviteDialog} onOpenChange={setOpenInviteDialog}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { createInvitationLink(); setOpenInviteDialog(true); }}>
                                <MailPlus /> Nouveau lien d'invitation
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-106">
                            <form>
                                <DialogHeader>
                                    <DialogTitle>Lien d'invitation</DialogTitle>
                                    <DialogDescription>
                                        Des que le client clique sur ce lien, il sera ajouté à votre projet.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 mb-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="link">Lien</Label>
                                        <Input id="link" name="link" disabled value={invitationLink || ""} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Annuler</Button>
                                    </DialogClose>
                                    <Button type="button" onClick={() => { navigator.clipboard.writeText(invitationLink || ""); }}>Copier le lien</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </ButtonGroup>

            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Aucun client dans ce projet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Précédent
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    )
}
