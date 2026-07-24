import EmployeeActions from "./EmployeeActions";
import EmployeeCheckIn from "./EmployeeCheckIn";
import EmployeeTarget from "./EmployeeTarget";
import { ROLE, TEXT } from "@/constants";
import { formatDate } from "@/utils";
import { useProfileStore } from "@/stores/useProfileStore";
import { EmployeeProps } from "@/types";

//** Custom hook */
export default function useEmployeeColumns() {
    //** Stores */
    const { profile } = useProfileStore();

    //** Variables */
    const isAdmin = profile.role === ROLE.ADMIN;
    const canViewTarget = isAdmin || profile.role === ROLE.MANAGER;

    const columns = [
        {
            key: "name",
            name: TEXT.NAME,
            className: "min-w-32",
            content: (params: { row: EmployeeProps }) => (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        {isAdmin && params.row.isActive && (
                            <EmployeeCheckIn employee={params.row} />
                        )}
                        <span className="font-medium">{params.row.name}</span>
                    </div>
                    {!params.row.isActive && (
                        <span className="text-tiny text-gray-500">
                            {`${TEXT.OFF_FROM}: ${formatDate(params.row.updatedAt)}`}
                        </span>
                    )}
                </div>
            ),
        },
        ...(canViewTarget
            ? [
                  {
                      key: "target",
                      name: TEXT.TARGET,
                      className: "min-w-28",
                      content: (params: { row: EmployeeProps }) => (
                          <EmployeeTarget employee={params.row} />
                      ),
                  },
              ]
            : []),
        ...(isAdmin
            ? [
                  {
                      key: "actions",
                      name: "",
                      className: "min-w-32 justify-end",
                      content: (params: { row: EmployeeProps }) => (
                          <EmployeeActions employee={params.row} />
                      ),
                  },
              ]
            : []),
    ];

    return columns;
}
