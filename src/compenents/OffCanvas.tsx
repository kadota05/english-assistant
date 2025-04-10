import React, { useEffect, useState } from 'react';
import { ChatLog, getAllChatLogs, getChatLog, deleteChatLog } from '../store/chatLogService';
import { deleteExercise } from '../store/exerciseService';

type Props = {
  handlePastChat: (logID: number) => Promise<void>;
};

const OffCanvas: React.FC<Props> = ({ handlePastChat }) => {
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);

  useEffect(() => {
    const offcanvasElement = document.getElementById('offcanvasExample');
    const fetchChatLogs = async () => {
      try {
        const logs = await getAllChatLogs();
        setChatLogs(logs);
      } catch (error) {
        console.error("チャットログの取得に失敗しました", error);
      }
    };
    // offcanvas が表示されたときにフェッチ
    offcanvasElement?.addEventListener('shown.bs.offcanvas', fetchChatLogs);

    return () => {
      offcanvasElement?.removeEventListener('shown.bs.offcanvas', fetchChatLogs);
    };
  }, []);

  const closeOffCanvas = () => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm("このチャットログを削除しますか？")) {
      try{
        const targetChatLog = await getChatLog(id);
        console.log('targetChatLog取得に成功');
        
        await deleteChatLog(id);
        setChatLogs(prev => prev.filter(log=>log.id !== id));
        console.log('ChatLogsストアから削除することに成功');

        await deleteExercise(targetChatLog.chatResponse);
        console.log('Exercisesストアから削除することに成功');
        
        console.log('無事削除できましたとさ');
      } catch(error){
        console.error("削除エラー", error)
      }
    }
  }

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
            <div
              key={chatLog.id}
              className="list-group-item list-group-item-action list-group-item-dark d-flex align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (chatLog.id !== undefined) {
                  handlePastChat(chatLog.id);
                  closeOffCanvas();
                }
              }}
            >
              {/* ユーザー意図部分：flex-growで幅を最大限確保し、text-truncateで溢れるテキストは省略表示 */}
              <span className="flex-grow-1 text-truncate" style={{ marginRight: '8px' }}>
                {chatLog.UserIntent}
              </span>
              {/* 削除ボタン */}
              <button
                className="btn btn-link text-secondary p-0"
                onClick={(e) => {
                  e.stopPropagation(); // 親の onClick をキャンセル
                  if (chatLog.id !== undefined) {
                    handleDelete(chatLog.id);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg>
              </button>
            </div>
          ))}

          </div>
        </div>
      </div>
    </>
  );
};

export default OffCanvas;