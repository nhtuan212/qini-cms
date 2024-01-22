import React from "react";
import {
    Modal as ModalUI,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalProps,
} from "@nextui-org/react";

interface Props extends ModalProps {
    size?: ModalProps["size"];
    radius?: ModalProps["radius"];
    children: React.ReactNode;
}

const Modal = ({ size = "md", radius = "sm", children, ...props }: Props) => {
    return (
        <ModalUI size={size} radius={radius} {...props}>
            <ModalContent>{children}</ModalContent>
        </ModalUI>
    );
};

const Header = ({ children }: { children: React.ReactNode }) => {
    return <ModalHeader className="flex flex-col gap-1">{children}</ModalHeader>;
};

const Body = ({ children }: { children: React.ReactNode }) => {
    return <ModalBody>{children}</ModalBody>;
};

const Footer = ({ children }: { children: React.ReactNode }) => {
    return <ModalFooter>{children}</ModalFooter>;
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
