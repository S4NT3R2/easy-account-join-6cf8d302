
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format, addDays, isSameDay } from "date-fns";
import { useState } from "react";

interface DateTimeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDateTime: Date | null;
  onSelectDateTime: (date: Date) => void;
}

const times = ["08:00", "09:00", "10:00", "11:00", "12:00"];

export function DateTimeSheet({ open, onOpenChange, selectedDateTime, onSelectDateTime }: DateTimeSheetProps) {
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(today);
  
  // Generate dates for the next 30 days
  const dates = Array.from({ length: 30 }, (_, i) => addDays(today, i));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] bg-[#1A1F2C] border-t border-border p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold text-white">Select Date & Time</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-6">
          {/* Dates */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {dates.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => {
                    const [hour, minute] = (selectedDateTime ? format(selectedDateTime, 'HH:mm') : '09:00').split(':');
                    const newDate = new Date(date);
                    newDate.setHours(parseInt(hour), parseInt(minute));
                    onSelectDateTime(newDate);
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[70px] ${
                    selectedDateTime && isSameDay(selectedDateTime, date)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div className="text-sm">{format(date, 'MMM')}</div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedDateTime && isSameDay(selectedDateTime, date)
                      ? "bg-primary text-secondary"
                      : "hover:bg-muted/30"
                  }`}>
                    {format(date, 'd')}
                  </div>
                  <div className="text-xs">{format(date, 'EEE')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Times */}
          <div className="overflow-x-auto">
            <div className="flex justify-between gap-4 px-4" style={{ minWidth: 'max-content' }}>
              {times.map((time) => {
                const [hour, minute] = time.split(':');
                const dateTime = selectedDateTime || new Date();
                const timeDate = new Date(dateTime);
                timeDate.setHours(parseInt(hour), parseInt(minute));

                return (
                  <button
                    key={time}
                    onClick={() => onSelectDateTime(timeDate)}
                    className={`px-6 py-2 rounded-full transition-all min-w-[100px] ${
                      selectedDateTime && format(selectedDateTime, 'HH:mm') === time
                        ? "bg-primary text-secondary"
                        : "text-muted-foreground hover:bg-muted/30"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
