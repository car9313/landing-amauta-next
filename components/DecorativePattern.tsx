'use client';

interface DecorativePatternProps {
    variant?: 'curves' | 'dots' | 'mesh';
    className?: string;
    opacity?: number;
}

export function DecorativePattern({
                                      variant = 'curves',
                                      className = '',
                                      opacity = 0.08,
                                  }: DecorativePatternProps) {
    if (variant === 'curves') {
        return (
            <svg
                className={className}
                style={{opacity}}
                width="100%"
                height="100%"
                viewBox="0 0 1000 300"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M-20 60 C 150 130, 350 10, 600 80 S 850 30, 1020 90"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M-20 140 C 150 210, 350 90, 600 160 S 850 110, 1020 170"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M-20 20 C 150 90, 350 -30, 600 40 S 850 -10, 1020 50"
                    stroke="currentColor"
                    strokeWidth="2"
                />
            </svg>
        );
    }

    if (variant === 'dots') {
        const cols = 24;
        const rows = 8;
        const spacing = 40;

        return (
            <svg
                className={className}
                style={{opacity}}
                width="100%"
                height="100%"
                viewBox={`0 0 ${cols * spacing} ${rows * spacing}`}
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                aria-hidden="true"
            >
                {Array.from({length: rows}).map((_, row) =>
                    Array.from({length: cols}).map((_, col) => (
                        <circle
                            key={`${row}-${col}`}
                            cx={col * spacing + spacing / 2}
                            cy={row * spacing + spacing / 2}
                            r={2}
                            fill="currentColor"
                        />
                    )),
                )}
            </svg>
        );
    }

    // variant === 'mesh'
    return (
        <svg
            className={className}
            style={{opacity}}
            width="100%"
            height="100%"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            aria-hidden="true"
        >
            <defs>
                <pattern id="mesh-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" stroke="currentColor" strokeWidth="1" fill="none"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mesh-grid)"/>
        </svg>
    );
}