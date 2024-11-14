export const joinCss= (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');
