// useTypewriter.ts
import { useState, useRef } from 'react';

export type TypewriterResult = {
  typedSections: string[];
  showSectionCards: boolean[];
  currentSectionIndex: number;
  startTypewriterEffect: (finalSections: string[]) => void;
};

export const useTypewriter = (speed: number = 20): TypewriterResult => {
  // typedSections: 現在タイプされている各セクションの文字列
  const [typedSections, setTypedSections] = useState<string[]>([]);
  // showSectionCards: 各セクションのカード表示（タイピング完了）を示すフラグ
  const [showSectionCards, setShowSectionCards] = useState<boolean[]>([]);
  // currentSectionIndex: 現在どのセクションをタイピング中か
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  // 外部から渡された最終的な各セクションの文字列を保持するための ref
  const sectionsRef = useRef<string[]>([]);

  /**
   * startTypewriterEffect
   * 外部から呼び出し、finalSections（完成すべき各セクションの配列）を元にタイピング表示を開始する
   */
  const startTypewriterEffect = (finalSections: string[]) => {
    sectionsRef.current = finalSections;
    // 状態を初期化
    setTypedSections(finalSections.map(() => ""));
    setShowSectionCards(finalSections.map(() => false));
    setCurrentSectionIndex(0);
    if (finalSections.length > 0) {
      typeSection(0);
    }
  };

  /**
   * typeSection
   * 指定した index のセクションについて、タイピング効果をシミュレートする
   */
  const typeSection = (index: number) => {
    const finalSections = sectionsRef.current;
    if (index < 0 || index >= finalSections.length) return;

    // セクションが空の場合は、すぐにカード表示に切り替え、次のセクションへ
    if (!finalSections[index]) {
      setShowSectionCards((prev) => {
        const newArr = [...prev];
        newArr[index] = true;
        return newArr;
      });
      setCurrentSectionIndex(index + 1);
      typeSection(index + 1);
      return;
    }

    let pos = 0;
    const interval = setInterval(() => {
      pos++;
      setTypedSections((prev) => {
        const newArr = [...prev];
        // 指定したセクションの先頭から pos 文字までを表示
        newArr[index] = finalSections[index].substring(0, pos);
        return newArr;
      });
      // タイピングが完了したら
      if (pos >= finalSections[index].length) {
        clearInterval(interval);
        setShowSectionCards((prev) => {
          const newArr = [...prev];
          newArr[index] = true;
          return newArr;
        });
        setCurrentSectionIndex(index + 1);
        // 次のセクションがあれば、再帰的にタイピング開始
        typeSection(index + 1);
      }
    }, speed);
  };

  return { typedSections, showSectionCards, currentSectionIndex, startTypewriterEffect };
};
