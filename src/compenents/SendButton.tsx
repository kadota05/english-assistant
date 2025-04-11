import React from 'react';

type Props = {
    handleSend: () => void;
    loading: boolean;
    buttonString: string;
}

const SendButton: React.FC<Props> = ( {handleSend, loading, buttonString } ) => {
    return (
        <button
            className="btn btn-outline-primary rounded-pill fw-semibold mx-1"
            onClick={handleSend}
            disabled={loading}
            >
            {loading ? (
                <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                考えています...
                </>
            ) : (
                buttonString
            )}
            </button>
    )
}

export default SendButton;