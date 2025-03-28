import React from 'react';

type Props = {
    handleSend: () => void;
    loading: boolean;
}

const SendButton: React.FC<Props> = ( {handleSend, loading} ) => {
    return (
        <button
            className="btn btn-outline-primary rounded-pill fw-semibold"
            onClick={handleSend}
            disabled={loading}
            >
            {loading ? (
                <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                考えています...
                </>
            ) : (
                '添削してもらう'
            )}
            </button>
    )
}

export default SendButton;