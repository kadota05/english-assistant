import React, { useState, useEffect, useRef } from 'react';
import { default as Title } from './Title'
import { default as UserInputs } from './UserInputs'
import { default as DescriptionIcon } from './DescriptionIcon'
import { default as SendButton } from './SendButton'

import { fetchChatResponse } from '../services/aiService';
import { usePopover } from '../hooks/usePopover';

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
  const [typedSections, setTypedSections] = useState<string[]>(['', '', '']);
  const [showSectionCards, setShowSectionCards] = useState<boolean[]>([false, false, false]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

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
    setTypedSections(['', '', '']);
    setShowSectionCards([false, false, false]);
    setCurrentSectionIndex(0);

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
    setTypedSections(['', '', '']);
    setShowSectionCards([false, false, false]);
    setCurrentSectionIndex(0);
    typeSection(0, secs);
  }, [chatResponse]);

  const typeSection = (index: number, secs: string[]) => {
    if (index < 0 || index >= secs.length) return;
    if (!secs[index]) {
      setShowSectionCards((prev) => {
        const newArr = [...prev];
        newArr[index] = true;
        return newArr;
      });
      setCurrentSectionIndex(index + 1);
      typeSection(index + 1, secs);
      return;
    }
    let pos = 0;
    const interval = setInterval(() => {
      pos++;
      setTypedSections((prev) => {
        const newArr = [...prev];
        newArr[index] = secs[index].substring(0, pos);
        return newArr;
      });
      if (pos >= secs[index].length) {
        clearInterval(interval);
        setShowSectionCards((prev) => {
          const newArr = [...prev];
          newArr[index] = true;
          return newArr;
        });
        setCurrentSectionIndex(index + 1);
        typeSection(index + 1, secs);
      }
    }, 20);
  };

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

  const preprocessLine = (line: string) => {
    let newLine = line.replace(/^[.\s…・:：]+/, '');
    newLine = newLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return newLine;
  };

  const transformSection1 = (text: string) => {
    const lines = text.split('\n').map((l) => preprocessLine(l));
    return lines.map((line, idx) => {
      if (line.startsWith('-正しい英文:')) {
        const splitted = line.split(':');
        const prefix = splitted[0];
        const after = splitted.slice(1).join(':').trim();
        return (
          <p key={idx}>
            <span className="fw-bold text-primary">{prefix}:</span>{' '}
            <span className="fw-bold fs-5">{after}</span>
          </p>
        );
      }
      if (line.startsWith('-解説:')) {
        const splitted = line.split(':');
        const prefix = splitted[0];
        const after = splitted.slice(1).join(':').trim();
        return (
          <p key={idx}>
            <span className="fw-bold text-primary">{prefix}:</span>{' '}
            {after}
          </p>
        );
      }
      return <p key={idx}>{line}</p>;
    });
  };

  const transformSection2 = (text: string) => {
    const lines = text.split('\n').map((l) => preprocessLine(l));
    return lines.map((line, idx) => {
      if (/^\d+\.\s/.test(line)) {
        return (
          <p key={idx}>
            <strong>{line}</strong>
          </p>
        );
      }
      return <p key={idx}>{line}</p>;
    });
  };

  const transformSection3 = (text: string) => {
    const lines = text.split('\n').map((l) => preprocessLine(l));
    return lines.map((line, idx) => {
      const match = line.match(/^(\d+\.\s.*?:)(.*)/);
      if (match) {
        const prefix = match[1].replace(/<\/?strong>/g, '');
        const rest = match[2].replace(/<\/?strong>/g, '');
        return (
          <p key={idx}>
            <span className="fw-bold text-primary">{prefix}</span>
            {rest}
          </p>
        );
      }
      return <p key={idx}>{line.replace(/<\/?strong>/g, '')}</p>;
    });
  };

  const transformCardContent = (text: string, index: number) => {
    if (index === 0) {
      return transformSection1(text);
    } else if (index === 1) {
      return transformSection2(text);
    } else if (index === 2) {
      return transformSection3(text);
    }
    return text;
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
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
          <button
            className="btn btn-light d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: '50px', height: '50px' }}
            onClick={scrollToBottom}
          >
            <span className="fs-4">&darr;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;