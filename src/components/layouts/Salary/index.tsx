"use client";

import React from "react";
import SalaryCalculator from "./SalaryCalculator";
import SalaryPanel from "./SalaryPanel";
import { Tab, Tabs } from "@/components/Tab";
import { CalculatorIcon, DocumentChartBarIcon } from "@heroicons/react/24/outline";
import { TEXT } from "@/constants/text";

export default function Salary() {
    return (
        <Tabs>
            <Tab
                key="calculate-salary"
                title={
                    <div className="flex items-center gap-2">
                        <CalculatorIcon className="h-4 w-4" />
                        <span>{TEXT.CALCULATE_SALARY}</span>
                    </div>
                }
            >
                <SalaryCalculator />
            </Tab>
            <Tab
                key="payroll-month"
                title={
                    <div className="flex items-center gap-2">
                        <DocumentChartBarIcon className="h-4 w-4" />
                        <span>{TEXT.PAYROLL_MONTH}</span>
                    </div>
                }
            >
                <SalaryPanel />
            </Tab>
        </Tabs>
    );
}
