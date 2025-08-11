import {supabase} from "@/app/_lib/supabase";

// get all cabins
export async function getCabins() {
    const {data, error} = await supabase.from('cabins').select('*').order('name');

    if (error) {
        console.log(error)
        throw new Error(error.message);
    }

    return data
}