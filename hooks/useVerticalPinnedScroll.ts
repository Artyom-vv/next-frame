// hooks/useVerticalPinnedScroll.ts
import {useEffect, useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useScrollStore} from "@/lib/scrollState";

gsap.registerPlugin(ScrollTrigger);

interface UseVerticalPinnedScrollOptions {
    count: number;
    scrollPerStep: number;
    onIndexChange: (next: number) => void;
    enabled?: boolean;
}

export const useVerticalPinnedScroll = ({
                                            count,
                                            scrollPerStep,
                                            onIndexChange,
                                            enabled
                                        }: UseVerticalPinnedScrollOptions) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const currentRef = useRef(0);
    const onIndexChangeRef = useRef(onIndexChange);

    useEffect(() => {
        onIndexChangeRef.current = onIndexChange;
    }, [onIndexChange]);

    useGSAP(() => {
        if (!enabled || !wrapRef.current) return;
        if (count <= 1) return;

        const wrap = wrapRef.current;
        if (!wrap) return;

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
                    onIndexChangeRef.current(next);
                }
            },
        });

        return () => {
            st.kill();
            setIsPinned(false);
        };

    }, {
        scope: wrapRef,
        dependencies: [count, scrollPerStep, enabled]
    });

    return wrapRef;
};
