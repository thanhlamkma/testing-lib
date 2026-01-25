/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppstoreOutlined,
  FunctionOutlined,
  NumberOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Flex, theme, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// --- Mock Data: @ Trigger ---
// const MENTION_OPTIONS: { id: string; label: string; type: string }[] = [
//     { id: 'sales_org', label: 'Sales Organization', type: 'string' },
//     { id: 'status_msg', label: 'Status Bar Message', type: 'string' },
//     { id: 'customer_name', label: 'Customer Name', type: 'string' },
//     { id: 'order_id', label: 'Order ID', type: 'int' },
//     { id: 'created_by', label: 'Created By', type: 'string' },
// ];

// --- System Items (Built-in, fixed at top) ---
const SYSTEM_ITEMS = [
  { id: 'statmsg', label: 'Status Bar Message', type: 'system' },
  { id: 'popupmsg', label: 'Popup Message', type: 'system' }
];

// --- Mock Data: # Trigger ---
const FRUIT_OPTIONS = [
  { id: 'apple', label: 'Apple', type: 'string' },
  { id: 'banana', label: 'Banana', type: 'int' },
  { id: 'orange', label: 'Orange', type: 'boolean' },
  { id: 'grape', label: 'Grape', type: 'string' },
  { id: 'strawberry', label: 'Strawberry', type: 'int' }
];

// --- Mock Data: $ Trigger ---
const FUNCTION_OPTIONS = [
  { id: 'today', label: 'string today()', type: 'function' },
  { id: 'add', label: 'int add(int, int)', type: 'function' },
  { id: 'toUpperCase', label: 'string toUpperCase(string)', type: 'function' },
  { id: 'substring', label: 'string substring(string, int, int)', type: 'function' },
  { id: 'concat', label: 'string concat(string, string)', type: 'function' },
  { id: 'isValid', label: 'boolean isValid(boolean)', type: 'function' },
  { id: 'calcTax', label: 'int calcTax(int, boolean)', type: 'function' },
  { id: 'replace', label: 'string replace(string, string, string)', type: 'function' },
  { id: 'range', label: 'int range(int, int, int)', type: 'function' }
];

// --- Validation Metadata ---
const FUNCTION_DEFS = {
  today: [],
  add: ['int', 'int'],
  toUpperCase: ['string'],
  substring: ['string', 'int', 'int'],
  concat: ['string', 'string'],
  isValid: ['boolean'],
  calcTax: ['int', 'boolean'],
  replace: ['string', 'string', 'string'],
  range: ['int', 'int', 'int']
};

// Return Type Definitions
const FUNCTION_RETURNS = {
  today: 'string',
  add: 'int',
  toUpperCase: 'string',
  substring: 'string',
  concat: 'string',
  isValid: 'boolean',
  calcTax: 'int',
  replace: 'string',
  range: 'int'
};

// --- Hangul to English Converter ---
const CHOSUNG = [
  'r',
  'R',
  's',
  'e',
  'E',
  'f',
  'a',
  'q',
  'Q',
  't',
  'T',
  'd',
  'w',
  'W',
  'c',
  'z',
  'x',
  'v',
  'g'
];
const JUNGSEUNG = [
  'k',
  'o',
  'i',
  'O',
  'j',
  'p',
  'u',
  'P',
  'h',
  'hk',
  'ho',
  'hl',
  'y',
  'n',
  'nj',
  'np',
  'nl',
  'b',
  'm',
  'ml',
  'l'
];
const JONGSEUNG = [
  '',
  'r',
  'R',
  'rt',
  's',
  'sw',
  'sg',
  'e',
  'f',
  'fr',
  'fa',
  'fq',
  'ft',
  'fx',
  'fv',
  'fg',
  'a',
  'q',
  'qt',
  't',
  'T',
  'd',
  'w',
  'c',
  'z',
  'x',
  'v',
  'g'
];

const hangulToEnglish = (text: string): string => {
  let result = '';
  const decomposed = text.normalize('NFD');
  for (let i = 0; i < decomposed.length; i++) {
    const code = decomposed.charCodeAt(i);
    if (code >= 0x1100 && code <= 0x1112) result += CHOSUNG[code - 0x1100] || '';
    else if (code >= 0x1161 && code <= 0x1175) result += JUNGSEUNG[code - 0x1161] || '';
    else if (code >= 0x11a8 && code <= 0x11c2) result += JONGSEUNG[code - 0x11a8] || '';
    else result += decomposed[i];
  }
  return result;
};

interface JsonDataItem {
  type: string;
  value: string;
}

interface TraversalRange {
  start: number;
  end: number;
}

type FunctionDefKey = keyof typeof FUNCTION_DEFS;
type FunctionReturnKey = keyof typeof FUNCTION_RETURNS;

interface VarTextInputProps {
  valList?: any[];
  title?: string;
  variableList?: any[];
  onChange?: (value: any[]) => void;
}

