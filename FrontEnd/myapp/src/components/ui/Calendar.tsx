import React from "react";
import CalendarBase from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
export interface CalendarProps {
    value?: Date;
    onChange?: (date: Date) => void;
    className?: string;
    locale?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ value, onChange, className }) => {
    return (
        <div className={`rounded-lg bg-white p-4 text-black ${className || ""}`}>
            <CalendarBase
                locale="fr-FR"
                onChange={(value) => {
                    if (value && !Array.isArray(value)) {
                        onChange?.(value);
                    }
                }}

                value={value}
                nextLabel={<ChevronRight className="h-4 w-4" />}
                prevLabel={<ChevronLeft className="h-4 w-4" />}
                formatShortWeekday={(locale, date) =>
                    new Intl.DateTimeFormat(locale, { weekday: "short" })
                        .format(date)
                        .slice(0, 2)
                }
                tileClassName={({ view }) =>
                    view === "month" ? "rounded-full hover:bg-orange-100 transition text-sm" : ""
                }
            />
        </div>
    );
};

Calendar.displayName = "Calendar";
