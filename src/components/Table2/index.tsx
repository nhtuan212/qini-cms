// "use client";

// import React, { useCallback, useMemo, useState } from "react";
// import {
//     Table as TableUI,
//     TableBody,
//     TableCell,
//     TableColumn,
//     TableHeader,
//     TableRow,
//     TableProps,
//     Pagination,
//     Input,
//     Dropdown,
//     DropdownTrigger,
//     DropdownMenu,
//     DropdownItem,
//     SortDescriptor,
// } from "@nextui-org/react";
// import { statusOptions } from "./apis";
// import Cells from "./Cells";
// import {
//     ChevronDownIcon,
//     MagnifyingGlassIcon,
//     PlusIcon,
// } from "@heroicons/react/24/outline";
// import Button from "../Button";

// interface TableComponentProps extends TableProps {
//     rows: any[];
//     columns: any[];
//     isSortable?: boolean;
//     isPagination?: boolean;
// }

// export default function Table({
//     rows,
//     columns,
//     isSortable,
//     isPagination,
//     ...props
// }: TableComponentProps) {
//     //** States */
//     // Pagination
//     const [page, setPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const pages = Math.ceil(rows.length / rowsPerPage);

//     // Search filter
//     const [filterValue, setFilterValue] = useState("");

//     // Status filter
//     const [statusFilter, setStatusFilter] = useState("all");

//     // Columns filter
//     const [visibleColumns, setVisibleColumns] = useState(
//         new Set(columns.map(column => column.id)),
//     );

//     const headerColumns = useMemo(() => {
//         return columns.filter(column =>
//             Array.from(visibleColumns).includes(column.id),
//         );
//     }, [columns, visibleColumns]);
//     //

//     const hasSearchFilter = Boolean(filterValue);
//     const filteredItems = useMemo(() => {
//         let filteredUsers = [...rows];

//         if (hasSearchFilter) {
//             filteredUsers = filteredUsers.filter(user =>
//                 user.name.toLowerCase().includes(filterValue.toLowerCase()),
//             );
//         }
//         if (
//             statusFilter !== "all" &&
//             Array.from(statusFilter).length !== statusOptions.length
//         ) {
//             filteredUsers = filteredUsers.filter(user =>
//                 Array.from(statusFilter).includes(user.status),
//             );
//         }

//         return filteredUsers;
//     }, [rows, hasSearchFilter, filterValue, statusFilter]);

//     const items = useMemo(() => {
//         const start = (page - 1) * rowsPerPage;
//         const end = start + rowsPerPage;

//         return isPagination ? filteredItems.slice(start, end) : filteredItems;
//     }, [page, filteredItems, rowsPerPage, isPagination]);

//     //** Sorting */
//     const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
//         column: "age",
//         direction: "ascending",
//     });

//     const sortedItems = useMemo(() => {
//         return [...items].sort((a: any, b: any) => {
//             const first = a[sortDescriptor.column!];
//             const second = b[sortDescriptor.column!];
//             const cmp = first < second ? -1 : first > second ? 1 : 0;
//             return sortDescriptor?.direction === "descending" ? -cmp : cmp;
//         });
//     }, [items, sortDescriptor]);

//     //** Filter */
//     const onSearchChange = useCallback((value: string) => {
//         if (value) {
//             setFilterValue(value);
//             setPage(1);
//         } else {
//             setFilterValue("");
//         }
//     }, []);

//     //** Rows per page */
//     const onRowsPerPageChange = useCallback((e: any) => {
//         setRowsPerPage(Number(e.target.value));
//         setPage(1);
//     }, []);

