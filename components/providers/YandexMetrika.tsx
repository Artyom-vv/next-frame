"use client";

import Script from "next/script";
import {Suspense, useEffect, useRef} from "react";
import {usePathname, useSearchParams} from "next/navigation";
import {useCookieConsent} from "@/hooks/useCookieConsent";

const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "109883292";

declare global {
    interface Window {
        ym?: (counterId: number, method: string, ...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

function YandexMetrikaPageView({counterId}: { counterId: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isInitialPageView = useRef(true);

    useEffect(() => {
        if (isInitialPageView.current) {
            isInitialPageView.current = false;
            return;
        }

        window.ym?.(counterId, "hit", window.location.href);
    }, [counterId, pathname, searchParams]);

    return null;
}

export default function YandexMetrika() {
    const counterId = Number(YANDEX_METRIKA_ID);
    const consent = useCookieConsent();

    useEffect(() => {
        if (!Number.isFinite(counterId) || consent === "loading") {
            return;
        }

        const disableKey = `disableYaCounter${counterId}`;
        Reflect.set(window, disableKey, consent !== "accepted");

        if (consent === "necessary") {
            window.ym?.(counterId, "destruct");
        }
    }, [consent, counterId]);

    if (!Number.isFinite(counterId) || consent !== "accepted") {
        return null;
    }

    return (
        <>
            <Script id="yandex-metrika" strategy="afterInteractive">
                {`
                    (function(m,e,t,r,i,k,a){
                        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                        m[i].l=1*new Date();
                        for (var j = 0; j < document.scripts.length; j++) {
                            if (document.scripts[j].src === r) { return; }
                        }
                        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${counterId}', 'ym');

                    window.dataLayer = window.dataLayer || [];
                    ym(${counterId}, 'init', {
                        ssr: true,
                        webvisor: true,
                        clickmap: true,
                        ecommerce: 'dataLayer',
                        referrer: document.referrer,
                        url: location.href,
                        accurateTrackBounce: true,
                        trackLinks: true
                    });
                `}
            </Script>
            <noscript>
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Tracking pixel must stay in noscript markup. */}
                    <img
                        src={`https://mc.yandex.ru/watch/${counterId}`}
                        style={{position: "absolute", left: "-9999px"}}
                        alt=""
                    />
                </div>
            </noscript>
            <Suspense fallback={null}>
                <YandexMetrikaPageView counterId={counterId}/>
            </Suspense>
        </>
    );
}
