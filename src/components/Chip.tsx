import { Chip as ChipHeroUI, ChipProps } from "@heroui/react";

export default function Chip(props: ChipProps) {
    return (
        <ChipHeroUI
            classNames={{ base: "px-2" }}
            color="primary"
            variant="solid"
            size="sm"
            {...props}
        >
            {props.children}
        </ChipHeroUI>
    );
}
