import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
} from '@angular/forms';

interface ToFormDataOptions {
  separator?: string;
  includeNulls?: boolean;
  arrayFormat?: 'bracket' | 'index' | 'none';
  includeDisabled?: boolean;
}

export function toFormData(
  form: FormGroup | FormControl | FormRecord | FormArray | Record<string, any>,
  parentKey?: string,
  fd: FormData = new FormData(),
  options: ToFormDataOptions = {
    separator: '.',
    includeNulls: true,
    arrayFormat: 'bracket', // Default to Laravel-friendly format
    includeDisabled: true,
  },
): FormData {
  // Helper function to append values correctly
  const appendValue = (key: string, value: any): void => {
    if (value === null || value === undefined) {
      if (options.includeNulls) {
        fd.append(key, '');
      }
    } else if (typeof value === 'boolean') {
      fd.append(key, value ? '1' : '0'); // Convert booleans to Laravel format
    } else if (value instanceof File || value instanceof Blob) {
      fd.append(key, value); // Handle files correctly
    } else {
      fd.append(key, String(value)); // Convert other values to string
    }
  };

  if (form instanceof FormGroup || form instanceof FormRecord) {
    for (const [key, control] of Object.entries(form.controls)) {
      if (options.includeDisabled || control.enabled) {
        toFormData(
          control,
          parentKey ? `${parentKey}[${key}]` : key,
          fd,
          options,
        );
      }
    }
  } else if (form instanceof FormControl) {
    if (!parentKey) {
      throw new Error('Parent key is required for FormControl');
    }
    appendValue(parentKey, form.getRawValue());
  } else if (form instanceof FormArray) {
    form.controls.forEach((control, index) => {
      const key = `${parentKey}[${index}]`;
      toFormData(control, key, fd, options);
    });
  } else if (form && typeof form === 'object') {
    for (const [key, value] of Object.entries(form)) {
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;
      if (value && typeof value === 'object' && !(value instanceof Blob)) {
        toFormData(value, fullKey, fd, options);
      } else {
        appendValue(fullKey, value);
      }
    }
  }

  return fd;
}
