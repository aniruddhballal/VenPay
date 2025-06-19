import '@mui/material/Button';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    original: true;
    primary: true;
    danger: true;
  }
}