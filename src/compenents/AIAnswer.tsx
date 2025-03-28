import React from 'react';
import { transformCardContent } from '../utils/transformer';

type Props = {
    currentSectionIndex: number; 
    showSectionCards: boolean[];
    typedSections: string[];
    sections: string[];
}

const AIAnswer: React.FC<Props> = ( {currentSectionIndex, showSectionCards, typedSections, sections} ) => {
    return (
        <div className="mt-4">
            {currentSectionIndex >= 0 && (
                <>
                {!showSectionCards[0] ? (
                    <pre className="mb-3" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {typedSections[0]}
                    </pre>
                ) : sections[0] && (
                    <div className="card shadow-sm mb-3 bg-secondary border-2">
                    <div className="card-header fw-bold bg-primary text-white">1. 正しい表現</div>
                    <div className="card-body bg-dark text-white" style={{ whiteSpace: 'pre-wrap' }}>
                        {transformCardContent(sections[0], 0)}
                    </div>
                    </div>
                )}
                </>
            )}

            {currentSectionIndex >= 1 && (
                <>
                {!showSectionCards[1] ? (
                    <pre className="mb-3" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {typedSections[1]}
                    </pre>
                ) : sections[1] && (
                    <div className="card shadow-sm mb-3 bg-secondary border-2">
                    <div className="card-header fw-bold bg-primary text-white">2. 他の表現</div>
                    <div className="card-body bg-dark text-white" style={{ whiteSpace: 'pre-wrap' }}>
                        {transformCardContent(sections[1], 1)}
                    </div>
                    </div>
                )}
                </>
            )}

            {currentSectionIndex >= 2 && (
                <>
                {!showSectionCards[2] ? (
                    <pre className="mb-3" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {typedSections[2]}
                    </pre>
                ) : sections[2] && (
                    <div className="card shadow-sm mb-3 bg-secondary border-2">
                    <div className="card-header fw-bold bg-primary text-white">3. 今後のアドバイス</div>
                    <div className="card-body bg-dark text-white" style={{ whiteSpace: 'pre-wrap' }}>
                        {transformCardContent(sections[2], 2)}
                    </div>
                    </div>
                )}
                </>
            )}
            </div>
    )
}

export default AIAnswer;