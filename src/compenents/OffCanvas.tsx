import React, { useEffect, useState } from 'react';
import { ChatLog, getAllChatLogs } from '../store/chatLogService';

type Props = {
  changeDB: boolean
  handlePastChat: (logID: number) => void;
};

const OffCanvas: React.FC<Props> = ({ changeDB, handlePastChat }) => {
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);

  useEffect(() => {
    const fetchChatLogs = async () => {
      try {
        const logs = await getAllChatLogs();
        setChatLogs(logs);
      } catch (error) {
        console.error("チャットログの取得に失敗しました", error);
      }
    };
    fetchChatLogs();
  }, [changeDB]);

  const closeOffCanvas = () => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }
  };

  return (
    <>
      <button
        className="btn btn-secondary navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* OffCanvas */}
      <div
        className="offcanvas offcanvas-start text-bg-dark"
        tabIndex={-1}
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            過去の添削
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="list-group">
            {chatLogs.map((chatLog: ChatLog) => (
              <a
                key={chatLog.id}
                onClick={() => {
                  if (chatLog.id !== undefined) {
                    handlePastChat(chatLog.id);
                    closeOffCanvas();
                  }
                }}
                className="list-group-item list-group-item-action list-group-item-dark"
                style={{ cursor: 'pointer' }}
              >
                {chatLog.UserIntent}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OffCanvas;