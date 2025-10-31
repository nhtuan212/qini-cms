import React from "react";
import {
    DrawerBody as DrawerBodyNextUI,
    DrawerHeader as DrawerHeaderNextUI,
    DrawerFooter as DrawerFooterNextUI,
    Drawer as DrawerNextUI,
    DrawerProps,
    DrawerHeaderProps,
    DrawerBodyProps,
    DrawerFooterProps,
    DrawerContent,
} from "@heroui/react";

const Drawer = ({ ...props }: DrawerProps) => {
    return (
        <DrawerNextUI radius={props.radius || "md"} {...props}>
            <DrawerContent>{props.children}</DrawerContent>
        </DrawerNextUI>
    );
};

const DrawerHeader = ({ ...props }: DrawerHeaderProps) => {
    return <DrawerHeaderNextUI {...props}>{props.children}</DrawerHeaderNextUI>;
};

const DrawerBody = ({ ...props }: DrawerBodyProps) => {
    return <DrawerBodyNextUI {...props}>{props.children}</DrawerBodyNextUI>;
};

const DrawerFooter = ({ ...props }: DrawerFooterProps) => {
    return <DrawerFooterNextUI {...props}>{props.children}</DrawerFooterNextUI>;
};

export { Drawer, DrawerHeader, DrawerBody, DrawerFooter };
