"use client";

import React, {FC, HtmlHTMLAttributes} from "react";
import {cn} from "tailwind-variants";
import Image from "next/image";
import {ReviewData} from "@/data/reviews";

export type ReviewProps = HtmlHTMLAttributes<HTMLDivElement> & {
    data: ReviewData;
    selected?: boolean;
};

const Review: FC<ReviewProps> = ({data, selected = false, ...props}) => {

    return (
        <div
            {...props}
            className={cn(
                "2xl:p-10 p-6 px-4 flex 2xl:flex-row flex-col 2xl:gap-10 gap-6 shadow-[0_12px_24px_0_#0000000D,0_24px_48px_0_#0000000D,0_48px_96px_0_#0000000D] 2xl:w-210 xl:w-165 md:w-155 sm:w-115 w-75 max-2xl:!rotate-none relative z-0",
                selected ? "bg-white" : "bg-gradation-100",
                props.className
            )}
        >
            <div className="flex 2xl:flex-col flex-row gap-5 shrink-0">
                <Image width={160} height={160} src={data.image} alt={data.name} className="2xl:size-40 size-20"/>
                <div className="flex flex-col gap-[6px]">
                    <p className="text-l font-medium text-gradation-800">{data.name}</p>
                    <p className="text-m text-gradation-600">{data.location}</p>
                </div>
            </div>
            <div className="flex flex-col gap-2 text-l text-gradation-600">
                {data.paragraphs.map((text, i) => (
                    <p key={i}>{text}</p>
                ))}
            </div>
        </div>
    );
}

Review.displayName = "Review";
export default Review;
