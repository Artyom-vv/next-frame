"use client";

import {useEffect} from "react";
import Lenis from "lenis";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {setLenis} from "@/lib/lenisInstance"; // если используешь глобалку

export default function LenisProvider({children}: { children: React.ReactNode }) {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const isDesktop = window.innerWidth > 1024 && !("ontouchstart" in window);
        if (!isDesktop) {
            setLenis(null);
            return;
        }

        ScrollTrigger.config({
            ignoreMobileResize: true,
        });

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            syncTouch: false,
        });

        setLenis(lenis);

        lenis.on("scroll", ScrollTrigger.update);

        const ticker = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(ticker);
            setLenis(null);
        };
    }, []);

    return <>{children}</>;
}
