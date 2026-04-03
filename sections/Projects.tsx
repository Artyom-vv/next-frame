"use client";

import React, {useRef} from "react";
import Section from "@/components/layout/Section";
import {usePinnedScroll} from "@/hooks/usePinnedScroll";
import {useProjectsSliderAnimation} from "@/hooks/useProjectsSliderAnimation";
import {useGSAP} from "@gsap/react";
import {projectsSteps} from "@/data/projectsSteps";
import {useResponsiveSliderConfig} from "@/hooks/useResponsiveSliderConfig";
import {PROJECTS_SLIDER_CONFIG} from "@/config/projectsSliderConfig";
import ScrollTrigger from "gsap/ScrollTrigger";
import {useBreakpoint} from "@/hooks/useBreakpoint";
import {useShortScreen} from "@/hooks/useShortScreen";

const Projects = () => {
    const slidesRef = useRef<HTMLDivElement[]>([]);

    const {sizes, gap, animation, scrollPerStep, ready, breakpoint} =
        useResponsiveSliderConfig(PROJECTS_SLIDER_CONFIG);

    const {isBelow, isAtLeast, ready: bpReady} = useBreakpoint();
    const { isShortScreen, ready: shortReady } = useShortScreen();

    const isMobile = bpReady && shortReady
        ? isBelow("xl") || (isAtLeast("xl") && isShortScreen)
        : false;

    const {init, goTo, getSlideWidthByIndex} = useProjectsSliderAnimation({
        sizes,
        gap,
        animation,
        slidesRef,
    });

    const {wrapRef, currentIndex} = usePinnedScroll({
        count: projectsSteps.length,
        scrollPerStep,
        onSlideChange: (i) => {
            goTo(i);
        },
        enabled: !isMobile && bpReady && shortReady
    });

    useGSAP(() => {
        if (!ready || isMobile) return;
        init(sizes, gap);
    }, {scope: wrapRef, dependencies: [ready, breakpoint, isMobile]});

    const trackHeight = sizes.active.h + 80 + 16;

    return (
        <div ref={wrapRef} className="w-full">
            <Section
                title={
                    "продуманная архитектура, надежный конструктив и понятный бюджет без «сюрпризов» по ходу стройки"
                }
                subtitle="Наши проекты"
                id="projects"
                inverted
            >
                <div className="grid-responsive">
                    {/* DESKTOP: xl/2xl — слайдер */}
                    {!isMobile && (
                        <div className="col-start-3 col-span-10">
                            <div className="relative" style={{height: trackHeight}}>
                                {projectsSteps.map((step, i) => (
                                    <div
                                        key={step.id}
                                        ref={(el) => {
                                            if (el) slidesRef.current[i] = el;
                                        }}
                                        className="absolute top-0 left-0 flex flex-col gap-4"
                                    >
                                        <div
                                            className="flex flex-col gap-4"
                                            style={{
                                                width: getSlideWidthByIndex(
                                                    i,
                                                    currentIndex
                                                ),
                                            }}
                                        >
                                            <h3 className="text-gradation-100 truncate">
                                                {step.title}
                                            </h3>
                                            <div className="flex gap-4 text-gradation-200">
                                                {step.duration && (
                                                    <p className="text-l">
                                                        {step.duration}
                                                    </p>
                                                )}
                                                <p className="text-l">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>

                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            loading="eager"
                                            fetchPriority={i === 0 ? "high" : "low"}
                                            decoding="async"
                                            className="object-cover object-center"
                                            style={{
                                                width: sizes.active.w,
                                                height: sizes.active.h,
                                                transformOrigin: "left top",
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MOBILE: md и ниже — простая колонка */}
                    {isMobile && (
                        <div className="col-span-full flex flex-col gap-6">
                            {projectsSteps.map((step) => (
                                <div key={step.id} className="flex flex-col gap-4">
                                    {/* divider */}
                                    <div className="h-px bg-gradation-300"/>

                                    {/* текст */}
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-gradation-100">
                                            {step.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-gradation-200">
                                            {step.duration && (
                                                <>
                                                    <p className="text-l">{step.duration}</p>
                                                    <div className="h-[12px] bg-gradation-300 w-[1px]"></div>
                                                </>
                                            )}
                                            <p className="text-l">
                                                {step.description}
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

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
};

export default Projects;
