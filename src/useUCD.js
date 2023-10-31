import { useEffect, useState } from 'react';

/**
 *
 * @returns {import('ijmacd.ucd')?}
 */
export function useUCD () {
  const [ucd, setUCD] = useState(null);

  useEffect(() => {
    import('ijmacd.ucd').then(({ default: ucd }) => {
      setUCD(ucd);
    });
  }, []);

  return ucd;
}