"use client";

import {useSyncExternalStore} from "react";

export const COOKIE_CONSENT_KEY = "next-frame-cookie-consent-v1";
export const COOKIE_CONSENT_EVENT = "next-frame-cookie-consent-change";
export const COOKIE_SETTINGS_OPEN_EVENT = "next-frame-cookie-settings-open";

export type CookieConsentValue = "accepted" | "necessary";
type CookieConsentSnapshot = CookieConsentValue | null | "loading";
let inMemoryConsent: CookieConsentValue | null = null;

function getSnapshot(): CookieConsentSnapshot {
    try {
        const value = localStorage.getItem(COOKIE_CONSENT_KEY);
        return value === "accepted" || value === "necessary" ? value : null;
    } catch {
        return inMemoryConsent;
    }
}

function getServerSnapshot(): CookieConsentSnapshot {
    return "loading";
}

function subscribe(onStoreChange: () => void) {
    const handleStorage = (event: StorageEvent) => {
        if (event.key === COOKIE_CONSENT_KEY) {
            onStoreChange();
        }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(COOKIE_CONSENT_EVENT, onStoreChange);

    return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(COOKIE_CONSENT_EVENT, onStoreChange);
    };
}

export function setCookieConsent(value: CookieConsentValue) {
    inMemoryConsent = value;

    try {
        localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
        // The choice still applies for the current page if storage is unavailable.
    }

    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

export function openCookieSettings() {
    window.dispatchEvent(new Event(COOKIE_SETTINGS_OPEN_EVENT));
}

export function useCookieConsent() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
