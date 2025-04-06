import React, { useState } from 'react';
import { fetchExerciseResponse } from '../services/aiService';
import { ChatLog } from '../store/chatLogService';

type AdaptiveExerciseProps = {
  selectedChat: ChatLog | null;
};

const AdaptiveExercise: React.FC<AdaptiveExerciseProps> = ({ selectedChat }) => {
  const [exerciseResponse, setExerciseResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const exerciseText = await fetchExerciseResponse(selectedChat?.chatResponse || '');
      setExerciseResponse(exerciseText);
    } catch (error) {
      setExerciseResponse('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // 正規表現で「番号・日本語・英語・解説」をパースする
  const parseResponse = (response: string) => {
    const regex = /(\d+)\.\s*([^\/]+)\s*\/\s*([^(]+)\s*\(([^)]+)\)/g;
    let matches;
    const items = [];
    while ((matches = regex.exec(response)) !== null) {
      items.push({
        number: matches[1].trim(),
        japanese: matches[2].trim(),
        english: matches[3].trim(),
        explanation: matches[4].trim(),
      });
    }
    return items;
  };

  const items = parseResponse(exerciseResponse);

  return (
    <>
      <style>
        {`
          .accordion-button {
            justify-content: center;
            position: relative;
          }
          .accordion-button::after {
            position: absolute;
            right: 1rem;
          }
        `}
      </style>
      <div className="text-center mb-3">まだ開発中だよ</div>
      {selectedChat ? (
        <div className="text-center mb-3">作成できます！</div>
      ) : (
        <div className="text-center mb-3">chatResponseを得て下さい!</div>
      )}

      <div className="text-center">
        <button className="btn btn-primary" onClick={handleSend}>
          作成
        </button>
      </div>

      {loading && <div className="text-center mt-2">作問しています</div>}

      {exerciseResponse !== '' && items.length > 0 && (
        <div className="accordion mt-4" id="exerciseAccordion">
          {items.map((item, index) => (
            <div className="accordion-item border border-white mb-2" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button collapsed bg-dark text-white"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                  style={{ border: 'none' }} // ヘッダーとボディーの区切り線を無くす
                >
                  {item.number}. {item.japanese}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${index}`}
                data-bs-parent="#exerciseAccordion"
              >
                <div className="accordion-body bg-dark text-white text-center">
                  解答: <strong>{item.english}</strong>
                  <br />
                  <small className="text-white-50">({item.explanation})</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdaptiveExercise;
