import { useState, useEffect } from 'react';

type TypewriterResult = {
  typedSections: string[];
  showSectionCards: boolean[];
  currentSectionIndex: number;
}

export const useTypewriter = (sections: string[], speed: number = 20): TypewriterResult => {
  const [typedSections, setTypedSections] = useState<string[]>(sections.map(() => ""));
  const [showSectionCards, setShowSectionCards] = useState<boolean[]>(sections.map(() => false));
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  useEffect(() => {
    // セクションが更新されたとき、状態を初期化して最初のセクションからタイピング開始
    setTypedSections(sections.map(() => ""));
    setShowSectionCards(sections.map(() => false));
    setCurrentSectionIndex(0);
    if (sections.length > 0) {
      typeSection(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const typeSection = (index: number) => {
    if (index < 0 || index >= sections.length) return;
    // セクションが空の場合は、すぐにカード表示に切り替え、次のセクションへ
    if (!sections[index]) {
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
        newArr[index] = sections[index].substring(0, pos);
        return newArr;
      });
      if (pos >= sections[index].length) {
        clearInterval(interval);
        setShowSectionCards((prev) => {
          const newArr = [...prev];
          newArr[index] = true;
          return newArr;
        });
        setCurrentSectionIndex(index + 1);
        typeSection(index + 1);
      }
    }, speed);
  };

  return { typedSections, showSectionCards, currentSectionIndex };
};
