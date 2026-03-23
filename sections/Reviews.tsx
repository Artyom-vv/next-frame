"use client";

import React, { useRef, useState } from "react";
import Section from "@/components/layout/Section";
import { useVerticalPinnedScroll } from "@/hooks/useVerticalPinnedScroll";
import gsap from "gsap";
import Review from "@/components/reviews/Review";
import { reviews } from "@/data/reviews";
import {useBreakpoint} from "@/hooks/useBreakpoint";
import {REVIEWS_LAYOUT_CONFIG} from "@/config/reviewLayout";

const Reviews = () => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const {breakpoint, ready: bpReady} = useBreakpoint();

    const {cardHeight, gap} =
        REVIEWS_LAYOUT_CONFIG[breakpoint ?? "md"];

    console.dir(REVIEWS_LAYOUT_CONFIG[breakpoint ?? "md"])

    const STEP = cardHeight + gap;

    const goTo = (next: number) => {
        setCurrentIndex(next);
        gsap.to(sliderRef.current, {
            y: -(next * STEP),
            duration: 0.6,
            ease: "back.out(0.8)",
            overwrite: "auto",
        });
    };

    const wrapRef = useVerticalPinnedScroll({
        count: reviews.length,
        scrollPerStep: 1000,
        onIndexChange: goTo,
        enabled: bpReady,
    });

    return (
        <div ref={wrapRef} className="w-full">
            <Section
                title={"ценим не только прочность\nдомов, но и спокойствие жильцов"}
                subtitle="Отзывы клиентов"
                id="reviews"
                className="h-[100vh]"
            >
                <div className="grow-1 overflow-hidden relative">
                    <div className="absolute z-1 top-0 left-0 w-full h-24 bg-[linear-gradient(to_top,rgba(255,255,255,0)_0%,#ffffff_100%)]" />
                    <div className="absolute z-1 bottom-0 left-0 w-full h-24 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,#ffffff_100%)]" />

                    <div className="grid-responsive">
                        <div className="divider bg-gradation-300 h-[1px] xl:col-start-3 xl:col-span-8 col-span-full relative z-10" />
                    </div>

                    <div className="col-span-full grow-1 flex justify-center">
                        <div
                            ref={sliderRef}
                            className="flex flex-col self-center xl:pt-[166px] pt-[104px] 2xl:gap-12 gap-8"
                        >
                            {reviews.map((review, i) => (
                                <Review
                                    key={review.id}
                                    data={review}
                                    selected={currentIndex === i}
                                    style={{ rotate: review.rotate }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default Reviews;

