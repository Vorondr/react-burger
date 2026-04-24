import { useCallback, useState, type ChangeEvent } from 'react';

type TFormValues = Record<string, string>;

type TUseFormReturn<T extends TFormValues> = {
  values: T;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  resetForm: (nextState?: T) => void;
};

export const useForm = <T extends TFormValues>(initialState: T): TUseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialState);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(
    (nextState?: T): void => {
      setValues(nextState ?? initialState);
    },
    [initialState]
  );

  return {
    values,
    handleChange,
    setValues,
    resetForm,
  };
};
