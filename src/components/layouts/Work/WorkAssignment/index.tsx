import React, { useEffect } from "react";
import WorkAssignmentForm from "./WorkAssignmentForm";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import Checkbox from "@/components/Checkbox";
import Loading from "@/components/Loading";
import {
    CalendarIcon,
    CheckCircleIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { useWorkAssignmentStore } from "@/stores/useWorkAssignmentStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { twMerge } from "tailwind-merge";
import {
    formatDate,
    getCurrentVietnamDate,
    getDayName,
    getWeekDates,
    isDateTodayOrFuture,
    isEmpty,
} from "@/utils";
import { ROLE, TEXT } from "@/constants";
import { StaffProps } from "@/types";

export default function WorkAssignment({
    staff,
    currentWeek,
}: {
    staff?: StaffProps;
    currentWeek?: Date;
}) {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { getAlert } = useAlertStore();
    const {
        isLoading,
        workAssignments,
        getWorkAssignments,
        updateWorkAssignment,
        deleteWorkAssignment,
    } = useWorkAssignmentStore();

    //** Variables */
    const weekDates = getWeekDates(currentWeek || getCurrentVietnamDate());

    //** Effects */
    useEffect(() => {
        workAssignments.length === 0 && getWorkAssignments();
    }, [getWorkAssignments, workAssignments.length]);

    //** Render */
    const renderAssignment = (date: Date) => {
        if (isEmpty(workAssignments)) {
            return TEXT.NO_ASSIGNMENT;
        }

        // Filter assignments for the specific date
        const assignmentsForDate = workAssignments.filter(assignment => {
            const assignmentDate = new Date(assignment.date);
            return formatDate(assignmentDate, "MM-DD-YYYY") === formatDate(date, "MM-DD-YYYY");
        });

        if (assignmentsForDate.length === 0) {
            return TEXT.NO_ASSIGNMENT;
        }

        return (
            <div className="space-y-1">
                {assignmentsForDate.map(assignment => (
                    <div key={assignment.id} className="relative bg-success-50 rounded-md p-2">
                        {isLoading && <Loading className="[&>div]:w-8 [&>div]:h-8" />}
                        <div className="flex justify-between items-baseline gap-x-2">
                            <Checkbox
                                size="md"
                                isSelected={assignment.isCompleted}
                                isDisabled={
                                    (staff?.id !== assignment?.staffId || assignment.isCompleted) &&
                                    profile.role !== ROLE.ADMIN
                                }
                                onChange={e => {
                                    if (
                                        formatDate(date, "YYYY-MM-DD") !==
                                        formatDate(getCurrentVietnamDate(), "YYYY-MM-DD")
                                    ) {
                                        return getAlert({
                                            isOpen: true,
                                            type: "error",
                                            duration: 3000,
                                            title: TEXT.ONLY_UPDATE_TODAY_WORK,
                                        });
                                    }

                                    updateWorkAssignment(assignment.id, {
                                        isCompleted: e.target.checked,
                                    });
                                }}
                            />

                            <div className="flex-1 space-y-2">
                                <div>
                                    <p
                                        className={twMerge(
                                            "text-base font-medium",
                                            assignment.isCompleted && "line-through",
                                        )}
                                    >
                                        {assignment.workTypeName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {assignment.description}
                                    </p>
                                </div>

                                <p className="text-base">{`${assignment.shiftName} - ${assignment.staffName}`}</p>

                                {assignment.isCompleted && assignment.updatedAt && (
                                    <div className="flex items-center gap-x-1 font-bold text-xs text-primary">
                                        <CheckCircleIcon className="w-5 h-5" />
                                        <p>{`${assignment.staffName} - ${formatDate(assignment.updatedAt, "HH:mm - DD/MM/YYYY")}`}</p>
                                    </div>
                                )}
                            </div>

                            {profile.role === ROLE.ADMIN && (
                                <>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        startContent={<PencilIcon className="w-4 h-4" />}
                                        isDisabled={assignment.isCompleted}
                                        onPress={() => {
                                            getModal({
                                                isOpen: true,
                                                modalHeader: TEXT.UPDATE(
                                                    `"${assignment.workTypeName}"`,
                                                ),
                                                modalBody: (
                                                    <WorkAssignmentForm
                                                        assignment={assignment}
                                                        date={date}
                                                    />
                                                ),
                                            });
                                        }}
                                    />

                                    <Button
                                        isIconOnly
                                        size="sm"
                                        startContent={<TrashIcon className="w-4 h-4" />}
                                        onPress={() => {
                                            getModal({
                                                isOpen: true,
                                                modalHeader: TEXT.DELETE,
                                                modalBody: (
                                                    <ConfirmModal
                                                        onConfirm={async () => {
                                                            await deleteWorkAssignment(
                                                                assignment.id,
                                                            );
                                                            getModal({ isOpen: false });
                                                        }}
                                                    />
                                                ),
                                            });
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {weekDates.map(date => {
                return (
                    <Card key={date.toISOString()} className="p-0">
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-t-md">
                            <div className="flex items-center gap-x-2 p-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{getDayName(date)}</span>
                                <h3 className="text-lg">{formatDate(date)}</h3>
                            </div>

                            {isDateTodayOrFuture(date) && profile.role === ROLE.ADMIN && (
                                <Button
                                    isIconOnly
                                    size="sm"
                                    startContent={<PlusIcon className="w-4 h-4" />}
                                    onPress={() => {
                                        getModal({
                                            isOpen: true,
                                            modalHeader: TEXT.ADD_NEW,
                                            modalBody: <WorkAssignmentForm date={date} />,
                                        });
                                    }}
                                />
                            )}
                        </div>

                        <div className="p-4 text-sm text-gray-500 border-t border-gray-200 rounded-md">
                            {renderAssignment(date)}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
