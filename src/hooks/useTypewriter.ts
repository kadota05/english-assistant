// useTypewriter.ts
import { useState, useEffect, useRef } from 'react';

export type TypeWriterResult = {
  typedSections: string[];
  showSectionCards: boolean[];
  currentSectionIndex: number;
};

export const useTypewriter = (sections: string[], speed: number): TypeWriterResult => {
  // セクション数に合わせた初期状態を生成
  const [typedSections, setTypedSections] = useState<string[]>(Array(sections.length).fill(''));
  const [showSectionCards, setShowSectionCards] = useState<boolean[]>(Array(sections.length).fill(false));
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  // 現在動作中のinterval IDを保持するref
  const intervalRef = useRef<number | null>(null);

  const clearCurrentInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const typeSection = (index: number, sections: string[]) => {
    if (index < 0 || index >= sections.length) return;
    // 空文字なら即完了扱いにする
    if (!sections[index]) {
      setShowSectionCards(prev => {
        const newArr = [...prev];
        newArr[index] = true;
        return newArr;
      });
      setCurrentSectionIndex(index + 1);
      typeSection(index + 1, sections);
      return;
    }
    let pos = 0;
    // 前回のintervalが残っている場合はクリア
    clearCurrentInterval();
    intervalRef.current = window.setInterval(() => {
      pos++;
      setTypedSections(prev => {
        const newArr = [...prev];
        newArr[index] = sections[index].substring(0, pos);
        return newArr;
      });
      if (pos >= sections[index].length) {
        clearCurrentInterval();
        setShowSectionCards(prev => {
          const newArr = [...prev];
          newArr[index] = true;
          return newArr;
        });
        setCurrentSectionIndex(index + 1);
        typeSection(index + 1, sections);
      }
    }, speed);
  };

  useEffect(() => {
    // 新しいsectionsが渡されたら状態をリセット
    clearCurrentInterval();
    setTypedSections(Array(sections.length).fill(''));
    setShowSectionCards(Array(sections.length).fill(false));
    setCurrentSectionIndex(0);
    if (sections.length > 0) {
      typeSection(0, sections);
    }
    return () => {
      clearCurrentInterval();
    };
  }, [sections, speed]);

  return { typedSections, showSectionCards, currentSectionIndex };
};
