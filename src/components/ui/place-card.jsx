import * as React from "react";
import { cn } from "@/lib/utils";
import { MapPin, Globe, Phone, Accessibility } from 'lucide-react';
import { Button } from "@/components/ui/button";

function PlaceCard({
    className,
    header,
    location,
    categoryLabel,
    icon: Icon,
    isFavorite,
    website,
    phone,
    wheelchairAccessible,
    actionButtons
}) {

    const infoItems = [
        { condition: location, icon: MapPin, content: location, isLink: false },
        { condition: website, icon: Globe, content: website, isLink: true },
        { condition: phone, icon: Phone, content: phone, isLink: false }
    ];

    return (
        <div className={cn(
            "min-h-52 border flex flex-col rounded-lg p-6 hover:shadow-lg transition-shadow overflow-hidden relative",
            className,
            isFavorite ? "bg-linear-to-tr from-accent-50 via-transparent via-50% to-transparent" : ""
        )}>
            <div className="grow">
                {Icon && (
                    <Icon
                        className="absolute top-1 right-1 w-30 h-30 -z-10 opacity-10 text-accent-400"
                        strokeWidth={1.5}
                    />
                )}

                {categoryLabel && (
                    <div className="flex items-start gap-1 sm:gap-3 mb-3">
                        <h1 className="font-semibold text-lg grow">{header}</h1>
                        <div className="flex items-center gap-1 sm:gap-2">
                            {wheelchairAccessible && (
                                <div className="p-0.5 sm:p-1.5 rounded-lg bg-accent-100 text-accent-700">
                                    <Accessibility className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                </div>
                            )}
                            <span className="text-center px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full text-xs font-medium bg-white/50 text-accent-600 border border-accent-200">
                                {categoryLabel}
                            </span>
                        </div>
                    </div>
                )}

                {infoItems.map(({ condition, icon: InfoIcon, content, isLink }, index) =>
                    condition && (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-500 mb-1.5">
                            <InfoIcon className="w-4 h-4 shrink-0" />
                            {isLink ? (
                                <a href={content} target="_blank" rel="noopener noreferrer" className="hover:underline text-accent-600 line-clamp-1">
                                    {content}
                                </a>
                            ) : (
                                <span>{content}</span>
                            )}
                        </div>
                    )
                )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2 pt-4 border-t border-gray-100">
                {actionButtons.map(({ condition, onClickACB, variant, className, disabled, icon: BtnIcon, iconClass, label, labelClass }, index) =>
                    condition && (
                        <Button
                            key={index}
                            onClick={onClickACB}
                            variant={variant}
                            className={className}
                            disabled={disabled}>
                            {BtnIcon && <BtnIcon className={iconClass} />}
                            <span className={labelClass}>{label}</span>
                        </Button>
                    )
                )}
            </div>
        </div>
    );
}

export { PlaceCard };