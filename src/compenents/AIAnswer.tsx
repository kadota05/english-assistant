// AIAnswer.tsx
import React from 'react';
import { transformCardContent } from '../utils/transformer';

type Props = {
    currentSectionIndex: number; 
    showSectionCards: boolean[];
    typedSections: string[];
    sections: string[];
    isReviewMode: boolean; //いきなりカード表示かタイプライター表示か決める 
}

const AIAnswer: React.FC<Props> = ({ currentSectionIndex, showSectionCards, typedSections, sections, isReviewMode }) => {
    return (
        <div className="mt-4">
            {currentSectionIndex >= 0 && (
                <>
                {isReviewMode || showSectionCards[0] ? (
                    sections[0] && (
                        <div className="card shadow-sm mb-3 bg-secondary border-2">
                            <div className="card-header fw-bold bg-primary text-white">1. 正しい表現</div>
                            <div className="card-body bg-dark text-white" style={{ whiteSpace: 'pre-wrap' }}>
                                {transformCardContent(sections[0], 0)}
                            </div>
                        </div>
                    )
                ) : (
                    <pre className="mb-3" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {typedSections[0]}
                    </pre>
                )}
                </>
            )}

            {currentSectionIndex >= 1 && (
                <>
                {isReviewMode || showSectionCards[1] ? (
                    sections[1] && (
                        <div className="card shadow-sm mb-3 bg-secondary border-2">
                            <div className="card-header fw-bold bg-primary text-white">2. 他の表現</div>
                            <div className="card-body bg-dark text-white" style={{ whiteSpace: 'pre-wrap' }}>
                                {transformCardContent(sections[1], 1)}
                            </div>
                        </div>
                    )
                ) : (
                    <pre className="mb-3" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {typedSections[1]}
                    </pre>
                )}
                </>
            )}

            {currentSectionIndex >= 2 && (
                <>
                {isReviewMode || showSectionCards[2] ? (
                    sections[2] && (
                        <div className="card shadow-sm mb-3 bg-secondary border-2">
                            <div className="card-header fw-bold bg-primary text-white">3. 今後のアドバイス</div>
                            <div className="card-body bg-dark text-white" style={{ whiteSpace: 'pre-wrap' }}>
                                {transformCardContent(sections[2], 2)}
                            </div>
                        </div>
                    )
                ) : (
                    <pre className="mb-3" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {typedSections[2]}
                    </pre>
                )}
                </>
            )}
        </div>
    );
}

export default AIAnswer;
