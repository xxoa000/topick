import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import FoodTypeFilterBar from './FoodTypeFilterBar';

export default function FilterHeaderPortal() {
  const location = useLocation();
  const [slotEl, setSlotEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSlotEl(document.getElementById('food-type-slot'));
  }, []);

  const isFilterPage =
    location.pathname === '/filter' || location.pathname.startsWith('/filter/');

  if (!isFilterPage || !slotEl) {
    return null;
  }

  return createPortal(<FoodTypeFilterBar />, slotEl);
}
