"use client";

import { useMemo, useState } from "react";
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

    //** States */
    const [active, setActive] = useState(false);

    //** Variables */
    const employeeActive = useMemo(() => {
        return employees.filter(employee => employee.isActive === active);
    }, [employees, active]);

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
            </div>

            <Tabs
                className="mt-4"
                color="primary"
                disabledKeys={disabledKeys}
                onSelectionChange={key => setActive(key === "active")}
            >
                <Tab key="active" title={TEXT.ACTIVE}>
                    <EmployeeData data={employeeActive} />
                </Tab>
                <Tab key="in-active" title={TEXT.IN_ACTIVE}>
                    <EmployeeData data={employeeActive} />
                </Tab>
            </Tabs>
        </>
    );
}
