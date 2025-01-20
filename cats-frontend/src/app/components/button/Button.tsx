import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon';
export type ButtonSize = 'small' | 'medium';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  active?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      className,
      active = false,
      ...props
    },
    ref,
  ) => {
    const variantCssClass = variant === 'icon' ? 'btn-icon' : variant;
    return (
      <button
        ref={ref}
        className={clsx([
          'SITE-Button',
          variantCssClass,
          size,
          active && 'btn-active',
          className,
        ])}
        {...props}
      />
    );
  },
);