//     //** Top content */
//     const topContent = useMemo(() => {
//         return (
//             <div className="flex flex-col gap-4">
//                 <div className="flex justify-between gap-3 items-end">
//                     <Input
//                         isClearable
//                         classNames={{
//                             base: "w-full sm:max-w-[44%]",
//                             inputWrapper: "border-1",
//                         }}
//                         placeholder="Search by name..."
//                         size="sm"
//                         startContent={
//                             <MagnifyingGlassIcon className="w-6 text-default-300" />
//                         }
//                         value={filterValue}
//                         variant="bordered"
//                         onClear={() => setFilterValue("")}
//                         onValueChange={onSearchChange}
//                     />
//                     <div className="flex gap-3">
//                         <Dropdown>
//                             <DropdownTrigger className="hidden sm:flex">
//                                 <Button
//                                     endContent={
//                                         <ChevronDownIcon className="w-6 text-small" />
//                                     }
//                                     size="sm"
//                                     variant="flat"
//                                 >
//                                     Status
//                                 </Button>
//                             </DropdownTrigger>
//                             <DropdownMenu
//                                 disallowEmptySelection
//                                 closeOnSelect={false}
//                                 selectionMode="multiple"
//                                 selectedKeys={statusFilter}
//                                 onSelectionChange={setStatusFilter as any}
//                                 aria-label="Table Columns"
//                             >
//                                 {statusOptions.map(status => (
//                                     <DropdownItem
//                                         key={status.id}
//                                         className="capitalize"
//                                     >
//                                         {status.name}
//                                     </DropdownItem>
//                                 ))}
//                             </DropdownMenu>
//                         </Dropdown>
//                         <Dropdown>
//                             <DropdownTrigger className="hidden sm:flex">
//                                 <Button
//                                     endContent={
//                                         <ChevronDownIcon className="w-6 text-small" />
//                                     }
//                                     size="sm"
//                                     variant="flat"
//                                 >
//                                     Columns
//                                 </Button>
//                             </DropdownTrigger>
//                             <DropdownMenu
//                                 disallowEmptySelection
//                                 aria-label="Table Columns"
//                                 closeOnSelect={false}
//                                 selectedKeys={visibleColumns}
//                                 selectionMode="multiple"
//                                 onSelectionChange={setVisibleColumns as any}
//                             >
//                                 {columns.map(column => (
//                                     <DropdownItem
//                                         key={column.id}
//                                         className="capitalize"
//                                     >
//                                         {column.name}
//                                     </DropdownItem>
//                                 ))}
//                             </DropdownMenu>
//                         </Dropdown>
//                         <Button
//                             startContent={<PlusIcon className="w-5" />}
//                             size="sm"
//                         >
//                             Add New
//                         </Button>
//                     </div>
//                 </div>

//                 {/* {Row per page} */}
//                 {isPagination && (
//                     <div className="flex justify-end items-center">
//                         <label className="flex items-center text-default-400 text-small">
//                             <span className="mr-2">Rows per page:</span>
//                             <select
//                                 className="bg-blue-500 p-2 text-white rounded-md cursor-pointer"
//                                 onChange={onRowsPerPageChange}
//                             >
//                                 <option value="5">5</option>
//                                 <option value="10">10</option>
//                                 <option value="15">15</option>
//                             </select>
//                         </label>
//                     </div>
//                 )}
//             </div>
//         );
//     }, [
//         columns,
//         filterValue,
//         statusFilter,
//         visibleColumns,
//         onSearchChange,
//         onRowsPerPageChange,
//         isPagination,
//     ]);

//     //** Bottom content */
//     const buttonContent = useMemo(() => {
//         if (!isPagination) return null;

//         return (
//             pages > 0 && (
//                 <div className="flex w-full justify-center">
//                     <Pagination
//                         isCompact
//                         showControls
//                         showShadow
//                         color="primary"
//                         page={page}
//                         total={pages}
//                         onChange={page => setPage(page)}
//                     />
//                 </div>
//             )
//         );
//     }, [page, pages, isPagination]);

//     return (
//         <>
//             <TableUI
//                 topContent={topContent}
//                 bottomContent={buttonContent}
//                 //** Sorting */
//                 selectionMode={isSortable ? "multiple" : "none"}
//                 sortDescriptor={isSortable ? sortDescriptor : undefined}
//                 onSortChange={isSortable ? setSortDescriptor : undefined}
//                 //** Sorting */
//                 {...props}
//             >
//                 <TableHeader columns={headerColumns}>
//                     {column => (
//                         <TableColumn
//                             key={column.id}
//                             align={column.id === "actions" ? "center" : "start"}
//                             //** Sorting */
//                             allowsSorting={isSortable}
//                         >
//                             {column.name}
//                         </TableColumn>
//                     )}
//                 </TableHeader>

//                 <TableBody
//                     items={sortedItems}
//                     emptyContent={"No rows to display."}
//                 >
//                     {item => (
//                         <TableRow key={item.id}>
//                             {columnKey => (
//                                 <TableCell>
//                                     <Cells user={item} columnKey={columnKey} />
//                                 </TableCell>
//                             )}
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </TableUI>
//         </>
//     );
// }
