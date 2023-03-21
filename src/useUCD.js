import { useEffect, useState } from 'react';

export function useUCD () {
  const [ucd, setUCD] = useState(null);

  useEffect(() => {
    if (!ucd) {
      import('ijmacd.ucd').then(({ default: ucd }) => {
        setUCD(ucd);
      });
    }
  }, [ucd]);

  return ucd;
}