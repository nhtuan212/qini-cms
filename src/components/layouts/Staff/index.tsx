"use client";

import React, { useEffect, useMemo, useState } from "react";
import StaffModal from "./StaffModal";
import StaffData from "./StaffData";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { ROLE, TEXT } from "@/constants";
import { Tab, Tabs } from "@/components/Tab";
import { useProfileStore } from "@/stores/useProfileStore";

export default function Staff() {
    //** Stores */
    const { profile } = useProfileStore();
    const { isLoading, staff, getStaff } = useStaffStore();
    const { getModal } = useModalStore();

    //** States */
    const [active, setActive] = useState(false);

    //** Variables */
    const data = useMemo(() => {
        return staff.filter(staff => staff.isActive === active);
    }, [staff, active]);

    const disabledKeys = useMemo(() => {
        if (profile.role !== ROLE.ADMIN) {
            return ["in-active"];
        }

        return [];
    }, [profile.role]);

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

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
                    <StaffData data={data} />
                </Tab>
                <Tab key="in-active" title={TEXT.IN_ACTIVE}>
                    <StaffData data={data} />
                </Tab>
            </Tabs>
        </>
    );
}
