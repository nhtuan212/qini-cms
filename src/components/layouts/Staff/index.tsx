"use client";

import React, { useMemo, useState } from "react";
import StaffModal from "./StaffModal";
import StaffData from "./StaffData";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { ROLE, TEXT } from "@/constants";
import { Tab, Tabs } from "@/components/Tab";
import { useProfileStore } from "@/stores/useProfileStore";
import { useStaff } from "@/hooks";

export default function Staff() {
    //** Stores */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** Queries */
    const { isLoading, staffs } = useStaff();

    //** States */
    const [active, setActive] = useState(false);

    //** Variables */
    const staffActive = useMemo(() => {
        return staffs.filter(staff => staff.isActive === active);
    }, [staffs, active]);

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
                <div className="title">{TEXT.STAFF}</div>
                <Button
                    onPress={() =>
                        getModal({
                            isOpen: true,
                            size: "3xl",
                            modalHeader: TEXT.ADD_STAFF,
                            modalBody: <StaffModal />,
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
                    <StaffData data={staffActive} />
                </Tab>
                <Tab key="in-active" title={TEXT.IN_ACTIVE}>
                    <StaffData data={staffActive} />
                </Tab>
            </Tabs>
        </>
    );
}
