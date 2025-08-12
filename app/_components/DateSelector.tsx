"use client";
import { isWithinInterval, differenceInDays, isBefore, isAfter } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import { useMemo, useCallback } from "react";
import "react-day-picker/dist/style.css";

// Type definitions
interface Settings {
    minBookingLength: number;
    maxBookingLength: number;
}

interface Cabin {
    id: number;
    name: string;
    regularPrice: number;
    discount: number;
}

interface BookedDate {
    startDate: Date;
    endDate: Date;
}

interface DateSelectorProps {
    settings: Settings;
    cabin: Cabin;
    bookedDates: BookedDate[];
}

// Hook type (you'll need to define this based on your actual hook)
interface UseReservationReturn {
    range: DateRange | undefined;
    setRange: (range: DateRange | undefined) => void;
    resetRange: () => void;
}

// Mock hook - replace with your actual implementation
function useReservation(): UseReservationReturn {
    // This should be your actual hook implementation
    throw new Error("useReservation hook not implemented");
}

// Utility function to check if a range overlaps with booked dates
function isRangeOverlappingBookedDates(
    range: DateRange,
    bookedDates: BookedDate[]
): boolean {
    if (!range.from || !range.to) return false;

    return bookedDates.some((booking) =>
        // Check if any part of the selected range overlaps with existing bookings
        !(isAfter(range.from!, booking.endDate) || isBefore(range.to!, booking.startDate))
    );
}

// Get all individual booked dates for DayPicker disabled prop
function getDisabledDates(bookedDates: BookedDate[]): Date[] {
    const disabledDates: Date[] = [];

    bookedDates.forEach((booking) => {
        const start = booking.startDate;
        const end = booking.endDate;
        const daysBetween = differenceInDays(end, start);

        for (let i = 0; i <= daysBetween; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            disabledDates.push(date);
        }
    });

    return disabledDates;
}

// Calculate price with proper validation
function calculatePricing(
    range: DateRange | undefined,
    regularPrice: number,
    discount: number
) {
    if (!range?.from || !range?.to) {
        return {
            numNights: 0,
            pricePerNight: regularPrice,
            discountedPrice: Math.max(0, regularPrice - discount),
            totalPrice: 0,
            hasDiscount: discount > 0
        };
    }

    const numNights = differenceInDays(range.to, range.from);
    const discountedPrice = Math.max(0, regularPrice - discount);
    const pricePerNight = discount > 0 ? discountedPrice : regularPrice;
    const totalPrice = pricePerNight * numNights;

    return {
        numNights,
        pricePerNight,
        discountedPrice,
        totalPrice,
        hasDiscount: discount > 0,
        originalPrice: regularPrice
    };
}

function DateSelector({ settings, cabin, bookedDates }: DateSelectorProps) {
    const { range, setRange, resetRange } = useReservation();

    const { minBookingLength, maxBookingLength } = settings;
    const { regularPrice, discount } = cabin;

    // Memoized disabled dates for performance
    const disabledDates = useMemo(() =>
            getDisabledDates(bookedDates),
        [bookedDates]
    );

    // Calculate pricing information
    const pricing = useMemo(() =>
            calculatePricing(range, regularPrice, discount),
        [range, regularPrice, discount]
    );

    // Validate and set date range
    const handleDateSelect = useCallback((selectedRange: DateRange | undefined) => {
        if (!selectedRange) {
            setRange(undefined);
            return;
        }

        // Check for overlaps with booked dates
        if (selectedRange.from && selectedRange.to) {
            const hasOverlap = isRangeOverlappingBookedDates(selectedRange, bookedDates);
            if (hasOverlap) {
                // Don't allow selection if it overlaps with booked dates
                console.warn("Selected dates overlap with existing bookings");
                return;
            }

            // Check if range meets minimum/maximum requirements
            const numNights = differenceInDays(selectedRange.to, selectedRange.from);
            if (numNights < minBookingLength) {
                console.warn(`Minimum booking length is ${minBookingLength} nights`);
                return;
            }
            if (numNights > maxBookingLength) {
                console.warn(`Maximum booking length is ${maxBookingLength} nights`);
                return;
            }
        }

        setRange(selectedRange);
    }, [setRange, bookedDates, minBookingLength, maxBookingLength]);

    // Format currency
    const formatPrice = (price: number): string =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);

    return (
        <div className="flex flex-col justify-between">
            <DayPicker
                className="pt-12 place-self-center"
                mode="range"
                onSelect={handleDateSelect}
                selected={range}
                disabled={[
                    { before: new Date() }, // Disable past dates
                    ...disabledDates // Disable booked dates
                ]}
                fromMonth={new Date()}
                fromDate={new Date()}
                toYear={new Date().getFullYear() + 5}
                captionLayout="dropdown"
                numberOfMonths={2}
                showOutsideDays={false}
                modifiers={{
                    booked: disabledDates
                }}
                modifiersStyles={{
                    booked: {
                        backgroundColor: '#ef4444',
                        color: 'white',
                        opacity: 0.7
                    }
                }}
            />

            <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
                <div className="flex items-baseline gap-6">
                    <div className="flex gap-2 items-baseline">
                        {pricing.hasDiscount ? (
                            <>
                <span className="text-2xl font-semibold">
                  {formatPrice(pricing.discountedPrice)}
                </span>
                                <span className="line-through font-semibold text-primary-700">
                  {/*{formatPrice(pricing.originalPrice)}*/}
                </span>
                            </>
                        ) : (
                            <span className="text-2xl font-semibold">
                {formatPrice(pricing.pricePerNight)}
              </span>
                        )}
                        <span className="text-sm text-primary-600">/night</span>
                    </div>

                    {pricing.numNights > 0 && (
                        <>
                            <div className="bg-accent-600 px-3 py-2 rounded">
                                <span className="text-lg">×</span>
                                <span className="text-xl font-semibold ml-1">
                  {pricing.numNights}
                </span>
                                <span className="text-sm ml-1">
                  {pricing.numNights === 1 ? 'night' : 'nights'}
                </span>
                            </div>

                            <div className="flex flex-col items-end">
                <span className="text-sm font-medium uppercase tracking-wide text-primary-600">
                  Total
                </span>
                                <span className="text-2xl font-bold">
                  {formatPrice(pricing.totalPrice)}
                </span>
                            </div>
                        </>
                    )}
                </div>

                {(range?.from || range?.to) && (
                    <button
                        type="button"
                        className="border border-primary-800 py-2 px-4 text-sm font-semibold hover:bg-primary-100 transition-colors rounded"
                        onClick={resetRange}
                        aria-label="Clear selected dates"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Validation messages */}
            {range?.from && range?.to && (
                <div className="px-8 py-2 text-sm">
                    {pricing.numNights < minBookingLength && (
                        <p className="text-red-600">
                            Minimum booking is {minBookingLength} nights
                        </p>
                    )}
                    {pricing.numNights > maxBookingLength && (
                        <p className="text-red-600">
                            Maximum booking is {maxBookingLength} nights
                        </p>
                    )}
                </div>
            )}
        </div>

    );
}

export default DateSelector;