import { SelectProps } from 'antd';
import { useState } from 'react';

export const useExpressionSearch = (
  allOptions: SelectProps['options'] = [],
  variableOptions: SelectProps['options'] = [],
  functionOptions: SelectProps['options'] = []
) => {
  const [options, setOptions] = useState<SelectProps['options']>(allOptions);

  const onSearch = (value: string) => {
    if (!value) {
      setOptions(allOptions);
      return;
    }

    const firstChar = value[0];

    switch (firstChar) {
      case '@':
        setOptions(variableOptions);
        break;

      case '$':
        setOptions(functionOptions);
        break;

      case '#':
        setOptions([{ label: 'Input', value: 'input' }]);
        break;

      default:
        setOptions(
          allOptions.filter((opt) =>
            opt?.label?.toString().toLowerCase().includes(value.toLowerCase())
          )
        );
    }
  };

  return { options, onSearch };
};
