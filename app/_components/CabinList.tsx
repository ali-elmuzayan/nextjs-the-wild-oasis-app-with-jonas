import {CabinType, getCabins} from "@/app/_lib/data-service";
import CabinCard from "@/app/_components/CabinCard";
import {FilterOption} from "@/app/_components/Filter";

export default async function CabinList({filter}: {filter: FilterOption['filter']}) {
    const cabins: CabinType[] = await getCabins();

    let displayedCabins: CabinType[] | null;
    switch (filter) {
        case "small":
            displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
            break;
        case "medium":
            displayedCabins = cabins.filter((cabin) => cabin.maxCapacity > 3 && cabin.maxCapacity <= 7);
            break;
        case "large":
            displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 7)
            break;
        default:
            displayedCabins = cabins;
    }

    if (cabins.length === 0) return null;
    return (

                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
                    {displayedCabins.map((cabin) => (
                        <CabinCard cabin={cabin} key={cabin.id} />
                    ))}
                </div>
    )
}