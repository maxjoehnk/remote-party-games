import { html } from 'https://unpkg.com/lit-html?module';
import { navigate } from '../router.mjs';

export const link = (href, { disabled, label, className }) => html`
    <a class="button ${disabled ? 'button--disabled' : ''} ${className}"
       href=${href}
       @click=${e => {
           e.preventDefault();
           navigate(href);
       }}>
        ${label}
    </a>
`;