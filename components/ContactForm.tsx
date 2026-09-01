'use client';

import 'react-international-phone/style.css';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import {normalizeFeedbackFields, type FeedbackErrors, validateFeedbackFields} from '@/lib/feedbackValidation';
import PhoneInputField from './ui/PhoneInputField';

// ─── Классы инпута ────────────────────────────────────────────────────────────

const inputClass = (hasError: boolean) =>
    `bg-white/[0.06] text-gradation-200 placeholder:text-gradation-500 text-m h-12 rounded-full px-6 outline-none border transition-colors w-full ${hasError
        ? 'border-red-500/60'
        : 'border-transparent focus:border-gradation-500'
    }`;

// ─── Форма ─────────────────────────────────────────────────────────────────────

const ContactForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [personalDataConsent, setPersonalDataConsent] = useState(false);
    const [errors, setErrors] = useState<FeedbackErrors>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'stored' | 'error'>('idle');

    const handleSubmit = async () => {
        if (!personalDataConsent) {
            return;
        }

        const normalizedFields = normalizeFeedbackFields({name, phone, email});
        const validationErrors = validateFeedbackFields(normalizedFields);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setName(normalizedFields.name);
        setPhone(normalizedFields.phone);
        setEmail(normalizedFields.email);
        setErrors({});
        setStatus('loading');

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(normalizedFields),
            });
            const data = await res.json().catch(() => null) as {delivery?: string} | null;
            setStatus(res.ok ? (data?.delivery === 'stored' ? 'stored' : 'done') : 'error');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="xl:col-start-8 xl:col-span-5 col-span-full md:gap-12 gap-6 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <p className="text-m text-gradation-200">~60 минут на обработку заявки</p>
                    <h2 className="text-gradation-100">Обратная связь</h2>
                </div>
                <div className="flex flex-col md:gap-4 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <input
                            className={inputClass(!!errors.name)}
                            placeholder="Как к Вам обращаться?"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                            }}
                        />
                        {errors.name && <p className="text-m text-red-400 px-4">{errors.name}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <PhoneInputField
                            value={phone}
                            onChange={(v) => {
                                setPhone(v);
                                if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                            }}
                            hasError={!!errors.phone}
                        />
                        {errors.phone && <p className="text-m text-red-400 px-4">{errors.phone}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <input
                            className={inputClass(!!errors.email)}
                            type="email"
                            placeholder="Электронная почта"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                            }}
                        />
                        {errors.email && <p className="text-m text-red-400 px-4">{errors.email}</p>}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 xl:h-[116px] xl:justify-between xl:gap-0">
                <Button
                    inverted
                    className="xl:self-start"
                    onClick={handleSubmit}
                    disabled={!personalDataConsent || status === 'loading' || status === 'done' || status === 'stored'}
                >
                    {status === 'loading'
                        ? 'Отправка...'
                        : status === 'done'
                            ? 'Заявка отправлена'
                            : status === 'stored'
                                ? 'Заявка принята'
                            : 'Отправить заявку'}
                </Button>
                {status === 'error' && (
                    <p className="text-m text-red-400">Не удалось отправить заявку. Попробуйте ещё раз.</p>
                )}
                {status === 'stored' && (
                    <p className="text-m text-gradation-200">Заявка сохранена. Мы свяжемся с вами в ближайшее время.</p>
                )}
                <label className="group flex cursor-pointer items-start gap-3 text-m text-gradation-300">
                    <input
                        type="checkbox"
                        checked={personalDataConsent}
                        onChange={(event) => setPersonalDataConsent(event.target.checked)}
                        className="peer sr-only"
                    />
                    <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border border-gradation-300 transition-colors group-hover:border-gradation-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sandy-orange-200 peer-checked:border-sandy-orange-200 peer-checked:bg-sandy-orange-200 peer-checked:[&>svg]:opacity-100"
                    >
                        <svg
                            viewBox="0 0 12 10"
                            className="h-2.5 w-3 fill-none stroke-royal-green-800 opacity-0 transition-opacity"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M1 5 4.25 8 11 1"/>
                        </svg>
                    </span>
                    <span>
                        Я согласен на обработку персональных данных
                    </span>
                </label>
            </div>
        </div>
    );
};

export default ContactForm;
