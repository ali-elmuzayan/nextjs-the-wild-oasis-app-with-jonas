import {supabase} from "@/app/_lib/supabase";


export interface CabinType {
    id: string;
    name: string;
    description: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    image: string;
}

// get all cabins
export async function getCabins() :Promise<CabinType[]> {
    const {data, error} = await supabase.from('cabins').select('*').order('name');


    // for testing
    if (error) {
        console.log(error)
        throw new Error(error.message);
    }

    return data
}


export async function getCabinById(id: string) :Promise<CabinType> {
    const {data, error} = await supabase.from('cabins').select('*').eq('id', id).single();

    if (error) {
        console.log(error)
        throw new Error(error.message);
    }
    return data;
}


// get all the countriesl
export async function getCountries() {
    try {
        const res = await fetch(
            "https://restcountries.com/v2/all?fields=name,flag"
        );
        const countries = await res.json();
        return countries;
    } catch {
        throw new Error("Could not fetch countries");
    }
}