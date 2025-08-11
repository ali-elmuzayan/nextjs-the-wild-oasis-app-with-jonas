import Spinner from "@/app/_components/Spinner"

export default function Loading() {
    <div className="grid items-center justify-center">
        <Spinner/>
        <p className="text-primary-200 text-xl font-semibold">
            Loading Cabin data...
        </p>
    </div>
}