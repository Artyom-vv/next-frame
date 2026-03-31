"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Section from "@/components/layout/Section";
import { useVerticalPinnedScroll } from "@/hooks/useVerticalPinnedScroll";
import gsap from "gsap";
import Review from "@/components/reviews/Review";
import { reviews } from "@/data/reviews";
import { useBreakpoint } from "@/hooks/useBreakpoint";
const SAFE_TOP_BY_BP = {
    base: 48,
    xl: 48,
    "2xl": 166,
} as const;

const Reviews = () => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const offsetsRef = useRef<number[]>([]);
    const centeredBaseRef = useRef(0);
    const currentIndexRef = useRef(0);

    const [currentIndex, setCurrentIndex] = useState(0);
    const { ready: bpReady, breakpoint } = useBreakpoint();

   const getSafeTop = () =>
    breakpoint === "xl" || breakpoint === "2xl" ? SAFE_TOP_BY_BP[breakpoint] : SAFE_TOP_BY_BP.base;

    const getYForIndex = (index: number) => {
        if (index <= 0) return getSafeTop();

        const offset = offsetsRef.current[index] ?? 0;
        return centeredBaseRef.current - offset;
    };

    useLayoutEffect(() => {
        const measure = () => {
            const viewport = viewportRef.current;
            const slider = sliderRef.current;
            const firstCard = cardRefs.current[0];

            if (!viewport || !slider || !firstCard) return;

            const firstOffset = firstCard.offsetTop;
            const safeTop = getSafeTop();

            offsetsRef.current = cardRefs.current.map((card) => {
                if (!card) return 0;
                return card.offsetTop - firstOffset;
            });

            const viewportHeight = viewport.clientHeight;
            const firstCardHeight = firstCard.offsetHeight;
            const centeredTop = (viewportHeight - firstCardHeight) / 2;

            centeredBaseRef.current = Math.max(safeTop, centeredTop);

            gsap.killTweensOf(slider);
            gsap.set(slider, {
                y: getYForIndex(currentIndexRef.current),
            });
        };

        measure();
        window.addEventListener("resize", measure);

        return () => {
            window.removeEventListener("resize", measure);
        };
    }, [breakpoint]);

    const goTo = (next: number) => {
        if (next === currentIndexRef.current) return;

        currentIndexRef.current = next;
        setCurrentIndex(next);

        const slider = sliderRef.current;
        if (!slider) return;

        gsap.killTweensOf(slider);
        gsap.to(slider, {
            y: getYForIndex(next),
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
                <div
                    ref={viewportRef}
                    className="grow-1 overflow-hidden relative h-full"
                >
                    <div className="absolute z-1 top-0 left-0 w-full h-24 bg-[linear-gradient(to_top,rgba(255,255,255,0)_0%,#ffffff_100%)]" />
                    <div className="absolute z-1 bottom-0 left-0 w-full h-24 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,#ffffff_100%)]" />

                    <div className="grid-responsive">
                        <div className="divider bg-gradation-300 h-[1px] xl:col-start-3 xl:col-span-8 col-span-full relative z-10" />
                    </div>

                    <div className="col-span-full grow-1 flex justify-center h-full">
                        <div
                            ref={sliderRef}
                            className="flex flex-col self-start gap-8 2xl:gap-12 will-change-transform"
                        >
                            {reviews.map((review, i) => (
                                <div
                                    key={review.id}
                                    ref={(el) => {
                                        cardRefs.current[i] = el;
                                    }}
                                >
                                    <Review
                                        data={review}
                                        selected={currentIndex === i}
                                        style={{ rotate: review.rotate }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default Reviews;