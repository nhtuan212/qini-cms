import { useState } from "react";
import EmployeeDetail from "../../Employee/EmployeeDetail";
import RecordTimeSheet from "./RecordTimeSheet";
import Salary from "../../Salary";
import WorkAssignment from "../../Work/WorkAssignment";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { CalendarIcon, ClockIcon, CurrencyDollarIcon, GiftIcon } from "@heroicons/react/24/outline";
import { useEmployeeStore } from "@/stores/useEmployeeStore";
import { TEXT } from "@/constants";
import { EmployeeProps } from "@/types";

interface AttendanceNavigationProps {
    // Self check-in truyền employee = profile; luồng admin bỏ trống để lấy selectedEmployee.
    employee?: EmployeeProps;
}

export default function AttendanceNavigation({
    employee: employeeProp,
}: AttendanceNavigationProps) {
    //** States */
    const [activeTab, setActiveTab] = useState("record");

    //** Stores */
    const { selectedEmployee } = useEmployeeStore();

    //** Variables */
    const employee = employeeProp ?? selectedEmployee;

    if (!employee) return null;

    const tabs = [
        {
            label: TEXT.TIME_SHEET,
            icon: ClockIcon,
            value: "record",
            component: <RecordTimeSheet employee={employee} />,
        },
        {
            label: TEXT.TARGET,
            icon: GiftIcon,
            value: "detail",
            component: <EmployeeDetail employee={employee} />,
        },
        {
            label: TEXT.SALARY,
            icon: CurrencyDollarIcon,
            value: "salary",
            component: <Salary employee={employee} />,
        },
        {
            label: TEXT.WORK_ASSIGNMENT,
            icon: CalendarIcon,
            value: "work",
            component: <WorkAssignment employee={employee} />,
        },
    ];

    //** Render */
    return (
        <div className="flex flex-col sm:gap-y-4 gap-y-2">
            <Card className="sm:p-4 p-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {tabs.map(tab => (
                        <Button
                            key={tab.value}
                            className={
                                "h-auto flex-col flex-1 sm:py-4 py-2 sm:px-6 px-2 gap-1 font-medium"
                            }
                            variant={activeTab === tab.value ? "flat" : "light"}
                            size="lg"
                            onPress={() => setActiveTab(tab.value)}
                        >
                            <tab.icon className="sm:h-6 sm:w-6 h-4 w-4" />
                            <p className="sm:text-base text-sm">{tab.label}</p>
                        </Button>
                    ))}
                </div>
            </Card>

            <Card className="sm:p-4 p-2">
                {tabs.find(tab => tab.value === activeTab)?.component}
            </Card>
        </div>
    );
}
