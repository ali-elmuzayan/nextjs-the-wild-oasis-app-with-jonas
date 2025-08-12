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