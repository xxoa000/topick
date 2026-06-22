import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KeywordSearchForm from './KeywordSearchForm';
import { useFilterSearch } from '../context/FilterSearchContext';
import type { FilterNavigateState } from '../types/navigate';
import '../styles/filterKeywordSearch.scss';

function isFilterPath(pathname: string) {
  return pathname === '/filter' || pathname.startsWith('/filter/');
}

export default function KeywordSearchBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchKeyword, submitKeywordSearch } = useFilterSearch();
  const onFilterPage = isFilterPath(location.pathname);

  const [inputValue, setInputValue] = useState(searchKeyword);
  const [homeKeyword, setHomeKeyword] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (onFilterPage) {
      setInputValue(searchKeyword);
    }
  }, [searchKeyword, onFilterPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    try {
      if (onFilterPage) {
        await submitKeywordSearch(inputValue);
      } else {
        const trimmed = inputValue.trim();
        setHomeKeyword(trimmed);
        navigate('/filter', {
          state: { keyword: trimmed } satisfies FilterNavigateState,
        });
      }
    } finally {
      setSearching(false);
    }
  };

  const handleClear = async () => {
    setInputValue('');
    setSearching(true);
    try {
      if (onFilterPage) {
        await submitKeywordSearch('');
      } else {
        setHomeKeyword('');
        navigate('/filter', { state: { keyword: '' } satisfies FilterNavigateState });
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <KeywordSearchForm
      inputValue={inputValue}
      activeKeyword={onFilterPage ? searchKeyword : homeKeyword}
      searching={searching}
      onInputChange={setInputValue}
      onSubmit={handleSubmit}
      onClear={handleClear}
    />
  );
}
