import React from 'react';

type UserInputsProps = {
    intent: string;
    setIntent: React.Dispatch<React.SetStateAction<string>>;
    userExpression: string;
    setUserExpression: React.Dispatch<React.SetStateAction<string>>;
    intentError: string;
    userExpressionError: string;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const UserInput: React.FC<UserInputsProps> = ( {
    intent,
    setIntent,
    userExpression,
    setUserExpression,
    intentError,
    userExpressionError,
    handleKeyDown
    } ) => {
    return (
        <>
        {/* 入力欄: 日本語 */}
        <div className="mb-3">
        <label className="form-label">表現したい言葉（日本語）:</label>
        <input
            type="text"
            className={`form-control bg-secondary text-white ${intentError ? 'is-invalid' : ''}`}
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例: 今日は晴れていて気分がいいです"
        />
        {intentError && <div className="invalid-feedback">{intentError}</div>}
        </div>

        {/* 入力欄: 英語 */}
        <div className="mb-3">
        <label className="form-label">あなたが考えた英語表現（English）:</label>
        <input
            type="text"
            className={`form-control bg-secondary text-white ${userExpressionError ? 'is-invalid' : ''}`}
            value={userExpression}
            onChange={(e) => setUserExpression(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例: Today is sunny and I feel happy"
        />
        {userExpressionError && <div className="invalid-feedback">{userExpressionError}</div>}
        </div>
        </>
    )
}

export default UserInput;