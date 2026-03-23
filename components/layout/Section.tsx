import React, {FC} from 'react';
import {cn} from "tailwind-variants";
import {formatText} from "@/utils/formatText";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    subtitle: string;
    title: string;
    inverted?: boolean;
}

const Section: FC<SectionProps> = ({children, title, subtitle, inverted, ...props}) => {
    return (
        <section
            {...props}
            className={cn(
                props.className,
                "2xl:py-24 sm:py-12 py-6 2xl:min-h-[996px] xl:min-h-[706px] xl:h-[100vh]",
                {
                    "bg-gradation-800": inverted
                }
            )}
        >
            <div className="container flex flex-col sm:gap-12 gap-6 h-full">
                <div className={cn(
                    "grid-responsive max-xl:gap-3"
                )}>
                    <p className={cn(
                        "xl:col-span-2 col-span-full text-l",
                        {
                            "text-gradation-300": inverted,
                            "text-gradation-600": !inverted,
                        }

                    )}>
                        {formatText(subtitle)}
                    </p>
                    <div className="xl:col-span-10 col-span-full flex flex-col gap-12">
                        <h2 className={cn({
                            "text-gradation-100": inverted,
                            "text-gradation-800": !inverted
                        })}>{formatText(title)}</h2>
                    </div>
                </div>
                {children}
            </div>

        </section>
    );
};

export default Section;
