import React from 'react';

export const preprocessLine = (line: string): string => {
  let newLine = line.replace(/^[.\s…・:：]+/, '');
  newLine = newLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return newLine;
};

export const transformSection1 = (text: string): React.ReactNode[] => {
  const lines = text.split('\n').map(preprocessLine);
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

export const transformSection2 = (text: string): React.ReactNode[] => {
  const lines = text.split('\n').map(preprocessLine);
  return lines.map((line, idx) => {
    if (/^\d+\.\s/.test(line)) {
      const splitted = line.split('-')
      const sentence = splitted[0]
      const explanation = splitted.slice(1).join('-').trim().replace(/^-解説:\s*/, '');
      return (
        <p key={idx}>
          <span className="fw-bold fs-5 text-primary">{sentence}</span><br/>
          {explanation}
        </p>
      );
    }
    return <p key={idx}>{line}</p>;
  });
};

export const transformSection3 = (text: string): React.ReactNode[] => {
  const lines = text.split('\n').map(preprocessLine);
  return lines.map((line, idx) => {
    const match = line.match(/^(\d+\.\s.*?:)(.*)/);
    if (match) {
      const prefix = match[1].replace(/<\/?strong>/g, '');
      const rest = match[2].replace(/<\/?strong>/g, '');
      return (
        <p key={idx}>
          <span className="fw-bold text-warning">{prefix}</span>
          {rest}
        </p>
      );
    }
    return <p key={idx}>{line.replace(/<\/?strong>/g, '')}</p>;
  });
};

export const transformCardContent = (text: string, index: number): React.ReactNode[] | string => {
  switch (index) {
    case 0:
      return transformSection1(text);
    case 1:
      return transformSection2(text);
    case 2:
      return transformSection3(text);
    default:
      return text;
  }
};
