"use client";

import React from "react";
import { FieldErrors } from "react-hook-form";
import { ErrorMessage as ErrorMessageHook } from "@hookform/error-message";

export default function ErrorMessage({ errors, name }: { errors: FieldErrors; name: string }) {
    return (
        <ErrorMessageHook
            errors={errors}
            name={name}
            render={({ message }) => <p>{message}</p>}
            // render={({ messages }) =>
            //     messages &&
            //     Object.entries(messages).map(([type, message]) => <p key={type}>{message}</p>)
            // }
        />
    );
}
