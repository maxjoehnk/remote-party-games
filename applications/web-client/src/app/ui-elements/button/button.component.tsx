import React from 'react';

export interface ButtonProps {
  children: any;
  className?: string;
  primary?: boolean;
  onClick?: (event?: any) => any;
  type?: 'button' | 'submit';
}

const Button = ({ children, className, primary, ...props }: ButtonProps) => (
  <button className={`button ${primary ? 'button--primary' : ''} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