const TagInput = ({ valList, title = 'Result', variableList, onChange }: VarTextInputProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  // Input 컴포넌트의 토큰 가져오기
  const inputToken = token.Input || {};

  const [htmlContent, setHtmlContent] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [sourceOptions, setSourceOptions] = useState<{ id: string; label: string; type: string }[]>(
    []
  );
  const [currentOptions, setCurrentOptions] = useState<
    { id: string; label: string; type: string }[]
  >([]);
  const [mentionOptions, setMentionOptions] = useState<
    { id: string; label: string; type: string }[]
  >([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [query, setQuery] = useState('');
  const [triggerType, setTriggerType] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [isEditingInsideChip, setIsEditingInsideChip] = useState(false);
  const [expectedTypeFilter, setExpectedTypeFilter] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  const closeBtnIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.85523 1.37025C9.8555 1.37025 9.85577 1.37052 9.8563 1.37105L10.6289 2.14382C10.6295 2.14422 10.6296 2.14449 10.6297 2.14489C10.6298 2.14515 10.6298 2.14543 10.6297 2.14569C10.6297 2.1461 10.6295 2.14636 10.6289 2.1469L6.77581 6.00002L10.6289 9.85315C10.6295 9.85368 10.6296 9.85395 10.6297 9.85435C10.6298 9.85466 10.6298 9.85499 10.6297 9.85529C10.6297 9.85556 10.6295 9.85583 10.6289 9.85636L9.85617 10.629C9.85577 10.6295 9.8555 10.6297 9.85523 10.6298C9.85493 10.6299 9.8546 10.6299 9.85429 10.6298C9.85389 10.6298 9.85362 10.6295 9.85309 10.629L5.99996 6.77587L2.14684 10.629C2.1463 10.6295 2.14604 10.6297 2.14563 10.6298C2.14533 10.6299 2.145 10.6299 2.1447 10.6298C2.14443 10.6298 2.14416 10.6295 2.14362 10.629L1.37099 9.85623C1.37045 9.85583 1.37032 9.85556 1.37019 9.85529C1.37009 9.85499 1.37009 9.85466 1.37019 9.85435C1.37019 9.85395 1.37045 9.85368 1.37099 9.85315L5.22412 6.00002L1.37099 2.1469C1.37045 2.14636 1.37032 2.1461 1.37019 2.14569C1.37009 2.14539 1.37009 2.14506 1.37019 2.14476C1.37019 2.14449 1.37045 2.14422 1.37099 2.14369L2.14376 1.37105C2.14416 1.37052 2.14443 1.37038 2.1447 1.37025C2.145 1.37015 2.14533 1.37015 2.14563 1.37025C2.14604 1.37025 2.1463 1.37052 2.14684 1.37105L5.99996 5.22418L9.85309 1.37105C9.85362 1.37052 9.85389 1.37038 9.85429 1.37025C9.8546 1.37015 9.85493 1.37015 9.85523 1.37025Z" fill="var(--icon-color)"/>
        </svg>`;

  // InputValueItem[]을 HTML로 변환하는 함수
  const convertValListToHTML = (items: any[] | undefined): string => {
    if (!items || items.length === 0) {
      return '';
    }

    return items
      .map((item) => {
        if (item.type === 'TEXT') {
          // 텍스트는 HTML 이스케이프 처리
          return item.value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');
        } else if (item.type === 'SYSTEM') {
          // SYSTEM 타입 칩 생성 (노란색)
          // Find the label from SYSTEM_ITEMS using the id
          const systemItem = SYSTEM_ITEMS.find((si) => si.id === item.value);
          const displayLabel = systemItem ? systemItem.label : item.value;
          return `<span data-container-id="close-icon-container" data-type="mention" data-value="${item.value}" contenteditable="false" style="display: inline-flex; align-items: center; padding: 0 4px 0 8px; margin: 2px; font-size: 13px; line-height: 22px; border-radius: 4px; background-color: var(--warning-bg); border: 1px solid var(--warning-border); color: var(--warning-text); cursor: default; user-select: none; font-family: ${token.fontFamily}; vertical-align: 2px; transition: border-color 0.2s;"><span>${displayLabel}</span><span contenteditable="false" tabindex="-1" style="display: inline-flex; align-items: center; justify-content: center; margin-left: 4px; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; transition: all 0.2s; outline: none;">${closeBtnIcon}</span></span>`;
        } else if (item.type === 'VARIABLE') {
          // @{변수명} 형태의 칩 생성 (container > labelSpan + closeBtn 구조)
          return `<span data-container-id="close-icon-container" data-type="mention" data-value="${item.value}" contenteditable="false" style="display: inline-flex; align-items: center; padding: 0 4px 0 8px; margin: 2px; font-size: 13px; line-height: 22px; border-radius: 4px; background-color: ${token.colorPrimaryBg}; border: 1px solid ${token.colorInfoBorder}; color: ${token.colorPrimaryText}; cursor: default; user-select: none; font-family: ${token.fontFamily}; vertical-align: 2px; transition: border-color 0.2s;"><span>${item.value}</span><span contenteditable="false" tabindex="-1" style="display: inline-flex; align-items: center; justify-content: center; margin-left: 4px; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; transition: all 0.2s; outline: none;">${closeBtnIcon}</span></span>`;
        } else if (item.type === 'HASHTAG') {
          // #{태그명} 형태의 칩 생성 (container > labelSpan + closeBtn 구조)
          return `<span data-container-id="close-icon-container" data-type="hash" data-value="${item.value}" contenteditable="false" style="display: inline-flex; align-items: center; padding: 0 4px 0 8px; margin: 2px; font-size: 13px; line-height: 22px; border-radius: 4px; background-color: ${token.colorSuccessBg}; border: 1px solid ${token.colorSuccessBorder}; color: ${token.colorSuccessText}; cursor: default; user-select: none; font-family: ${token.fontFamily}; vertical-align: 2px; transition: border-color 0.2s;"><span>${item.value}</span><span contenteditable="false" tabindex="-1" style="display: inline-flex; align-items: center; justify-content: center; margin-left: 4px; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; transition: all 0.2s; outline: none;">${closeBtnIcon}</span></span>`;
        } else if (item.type === 'FUNCTION') {
          // 함수 형태의 칩 생성 (container > labelSpan + closeBtn 구조)
          return `<span data-container-id="close-icon-container" data-type="function" data-value="${item.value}" contenteditable="false" tabindex="-1" style="background-color: #F9F0FF; color: #722ED1; border: 1px solid #D3ADF7; border-radius: 2px; padding: 0 4px; margin: 2px; font-size: 13px; vertical-align: baseline; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;"><span contenteditable="true" style="outline: none; cursor: text; min-width: 10px;">${item.value}</span><span contenteditable="false" tabindex="-1" style="cursor: pointer; margin-left: 2px;">${closeBtnIcon}</span></span>`;
        }
        return '';
      })
      .join('');
  };

  // HTML로 생성된 칩에 이벤트 리스너를 바인딩하는 함수
  const bindChipEvents = () => {
    if (!editorRef.current) return;

    // 모든 칩의 닫기 버튼에 이벤트 추가
    const chips = editorRef.current.querySelectorAll(
      '[data-type="mention"], [data-type="hash"], [data-type="function"]'
    );

    chips.forEach((chip) => {
      const chipElement = chip as HTMLElement;
      const closeBtn = chipElement.querySelector(
        '[data-container-id="close-icon-container"] svg'
      ) as HTMLElement;

      if (!closeBtn) return;

      // 기존 이벤트 제거 (중복 방지)
      const newCloseBtn = closeBtn.cloneNode(true) as HTMLElement;
      closeBtn.parentNode?.replaceChild(newCloseBtn, closeBtn);

      const chipType = chipElement.dataset.type;

      // 닫기 버튼 클릭 이벤트
      newCloseBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        chipElement.remove();
        parseContent();
        setValidationError(null);
      };

      // 변수/해시태그 칩의 경우 hover 이벤트 추가
      if (chipType === 'mention' || chipType === 'hash') {
        newCloseBtn.onmouseenter = () => {
          newCloseBtn.style.backgroundColor = 'rgba(0,0,0,0.06)';
          newCloseBtn.style.opacity = '1';
        };
        newCloseBtn.onmouseleave = () => {
          if (document.activeElement !== newCloseBtn) {
            newCloseBtn.style.backgroundColor = 'transparent';
            newCloseBtn.style.opacity = '0.6';
          }
        };
        newCloseBtn.onfocus = () => {
          newCloseBtn.style.backgroundColor = 'rgba(255, 0, 0, 0.15)';
          newCloseBtn.style.color = token.colorError;
          newCloseBtn.style.opacity = '1';
        };
        newCloseBtn.onblur = () => {
          newCloseBtn.style.backgroundColor = 'transparent';
          const textColor = chipType === 'hash' ? token.colorSuccessText : token.colorPrimaryText;
          newCloseBtn.style.color = textColor;
          newCloseBtn.style.opacity = '0.6';
        };
      }

      // 키보드 이벤트
      newCloseBtn.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          chipElement.remove();
          parseContent();
          setValidationError(null);
          if (editorRef.current) {
            editorRef.current.focus();
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          const range = document.createRange();
          range.setStartAfter(chipElement);
          range.collapse(true);
          const sel = window.getSelection();
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
          }
          if (editorRef.current) {
            editorRef.current.focus();
          }
        }
      };

      // 함수 칩의 경우 labelSpan에 이벤트 추가
      if (chipType === 'function') {
        const labelSpan = chipElement.querySelector('span:first-child') as HTMLElement;
        if (labelSpan && labelSpan.isContentEditable) {
          labelSpan.onkeydown = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          };

          // 초기 validation
          validateFunctionTag(chipElement, labelSpan.innerText);
        }
      }
    });
  };

  // 컴포넌트 마운트 시 초기 valList 반영
  useEffect(() => {
    if (!editorRef.current) return;

    const initialHTML = convertValListToHTML(valList);
    editorRef.current.innerHTML = initialHTML;
    setHtmlContent(initialHTML);
    setValidationError(null);

    // 이벤트 바인딩
    setTimeout(() => bindChipEvents(), 0);
  }, []);

  // valList가 변경될 때 contentEditable 영역 업데이트
  useEffect(() => {
    if (!editorRef.current) return;

    // 내부 업데이트로 인한 변경이면 무시 (무한 루프 방지)
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    // valList를 HTML로 변환
    const newHTML = convertValListToHTML(valList);

    // 현재 HTML과 다른 경우에만 업데이트
    if (editorRef.current.innerHTML !== newHTML) {
      editorRef.current.innerHTML = newHTML;
      setHtmlContent(newHTML);
      setValidationError(null);

      // 이벤트 바인딩
      setTimeout(() => bindChipEvents(), 0);
    }
  }, [valList, token]);

  useEffect(() => {
    const variableOpts =
      variableList?.map((item) => ({
        id: item.variableKey,
        label: item.variableKey,
        type: 'VARIABLE'
      })) ?? [];

    // SYSTEM 아이템을 먼저 추가하고, 그 뒤에 VARIABLE 추가
    const tmpMentionOpts = [...SYSTEM_ITEMS, ...variableOpts];
    setMentionOptions(tmpMentionOpts);

    let tmpSrcOpts = [];
    if (triggerType === '#') {
      setSourceOptions(FRUIT_OPTIONS);
      tmpSrcOpts = FRUIT_OPTIONS;
    } else if (triggerType === '$') {
      setSourceOptions(FUNCTION_OPTIONS);
      tmpSrcOpts = FUNCTION_OPTIONS;
    } else {
      setSourceOptions(tmpMentionOpts);
      tmpSrcOpts = tmpMentionOpts;
    }

    const currentOptions = tmpSrcOpts.filter((opt) => {
      const lowerQuery = query.toLowerCase();
      let matchesQuery = false;
      if (opt.label.toLowerCase().includes(lowerQuery)) matchesQuery = true;
      else {
        const convertedQuery = hangulToEnglish(query).toLowerCase();
        if (convertedQuery && opt.label.toLowerCase().includes(convertedQuery)) matchesQuery = true;
      }

      if (!matchesQuery) return false;

      if (
        isEditingInsideChip &&
        (triggerType === '@' || triggerType === '#' || triggerType === '$') &&
        expectedTypeFilter
      ) {
        if (opt.type === 'function') {
          const returnType =
            opt.id in FUNCTION_RETURNS ? FUNCTION_RETURNS[opt.id as FunctionReturnKey] : undefined;
          if (returnType !== expectedTypeFilter) return false;
        } else {
          if (opt.type !== expectedTypeFilter) return false;
        }
      }

      return true;
    });

    setCurrentOptions(currentOptions);
  }, [triggerType, query, variableList, isEditingInsideChip, expectedTypeFilter]);

  // 드롭다운이 처음 열릴 때만 초기 선택 항목 설정
  const prevShowDropdown = useRef(false);
  useEffect(() => {
    if (showDropdown && !prevShowDropdown.current) {
      setSelectedIndex(0);
    }
    prevShowDropdown.current = showDropdown;
  }, [showDropdown]);

  // selectedIndex가 변경될 때 스크롤 조정
  useEffect(() => {
    if (showDropdown && dropdownRef.current) {
      const selectedElement = dropdownRef.current.querySelector(
        `li:nth-child(${selectedIndex + 1})`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, showDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        editorRef.current &&
        !editorRef.current.contains(target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Helper: 파라미터 파싱 ---
  const splitNestedArgs = (argsStr: string): string[] => {
    const args: string[] = [];
    let current = '';
    let depth = 0;
    let inQuote = false;
    let inBrace = false;

    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];
      if (char === '"') inQuote = !inQuote;

      if (char === '(' && !inQuote) depth++;
      else if (char === ')' && !inQuote) depth--;

      if (char === '{' && !inQuote) inBrace = true;
      else if (char === '}' && !inQuote) inBrace = false;

      if (char === ',' && depth === 0 && !inQuote && !inBrace) {
        args.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current.trim()) args.push(current.trim());
    return args;
  };

  // --- Helper: 리터럴 타입 검사 ---
  const isLiteralType = (value: string, type: string): boolean => {
    if (type === 'int') return /^-?\d+$/.test(value);
    if (type === 'boolean') return value === 'true' || value === 'false';
    if (type === 'string') return value.startsWith('"') && value.endsWith('"');
    return false;
  };

  // --- Helper: 커서 위치의 기대 타입 추론 ---
  const getExpectedTypeAtCaret = (fullText: string, caretOffset: number): string | null => {
    const stack: Array<{ funcName: string | null; argIndex: number }> = [];
    let inQuote = false;
    let lastTokenEnd = 0;

    for (let i = 0; i < fullText.length; i++) {
      if (i === caretOffset) break;

      const char = fullText[i];

      if (char === '"') {
        inQuote = !inQuote;
      } else if (!inQuote) {
        if (char === '(') {
          let j = i - 1;
          while (j >= lastTokenEnd && /\s/.test(fullText[j])) j--;
          const endName = j + 1;
          while (j >= lastTokenEnd && /[a-zA-Z0-9_]/.test(fullText[j])) j--;
          const funcName = fullText.slice(j + 1, endName);

          if (funcName in FUNCTION_DEFS) {
            stack.push({ funcName, argIndex: 0 });
          } else {
            stack.push({ funcName: null, argIndex: 0 });
          }
          lastTokenEnd = i + 1;
        } else if (char === ')') {
          if (stack.length > 0) stack.pop();
          lastTokenEnd = i + 1;
        } else if (char === ',') {
          if (stack.length > 0) {
            stack[stack.length - 1].argIndex++;
          }
          lastTokenEnd = i + 1;
        }
      }
    }

    if (stack.length > 0) {
      const { funcName, argIndex } = stack[stack.length - 1];
      if (funcName && funcName in FUNCTION_DEFS) {
        const paramTypes = FUNCTION_DEFS[funcName as FunctionDefKey];
        if (argIndex < paramTypes.length) {
          return paramTypes[argIndex];
        }
      }
    }
    return null;
  };

  // --- Recursive Validation Logic ---
  const validateExpression = (
    value: string,
    expectedType: string
  ): { valid: boolean; error?: string } => {
    const cleanValue = value.trim();

    if (isLiteralType(cleanValue, expectedType)) {
      return { valid: true };
    }

    if (cleanValue.startsWith('@{') && cleanValue.endsWith('}')) {
      const label = cleanValue.slice(2, -1);
      const option = mentionOptions.find((o) => o.label === label);
      if (!option)
        return {
          valid: false,
          error: t('ptee.message.testScenario.varTextInput.undefinedVariable', { label })
        };
      if (option.type !== expectedType)
        return {
          valid: false,
          error: t('ptee.message.testScenario.varTextInput.typeMismatch', {
            label,
            actualType: option.type,
            expectedType
          })
        };
      return { valid: true };
    }
    if (cleanValue.startsWith('#{') && cleanValue.endsWith('}')) {
      const label = cleanValue.slice(2, -1);
      const option = FRUIT_OPTIONS.find((o) => o.label === label);
      if (!option)
        return {
          valid: false,
          error: t('ptee.message.testScenario.varTextInput.undefinedTag', { label })
        };
      if (option.type !== expectedType)
        return {
          valid: false,
          error: t('ptee.message.testScenario.varTextInput.typeMismatch', {
            label,
            actualType: option.type,
            expectedType
          })
        };
      return { valid: true };
    }

    const openParen = cleanValue.indexOf('(');
    const closeParen = cleanValue.lastIndexOf(')');

    if (openParen > 0 && closeParen === cleanValue.length - 1) {
      const funcName = cleanValue.slice(0, openParen);
      const argsStr = cleanValue.slice(openParen + 1, closeParen);

      if (!(funcName in FUNCTION_RETURNS)) {
        return {
          valid: false,
          error: t('ptee.message.testScenario.varTextInput.unknownFunction', { funcName })
        };
      }

      const returnType = FUNCTION_RETURNS[funcName as FunctionReturnKey];
      if (returnType !== expectedType) {
        return {
          valid: false,
          error: t('ptee.message.testScenario.varTextInput.typeMismatch', {
            label: funcName,
            actualType: returnType,
            expectedType
          })
        };
      }

      const paramTypes = funcName in FUNCTION_DEFS ? FUNCTION_DEFS[funcName as FunctionDefKey] : [];
      if (paramTypes.length === 0 && argsStr.trim() !== '') {
        return {
          valid: false,
          error: t('ptee.message.testScenario.varTextInput.functionNoParams', { funcName })
        };
      }
      if (paramTypes.length === 0) return { valid: true };

      const args = splitNestedArgs(argsStr);
      if (args.length !== paramTypes.length) {
        return {
          valid: false,
          error: t('ptee.message.testScenario.varTextInput.paramCountMismatch', {
            funcName,
            expected: paramTypes.length
          })
        };
      }

      for (let i = 0; i < args.length; i++) {
        const result = validateExpression(args[i], paramTypes[i]);
        if (!result.valid) {
          return result;
        }
      }

      return { valid: true };
    }

    return {
      valid: false,
      error: t('ptee.message.testScenario.varTextInput.invalidFormat', { expectedType })
    };
  };

  // --- Top Level Validation ---
  const validateFunctionTag = (container: HTMLElement, text: string): boolean => {
    const openParen = text.indexOf('(');
    const closeParen = text.lastIndexOf(')');

    if (openParen === -1 || closeParen === -1) {
      container.style.borderColor = token.colorError;
      setValidationError(t('ptee.message.testScenario.varTextInput.invalidFunctionFormat'));
      return false;
    }

    const funcName = text.slice(0, openParen);
    const argsStr = text.slice(openParen + 1, closeParen);

    const expectedTypes =
      funcName in FUNCTION_DEFS ? FUNCTION_DEFS[funcName as FunctionDefKey] : undefined;
    if (!expectedTypes) {
      container.style.borderColor = '#D3ADF7';
      setValidationError(null);
      return true;
    }

    if (expectedTypes.length === 0) {
      if (argsStr.trim() !== '') {
        container.style.borderColor = token.colorError;
        setValidationError(
          t('ptee.message.testScenario.varTextInput.functionNoParams', { funcName })
        );
        return false;
      }
      container.style.borderColor = '#D3ADF7';
      setValidationError(null);
      return true;
    }

    const args = splitNestedArgs(argsStr);

    if (args.length !== expectedTypes.length) {
      container.style.borderColor = token.colorError;
      setValidationError(
        t('ptee.message.testScenario.varTextInput.paramCountMismatch', {
          funcName,
          expected: expectedTypes.length
        })
      );
      return false;
    }

    for (let i = 0; i < args.length; i++) {
      const result = validateExpression(args[i], expectedTypes[i]);
      if (!result.valid) {
        container.style.borderColor = token.colorError;
        setValidationError(
          result.error ||
            t('ptee.message.testScenario.varTextInput.paramError', { funcName, index: i + 1 })
        );
        return false;
      }
    }

    container.style.borderColor = '#D3ADF7';
    setValidationError(null);
    return true;
  };

  // --- Nested Traversal Logic ---
  const getTraversalRanges = (text: string, baseOffset = 0): TraversalRange[] => {
    const ranges: TraversalRange[] = [];
    const openParen = text.indexOf('(');
    const closeParen = text.lastIndexOf(')');

    if (openParen === -1 || closeParen === -1) return [];

    const content = text.slice(openParen + 1, closeParen);
    const contentStart = baseOffset + openParen + 1;

    let quoteDepth = 0;
    let parenDepth = 0;
    let braceDepth = 0;
    let lastIdx = 0;
    const args = [];

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      if (char === '"') quoteDepth ^= 1;
      else if (char === '(' && !quoteDepth) parenDepth++;
      else if (char === ')' && !quoteDepth) parenDepth--;
      else if (char === '{' && !quoteDepth) braceDepth++;
      else if (char === '}' && !quoteDepth) braceDepth--;

      if (char === ',' && !quoteDepth && !parenDepth && !braceDepth) {
        args.push({ text: content.slice(lastIdx, i), start: contentStart + lastIdx });
        lastIdx = i + 1;
      }
    }
    args.push({ text: content.slice(lastIdx), start: contentStart + lastIdx });

    args.forEach((arg) => {
      const trimmed = arg.text.trim();
      if (!trimmed) return;

      const argStart = arg.start + arg.text.indexOf(trimmed);
      const argEnd = argStart + trimmed.length;

      if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
        ranges.push({ start: argStart + 1, end: argEnd - 1 });
      } else {
        ranges.push({ start: argStart, end: argEnd });
      }

      const subOpen = trimmed.indexOf('(');
      const subClose = trimmed.lastIndexOf(')');
      if (subOpen !== -1 && subClose !== -1 && subClose > subOpen) {
        const subRanges = getTraversalRanges(trimmed, argStart);
        ranges.push(...subRanges);
      }
    });

    return ranges;
  };

  // --- [New] Get Absolute Offset Helper ---
  // DOM 트리 순회를 통해 현재 커서의 전체 텍스트 내 절대 위치를 계산합니다.
  const getCaretGlobalOffset = (root: Node): number => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;

    // 루트 노드(container) 내에서의 커서 위치를 전체 텍스트 길이로 변환
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(root);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  };

  const selectRangeInNode = (root: Node, start: number, end: number): void => {
    const range = document.createRange();
    let charCount = 0;
    let startNode: Node | null = null;
    let startOffset = 0;
    let endNode: Node | null = null;
    let endOffset = 0;
    let foundStart = false;
    let foundEnd = false;

    const traverse = (node: Node): void => {
      if (foundEnd) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text;
        const nextCharCount = charCount + textNode.length;

        if (!foundStart && start >= charCount && start <= nextCharCount) {
          startNode = node;
          startOffset = start - charCount;
          foundStart = true;
        }

        if (!foundEnd && end >= charCount && end <= nextCharCount) {
          endNode = node;
          endOffset = end - charCount;
          foundEnd = true;
        }

        charCount = nextCharCount;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          traverse(node.childNodes[i]);
        }
      }
    };

    traverse(root);

    if (startNode && endNode) {
      try {
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch (e) {
        console.error('Range Error', e);
      }
    }
  };

  const parseContent = () => {
    if (!editorRef.current) return;
    const nodes = Array.from(editorRef.current.childNodes);
    const result: any[] = [];
    let currentTextBuffer = '';
    const flushText = () => {
      if (currentTextBuffer.length > 0) {
        result.push({ type: 'TEXT', value: currentTextBuffer });
        currentTextBuffer = '';
      }
    };
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        currentTextBuffer += (node.textContent || '').replace(/\u00A0/g, ' ');
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.dataset.type === 'mention') {
          flushText();
          // container > labelSpan + closeBtn 구조에서 labelSpan의 텍스트만 추출
          const labelSpan = element.querySelector('span:first-child');
          const labelValue = labelSpan ? labelSpan.textContent || '' : element.dataset.value || '';
          // SYSTEM_ITEMS에 있는지 확인하여 타입 구분
          const systemItem = SYSTEM_ITEMS.find((item) => item.label === labelValue);
          if (systemItem) {
            result.push({ type: 'SYSTEM', value: systemItem.id });
          } else {
            // VARIABLE의 경우도 id(variableKey)로 저장
            const variableItem = mentionOptions.find(
              (opt) => opt.label === labelValue && opt.type === 'VARIABLE'
            );
            result.push({ type: 'VARIABLE', value: variableItem ? variableItem.id : labelValue });
          }
        } else if (element.dataset.type === 'hash') {
          flushText();
          // container > labelSpan + closeBtn 구조에서 labelSpan의 텍스트만 추출
          const labelSpan = element.querySelector('span:first-child');
          const value = labelSpan ? labelSpan.textContent || '' : element.dataset.value || '';
          result.push({ type: 'HASHTAG', value });
        } else if (element.dataset.type === 'function') {
          flushText();
          // container > labelSpan + closeBtn 구조에서 labelSpan의 텍스트만 추출
          const labelSpan = element.querySelector('span:first-child');
          const currentValue = labelSpan
            ? labelSpan.textContent || ''
            : element.dataset.value || '';
          result.push({ type: 'FUNCTION', value: currentValue });
        } else if (element.tagName === 'BR') currentTextBuffer += '\n';
        else if (element.tagName === 'DIV') {
          flushText();
          currentTextBuffer += '\n' + (element.textContent || '').replace(/\u00A0/g, ' ');
          flushText();
        } else currentTextBuffer += element.textContent || '';
      }
    });
    flushText();

    // 내부 업데이트 플래그 설정 (양방향 바인딩 무한 루프 방지)
    isInternalUpdate.current = true;
    onChange?.(result);
    setHtmlContent(editorRef.current.innerHTML);
  };

  const getCaretCoordinates = () => {
    let x = 0,
      y = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(true);
      const rect = range.getClientRects()[0];
      if (rect && containerRef.current) {
        // Get the container's bounding box to calculate relative position
        const containerRect = containerRef.current.getBoundingClientRect();
        x = rect.left - containerRect.left;
        y = rect.top - containerRect.top + rect.height;
      }
    }
    return { x, y };
  };

  const handleInput = () => {
    parseContent();

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;

    let insideChip = false;
    let expectedType: string | null = null;

    if (
      textNode.parentNode &&
      (textNode.parentNode as HTMLElement).isContentEditable &&
      (textNode.parentNode.parentNode as HTMLElement)?.dataset?.type === 'function'
    ) {
      insideChip = true;
      const labelSpan = textNode.parentNode as HTMLElement;
      const container = labelSpan.parentNode as HTMLElement;

      const caretPos = range.startOffset;
      expectedType = getExpectedTypeAtCaret(labelSpan.innerText, caretPos);

      if (container) {
        validateFunctionTag(container, labelSpan.innerText);
      }
    }
    setIsEditingInsideChip(insideChip);
    setExpectedTypeFilter(expectedType);

    if (textNode.nodeType === Node.TEXT_NODE) {
      const textContent = textNode.textContent || '';
      const caretPos = range.startOffset;
      const textBeforeCaret = textContent.slice(0, caretPos);

      const lastAtPos = textBeforeCaret.lastIndexOf('@');
      //TODO : 함수 및 태그 임시 비활성화
      // const lastHashPos = textBeforeCaret.lastIndexOf('#');
      // const lastDollarPos = textBeforeCaret.lastIndexOf('$');

      let currentTrigger = null;
      let triggerPos = -1;

      //TODO : 함수 및 태그 임시 비활성화
      // const maxPos = Math.max(lastAtPos, lastHashPos, lastDollarPos);
      const maxPos = lastAtPos; // 함수 / 태그 활성화 시 위 주석 활성화

      if (maxPos !== -1) {
        if (maxPos === lastAtPos) currentTrigger = '@';
        //TODO : 함수 및 태그 임시 비활성화
        // else if (maxPos === lastHashPos) currentTrigger = '#';
        // else if (maxPos === lastDollarPos) currentTrigger = '$';
        triggerPos = maxPos;
      }

      if (triggerPos !== -1) {
        if (insideChip && (currentTrigger === '@' || currentTrigger === '#')) {
          if (expectedType && expectedType !== 'string') {
            // Filter logic handled in currentOptions
          }
        }

        const queryText = textBeforeCaret.slice(triggerPos + 1);
        if (!/\s/.test(queryText)) {
          const { x, y } = getCaretCoordinates();

          // 드롭다운 높이 (헤더 + 최대 옵션 높이)
          const dropdownHeight = 300 + 40; // maxHeight 300px + header ~40px
          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - y;

          // 하단 공간이 부족하면 위로 열기
          let finalTop = y + 5;
          if (spaceBelow < dropdownHeight) {
            finalTop = y - dropdownHeight - 5;
          }

          setDropdownPos({ top: finalTop, left: x });
          setQuery(queryText);
          setTriggerType(currentTrigger);
          setShowDropdown(true);
          // 위로 열릴 때는 마지막 항목부터, 아래로 열릴 때는 첫 항목부터
          setSelectedIndex(0); // 일단 0으로 설정 (currentOptions가 업데이트된 후 조정)
          return;
        }
      }
    }
    setShowDropdown(false);
    setTriggerType(null);
  };

  const insertItem = (item: { id: string; label: string; type: string }) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;

    if (
      isEditingInsideChip &&
      (triggerType === '$' || triggerType === '@' || triggerType === '#')
    ) {
      let displayText = item.id;

      if (triggerType === '$') {
        const defs =
          item.id in FUNCTION_DEFS ? FUNCTION_DEFS[item.id as FunctionDefKey] : undefined;
        if (defs) {
          const paramStr = defs.map((t: string) => (t === 'string' ? '""' : t)).join(', ');
          displayText = `${item.id}(${paramStr})`;
        }
      } else {
        displayText = `${triggerType}{${item.label}}`;
      }

      const caretPos = range.startOffset;
      const textContent = textNode.textContent || '';
      const lastTriggerPos = triggerType
        ? textContent.slice(0, caretPos).lastIndexOf(triggerType)
        : -1;

      if (lastTriggerPos !== -1) {
        let startOffset = lastTriggerPos;
        let endOffset = caretPos;

        if (
          lastTriggerPos > 0 &&
          textContent[lastTriggerPos - 1] === '"' &&
          textContent[caretPos] === '"'
        ) {
          startOffset -= 1;
          endOffset += 1;
        }

        range.setStart(textNode, startOffset);
        range.setEnd(textNode, endOffset);
        range.deleteContents();

        if (triggerType === '$') {
          const textNodeToInsert = document.createTextNode(displayText);
          range.insertNode(textNodeToInsert);

          const ranges = getTraversalRanges(displayText);
          if (ranges.length > 0) {
            const firstParam = ranges[0];
            if (firstParam.end <= displayText.length) {
              range.setStart(textNodeToInsert, firstParam.start);
              range.setEnd(textNodeToInsert, firstParam.end);
            } else {
              range.setStartAfter(textNodeToInsert);
              range.setEndAfter(textNodeToInsert);
            }
          } else {
            range.setStartAfter(textNodeToInsert);
            range.setEndAfter(textNodeToInsert);
          }
        } else {
          const innerChip = document.createElement('span');
          innerChip.innerText = displayText;
          innerChip.contentEditable = 'false';
          innerChip.tabIndex = -1;

          const isHash = triggerType === '#';
          const typeKey = isHash ? 'hash' : 'mention';

          // data 속성 설정 (parseContent와 일관성 유지)
          innerChip.dataset.type = typeKey;
          innerChip.dataset.value = item.label;

          const defaultBg = isHash ? token.colorSuccessBg : token.colorPrimaryBg;
          const activeBg = isHash ? token.colorSuccessBorder : token.colorInfoBorder;

          Object.assign(innerChip.style, {
            backgroundColor: defaultBg,
            color: isHash ? token.colorSuccessText : token.colorPrimaryText,
            border: `1px solid ${isHash ? token.colorSuccessBorder : token.colorInfoBorder}`,
            borderRadius: '2px',
            padding: '0 2px',
            margin: '0 1px',
            fontSize: '0.95em',
            verticalAlign: 'baseline',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          });

          innerChip.onclick = (e) => {
            e.stopPropagation();
            innerChip.focus(); // Set focus to trigger visual change

            const selectionInner = window.getSelection();
            const rangeInner = document.createRange();
            rangeInner.selectNode(innerChip);
            if (selectionInner) {
              selectionInner.removeAllRanges();
              selectionInner.addRange(rangeInner);
            }
          };

          innerChip.onfocus = () => {
            innerChip.style.backgroundColor = activeBg;
          };

          innerChip.onblur = () => {
            innerChip.style.backgroundColor = defaultBg;
          };

          range.insertNode(innerChip);
          range.setStartAfter(innerChip);
          range.setEndAfter(innerChip);
        }

        selection.removeAllRanges();
        selection.addRange(range);

        const labelSpan = textNode.parentNode as HTMLElement | null;
        const container = labelSpan?.parentNode as HTMLElement | null;
        if (labelSpan) {
          labelSpan.normalize();
          if (container) {
            validateFunctionTag(container, labelSpan.innerText);
          }
        }
      }

      setShowDropdown(false);
      setQuery('');
      setTriggerType(null);
      return;
    }

    if (textNode.nodeType === Node.TEXT_NODE) {
      const textContent = textNode.textContent || '';
      const caretPos = range.startOffset;
      const lastTriggerPos = triggerType
        ? textContent.slice(0, caretPos).lastIndexOf(triggerType)
        : -1;

      if (lastTriggerPos !== -1) {
        range.setStart(textNode, lastTriggerPos);
        range.setEnd(textNode, caretPos);
        range.deleteContents();

        const container = document.createElement('span');
        container.contentEditable = 'false';

        let typeKey = 'mention';
        if (triggerType === '#') typeKey = 'hash';
        if (triggerType === '$') typeKey = 'function';

        container.dataset.type = typeKey;

        // data-value는 함수의 경우 나중에 설정, 나머지는 바로 설정
        if (triggerType !== '$') {
          container.dataset.value = item.label;
        }

        let bg, border, textColor;

        if (triggerType === '#') {
          bg = token.colorSuccessBg;
          border = token.colorSuccessBorder;
          textColor = token.colorSuccessText;
        } else if (triggerType === '$') {
          bg = '#F9F0FF';
          border = '#D3ADF7';
          textColor = '#722ED1';
        } else {
          // @ 트리거: SYSTEM vs VARIABLE 구분
          const isSystemItem = item.type === 'system';
          if (isSystemItem) {
            bg = 'var(--warning-bg)';
            border = 'var(--warning-border)';
            textColor = 'var(--warning-text)';
          } else {
            bg = token.colorPrimaryBg;
            border = token.colorInfoBorder;
            textColor = token.colorPrimaryText;
          }
        }

        if (triggerType === '$') {
          // 함수 칩 스타일
          Object.assign(container.style, {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 4px',
            margin: '0 1px',
            fontSize: '0.95em',
            borderRadius: '2px',
            backgroundColor: bg,
            border: `1px solid ${border}`,
            color: textColor,
            cursor: 'pointer',
            verticalAlign: 'baseline',
            transition: 'all 0.2s'
          });
        } else {
          // 변수/해시태그 칩 스타일
          Object.assign(container.style, {
            display: 'inline-flex',
            alignItems: 'center',
            height: '24px',
            padding: '0 6px',
            margin: '2px',
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: '135%',
            borderRadius: '4px',
            backgroundColor: bg,
            border: `1px solid ${border}`,
            color: textColor,
            cursor: 'default',
            userSelect: 'none',
            fontFamily: token.fontFamily,
            verticalAlign: '2px',
            transition: 'border-color 0.2s'
          });
        }

        const labelSpan = document.createElement('span');

        if (triggerType === '$') {
          const defs =
            item.id in FUNCTION_DEFS ? FUNCTION_DEFS[item.id as FunctionDefKey] : undefined;
          let displayText = item.label;

          if (defs) {
            const paramStr = defs.map((t: string) => (t === 'string' ? '""' : t)).join(', ');
            displayText = `${item.id}(${paramStr})`;
          }
          labelSpan.innerText = displayText;
          container.dataset.value = displayText;

          labelSpan.contentEditable = 'true';
          labelSpan.style.cursor = 'text';
          labelSpan.style.outline = 'none';
          labelSpan.style.minWidth = '10px';

          labelSpan.onkeydown = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          };

          validateFunctionTag(container, displayText);
        } else {
          labelSpan.innerText = item.label;
        }

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = closeBtnIcon;
        closeBtn.contentEditable = 'false';
        closeBtn.tabIndex = -1;

        if (triggerType === '$') {
          // 함수 칩의 닫기 버튼 스타일
          Object.assign(closeBtn.style, {
            cursor: 'pointer',
            fontSize: '0.9em',
            opacity: '0.6',
            marginLeft: '2px'
          });
        } else {
          // 변수/해시태그 칩의 닫기 버튼 스타일
          Object.assign(closeBtn.style, {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '4px',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'all 0.2s',
            outline: 'none'
          });
        }

        if (triggerType !== '$') {
          // 변수/해시태그 칩의 닫기 버튼 이벤트
          closeBtn.onmouseenter = () => {
            closeBtn.style.backgroundColor = 'rgba(0,0,0,0.06)';
            closeBtn.style.opacity = '1';
          };
          closeBtn.onmouseleave = () => {
            if (document.activeElement !== closeBtn) {
              closeBtn.style.backgroundColor = 'transparent';
              closeBtn.style.opacity = '0.6';
            }
          };
          closeBtn.onfocus = () => {
            closeBtn.style.backgroundColor = 'rgba(255, 0, 0, 0.15)';
            closeBtn.style.color = token.colorError;
            closeBtn.style.opacity = '1';
          };
          closeBtn.onblur = () => {
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = textColor;
            closeBtn.style.opacity = '0.6';
          };
        }

        closeBtn.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            container.remove();
            parseContent();
            setValidationError(null);
            if (editorRef.current) {
              editorRef.current.focus();
            }
          } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            const range = document.createRange();
            range.setStartAfter(container);
            range.collapse(true);
            const sel = window.getSelection();
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(range);
            }
            if (editorRef.current) {
              editorRef.current.focus();
            }
          }
        };

        closeBtn.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          container.remove();
          parseContent();
          setValidationError(null);
        };

        container.appendChild(labelSpan);
        container.appendChild(closeBtn);

        range.insertNode(container);

        range.setStartAfter(container);
        range.setEndAfter(container);
        selection.removeAllRanges();
        selection.addRange(range);

        if (triggerType === '$' && labelSpan.innerText.includes('(')) {
          setTimeout(() => {
            const ranges = getTraversalRanges(labelSpan.textContent || '');
            if (ranges.length > 0) {
              labelSpan.focus();
              selectRangeInNode(labelSpan, ranges[0].start, ranges[0].end);
            }
          }, 10);
        } else {
          setTimeout(() => {
            parseContent();
            if (editorRef.current) {
              editorRef.current.focus();
            }
          }, 0);
        }
      }
    }

    setShowDropdown(false);
    setQuery('');
    setTriggerType(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showDropdown && currentOptions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % currentOptions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + currentOptions.length) % currentOptions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (currentOptions[selectedIndex]) insertItem(currentOptions[selectedIndex]);
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
      }
      return;
    }

    // Prevent Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }

    if (e.key === 'Escape') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const node = selection.anchorNode;
        if (node) {
          const parent = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;

          if (
            parent &&
            (parent as HTMLElement).isContentEditable &&
            (parent.parentNode as HTMLElement)?.dataset?.type === 'function'
          ) {
            e.preventDefault();
            const closeBtn = parent.nextSibling as HTMLElement | null;
            if (closeBtn && closeBtn.innerText === '×') {
              closeBtn.focus();
            }
          }
        }
      }
    }

    if (e.key === 'Delete') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.collapsed) {
          let targetNode: Node | null = null;
          if (range.startContainer.nodeType === Node.TEXT_NODE) {
            const textNode = range.startContainer as Text;
            if (range.startOffset === textNode.length) {
              targetNode = range.startContainer.nextSibling;
            }
          } else if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
            targetNode = range.startContainer.childNodes[range.startOffset];
          }

          if (targetNode && targetNode.nodeType === Node.ELEMENT_NODE) {
            const element = targetNode as HTMLElement;
            if (
              element.dataset.type === 'mention' ||
              element.dataset.type === 'hash' ||
              element.dataset.type === 'function'
            ) {
              e.preventDefault();

              const parent = targetNode.parentNode;
              const nextNode = targetNode.nextSibling;

              element.remove();
              parseContent();

              const newRange = document.createRange();
              if (nextNode) {
                newRange.setStartBefore(nextNode);
                newRange.setEndBefore(nextNode);
              } else if (parent) {
                newRange.selectNodeContents(parent);
                newRange.collapse(false);
              }
              selection.removeAllRanges();
              selection.addRange(newRange);
              return;
            }
          }
        }
      }
    }

    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.collapsed) {
          if (
            range.startContainer.nodeType === Node.TEXT_NODE &&
            range.startContainer.parentNode &&
            (range.startContainer.parentNode as HTMLElement).isContentEditable &&
            range.startContainer.parentNode.parentNode &&
            (range.startContainer.parentNode.parentNode as HTMLElement)?.dataset?.type ===
              'function'
          ) {
            if (range.startOffset === 0) {
              e.preventDefault();
              const container = range.startContainer.parentNode.parentNode as HTMLElement;
              const newRange = document.createRange();
              newRange.setStartBefore(container);
              newRange.setEndBefore(container);
              selection.removeAllRanges();
              selection.addRange(newRange);
              return;
            }
          }

          let targetNode: Node | null = null;
          if (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
            targetNode = range.startContainer.previousSibling;
          } else if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
            targetNode = range.startContainer.childNodes[range.startOffset - 1];
          }

          if (targetNode && targetNode.nodeType === Node.ELEMENT_NODE) {
            const element = targetNode as HTMLElement;
            if (
              element.dataset.type === 'mention' ||
              element.dataset.type === 'hash' ||
              element.dataset.type === 'function'
            ) {
              e.preventDefault();

              const parent = targetNode.parentNode;
              const prevNode = targetNode.previousSibling;

              element.remove();
              parseContent();

              const newRange = document.createRange();
              if (prevNode) {
                if (prevNode.nodeType === Node.TEXT_NODE) {
                  const textNode = prevNode as Text;
                  newRange.setStart(prevNode, textNode.length);
                  newRange.setEnd(prevNode, textNode.length);
                } else {
                  newRange.setStartAfter(prevNode);
                  newRange.setEndAfter(prevNode);
                }
              } else if (parent) {
                newRange.setStart(parent, 0);
                newRange.setEnd(parent, 0);
              }
              selection.removeAllRanges();
              selection.addRange(newRange);
              return;
            }
          }
        }
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const node = selection.anchorNode;
          if (node) {
            const parentSpan = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
            if (parentSpan) {
              const containerSpan = parentSpan.parentNode;

              if (
                (parentSpan as HTMLElement).isContentEditable &&
                containerSpan &&
                (containerSpan as HTMLElement)?.dataset?.type === 'function'
              ) {
                // [Modified] Use textContent and global offset calculator
                const text = parentSpan.textContent || '';
                const ranges = getTraversalRanges(text);
                if (ranges.length === 0) return;

                // Calculate absolute offset of current caret within the text content
                const currentGlobalOffset = getCaretGlobalOffset(parentSpan);

                let currentIndex = -1;
                ranges.forEach((r, i) => {
                  // Check if current global offset is exactly at the end of a parameter
                  // or within a parameter range
                  if (currentGlobalOffset >= r.start && currentGlobalOffset <= r.end) {
                    currentIndex = i;
                  }
                });

                const isValid = validateFunctionTag(containerSpan as HTMLElement, text);

                if (isValid && (currentIndex === ranges.length - 1 || currentIndex === -1)) {
                  const range = document.createRange();
                  range.setStartAfter(containerSpan);
                  range.collapse(true);
                  selection.removeAllRanges();
                  selection.addRange(range);
                  return;
                }

                const nextIndex = (currentIndex + 1) % ranges.length;
                const nextRange = ranges[nextIndex];
                selectRangeInNode(parentSpan, nextRange.start, nextRange.end);
              }
            }
          }
        }
      }, 0);
    }
  };

  const editorContainerStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    margin: 0,
    minHeight: '32px',
    padding: '4px 8px',
    fontVariant: 'tabular-nums' as any,
    listStyle: 'none',
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    minWidth: 0,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    color: token.colorText,
    backgroundColor: (inputToken as any).colorBgContainer || token.colorBgContainer,
    backgroundImage: 'none',
    border: '1px solid',
    borderColor: validationError
      ? token.colorError
      : isFocused || isHovered
        ? 'var(--primary-color)'
        : 'var(--border-input)',
    borderRadius: token.borderRadius,
    outline: 0,
    boxShadow: validationError ? 'none' : isFocused ? '0 0 0 2px var(--primary-bg-hover)' : 'none',
    transition: 'all 0.3s',
    cursor: 'text'
  };

  const getDropdownHeaderInfo = () => {
    if (triggerType === '#') return { text: 'Fruit Tags', color: token.colorSuccessText };
    if (triggerType === '$') return { text: 'Functions', color: '#722ED1' };
    return { text: 'Suggested Variables', color: token.colorPrimary };
  };

  return (
    <Flex
      ref={containerRef}
      vertical
      gap={8}
      className='ant-input-wrapper'
      style={{ position: 'relative' }}
    >
      {title !== '' && <h4>{title}</h4>}
      <Tooltip
        title={validationError}
        open={validationError ? undefined : false}
        color={token.colorError}
      >
        <div
          style={editorContainerStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.isContentEditable && target !== editorRef.current) return;
            if (target.tagName === 'SPAN' && target.innerText === '×') return;
            if (target !== editorRef.current && !target.dataset?.type) editorRef.current?.focus();
          }}
        >
          <div
            ref={editorRef}
            contentEditable={true}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ outline: 'none', minHeight: '22px', whiteSpace: 'pre-wrap', margin: '0 -2px' }}
            spellCheck={false}
            suppressContentEditableWarning={true}
          />
          {!htmlContent && (
            <div
              style={{
                position: 'absolute',
                top: '5px',
                left: '8px',
                color: token.colorTextPlaceholder,
                pointerEvents: 'none',
                lineHeight: token.lineHeight,
                fontSize: token.fontSize
              }}
            >
              {t('ptee.label.testScenario.varTextInput.placeholder')}
            </div>
          )}
        </div>
      </Tooltip>

      {showDropdown && currentOptions.length > 0 && (
        <div
          id='dropdown-variable-insert'
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${dropdownPos.top + 10}px`,
            left: `${dropdownPos.left}px`,
            width: '250px',
            backgroundColor: (inputToken as any).colorBgContainer || token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
            zIndex: 9999, // Ant Design Modal은 1000, Drawer는 1000, 충분히 높은 값으로 설정
            overflow: 'hidden',
            border: '1px solid rgba(165, 165, 165, 0.3)',
            pointerEvents: 'auto', // 클릭 이벤트 확실하게 받도록
            visibility: 'visible', // 명시적으로 보이게
            opacity: 1 // 명시적으로 불투명하게
          }}
        >
          <div
            style={{
              padding: '5px 12px',
              background: token.colorFillQuaternary,
              borderBottom: `1px solid ${token.colorBorder}`,
              fontSize: '11px',
              color: token.colorTextSecondary,
              fontWeight: 600,
              textTransform: 'uppercase'
            }}
          >
            {getDropdownHeaderInfo().text}
          </div>

          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 4,
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            {currentOptions.map((option, index) => {
              const isActive = index === selectedIndex;
              const isSystemItem = option.type === 'system';
              let activeBg, activeColor;
              if (triggerType === '#') {
                activeBg = token.colorSuccessBg;
                activeColor = token.colorSuccessText;
              } else if (triggerType === '$') {
                activeBg = '#F9F0FF';
                activeColor = '#531DAB';
              } else {
                activeBg = token.colorPrimaryBg;
                activeColor = token.colorPrimary;
              }

              return (
                <li
                  key={option.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertItem(option);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    padding: '5px 12px',
                    minHeight: '32px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'var(--bg-text-hover)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'background 0.2s ease',
                    color: token.colorText
                  }}
                >
                  {isSystemItem ? (
                    <IconStar style={{ fontSize: 16 }} />
                  ) : (
                    <Avatar
                      size={20}
                      style={{
                        backgroundColor: token.colorFillContent,
                        color: token.colorTextSecondary,
                        fontSize: 12
                      }}
                      icon={
                        triggerType === '#' ? (
                          <NumberOutlined />
                        ) : triggerType === '$' ? (
                          <FunctionOutlined />
                        ) : option.type === 'user' ? (
                          <UserOutlined />
                        ) : (
                          <AppstoreOutlined />
                        )
                      }
                    />
                  )}
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 400,
                      color: token.colorText
                    }}
                  >
                    {option.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Flex>
  );
};

export default TagInput;
