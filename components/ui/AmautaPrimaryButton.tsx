// components/ui/AmautaButton.tsx
'use client';

import {motion, useReducedMotion} from 'motion/react';
import {ReactNode} from 'react';

// ============================================================
// TIPOS
// ============================================================
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AmautaButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    onClick?: () => void;
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    fullWidth?: boolean;
}

// ============================================================
// COMPONENTE
// ============================================================
export function AmautaButton({
                                 variant = 'primary',
                                 size = 'md',
                                 onClick,
                                 children,
                                 icon,
                                 className = '',
                                 type = 'button',
                                 disabled = false,
                                 fullWidth = false,
                             }: AmautaButtonProps) {
    const shouldReduceMotion = useReducedMotion();

    // ----------------------------------------------------------
    // Estilos base
    // ----------------------------------------------------------
    const baseStyles = `
        relative self-center
        flex items-center justify-center gap-2
        rounded-xl
        font-bold
        transition-all duration-300
        cursor-pointer
        border-none
        disabled:opacity-50 disabled:cursor-not-allowed
         ${fullWidth ? 'w-full' : 'w-fit'}
    `;

    // ----------------------------------------------------------
    // Tamaños (con padding y tamaño de fuente)
    // ----------------------------------------------------------
    const sizeStyles: Record<ButtonSize, string> = {
        xs: 'min-h-8 px-3 py-1.5 text-xs',
        sm: 'min-h-10 px-5 py-2.5 text-sm',
        md: 'min-h-14 px-8 py-4 text-base',
        lg: 'min-h-16 px-10 py-5 text-lg',
        xl: 'min-h-18 px-12 py-6 text-xl',
    };

    // ----------------------------------------------------------
    // Variantes de estilo
    // ----------------------------------------------------------
    const variantStyles: Record<ButtonVariant, string> = {
        // 🔥 PRIMARIO – degradado naranja con brillo
        primary: `
            bg-gradient-to-r from-amauta-orange to-[#D95A1A]
            text-white
            shadow-[0_16px_36px_rgba(244,112,31,0.35)]
            hover:shadow-[0_24px_48px_rgba(244,112,31,0.45)]
            hover:scale-[1.02]
            active:scale-[0.98]
        `,

        // 🔥 SECUNDARIO – glass oscuro con azul (opción 1)
        secondary: `
            bg-amauta-blue-dark/10
            backdrop-blur-md
            border border-amauta-blue-dark/20
            text-amauta-blue-dark
            font-semibold
            shadow-[0_4px_12px_rgba(10,29,58,0.08)]
            hover:bg-amauta-blue-dark/15
            hover:border-amauta-blue-dark/30
            hover:shadow-[0_8px_24px_rgba(10,29,58,0.15)]
            active:scale-[0.98]
        `,

        // 🔥 TERCIARIO – glass cálido con naranja (opción 4)
        tertiary: `
            bg-amauta-orange-light/30
            backdrop-blur-md
            border-2 border-amauta-orange/30
            text-amauta-orange-dark
            shadow-[0_4px_16px_rgba(244,112,31,0.12)]
            hover:bg-amauta-orange-light/40
            hover:border-amauta-orange/50
            hover:shadow-[0_8px_28px_rgba(244,112,31,0.20)]
            active:scale-[0.98]
        `,

        // Fantasma
        ghost: `
            bg-transparent
            text-amauta-blue-dark
            hover:bg-amauta-blue/5
            active:scale-[0.98]
        `,

        // Contorno
        outline: `
            bg-transparent
            border-2 border-amauta-orange
            text-amauta-orange
            hover:bg-amauta-orange/10
            active:scale-[0.98]
        `,
    };

    // ----------------------------------------------------------
    // Efecto de brillo deslizante (solo para primary)
    // ----------------------------------------------------------
    const shineEffect = variant === 'primary' && (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
        >
                <span
                    className="
                     absolute inset-0 -translate-x-full
                    bg-linear-to-r from-transparent via-white/25 to-transparent
    transition-transform duration-700
    group-hover:translate-x-full
    "
                />
       </span>
    );

    // ----------------------------------------------------------
    // Render
    // ----------------------------------------------------------
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={shouldReduceMotion ? undefined : {y: variant === 'ghost' ? 0 : -3}}
            whileTap={shouldReduceMotion ? undefined : {scale: 0.97}}
            className={`
                group
                ${baseStyles}
                ${sizeStyles[size]}
                ${variantStyles[variant]}
                ${className}
            `}
        >
            {shineEffect}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
            {icon && (
                <span
                    className="
                        relative z-10
                        text-lg leading-none
                        transition-transform duration-300
                        group-hover:translate-x-1
                    "
                >
                    {icon}
                </span>
            )}
        </motion.button>
    );
}