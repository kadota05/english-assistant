import { GoogleGenerativeAI } from '@google/generative-ai';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export const fetchChatResponse = async (
  intent: string,
  userExpression: string
): Promise<string> => {
  // Gemini API用のAPIキーを環境変数から取得
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("GEMINI API KEY is not defined in the environment variables.");
  }

  // GoogleGenerativeAIインスタンスを生成
  const genAI = new GoogleGenerativeAI(API_KEY);
  // Gemini Proモデルを利用（必要に応じてモデル名を変更してください）
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // プロンプト作成
  const prompt = `
  You are an English Expression Diagnostic Assistant. You will be provided with two inputs:
  1. [Intent]: the meaning the user wants to express (in Japanese)
  2. [User's English Expression]: the English expression that the user has come up with

  Your task is to generate a response with exactly three sections, in this exact order and format:

  1. Correct Expression:
  -正しい英文: [ここには、[User's English Expression]を修正した英語表現を、追加の説明やコメントなしで一文（または複数文の場合は必要な文数）だけ記載してください。もし[User's English Expression]がすでに正しい場合は「excellent!」と日本語で書いてください。]

  -解説: [ここに日本語で解説を書いてください。もしユーザーの英文がすでに自然で正しい場合は「excellent!」または「Your expression is natural and excellent!」と日本語で書いてください。もし不自然または誤りがある場合は、何が不自然・誤りなのかを具体的に指摘し、どのように修正すべきかを日本語で説明してください。必要があれば、この解説パートで再度正しい英文を提示してもかまいません。]

  2. Five Alternative Natural Expressions:
  [以下のフォーマットで、5つの英語表現を提示してください。ただし各表現の説明・解説は各英語表現の下に改行して日本語で書いてください:
  1. Expression 1
  2. Expression 2
  3. Expression 3
  4. Expression 4
  5. Expression 5
  ]

  3. Learning Advice:
  [ここでは[User's English Expression]を分析し、少なくとも3つの具体的な改善ポイント（例：冠詞の使い方、時制の一致、前置詞の使い方、語彙の限界など）を日本語で提示してください。]

  [intent]: ${intent}
  [User's English Expression]: ${userExpression}
  `.trim();

  try {
    // プロンプトをもとにコンテンツ生成リクエストを送信
    const result = await model.generateContent(prompt);
    // result.response は EnhancedGenerateContentResponse 型（オブジェクト）と仮定し、その中の text プロパティを返す
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};
