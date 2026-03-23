import type {BreakpointName} from "@/hooks/useBreakpoint";

type ReviewsLayoutConfig = {
    cardHeight: number;
    gap: number;
};

export const REVIEWS_LAYOUT_CONFIG: Record<BreakpointName, ReviewsLayoutConfig> = {
    xs:  { cardHeight: 560, gap: 32 },
    sm:  { cardHeight: 300, gap: 32 },
    md:  { cardHeight: 300, gap: 32 },
    xl:  { cardHeight: 328, gap: 48 },
    "2xl": { cardHeight: 328, gap: 48 },
};
