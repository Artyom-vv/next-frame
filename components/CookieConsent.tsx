"use client";

import Button from "@/components/ui/Button";
import {
    setCookieConsent,
    useCookieConsent,
    type CookieConsentValue,
} from "@/hooks/useCookieConsent";

export default function CookieConsent() {
    const consent = useCookieConsent();

    const saveConsent = (value: CookieConsentValue) => {
        setCookieConsent(value);
    };

    if (consent !== null) {
        return null;
    }

    return (
        <aside
            aria-label="Настройки файлов cookie"
            aria-live="polite"
            className="fixed inset-x-0 bottom-0 z-[100] px-2.5 pb-2.5 sm:px-5 sm:pb-5 pointer-events-none"
        >
            <div className="container !px-0">
                <div className="pointer-events-auto ml-auto max-w-[760px] overflow-hidden rounded-[28px] bg-royal-green-800 text-gradation-100 shadow-[0_18px_60px_rgba(29,32,32,0.35)] sm:rounded-[32px]">
                    <div className="flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:items-end md:gap-8">
                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                            <div className="flex items-center gap-2 text-sandy-orange-200">
                                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current"/>
                                <p className="text-s font-semibold uppercase tracking-[0.08em]">Cookie</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-gradation-100">Мы используем cookie</h3>
                                <p className="text-m max-w-[520px] text-gradation-200">
                                    Они помогают сайту работать стабильно и показывают, как им пользуются.
                                    Разрешите аналитику или оставьте только необходимые cookie.
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row md:flex-col">
                            <Button
                                type="button"
                                inverted
                                size="m"
                                className="w-full sm:w-auto"
                                onClick={() => saveConsent("accepted")}
                            >
                                Разрешить
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                inverted
                                size="m"
                                className="w-full sm:w-auto"
                                onClick={() => saveConsent("necessary")}
                            >
                                Только необходимые
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
