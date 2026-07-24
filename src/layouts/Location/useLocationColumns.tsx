import LocationActions from "./LocationActions";
import Chip from "@/components/Chip";
import { TEXT } from "@/constants";
import { LocationProps } from "@/types";

//** Custom hook */
export default function useLocationColumns() {
    const columns = [
        {
            key: "name",
            name: TEXT.NAME,
            className: "min-w-28",
            content: (params: { row: LocationProps }) => (
                <span className="font-medium">{params.row.name}</span>
            ),
        },
        {
            key: "coordinates",
            name: TEXT.COORDINATES,
            className: "min-w-48",
            content: (params: { row: LocationProps }) => (
                <span className="text-small">{`${params.row.lat}, ${params.row.lng}`}</span>
            ),
        },
        {
            key: "radius",
            name: TEXT.RADIUS,
            className: "min-w-28",
            content: (params: { row: LocationProps }) => <span>{`${params.row.radius} m`}</span>,
        },
        {
            key: "status",
            name: TEXT.STATUS,
            className: "min-w-28",
            content: (params: { row: LocationProps }) => (
                <Chip color={params.row.isActive ? "success" : "default"}>
                    {params.row.isActive ? TEXT.ACTIVE : TEXT.IN_ACTIVE}
                </Chip>
            ),
        },
        {
            key: "actions",
            name: "",
            className: "min-w-24 justify-end",
            content: (params: { row: LocationProps }) => <LocationActions location={params.row} />,
        },
    ];

    return columns;
}
