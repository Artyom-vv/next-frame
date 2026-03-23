import {useEffect, useState} from "react";

export type BreakpointName = "xs" | "sm" | "md" | "xl" | "2xl";

type Breakpoints = Record<BreakpointName, number>;

const readBreakpointsFromCSS = (): Breakpoints | null => {
    if (typeof window === "undefined") return null;

    const style = getComputedStyle(document.documentElement);

    const read = (name: string, fallback: number): number => {
        const raw = style.getPropertyValue(name).trim();
        if (!raw) return fallback;

        // ожидаем значение в rem
        const remMatch = raw.match(/^([\d.]+)rem$/);
        if (remMatch) {
            const rem = parseFloat(remMatch[1]);
            return rem * parseFloat(
                getComputedStyle(document.documentElement).fontSize || "16"
            );
        }

        // px
        const pxMatch = raw.match(/^([\d.]+)px$/);
        if (pxMatch) {
            return parseFloat(pxMatch[1]);
        }

        // fallback, если формат не распознали
        return fallback;
    };

    return {
        xs: read("--breakpoint-xs", 320),
        sm: read("--breakpoint-sm", 480),
        md: read("--breakpoint-md", 640),
        xl: read("--breakpoint-xl", 1024),
        "2xl": read("--breakpoint-2xl", 1400),
    };
};

export const useBreakpoint = (defaultBreakpoint: BreakpointName = "md") => {
    const [current, setCurrent] = useState<BreakpointName>(defaultBreakpoint);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const cssBreakpoints = readBreakpointsFromCSS();
        if (!cssBreakpoints) return;

        const calc = () => {
            const width = window.innerWidth;

            let next: BreakpointName;
            if (width < cssBreakpoints.sm) next = "xs";
            else if (width < cssBreakpoints.md) next = "sm";
            else if (width < cssBreakpoints.xl) next = "md";
            else if (width < cssBreakpoints["2xl"]) next = "xl";
            else next = "2xl";

            setCurrent((prev) => (prev === next ? prev : next));
            setReady(true);
        };

        calc();

        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

    const isBelow = (bp: BreakpointName) => {
        const order: BreakpointName[] = ["xs", "sm", "md", "xl", "2xl"];
        return order.indexOf(current) < order.indexOf(bp);
    };

    const isAtLeast = (bp: BreakpointName) => {
        const order: BreakpointName[] = ["xs", "sm", "md", "xl", "2xl"];
        return order.indexOf(current) >= order.indexOf(bp);
    };

    return {breakpoint: current, isBelow, isAtLeast, ready};
};
