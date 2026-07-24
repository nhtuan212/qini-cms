"use client";

import useLocationColumns from "./useLocationColumns";
import LocationTopContent from "./LocationTopContent";
import Table from "@/components/Table";
import { useLocation } from "@/hooks";

export default function Location() {
    //** Queries */
    const { isLoading, locations } = useLocation();

    //** Render */
    return (
        <Table
            columns={useLocationColumns()}
            rows={locations}
            loading={isLoading}
            topContent={<LocationTopContent />}
        />
    );
}
