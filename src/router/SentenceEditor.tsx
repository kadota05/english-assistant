import React, { useState, useEffect, useRef } from 'react';
import {
  UserInputs,
  DescriptionIcon,
  SendButton,
  ScrollToBottom,
  AIAnswer,
  ResetButton
} from '../compenents/index';
import { fetchChatResponse } from '../services/aiService';
import { usePopover } from '../hooks/usePopover';
import { ChatLog, addChatLog } from '../store/chatLogService';

type SentenceEditorProps = {
  chatResponse: string;
  setChatResponse: React.Dispatch<React.SetStateAction<string>>;
  selectedChat: ChatLog | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<ChatLog | null>>;
};

const SentenceEditor: React.FC<SentenceEditorProps> = ({
  chatResponse,
  setChatResponse,
  selectedChat,
  setSelectedChat
}) => {
  const [intent, setIntent] = useState<string>('');
  const [userExpression, setUserExpression] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [intentError, setIntentError] = useState<string>('');
  const [userExpressionError, setUserExpressionError] = useState<string>('');

  const descriptionRef = useRef<HTMLSpanElement>(null);

  // セクション情報（各項目はすぐ完成状態で表示）
  const [sections, setSections] = useState<string[]>(['', '', '']);

  const handleReset = () => {
    setIntent('');
    setIntentError('');
    setUserExpression('');
    setUserExpressionError('');
    setChatResponse('');
    setSections(['', '', '']);
  };

  // 送信時（入力チェック後、AI の応答を取得し、チャットログを indexedDB および親状態へ更新）
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

      // indexedDB に新規チャットログとして保存
      const newLog: ChatLog = {
        UserIntent: intent,
        UserExpression: userExpression,
        chatResponse: responseText,
        timestamp: Date.now(),
      };
      const key = await addChatLog(newLog);
      console.log(`チャットログが追加されました（ID: ${key}）`);

      // 親状態へ反映
      setSelectedChat(newLog);
    } catch (error) {
      setChatResponse('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // 過去ログ選択時：親状態の selectedChat に保存された情報を反映し、即時全表示
  useEffect(() => {
    if (selectedChat) {
      setIntent(selectedChat.UserIntent);
      setUserExpression(selectedChat.UserExpression);
      setChatResponse(selectedChat.chatResponse);
      const secs = parseSections(selectedChat.chatResponse);
      setSections(secs);
    }
  }, [selectedChat]);

  // chatResponse 更新時：テキストを3セクションに分割して即時全表示
  useEffect(() => {
    if (!chatResponse) return;
    const secs = parseSections(chatResponse);
    setSections(secs);
  }, [chatResponse]);

  // Popover 設定
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

  // Enterキーで送信
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
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
    <>
      <div className="row justify-content-center">
        <div className="col-10 col-sm-8 col-md-6 col-lg-5">
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
              <DescriptionIcon descriptionRef={descriptionRef} />
              <SendButton handleSend={handleSend} loading={loading} />
              <ResetButton handleReset={handleReset} />
            </div>
          </div>
          <AIAnswer
            // すべてのセクションを完成状態として表示
            typedSections={sections}
            sections={sections}
            currentSectionIndex={sections.length}
            showSectionCards={[true, true, true]}
          />
        </div>
      </div>

      {chatResponse && chatResponse.trim() && (
        <div className="position-fixed start-50 translate-middle-x" style={{ bottom: '10px' }}>
          <ScrollToBottom />
        </div>
      )}
    </>
  );
};

export default SentenceEditor;
