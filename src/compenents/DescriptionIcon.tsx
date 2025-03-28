import React from 'react';

type Props = {
    descriptionRef: React.RefObject<HTMLSpanElement | null>;
}

const DescriptionIcon: React.FC<Props> = ( {descriptionRef} ) => {
    return (
        <span
        ref={descriptionRef}
        className="text-primary"
        style={{ cursor: 'pointer' }}
        data-bs-toggle="popover"
        data-bs-trigger="hover focus"
        >
        {/* SVGアイコン例：description iconっぽいもの */}
        <svg
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm-2 5h4c.552 0 1 .448 1 1s-.448 1-1 1h-4c-.552 0-1-.448-1-1s.448-1 1-1zm6 12H8c-.552 0-1-.448-1-1s.448-1 1-1h8c.552 0 1 .448 1 1s-.448 1-1 1zm0-4H8c-.552 0-1-.448-1-1s.448-1 1-1h8c.552 0 1 .448 1 1s-.448 1-1 1z" />
        </svg>
        </span>
    )
}

export default DescriptionIcon;