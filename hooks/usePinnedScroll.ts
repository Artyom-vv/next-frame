import {useEffect, useRef, useState} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useScrollStore} from "@/lib/scrollState";

gsap.registerPlugin(ScrollTrigger);

interface UsePinnedScrollOptions {
    count: number;
    scrollPerStep: number;
    onSlideChange: (next: number) => void;
    enabled?: boolean;
}

export const usePinnedScroll = ({
                                    count,
                                    scrollPerStep,
                                    onSlideChange,
                                    enabled = true,
                                }: UsePinnedScrollOptions) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const currentRef = useRef(0);
    const onSlideChangeRef = useRef(onSlideChange);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        onSlideChangeRef.current = onSlideChange;
    }, [onSlideChange]);

    useGSAP(
        () => {
            if (!enabled || !wrapRef.current) return;
            if (count <= 1) return;

            const wrap = wrapRef.current;
            const {setIsPinned} = useScrollStore.getState();

            const st = ScrollTrigger.create({
                trigger: wrap,
                pin: wrap,
                pinSpacing: true,
                start: "top top",
                end: `+=${(count - 1) * scrollPerStep}`,
                // anticipatePin: 1,
                snap: {
                    snapTo: 1 / (count - 1),
                    duration: {min: 0.3, max: 0.6},
                    ease: "power2.inOut",
                    delay: 0.05,
                },
                onEnter: () => setIsPinned(true),
                onLeave: () => setIsPinned(false),
                onEnterBack: () => setIsPinned(true),
                onLeaveBack: () => setIsPinned(false),
                onUpdate: (self) => {
                    const rawProgress = self.progress * (count - 1);
                    const next = Math.round(rawProgress);

                    if (next !== currentRef.current) {
                        currentRef.current = next;
                        setCurrentIndex(next);
                        onSlideChangeRef.current(next);
                    }
                },
            });
            return () => {
                st.kill();
                setIsPinned(false);
            };
        },
        {
            scope: wrapRef,
            dependencies: [count, scrollPerStep, enabled],
        }
    );


    return {wrapRef, currentIndex};
};
