"use client";

import { useEmployeeStore } from "@/stores/useEmployeeStore";
import ValidateEmployeePassword from "./ValidateEmployeePassword";
import EmployeeActions from "./EmployeeActions";
import EmployeeDetail from "./EmployeeDetail";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { ROLE, TEXT } from "@/constants";
import { formatDate } from "@/utils";
import { EmployeeProps } from "@/types";

export default function EmployeeData({ data }: { data: EmployeeProps[] }) {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();
    const { setSelectedEmployee } = useEmployeeStore();

    //** Render */
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-4 gap-2">
            {data &&
                data.length > 0 &&
                data?.map((employee: EmployeeProps) => {
                    return (
                        <Card
                            key={employee.id}
                            className="min-h-36 flex flex-col justify-between gap-4 bg-gray-50 p-3 border rounded-lg shadow-md"
                        >
                            <div className="flex justify-between items-center">
                                {employee.name}

                                {(profile.role === ROLE.ADMIN || profile.role === ROLE.REPORT) && (
                                    <EmployeeActions employee={employee} />
                                )}
                            </div>

                            <div className="flex items-center flex-wrap gap-2">
                                {(profile.role === ROLE.ADMIN || profile.role === ROLE.MANAGER) && (
                                    <Button
                                        variant="flat"
                                        color="success"
                                        className="flex-1"
                                        startContent={<BanknotesIcon className="w-5 h-5" />}
                                        onPress={() => {
                                            getModal({
                                                isOpen: true,
                                                size: "3xl",
                                                modalHeader: employee.name,
                                                modalBody: <EmployeeDetail employee={employee} />,
                                            });
                                        }}
                                    >
                                        {TEXT.TARGET}
                                    </Button>
                                )}

                                <Button
                                    variant="flat"
                                    className="flex-1"
                                    startContent={<ClockIcon className="w-5 h-5" />}
                                    onPress={() => {
                                        setSelectedEmployee(employee);

                                        getModal({
                                            isOpen: true,
                                            modalHeader: employee.name,
                                            modalBody: <ValidateEmployeePassword />,
                                        });
                                    }}
                                >
                                    {TEXT.TIME_SHEET}
                                </Button>
                            </div>

                            {!employee.isActive && (
                                <div className="bg-danger-50 p-2 border-l-3 border-danger-200 rounded-md">
                                    <div className="text-tiny text-gray-500">
                                        {`${TEXT.OFF_FROM}: ${formatDate(employee.updatedAt)}`}
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}
        </div>
    );
}
