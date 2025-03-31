import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css';
import {
  Title,
  UserInputs,
  DescriptionIcon,
  SendButton,
  ScrollToBottom,
  AIAnswer,
  OffCanvas
} from './compenents/index';
import { fetchChatResponse } from './services/aiService';
import { usePopover } from './hooks/usePopover';
import { useTypewriter } from './hooks/useTypewriter';
import { getChatLog } from './store/chatLogService';

function App() {
  const [intent, setIntent] = useState<string>('');
  const [userExpression, setUserExpression] = useState<string>('');
  const [chatResponse, setChatResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [intentError, setIntentError] = useState<string>('');
  const [userExpressionError, setUserExpressionError] = useState<string>('');

  const descriptionRef = useRef<HTMLSpanElement>(null);

  // セクション情報
  const [sections, setSections] = useState<string[]>(['', '', '']);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);

  // 送信時
  const handleSend = async () => {
    setIsReviewMode(false);
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

  // 過去ログ選択時
  const handlePastChat = async (logID: number) => {
    setIsReviewMode(true);
    const pastLog = await getChatLog(logID);
    setIntent(pastLog.UserIntent);
    setUserExpression(pastLog.UserExpression);
    setChatResponse(pastLog.chatResponse);
  };

  const { typedSections, showSectionCards, currentSectionIndex, startTypewriterEffect } = useTypewriter(20);

  // chatResponse更新 → 3セクションに分割
  useEffect(() => {
    if (!chatResponse) return;
    const secs = parseSections(chatResponse);
    setSections(secs);
    if (!isReviewMode) {
      startTypewriterEffect(secs);
    }
  }, [chatResponse]);

  // Popover
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
  });

  // Enterキー
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!isReviewMode) {
        handleSend();
      } else {
        handlePastChat(1);
      }
    }
  };

  // 3セクションに分割
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
    <div className="App bg-dark text-white min-vh-100">
      {/* ヘッダー */}
      <header>
        <nav className="navbar navbar-dark bg-dark fixed-top" style={{ height: '70px', paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="container-fluid d-flex align-items-center justify-content-between">
            {/* 左側: OffCanvas トグルボタン */}
            <div style={{ width: '50px' }}>
              <OffCanvas handlePastChat={handlePastChat} />
            </div>
            {/* 中央: タイトル */}
            <div className="text-center flex-grow-1">
              <Title />
            </div>
            {/* 右側: 空要素（左側と同じ幅でタイトルを中央に配置） */}
            <div style={{ width: '50px' }}></div>
          </div>
        </nav>
      </header>

      {/*
        メインコンテンツ 
        marginTop: ヘッダーの高さ分(70px)を確保
      */}
      <main className="container pt-5 pb-5" style={{ marginTop: 'calc(70px + env(safe-area-inset-top))' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5">
            <UserInputs
              intent={intent}
              setIntent={setIntent}
              userExpression={userExpression}
              setUserExpression={setUserExpression}
              intentError={intentError}
              userExpressionError={userExpressionError}
              handleKeyDown={handleKeyDown}
            />
            <div className="text-center my-4">
              <div className="d-inline-flex align-items-center gap-2">
                <SendButton handleSend={handleSend} loading={loading} />
                <DescriptionIcon descriptionRef={descriptionRef} />
              </div>
            </div>
            <AIAnswer
              currentSectionIndex={currentSectionIndex}
              showSectionCards={showSectionCards}
              typedSections={typedSections}
              sections={sections}
              isReviewMode={isReviewMode}
            />
          </div>
        </div>

        {/* 下部へ移動ボタン */}
        {chatResponse && chatResponse.trim() && (
          <div className="position-fixed start-50 translate-middle-x" style={{ bottom: '10px' }}>
            <ScrollToBottom />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
