import React from 'react';
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-4 z-10" >
            <Image src="/logo.png" alt="logo" width={60} height={60} />
            <span className="text-xl font-semibold text-primary-100">The wild Oasis</span>
        </Link>
    );
};

export default Logo;
