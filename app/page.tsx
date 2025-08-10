import Image from "next/image";
import Link from "next/link";
import bg from "@/public/bg.png"

export default function Page() {
    return (
        <div className="mt-24" >
            <Image fill src={bg} placeholder="blur" className="object-cover object-top"  alt="Mountains and forsts with two cabins"/>
            <div className={"relative z-10 text-center"} >
                <h1 className="text-8xl text-primary-50 mb-10 tracking-tight font-normal">
                    Welcome to paradise
                </h1>
                <Link href="/cabins" className="bg-accent-500 px-8 py-6 text-primary-900 text-lg font-semibold hover:bg-accent-6000 transition-all">
                    Explore Luxury cabins
                </Link>
            </div>
        </div>
    )
}