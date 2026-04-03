import { useEffect, useState } from "react";

const SHORT_SCREEN_HEIGHT = 996;

export const useShortScreen = (threshold = SHORT_SCREEN_HEIGHT) => {
    const [isShortScreen, setIsShortScreen] = useState<boolean | null>(null);

    useEffect(() => {
        const check = () => setIsShortScreen(window.innerHeight < threshold);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [threshold]);

    return {
        isShortScreen: isShortScreen ?? false,
        ready: isShortScreen !== null,
    };
};