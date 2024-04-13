"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type ModalProps = {
    children: React.ReactNode;
    open: boolean;
    isCloseIcon?: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    radius?: "sm" | "md" | "lg";
    onClose?: () => void;
};

const Modal = ({ ...props }: ModalProps) => {
    //** Destructuring */
    const { children, open, isCloseIcon = true, size = "md", radius = "md", onClose } = props;

    //** States */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    //** Functions */
    const handleClose = () => {
        typeof onClose === "function" && onClose();
        setIsModalOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
    };

    const backDropHandler = (e: Event) => {
        if (ref?.current?.contains(e.target as HTMLElement) === false) {
            handleClose();
        }
    };

    //** Effects */
    useEffect(() => {
        // Handle openModal
        setIsModalOpen(open);
    }, [open, setIsModalOpen]);

    useEffect(() => {
        // Handle keydown
        window.addEventListener("keydown", handleKeyDown);

        // setTimeout in order to prevent the eventListener to be attached before the modal is open.
        setTimeout(() => {
            window.addEventListener("mousedown", backDropHandler);
        });

        return () => {
            // Handle keydown
            window.addEventListener("keydown", handleKeyDown);

            // remove the event listener when the modal is closed
            window.removeEventListener("mousedown", backDropHandler);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={ref}
                className={clsx(
                    "relative w-full flex flex-col justify-between gap-2 bg-white p-4 rounded-lg",
                    "animate-zoomIn",

                    // Size
                    size === "xs" && "max-w-xs",
                    size === "sm" && "max-w-sm",
                    size === "md" && "max-w-md",
                    size === "lg" && "max-w-lg",
                    size === "xl" && "max-w-xl",
                    size === "2xl" && "max-w-2xl",
                    size === "3xl" && "max-w-3xl",
                    size === "4xl" && "max-w-4xl",
                    size === "5xl" && "max-w-5xl",
                    size === "full" && "max-w-full h-full rounded-none",

                    // Radius
                    radius === "sm" && "rounded-sm",
                    radius === "md" && "rounded-md",
                    radius === "lg" && "rounded-lg",
                )}
                {...props}
            >
                {isCloseIcon && (
                    <button className="absolute top-4 right-4" onClick={handleClose}>
                        <svg
                            aria-hidden="true"
                            fill="none"
                            focusable="false"
                            height="1em"
                            role="presentation"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="1em"
                        >
                            <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                    </button>
                )}

                {children}
            </div>
        </div>
    );
};

const Header = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={clsx("text-lg font-bold py-2", className)}>{children}</div>;
};

const Body = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={clsx("flex-1 py-2", className)}>{children}</div>;
};

const Footer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={clsx("flex justify-end gap-2 py-2", className)}>{children}</div>;
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;

// import React from "react";
// import {
//     Modal as ModalUI,
//     ModalBody,
//     ModalContent,
//     ModalFooter,
//     ModalHeader,
//     ModalProps,
// } from "@nextui-org/react";

// interface Props extends ModalProps {
//     size?: ModalProps["size"];
//     radius?: ModalProps["radius"];
//     children: React.ReactNode;
// }

// const Modal = ({ size = "md", radius = "sm", children, ...props }: Props) => {
//     return (
//         <ModalUI size={size} radius={radius} {...props}>
//             <ModalContent>{children}</ModalContent>
//         </ModalUI>
//     );
// };

// const Header = ({ children }: { children: React.ReactNode }) => {
//     return <ModalHeader className="flex flex-col gap-1">{children}</ModalHeader>;
// };

// const Body = ({ children }: { children: React.ReactNode }) => {
//     return <ModalBody>{children}</ModalBody>;
// };

// const Footer = ({ children }: { children: React.ReactNode }) => {
//     return <ModalFooter className="items-center">{children}</ModalFooter>;
// };

// Modal.Header = Header;
// Modal.Body = Body;
// Modal.Footer = Footer;

// export default Modal;
