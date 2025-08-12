'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// Better type definition with proper capacity values
type FilterOption = {
    filter: 'all' | 'small' | 'medium' | 'large';
    text: string;
    label: string; // More descriptive for screen readers
}

// Improved filter configuration
const FILTER_OPTIONS: FilterOption[] = [
    { filter: 'all', text: 'All cabins', label: 'Show all cabins' },
    { filter: 'small', text: '1–3 guests', label: 'Cabins for 1 to 3 guests' },
    { filter: 'medium', text: '4–7 guests', label: 'Cabins for 4 to 7 guests' },
    { filter: 'large', text: '8–12 guests', label: 'Cabins for 8 to 12 guests' }
];

export default function Filter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Get active filter with proper typing
    const activeFilter = (searchParams.get("capacity") as FilterOption['filter']) ?? "all";

    // Memoized filter handler to prevent unnecessary re-renders
    const handleFilter = useCallback((filter: FilterOption['filter']) => {
        const params = new URLSearchParams(searchParams.toString());

        // Remove capacity param if selecting 'all', otherwise set it
        if (filter === 'all') {
            params.delete("capacity");
        } else {
            params.set("capacity", filter);
        }

        // Preserve other search parameters
        const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
        router.replace(newUrl, { scroll: false });
    }, [searchParams, pathname, router]);

    return (
        <div
            className="border border-primary-800 flex rounded-lg overflow-hidden"
            role="group"
            aria-label="Filter cabins by capacity"
        >
            {FILTER_OPTIONS.map((option) => (
                <FilterButton
                    key={option.filter}
                    filter={option.filter}
                    text={option.text}
                    label={option.label}
                    isActive={option.filter === activeFilter}
                    onClick={handleFilter}
                />
            ))}
        </div>
    );
}

// Improved Button component with better props and accessibility
type FilterButtonProps = {
    filter: FilterOption['filter'];
    text: string;
    label: string;
    isActive: boolean;
    onClick: (filter: FilterOption['filter']) => void;
};

function FilterButton({ filter, text, label, isActive, onClick }: FilterButtonProps) {
    return (
        <button
            type="button"
            className={`
        px-5 py-2 transition-colors duration-200 text-sm font-medium
        hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset
        ${isActive
                ? "bg-primary-700 text-primary-50"
                : "bg-transparent text-primary-200 hover:text-primary-50"
            }
        first:rounded-l-lg last:rounded-r-lg
      `}
            onClick={() => onClick(filter)}
            aria-pressed={isActive}
            aria-label={label}
            title={label}
        >
            {text}
        </button>
    );
}

// Optional: Export types for use in other components
export type { FilterOption };