import React, { useState, useEffect } from 'react';
import { fetchExerciseResponse } from '../services/aiService';
import { ChatLog } from '../store/chatLogService';
import { exercise, addExercise, editExercise } from '../store/exerciseService'

type AdaptiveExerciseProps = {
  selectedChat: ChatLog | null;
  relatedExercise: exercise | null;
};

type items = {
  number: string;
  japanese: string;
  english: string;
  explanation: string;
}

const AdaptiveExercise: React.FC<AdaptiveExerciseProps> = ({ selectedChat, relatedExercise }) => {
  const [exerciseResponse, setExerciseResponse] = useState<string>('');
  const [bracketedText, setBracketedText] = useState<string>('');
  const [restOfResponse, setRestOfResponse] = useState<string>('');
  const [items, setItems] = useState<items[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [existExercise, setExistExercise] = useState<boolean>(false);


  // 過去のチャットが選ばれたときに値をセットする用のuseEffect
  useEffect(()=>{
    // console.log("relatedExercise が更新されました:", relatedExercise);
    if(relatedExercise){
      setExerciseResponse(relatedExercise.exerciseResponse);
      setExistExercise(true);
      // console.log("過去のチャットセット完了")
    }
  }, [relatedExercise]);

  // 表示用のuseEffect
  useEffect(()=>{
    // まず冒頭の[ ]部分を抽出 → 残りの文字列をparse
  const { bracketedText, restOfResponse } = extractBracketedText(exerciseResponse);
  setBracketedText(bracketedText);
  setRestOfResponse(restOfResponse);

  const items = parseResponse(restOfResponse);
  setItems(items);
  }, [exerciseResponse])
  

  const handleSend = async () => {
    if (!selectedChat) {
      setExistExercise(false);
      console.error('chatResponseが取得できていません。');
      return;
    }
    setLoading(true);

    try {
      const exerciseText = await fetchExerciseResponse(selectedChat?.chatResponse || '');
      setExerciseResponse(exerciseText);

      // indexedDBにaddする
      const newExercise: exercise = {
        chatResponse: selectedChat.chatResponse,
        exerciseResponse: exerciseText,
        isLike: false,
        numReview: null
      }
      if (!existExercise){
        const key = await addExercise(newExercise);
        console.log(`エクササイズが追加されました (key:${key})`);
      } else{
        const key = await editExercise(newExercise);
        console.log(`エクササイズを変更しました (key:${key})`);
      }
      
    } catch (error) {
      setExerciseResponse('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // [ ] で囲まれた冒頭の説明を取り出すための処理を追加
  const extractBracketedText = (response: string) => {
    // 冒頭にある[ ]部分だけを取得
    const bracketMatch = response.match(/^\[([^\]]+)\]/);
    let bracketedText = '';
    let restOfResponse = response;

    if (bracketMatch) {
      bracketedText = bracketMatch[1];
      // 取得した[ ]部分を取り除いて残りの文字列を返す
      restOfResponse = restOfResponse.replace(bracketMatch[0], '').trim();
    }

    return { bracketedText, restOfResponse };
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
          /* advice-box クラスを洗練されたモダンな印象に調整 */
          .advice-box {
            max-width: 600px;
            margin: 20px auto;
            padding: 12px;
            border-radius: 6px;
            background: linear-gradient(135deg, #001f3f, #000000);
            border: 1px solid #007bff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
            color: #fff;
            font-size: 1rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
          }
        `}
      </style>
      <div className="text-danger text-center mb-3">まだ開発中だよ</div>
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

      {/* 抽出した[ ]部分をアドバイス表示用にスタイル */}
      {bracketedText && (
        <div className="advice-box">
          <p className="mb-0">{bracketedText}</p>
        </div>
      )}

      {restOfResponse !== '' && items.length > 0 && (
        <div className="accordion mt-4" id="exerciseAccordion">
          {items.map((item, index) => (
            <div className="accordion-item border border-white mb-3" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button collapsed bg-dark text-white"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                  style={{ border: 'none' }}
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
