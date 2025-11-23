import { ChangeEvent, useCallback, useState } from 'react';

export function useCurrencyInput(initialValue = '') {
    const [value, setValue] = useState<string>(initialValue);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/,/g, '');
        if (inputValue === '') {
            setValue('');
            return;
        }
        if (isNaN(Number(inputValue))) {
            return;
        }
        setValue(Number(inputValue).toLocaleString());
    }, []);

    const numericValue = Number(value.replace(/,/g, ''));

    return {
        value,
        numericValue,
        onChange: handleChange,
        setValue,
    };
}
