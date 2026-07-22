import { useState } from "react";
import EmployeeDetail from "../../Employee/EmployeeDetail";
import RecordTimeSheet from "./RecordTimeSheet";
import Salary from "../../Salary";
import WorkAssignment from "../../Work/WorkAssignment";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { CalendarIcon, ClockIcon, CurrencyDollarIcon, GiftIcon } from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { ROLE, TEXT } from "@/constants";
import { EmployeeProps } from "@/types";

export default function AttendanceNavigation({ employee }: { employee: EmployeeProps }) {
    //** Stores */
    const { profile } = useProfileStore();

    //** Variables */
    const isAdmin = profile?.role === ROLE.ADMIN;
    const isManager = profile?.role === ROLE.MANAGER;
    const isSelf = employee.userId === profile?.id;

    const tabs = [
        {
            label: TEXT.TIME_SHEET,
            icon: ClockIcon,
            value: "record",
            visible: isAdmin || isSelf,
            component: <RecordTimeSheet employee={employee} />,
        },
        {
            label: TEXT.TARGET,
            icon: GiftIcon,
            value: "detail",
            visible: isAdmin || isManager || isSelf,
            component: <EmployeeDetail employee={employee} />,
        },
        {
            label: TEXT.SALARY,
            icon: CurrencyDollarIcon,
            value: "salary",
            visible: isAdmin || isSelf,
            component: <Salary employee={employee} />,
        },
        {
            label: TEXT.WORK_ASSIGNMENT,
            icon: CalendarIcon,
            value: "work",
            visible: isAdmin,
            component: <WorkAssignment employee={employee} />,
        },
    ].filter(tab => tab.visible);

    //** States */
    const [activeTab, setActiveTab] = useState<string>();
    const active = tabs.find(tab => tab.value === activeTab) ?? tabs[0];

    if (!active) return null;

    //** Render */
    return (
        <div className="flex flex-col sm:gap-y-4 gap-y-2">
            {tabs.length > 1 && (
                <Card className="sm:p-4 p-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {tabs.map(tab => (
                            <Button
                                key={tab.value}
                                className="h-auto flex-col flex-1 sm:py-4 py-2 sm:px-6 px-2 gap-1 font-medium"
                                variant={active.value === tab.value ? "flat" : "light"}
                                size="lg"
                                onPress={() => setActiveTab(tab.value)}
                            >
                                <tab.icon className="sm:h-6 sm:w-6 h-4 w-4" />
                                <p className="sm:text-base text-sm">{tab.label}</p>
                            </Button>
                        ))}
                    </div>
                </Card>
            )}

            <Card className="sm:p-4 p-2">{active.component}</Card>
        </div>
    );
}
