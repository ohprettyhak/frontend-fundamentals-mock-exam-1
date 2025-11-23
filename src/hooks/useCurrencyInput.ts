import { ChangeEvent, useCallback, useState } from 'react';

export function useCurrencyInput(initialValue = '', onValueChange?: (value: number) => void) {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/,/g, '');
      if (inputValue === '') {
        setValue('');
        onValueChange?.(0);
        return;
      }
      if (isNaN(Number(inputValue))) {
        return;
      }
      const numberValue = Number(inputValue);
      setValue(numberValue.toLocaleString());
      onValueChange?.(numberValue);
    },
    [onValueChange]
  );

  const numericValue = Number(value.replace(/,/g, ''));

  return {
    value,
    numericValue,
    onChange: handleChange,
    setValue,
  };
}
