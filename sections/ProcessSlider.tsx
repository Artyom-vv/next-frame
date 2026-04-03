"use client";

import React, {useRef} from "react";
import {useGSAP} from "@gsap/react";
import Section from "@/components/layout/Section";
import {processSteps} from "@/data/processSteps";
import {usePinnedScroll} from "@/hooks/usePinnedScroll";
import {useSliderAnimation} from "@/hooks/useSliderAnimation";
import SliderTrack from "@/components/slider/SliderTrack";
import {useResponsiveSliderConfig} from "@/hooks/useResponsiveSliderConfig";
import {PROCESS_SLIDER_CONFIG} from "@/config/processSliderConfig";
import Button from "@/components/ui/Button";
import {scrollTo} from "@/utils/scrollTo";
import {useBreakpoint} from "@/hooks/useBreakpoint";
import {useShortScreen} from "@/hooks/useShortScreen";

const ProcessSlider = () => {
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const textsRef = useRef<HTMLDivElement[]>([]);

    const {sizes, gap, animation, scrollPerStep, ready, breakpoint} =
        useResponsiveSliderConfig(PROCESS_SLIDER_CONFIG);

    const {isBelow, isAtLeast, ready: bpReady} = useBreakpoint();
    const { isShortScreen, ready: shortReady } = useShortScreen();

    const isMobile = bpReady && shortReady
        ? isBelow("xl") || (isAtLeast("xl") && isShortScreen)
        : false;
    // const isMobile = bpReady ? isBelow("xl") : false;

    const {init, goTo} = useSliderAnimation({
        sizes,
        gap,
        animation,
        imagesRef,
        textsRef,
    });

    const {wrapRef, currentIndex} = usePinnedScroll({
        count: processSteps.length,
        scrollPerStep,
        onSlideChange: (i) => {
            goTo(i);
        },
        enabled: !isMobile && bpReady && shortReady,
    });

    const isLastStep = !isMobile && currentIndex === processSteps.length - 1;

    useGSAP(() => {
        if (!ready || isMobile) return;
        init(sizes, gap);
    }, {scope: wrapRef, dependencies: [ready, breakpoint, isMobile]});

    return (
        <div ref={wrapRef} className="w-full">
            <Section
                title={"Строим надёжные дома\nи крепкие отношения"}
                subtitle="Процесс работы"
                id="process"
            >
                <div className="grid-responsive">
                    {/* DESKTOP: xl/2xl — слайдер */}
                    {!isMobile && (
                        <>
                            <div className="xl:col-start-3 xl:col-span-8">
                                <SliderTrack height={sizes.active.h}>
                                    {processSteps.map((step, i) => (
                                        <img
                                            key={step.id}
                                            ref={(el) => {
                                                if (el) imagesRef.current[i] = el;
                                            }}
                                            src={step.image}
                                            alt={step.title}
                                            loading="eager"
                                            fetchPriority={i === 0 ? "high" : "low"}
                                            decoding="async"
                                            className="absolute top-0 left-0 object-cover object-center"
                                        />
                                    ))}
                                </SliderTrack>

                                <div className="relative mt-10 [@media(min-height:1000px)]:h-[220px]">
                                    {processSteps.map((step, i) => (
                                        <div
                                            key={step.id}
                                            ref={(el) => {
                                                if (el) textsRef.current[i] = el;
                                            }}
                                            className="absolute top-0 left-0 flex gap-10 [@media(min-height:1000px)]:h-full"
                                            style={{
                                                width: sizes.active.w,
                                                opacity: i === 0 ? 1 : 0,
                                            }}
                                        >
                                            <div className="flex flex-col justify-between shrink-0">
                                                <div className="flex flex-col gap-4">
                                                    <h3>{step.step}</h3>
                                                    <p className="text-l text-royal-green-800">
                                                        {step.price}
                                                    </p>
                                                </div>
                                                <p className="text-l text-royal-green-600">
                                                    {step.duration}
                                                </p>
                                            </div>
                                            <div className="flex flex-col justify-between gap-3">
                                                <div className="flex flex-col gap-4">
                                                    <h3>{step.title}</h3>
                                                    <p className="text-l text-gradation-600">
                                                        {step.description}
                                                    </p>
                                                </div>
                                                {step.promo && (
                                                    <p className="text-l text-royal-green-800">
                                                        {step.promo}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={scrollTo("contacts")}
                                className={`
                        col-start-11 col-span-2 h-23 bg-royal-green-800
                        flex items-center justify-center relative rounded-none
                        process-cta
                        ${isLastStep ? "process-cta-visible" : "process-cta-hidden"}
                    `}
                            >
                                Связаться
                            </Button>
                        </>
                    )}

                    {/* MOBILE: md и ниже — колонка без слайдера */}
                    {isMobile && (
                        <div className="col-span-full flex flex-col gap-6">
                            {processSteps.map((step) => (
                                <div key={step.id} className="flex flex-col gap-6">
                                    {/* divider сверху */}
                                    <div className="h-px bg-gradation-300"/>

                                    {/* текст */}
                                    <div className="flex flex-col gap-3">
                                        <h3>{step.step}</h3>
                                        <div className="flex items-center gap-3">
                                            <p className="text-l text-royal-green-800">
                                                {step.price}
                                            </p>
                                            <div className="h-[12px] bg-gradation-300 w-[1px]"></div>
                                            <p className="text-l text-royal-green-600">
                                                {step.duration}
                                            </p>
                                        </div>
                                    </div>
                                    {/* картинка */}
                                    <img
                                        src={step.image}
                                        alt={step.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full md:h-[348px] sm:h-[258px] h-[169px] object-cover object-center"
                                    />
                                    <div className="flex flex-col gap-3">
                                        <h3>{step.title}</h3>
                                        <p className="text-l text-gradation-600">
                                            {step.description}
                                        </p>
                                        {step.promo && (
                                            <p className="text-l text-royal-green-800">
                                                {step.promo}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <Button
                                onClick={scrollTo("contacts")}
                                className="xl:mt-0 sm:mt-6 w-full bg-royal-green-800"
                            >
                                Связаться
                            </Button>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
};

export default ProcessSlider;
