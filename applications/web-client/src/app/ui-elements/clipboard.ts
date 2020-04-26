const copyText = text => {
    const inputElement = document.createElement('input');
    inputElement.value = text;
    inputElement.style.position = 'absolute';
    inputElement.style.opacity = 0;
    document.body.appendChild(inputElement);

    inputElement.setAttribute('readonly', '');
    inputElement.select();
    inputElement.setSelectionRange(0, 99999);

    document.execCommand('copy');

    document.body.removeChild(inputElement);
};

export function useClipboard() {
    return {
        copy: copyText
    };
}
