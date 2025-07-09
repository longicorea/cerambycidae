'use client'

import { useState, useEffect, useRef } from "react";
import { CollDataType } from "@src/data/collData";

interface AutocompleteSearchProps {
  collData: CollDataType[];
  onSearch: (searchText: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AutocompleteSearch({ 
  collData, 
  onSearch, 
  placeholder = "검색어를 입력하세요...",
  className = ""
}: AutocompleteSearchProps) {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 퍼지 매칭 함수 - 부분 문자열과 순서가 맞는 문자들을 찾음
  const fuzzyMatch = (searchTerm: string, target: string): boolean => {
    console.log(`Fuzzy matching: "${searchTerm}" in "${target}"`);
    const search = searchTerm.toLowerCase();
    const text = target.toLowerCase();
    
    // 완전 포함 검사 (기존 방식)
    if (text.includes(search)) return true;
    
    // 순서가 맞는 부분 문자열 검사
    let searchIndex = 0;
    for (let i = 0; i < text.length && searchIndex < search.length; i++) {
      if (text[i] === search[searchIndex]) {
        searchIndex++;
      }
    }
    
    return searchIndex === search.length;
  };

  useEffect(() => {
    if (searchText.length > 0) {
      const suggestionMap = new Map<string, number>();
      
      collData.forEach(item => {
        console.log(collData)
        const fields = [
          item.name_ko,
          item.genus_name,
          item.family_name,
          item.subfamily_name,
          `${item.genus_name} ${item.species_name}`
        ];
        
        fields.forEach(field => {
          if (field && fuzzyMatch(searchText, field)) {
            // 완전 포함이면 높은 점수, 퍼지 매칭이면 낮은 점수
            const score = field.toLowerCase().includes(searchText.toLowerCase()) ? 2 : 1;
            if (!suggestionMap.has(field) || suggestionMap.get(field)! < score) {
              suggestionMap.set(field, score);
            }
          }
        });
      });
      
      // 점수순으로 정렬하여 완전 매칭을 우선 표시
      const filteredSuggestions = Array.from(suggestionMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([suggestion]) => suggestion)
        .slice(0, 8);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [searchText, collData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion: string|undefined) => {
    if(!suggestion) return;
    setSearchText(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="border rounded-full h-20 w-full text-[30px] px-6 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              ref={(el) => {
                suggestionRefs.current[index] = el;
                return;
              }}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors ${
                index === selectedIndex ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}