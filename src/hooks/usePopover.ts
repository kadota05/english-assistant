import { useEffect } from 'react';
import { Popover } from 'bootstrap';

export const usePopover = (ref: React.RefObject<HTMLElement | null>, options: Record<string, any>) => {
  useEffect(() => {
    if (ref.current) {
      const popover = new Popover(ref.current, options);
      return () => {
        popover.dispose();
      };
    }
  }, []);
};

