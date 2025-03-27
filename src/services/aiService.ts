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
-正しい英文: [Here you should provide the correct English expression or "excellent!" in Japanese if the user's expression is already correct.]
-解説: [Write your explanation in Japanese. If the user's expression is correct and natural, respond with either "excellent!" or "Your expression is natural and excellent!" in Japanese. If the expression is incorrect or unnatural, provide the correct English expression and explain in Japanese what aspects are unnatural or incorrect and how to fix them.]

2. Five Alternative Natural Expressions:
[Provide five alternative English expressions in the following format, but the explanation/description for each expression must be in Japanese:
1. Expression 1
2. Expression 2
3. Expression 3
4. Expression 4
5. Expression 5
]

3. Learning Advice:
[Analyze the user's English expression and identify at least three specific areas (e.g., use of articles, tense consistency, preposition usage, vocabulary limitations) where the user’s grammar or expression skills are lacking. Write all of your advice in Japanese.]

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
