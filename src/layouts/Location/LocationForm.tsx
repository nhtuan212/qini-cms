"use client";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Input, { NumberInput } from "@/components/Input";
import Switch from "@/components/Switch";
import ErrorMessage from "@/components/ErrorMessage";
import { Controller, useForm } from "react-hook-form";
import { useModalStore } from "@/stores/useModalStore";
import { useLocation } from "@/hooks";
import { TEXT } from "@/constants";
import { LocationProps } from "@/types";

export type FormLocationProps = {
    name: string;
    lat: string;
    lng: string;
    radius: number;
    isActive: boolean;
};

const validateCoordinate = (value: string, max: number, message: string) => {
    if (!value.trim()) return `${TEXT.IS_REQUIRED}`;
    const num = Number(value);
    if (Number.isNaN(num)) return message;
    return num >= -max && num <= max ? true : message;
};

export default function LocationForm({ location }: { location?: LocationProps }) {
    //** Stores */
    const { getModal } = useModalStore();

    //** Queries */
    const { createLocation, updateLocation } = useLocation();

    //** React hook form */
    const defaultValues: FormLocationProps = {
        name: location?.name || "",
        lat: location?.lat != null ? String(location.lat) : "",
        lng: location?.lng != null ? String(location.lng) : "",
        radius: location?.radius ?? 120,
        isActive: location?.isActive ?? true,
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormLocationProps>({
        values: defaultValues,
        criteriaMode: "all",
    });

    //** Functions */
    const handleCloseModal = () => {
        getModal({ isOpen: false });
        reset();
    };

    const onSubmit = async (data: FormLocationProps) => {
        const params = {
            name: data.name,
            lat: Number(data.lat),
            lng: Number(data.lng),
            radius: data.radius,
            isActive: data.isActive,
        };

        if (location) {
            return updateLocation({ id: location.id, params }).then(handleCloseModal);
        }

        return createLocation(params).then(handleCloseModal);
    };

    //** Render */
    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Card className="border p-3 space-y-4">
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: `${TEXT.LOCATION_NAME} ${TEXT.IS_REQUIRED}` }}
                    render={({ field }) => (
                        <Input
                            label={TEXT.LOCATION_NAME}
                            placeholder={TEXT.ENTER_LOCATION_NAME}
                            {...field}
                            isInvalid={!!errors.name}
                            errorMessage={<ErrorMessage errors={errors} name="name" />}
                        />
                    )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                    <Controller
                        name="lat"
                        control={control}
                        rules={{
                            validate: value => validateCoordinate(value, 90, TEXT.LATITUDE_INVALID),
                        }}
                        render={({ field }) => (
                            <Input
                                label={TEXT.LATITUDE}
                                placeholder="10.859221386956039"
                                inputMode="decimal"
                                {...field}
                                isInvalid={!!errors.lat}
                                errorMessage={<ErrorMessage errors={errors} name="lat" />}
                            />
                        )}
                    />

                    <Controller
                        name="lng"
                        control={control}
                        rules={{
                            validate: value =>
                                validateCoordinate(value, 180, TEXT.LONGITUDE_INVALID),
                        }}
                        render={({ field }) => (
                            <Input
                                label={TEXT.LONGITUDE}
                                placeholder="106.629664"
                                inputMode="decimal"
                                {...field}
                                isInvalid={!!errors.lng}
                                errorMessage={<ErrorMessage errors={errors} name="lng" />}
                            />
                        )}
                    />
                </div>

                <Controller
                    name="radius"
                    control={control}
                    rules={{
                        validate: value =>
                            value && value > 0 ? true : `${TEXT.RADIUS} ${TEXT.IS_REQUIRED_MIN}`,
                    }}
                    render={({ field }) => (
                        <NumberInput
                            label={TEXT.RADIUS}
                            value={field.value}
                            minValue={0}
                            formatOptions={{ maximumFractionDigits: 0, useGrouping: false }}
                            isInvalid={!!errors.radius}
                            errorMessage={<ErrorMessage errors={errors} name="radius" />}
                            onValueChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                        <Switch isSelected={field.value} onValueChange={field.onChange}>
                            {TEXT.ACTIVE}
                        </Switch>
                    )}
                />
            </Card>

            <div className="flex flex-row-reverse gap-2">
                <Button type="submit">{TEXT.SAVE}</Button>
                <Button
                    className="bg-white text-default-900 ring-1 ring-inset ring-gray-300"
                    onPress={handleCloseModal}
                >
                    {TEXT.CANCEL}
                </Button>
            </div>
        </form>
    );
}
