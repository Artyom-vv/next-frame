import React from "react";
import Image from "next/image";
import {formatText} from "@/utils/formatText";

interface GreenBannerProps {
    stat: string;
    description: string;
}

const GreenBanner = ({stat, description}: GreenBannerProps) => {
    return (
        <div className="relative bg-royal-green-800 2xl:h-[332px] xl:h-[236px] overflow-hidden">
            {/* Фоны для разных брейкпоинтов */}
            {/* mobile (по умолчанию) */}
            <Image
                src="/Banner-4.png"
                alt=""
                fill
                priority
                className="object-cover sm:hidden"
            />
            {/* sm–md */}
            <Image
                src="/Banner-3.png"
                alt=""
                fill
                priority
                className="object-cover hidden sm:block md:hidden"
            />
            {/* md–xl */}
            <Image
                src="/Banner-2.png"
                alt=""
                fill
                priority
                className="object-cover hidden md:block 2xl:hidden"
            />
            {/* 2xl+ */}
            <Image
                src="/Banner.png"
                alt=""
                fill
                priority
                className="object-cover hidden 2xl:block"
            />

            {/* Контент поверх фона */}
            <div className="relative py-6 md:py-12 2xl:py-24 container grid-responsive">
                <div className="flex flex-col xl:col-start-3 xl:col-span-5 md:col-span-6 col-span-4 gap-4">
                    <h1 className="text-gradation-100">{formatText(stat)}</h1>
                    <p className="text-l text-gradation-100">{formatText(description)}</p>
                </div>
            </div>
        </div>
    );
};

export default GreenBanner;
