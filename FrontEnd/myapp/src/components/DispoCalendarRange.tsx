import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Calendar } from "./ui/Calendar";
import { Button } from "./ui/Button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
type Props = {
    dateRange: { start: Date | null; end: Date | null };
    onDateChange: (range: { start: Date | null; end: Date | null }) => void;
};
export const DispoCalendarRange: React.FC<Props> = ({ dateRange, onDateChange }) => {
    const [selectingStart, setSelectingStart] = useState(true);
    const handleSelect = (date: Date) => {
        if (selectingStart) {
            onDateChange({ start: date, end: null });
            setSelectingStart(false);
        } else {
            if (dateRange.start && date < dateRange.start) {
                onDateChange({ start: date, end: null });
            } else {
                onDateChange({ start: dateRange.start, end: date });
            }
            setSelectingStart(true);
        }
    };
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {dateRange.start && dateRange.end ? "Plage de disponibilité" : "Sélectionnez une plage de dates"}
            </label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-[#E1E5E8]"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.start && dateRange.end ? (
                            `${format(dateRange.start, "PPP", { locale: fr })} → ${format(dateRange.end, "PPP", { locale: fr })}`
                        ) : (
                            <span>Choisir une période</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                        locale="fr-FR"
                        value={dateRange.start ?? undefined}
                        onChange={(value: Date) => handleSelect(value)}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};
