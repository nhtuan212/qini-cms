import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";

// export default function Button({
//     className,
//     children,
//     type = "button",
//     ...props
// }: ButtonHTMLAttributes<HTMLButtonElement>) {
//     return (
//         <button className={clsx("button", className)} type={type} {...props}>
//             {children}
//         </button>
//     );
// }

const Button = React.forwardRef(
    (
        {
            className,
            children,
            type = "button",
            ...props
        }: ButtonHTMLAttributes<HTMLButtonElement>,
        ref: React.ForwardedRef<HTMLButtonElement>,
    ) => {
        return (
            <button
                ref={ref}
                className={clsx("button", className)}
                type={type}
                {...props}
            >
                {children}
            </button>
        );
    },
);

export default Button;
