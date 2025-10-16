"use client";

import React from "react";
import Button from "@/components/Button";
import { HomeIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { ROUTE } from "@/constants";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="max-w-md w-full space-y-4 text-center">
                <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto" />

                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    Sorry, we could not find the page you are looking for. It might have been moved,
                    deleted, or you entered the wrong URL.
                </p>

                <Button
                    className="w-full"
                    size="lg"
                    onClick={() => (window.location.href = ROUTE.HOME)}
                >
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Back to Home
                </Button>
            </div>
        </div>
    );
}
