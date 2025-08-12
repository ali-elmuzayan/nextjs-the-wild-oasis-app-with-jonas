import Image from "next/image";
import {EyeSlashIcon, PhotoIcon, UsersIcon} from "@heroicons/react/24/solid";
import {CabinType, getCabinById, getCabins} from "@/app/_lib/data-service";
import {notFound} from "next/navigation";
import TextExpander from "@/app/_components/TextExpander";

interface CabinPageProps {
    params: {cabinId: string}
}

export async function generateMetadata({params}: CabinPageProps) {
    const {name} = await  getCabinById(params.cabinId);
    return {title: `Cabin ${name}`}
}

export async function generateStaticParams() {
    const cabins : CabinType[] = await getCabins();
    const ids : {cabinId: string}[] = cabins.map(cabin => ({cabinId: String(cabin.id)}));
    return ids;
}

export default async function Page({params}: CabinPageProps) {
    const {cabinId} = params;

    if (!cabinId || isNaN(Number(cabinId))) notFound();

    let cabin;
    try {
        cabin = await getCabinById(cabinId);

        // check if it exist or not
        if (!cabin) notFound();
    } catch (error) {
        console.log(error);
        notFound();
    }
    const { name, description, image, discount, maxCapacity, regularPrice} = cabin;


    return (
        <div className="max-w-6xl mx-auto mt-8">
            <div
                className="grid grid-cols-1 lg:grid-cols-[3fr_4fr] gap-8 lg:gap-20 border border-primary-800 py-6 px-6 lg:py-3 lg:px-10 mb-24">

                {/* Image Section */}
                <div className="relative scale-100 lg:scale-[1.15] lg:-translate-x-3">
                    {image ? (
                        <Image
                            src={image}
                            alt={`${name} cabin interior`}
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full h-auto"
                            priority
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjBDMt7G5TCH1s7FNyqqt+nLXGmqc+mLY6sBBg=="
                        />
                    ) : (
                        <div className="w-full h-64 lg:h-96 bg-primary-800 rounded-lg flex items-center justify-center">
                            <div className="text-center text-primary-300">
                                <PhotoIcon className="h-16 w-16 mx-auto mb-2"/>
                                <p>No image available</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-accent-100 font-black text-4xl lg:text-7xl mb-5
                          lg:translate-x-[-254px] bg-primary-950 p-4 lg:p-6 lg:pb-1
                          lg:w-[150%] rounded lg:rounded-none">
                            Cabin {name}
                        </h1>

                        {description && (
                            <p className="text-primary-300 text-base lg:text-lg leading-relaxed">
                                <TextExpander>{description}</TextExpander>
                            </p>
                        )}
                    </div>

                    {/* Features List */}
                    <ul className="flex flex-col gap-4">
                        {maxCapacity && (
                            <li className="flex gap-3 items-center">
                                <UsersIcon className="h-5 w-5 text-primary-600 flex-shrink-0"/>
                                <span className="text-lg">
                  Up to <span className="font-bold">{maxCapacity}</span> guests
                </span>
                            </li>
                        )}

                        <li className="flex gap-3 items-center">
                            <EyeSlashIcon className="h-5 w-5 text-primary-600 flex-shrink-0"/>
                            <span className="text-lg">
                Privacy <span className="font-bold">100%</span> guaranteed
              </span>
                        </li>
                    </ul>

                    {/* Pricing Section */}
                    {regularPrice && (
                        <div className="bg-primary-900 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-primary-200">Price per night</span>
                                <div className="text-right">
                                    {discount > 0 && (
                                        <span className="text-primary-400 line-through text-sm">
                      ${regularPrice}
                    </span>
                                    )}
                                    <span className="text-accent-400 text-2xl font-bold ml-2">
                    ${discount > 0 ? regularPrice - discount : regularPrice}
                  </span>
                                    {discount > 0 && (
                                        <span className="text-green-400 text-sm ml-2">
                      Save ${discount}!
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
                <h2 className="text-3xl lg:text-5xl font-semibold mb-6">
                    Reserve today. Pay on arrival.
                </h2>
                <button
                    className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                    Check Availability
                </button>
            </div>
        </div>
    );
    // return (
    //     <div className="max-w-6xl mx-auto mt-8">
    //         <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24">
    //             <div className="relative scale-[1.15] -translate-x-3">
    //                 { image ? <Image src={image} alt={name} width={600} height={400} : '' />}
    //             </div>
    //             <div>
    //                 <h3  className="text-accent-100 font-black text-7xl mb-5 translate-x-[-254px]
    //                         bg-primary-950 p-6 pb-1 w-[150%]">
    //                     Cabin {name}
    //                 </h3>
    //                 <p className="text-primary-300 text-lg mb-10">
    //                     {description}
    //                 </p>
    //                 <ul className="flex flex-col gap-4 mb-7">
    //                     <li className="flex gap-3 itmes-center">
    //                         <UsersIcon className="h-5 w-5 text-primary-600" />
    //                     </li>
    //                     <li className="flex gap-3 items-center">
    //                         <EyeSlashIcon className="h-5 w-5 text-primary-600" />
    //                         <span className="text-lg">Privacy <span className="font-bold">100%</span> guaranteedd </span>
    //                     </li>
    //                 </ul>
    //             </div>
    //             <div>
    //                 <h2 className="text-5xl font-semibold text-center">
    //                     Resrve today. Pay on arrival
    //                 </h2>
    //             </div>
    //         </div>
    //     </div>
    // )
}

