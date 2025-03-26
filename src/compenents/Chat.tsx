import React, { useState } from 'react';
import { fetchChatResponse } from '../services/deepSeekService';

const Chat: React.FC = () => {
  const [intent, setIntent] = useState<string>('');
  const [userExpression, setUserExpression] = useState<string>('');
  const [chatResponse, setChatResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!intent.trim() || !userExpression.trim()) return;
    setLoading(true);
    try {
      const responseText = await fetchChatResponse(intent, userExpression);
      setChatResponse(responseText);
    } catch (error) {
      setChatResponse('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

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
        const prefix = match[1];
        const rest = match[2];
        return (
          <p key={idx}>
            <span className="fw-bold fs-5 text-success">{prefix}</span>
            {rest}
          </p>
        );
      }
      return <p key={idx}>{line}</p>;
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

  const sections = chatResponse ? parseSections(chatResponse) : [];

  return (
    <div className="container-fluid min-vh-100 bg-dark text-white d-flex flex-column justify-content-center pt-5">
      {/* row + col で左右に余白を作り、中央に寄せる */}
      <div className="row w-100 mx-0">
        <div className="col-11 col-sm-8 col-md-6 col-lg-5 mx-auto">
          <h1 className="display-4 text-center mb-5 text-primary">Pocket English Teacher</h1>

          <div className="mb-3">
            <label className="form-label">表現したい言葉（日本語）:</label>
            <input
              type="text"
              className="form-control bg-secondary text-white"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="例: 今日は晴れていて気分がいいです"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">あなたが考えた英語表現（English）:</label>
            <input
              type="text"
              className="form-control bg-secondary text-white"
              value={userExpression}
              onChange={(e) => setUserExpression(e.target.value)}
              placeholder="例: Today is sunny and I feel happy"
            />
          </div>

          <div className="d-grid gap-2 col-10 col-sm-8 col-md-6 mx-auto my-4">
            <button className="btn btn-primary rounded-pill" onClick={handleSend} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  考えています...
                </>
              ) : (
                '添削してもらう'
              )}
            </button>
          </div>

          <div className="mt-4">
            {sections[0] || sections[1] || sections[2] ? (
              <>
                {sections[0] && (
                  <div className="card shadow-sm mb-3 bg-secondary border-2">
                    <div className="card-header fw-bold bg-primary text-white">1. Correct Expression</div>
                    <div className="card-body bg-dark text-white" style={{ whiteSpace: 'pre-wrap' }}>
                      {transformCardContent(sections[0], 0)}
                    </div>
                  </div>
                )}
                {sections[1] && (
                  <div className="card shadow-sm mb-3 bg-secondary border-2">
                    <div className="card-header fw-bold bg-primary text-white">2. Five Alternative Natural Expressions</div>
                    <div className="card-body bg-dark text-white" style={{ whiteSpace: 'pre-wrap' }}>
                      {transformCardContent(sections[1], 1)}
                    </div>
                  </div>
                )}
                {sections[2] && (
                  <div className="card shadow-sm mb-3 bg-secondary border-2">
                    <div className="card-header fw-bold bg-primary text-white">3. Learning Advice</div>
                    <div className="card-body bg-dark text-white" style={{ whiteSpace: 'pre-wrap' }}>
                      {transformCardContent(sections[2], 2)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              chatResponse && <p>{chatResponse}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
