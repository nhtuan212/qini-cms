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
        <ModalNextUI size={props.size || "2xl"} radius={props.radius || "md"} {...props}>
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
