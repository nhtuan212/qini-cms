"use client";

import React from "react";
import {
    Modal as ModalNextUI,
    ModalContent,
    ModalHeader as ModalHeaderNextUI,
    ModalBody as ModalBodyNextUI,
    ModalFooter as ModalFooterNextUI,
    ModalProps,
    ModalHeaderProps,
    ModalBodyProps,
    ModalFooterProps,
} from "@heroui/react";

const Modal = ({ ...props }: ModalProps) => {
    return (
        <ModalNextUI
            size={props.size || "2xl"}
            radius={props.radius || "md"}
            placement={props.placement || "center"}
            classNames={{
                header: "sm:px-6 sm:py-6 px-2 py-2",
                body: "sm:px-6 px-2",
                wrapper: "p-4",
                // Ensure proper mobile display
                backdrop: "bg-black/50 backdrop-blur-sm",
            }}
            // Mobile-specific props
            scrollBehavior="inside"
            isDismissable={props.isDismissable !== false}
            {...props}
        >
            <ModalContent>{props.children}</ModalContent>
        </ModalNextUI>
    );
};

const ModalHeader = ({ ...props }: ModalHeaderProps) => {
    return <ModalHeaderNextUI {...props}>{props.children}</ModalHeaderNextUI>;
};

const ModalBody = ({ ...props }: ModalBodyProps) => {
    return <ModalBodyNextUI {...props}>{props.children}</ModalBodyNextUI>;
};

const ModalFooter = ({ ...props }: ModalFooterProps) => {
    return <ModalFooterNextUI {...props}>{props.children}</ModalFooterNextUI>;
};

export { Modal, ModalHeader, ModalBody, ModalFooter };
