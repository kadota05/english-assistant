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
  1. 語彙力（Vocabulary）:
User's English Expressionを分析し、語彙（単語、フレーズ、慣用句や決まり文句）に不足がある場合は、その不足点や改善のためのアドバイスを具体的に述べてください。問題がなければ「good!!!」と記載してください。
  2. 文法力（Grammar）:
User's English Expressionを分析し、文法的な誤りや理解不足が見られる場合、その問題点や改善方法を説明してください。問題がなければ「good!!!」と記載してください。
  3. 自然な表現力（Natural Expressions）:
User's English Expressionを分析し、自然さや文化的背景を踏まえた表現方法に不足や不自然さがあれば具体的に指摘し、改善方法を提案してください。問題がなければ「good!!!」と記載してください。

これらを通じて、Userが自身の英語表現能力を効率的に改善できるような明確で具体的なフィードバックを提供してください。

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


export const fetchExerciseResponse = async (chatResponse: string): Promise<string> => {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("GEMINI API KEY is not defined in the environment variables.");
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are an English learning assistant. You have access to a text called "chatResponse," which includes a section titled "3. Learning Advice." This section describes the user's weaknesses and provides suggestions for improvement in vocabulary, grammar, and natural expression.
  Your task:
  At the beginning of your response, include a brief explanation in brackets [] in natural Japanese (自然な日本語を使用してください) summarizing the user’s main weaknesses and clearly explaining how you tailored the exercises to address those weaknesses. Please use a tone and style similar to these examples:
   - 「語彙力、とくに「あ」みたいにいろんな意味があって混乱しやすい単語を使うのが少し苦手みたいですね。なので、ピッタリの英語を選べるような問題を作りましたよ！」
   - 「日本語を自然な英語にパッと変えるのがちょっと難しいみたいですね。そこで、英語らしく考えるコツを身につけるための問題を用意しました！」
  Then, create 10 Japanese-to-English translation exercises focusing specifically on the user's identified weaknesses.
  Each exercise must follow this exact format:
  [number]. [Japanese sentence] / [Correct English translation] (Short explanation in natural Japanese)
  Number the items from 1 to 10.
  Ensure the Japanese sentences reflect the user's weak points highlighted in "3. Learning Advice."
  Provide correct, natural English translations.
  Include a concise explanation in natural Japanese, clearly explaining the key learning point.
  Output only the bracketed explanation followed by the 10 exercises. Do not include any additional text or commentary beyond these elements.
  [chatresponse]: ${chatResponse}
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