import React, { useState, useEffect, useRef } from 'react';
import { default as Title } from './Title'
import { default as UserInputs } from './UserInputs'
import { default as DescriptionIcon } from './DescriptionIcon'
import { default as SendButton } from './SendButton'
import { default as ScrollToBottom } from './ScrollToBottom'

import { fetchChatResponse } from '../services/aiService';
import { usePopover } from '../hooks/usePopover';
import { useTypewriter } from '../hooks/useTypewriter';

import { transformCardContent } from '../utils/transformer';


const Chat: React.FC = () => {
  const [intent, setIntent] = useState<string>('');
  const [userExpression, setUserExpression] = useState<string>('');
  const [chatResponse, setChatResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [intentError, setIntentError] = useState<string>('');
  const [userExpressionError, setUserExpressionError] = useState<string>('');

  // ---- ① description icon 用の ref ----
  const descriptionRef = useRef<HTMLSpanElement>(null);

  // セクション情報
  const [sections, setSections] = useState<string[]>(['', '', '']);

  // Enterキー送信用ハンドラ
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = async () => {
    let valid = true;
    if (!intent.trim()) {
      setIntentError('必須項目です');
      valid = false;
    } else {
      setIntentError('');
    }
    if (!userExpression.trim()) {
      setUserExpressionError('必須項目です');
      valid = false;
    } else {
      setUserExpressionError('');
    }
    if (!valid) return;

    setLoading(true);
    setChatResponse('');
    setSections(['', '', '']);

    try {
      const responseText = await fetchChatResponse(intent, userExpression);
      setChatResponse(responseText);
    } catch (error) {
      setChatResponse('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // chatResponseが更新されたら、3セクションに分割し順次タイプライター表示
  useEffect(() => {
    if (!chatResponse) return;
    const secs = parseSections(chatResponse);
    setSections(secs);
  }, [chatResponse]);

  const { typedSections, showSectionCards, currentSectionIndex } = useTypewriter(sections, 20)

  // // ---- ② description icon の Popover 初期化 ----
  usePopover(descriptionRef, {
          container: 'body',
          placement: 'bottom',
          trigger: 'hover focus',
          html: true,
          content: `
            <div style="max-width: 300px;">
              <strong>1. 正しい表現かどうか</strong><br />
              あなたの入力をもとに、AIが英語表現をチェックします。<br /><br />
              <strong>2. 他にどのような表現ができるか</strong><br />
              同じ意味を表す多様な英語表現を提示します。<br /><br />
              <strong>3. 文章を分析した学習アドバイス</strong><br />
              あなたの表現をさらに洗練させるためのヒントを提案します。
            </div>
          `,
        })
  
  const parseSections = (text: string) => {
    const regex = /1\. Correct Expression([\s\S]*?)2\. Five Alternative Natural Expressions([\s\S]*?)3\. Learning Advice([\s\S]*)/;
    const match = text.match(regex);
    if (match) {
      const section1 = match[1].trim();
      const section2 = match[2].trim();
      const section3 = match[3].trim();
      return [section1, section2, section3];
    } else {
      return [text, '', ''];
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-dark text-white d-flex flex-column pt-5 pb-5 position-relative">
      <div className="row w-100 mx-0">
        <div className="col-11 col-sm-8 col-md-6 col-lg-5 mx-auto">
          {/* タイトル */}
          <Title />
          {/* 入力欄 */}
          <UserInputs 
            intent={intent}
            setIntent={setIntent}
            userExpression={userExpression}
            setUserExpression={setUserExpression}
            intentError={intentError}
            userExpressionError={userExpressionError}
            handleKeyDown={handleKeyDown}
          />

          {/* ボタン＋description icon */}
          <div className="col-10 col-sm-8 col-md-6 mx-auto my-4 text-center">
            <div className="d-inline-flex align-items-center gap-2">
              <SendButton handleSend={handleSend} loading={loading} />
              <DescriptionIcon descriptionRef={descriptionRef} />
            </div>
          </div>
          

          {/* セクションのタイプライター表示 or カード表示 */}
          <div className="mt-4">
            {/* 以下、カードや表示ロジックは省略なく継続 */}
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
        </div>
      </div>

      {/* 画面下部へ移動ボタン (AI回答があるときに表示) */}
      {chatResponse && chatResponse.trim() && (
        <div className="position-fixed start-50 translate-middle-x" style={{ bottom: '10px' }}>
          <ScrollToBottom />
        </div>
      )}
    </div>
  );
};

export default Chat;