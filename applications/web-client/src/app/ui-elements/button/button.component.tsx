import React from 'react';

export interface ButtonProps {
  children: any;
  className?: string;
  primary?: boolean;
  card?: boolean;
  onClick?: (event?: any) => any;
  type?: 'button' | 'submit';
}

const Button = ({ children, className, primary, card, ...props }: ButtonProps) => (
  <button className={`button ${primary ? 'button--primary' : ''} ${card ? 'button--card' : ''} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
