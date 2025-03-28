import React from 'react'

const ScrollToBottom: React.FC = () => {
    const scrollToBottom = () => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      };

    return(
        <button
        className="btn btn-light d-flex align-items-center justify-content-center rounded-circle"
        style={{ width: '50px', height: '50px' }}
        onClick={scrollToBottom}
        >
        <span className="fs-4">&darr;</span>
        </button>
    )
}

export default ScrollToBottom;