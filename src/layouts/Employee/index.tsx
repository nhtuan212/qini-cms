"use client";

import { useMemo } from "react";
import EmployeeModal from "./EmployeeModal";
import EmployeeData from "./EmployeeData";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { ROLE, TEXT } from "@/constants";
import { Tab, Tabs } from "@/components/Tab";
import { useProfileStore } from "@/stores/useProfileStore";
import { useEmployee } from "@/hooks";

export default function Employee() {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** Queries */
    const { isLoading, employees } = useEmployee();

    //** Variables */
    const { activeEmployees, inactiveEmployees } = useMemo(() => {
        return {
            activeEmployees: employees.filter(employee => employee.isActive),
            inactiveEmployees: employees.filter(employee => !employee.isActive),
        };
    }, [employees]);

    const disabledKeys = useMemo(() => {
        if (profile.role !== ROLE.ADMIN) {
            return ["in-active"];
        }

        return [];
    }, [profile.role]);

    //** Render */
    return (
        <>
            {isLoading && <Loading />}

            <div className="flex justify-between items-center">
                <div className="title">{TEXT.EMPLOYEE}</div>
                {profile.role === ROLE.ADMIN && (
                    <Button
                        onPress={() =>
                            getModal({
                                isOpen: true,
                                size: "3xl",
                                modalHeader: TEXT.ADD_EMPLOYEE,
                                modalBody: <EmployeeModal />,
                            })
                        }
                    >
                        {TEXT.ADD_NEW}
                        <PlusIcon className="w-5 ml-2" />
                    </Button>
                )}
            </div>

            <Tabs className="mt-4" color="primary" disabledKeys={disabledKeys}>
                <Tab key="active" title={TEXT.ACTIVE}>
                    <EmployeeData data={activeEmployees} />
                </Tab>
                <Tab key="in-active" title={TEXT.IN_ACTIVE}>
                    <EmployeeData data={inactiveEmployees} />
                </Tab>
            </Tabs>
        </>
    );
}
