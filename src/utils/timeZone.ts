import dayjs from "dayjs";

// Ho Chi Minh timezone constant
export const HO_CHI_MINH_TIMEZONE = "Asia/Ho_Chi_Minh";

// Common timezone utility functions
export const getCurrentVietnamDate = (): Date => {
    return dayjs.utc().tz(HO_CHI_MINH_TIMEZONE).toDate();
};

export const parseVietnamDate = (dateString: string, format: string = "DD/MM/YYYY"): Date => {
    const [day, month, year] = dateString.split(format.includes("/") ? "/" : "-");
    return dayjs
        .utc()
        .year(parseInt(year))
        .month(parseInt(month) - 1)
        .date(parseInt(day))
        .tz(HO_CHI_MINH_TIMEZONE)
        .toDate();
};

export const addDaysToVietnamDate = (date: Date, days: number): Date => {
    return dayjs.utc(date).tz(HO_CHI_MINH_TIMEZONE).add(days, "day").toDate();
};

export const subtractDaysFromVietnamDate = (date: Date, days: number): Date => {
    return dayjs.utc(date).tz(HO_CHI_MINH_TIMEZONE).subtract(days, "day").toDate();
};

export const convertToVietnamTimezone = (date: Date): Date => {
    return dayjs.utc(date).tz(HO_CHI_MINH_TIMEZONE).toDate();
};
