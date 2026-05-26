import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import KeywordSearchBar from './KeywordSearchBar';

export default function FilterHeaderPortal() {
  const location = useLocation();
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHeaderEl(document.querySelector('header'));
  }, []);

  if (location.pathname !== '/' || !headerEl) {
    return null;
  }

  return createPortal(<KeywordSearchBar />, headerEl);
}
