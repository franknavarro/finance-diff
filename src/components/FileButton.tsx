import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChangeEvent, FC, useCallback } from 'react';

const Input = styled('input')({
  display: 'none',
});

export interface FileButtonProps extends Omit<ButtonProps, 'onChange'> {
  id: string;
  onChange?: (files: FileList | null) => void;
  resetOnChange?: boolean;
  accept?: string;
  multiple?: boolean;
}

const FileButton: FC<FileButtonProps> = ({
  accept,
  children,
  id,
  multiple = false,
  onChange,
  resetOnChange = false,
  ...props
}) => {
  const buttonProps: ButtonProps = {
    variant: 'contained',
    ...props,
  };

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newFiles = event.target.files;
      if (onChange) onChange(newFiles);
      if (resetOnChange) event.target.value = '';
    },
    [onChange, resetOnChange],
  );

  return (
    <label htmlFor={id}>
      <Input
        accept={accept}
        id={id}
        multiple={multiple}
        type="file"
        onChange={handleChange}
      />
      <Button {...buttonProps} component="span">
        {children}
      </Button>
    </label>
  );
};

export default FileButton;
