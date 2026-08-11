import { useState, useCallback } from 'react';
import * as yup from 'yup';

interface UseFormHandlerOptions<T> {
  initialValues: T;
  validationSchema?: yup.ObjectSchema<any>;
}

interface FormErrors {
  [key: string]: string;
}

export function useFormHandler<T extends Record<string, any>>({
  initialValues,
  validationSchema,
}: UseFormHandlerOptions<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>) => {
      const { name, value, type } = e.target;

      const newValue =
        type === 'number' ? (value ? Number(value) : 0) : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSelectChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      const newValue = value ? Number(value) : 0;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleBlur = useCallback((e: React.FocusEvent<any>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const validateForm = useCallback(
    async (data: T): Promise<FormErrors> => {
      if (!validationSchema) return {};

      try {
        await validationSchema.validate(data, { abortEarly: false });
        return {};
      } catch (err: any) {
        const newErrors: FormErrors = {};
        if (err.inner) {
          err.inner.forEach((error: any) => {
            newErrors[error.path] = error.message;
          });
        }
        return newErrors;
      }
    },
    [validationSchema]
  );

  const handleSubmit = useCallback(
    async (onSubmit: (data: T) => Promise<void>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
          const formErrors = await validateForm(formData);
          if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setIsSubmitting(false);
            return;
          }

          await onSubmit(formData);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [formData, validateForm]
  );

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const getFieldError = (fieldName: string): string | undefined => {
    return touched[fieldName] ? errors[fieldName] : undefined;
  };

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    getFieldError,
    validateForm,
  };
}
