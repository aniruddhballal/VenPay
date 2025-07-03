// makePaymentsStyles.ts
export const makePaymentsStyles = {
  // Main container with glassmorphic effect
  container: `
    max-w-md mx-auto 
    bg-gradient-to-br from-white/20 to-gray-100/10 
    backdrop-blur-xl 
    border border-white/30 
    rounded-3xl 
    shadow-[0_8px_32px_rgba(0,0,0,0.12)] 
    p-8 
    transition-all duration-500 ease-out
    hover:shadow-[0_16px_64px_rgba(0,0,0,0.15)] 
    hover:transform hover:scale-[1.02]
    relative
    before:absolute before:inset-0 
    before:rounded-3xl 
    before:bg-gradient-to-br before:from-white/10 before:to-transparent 
    before:opacity-0 
    hover:before:opacity-100 
    before:transition-opacity before:duration-300
  `,

  // Header section
  header: `
    flex items-center mb-8 
    transition-all duration-300 ease-out
    group
  `,

  headerIcon: `
    w-8 h-8 text-gray-800 mr-3 
    transition-all duration-300 ease-out
    group-hover:text-black 
    group-hover:scale-110 
    group-hover:rotate-3
    drop-shadow-sm
  `,

  headerTitle: `
    text-3xl font-bold 
    bg-gradient-to-r from-gray-900 via-black to-gray-700 
    bg-clip-text text-transparent 
    transition-all duration-300 ease-out
    group-hover:from-black group-hover:via-gray-800 group-hover:to-black
  `,

  // Payment summary with enhanced glassmorphism
  paymentSummary: `
    bg-gradient-to-br from-gray-50/40 to-white/20 
    backdrop-blur-md 
    border border-gray-200/30 
    rounded-2xl 
    p-6 mb-8 
    transition-all duration-300 ease-out
    hover:bg-gradient-to-br hover:from-gray-50/60 hover:to-white/30
    hover:border-gray-300/40
    hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]
    relative
    overflow-hidden
    before:absolute before:top-0 before:left-0 
    before:w-full before:h-0.5 
    before:bg-gradient-to-r before:from-transparent before:via-gray-400/50 before:to-transparent
    before:opacity-0 hover:before:opacity-100
    before:transition-opacity before:duration-300
  `,

  summaryRow: `
    flex justify-between items-center mb-3 last:mb-0
    transition-all duration-200 ease-out
    hover:transform hover:translateX-1
  `,

  summaryLabel: `
    text-gray-700 font-medium
    transition-colors duration-200
    hover:text-gray-900
  `,

  summaryAmount: `
    text-2xl font-bold 
    bg-gradient-to-r from-gray-900 to-black 
    bg-clip-text text-transparent
    transition-all duration-200
    hover:scale-105
  `,

  summaryDescription: `
    text-gray-800 font-medium
    transition-colors duration-200
    hover:text-black
  `,

  // Payment methods section
  paymentMethodsTitle: `
    text-xl font-bold text-gray-900 mb-4
    transition-all duration-200
    hover:text-black hover:scale-[1.02]
    origin-left
  `,

  // Individual payment method cards
  paymentMethodCard: `
    border border-gray-200/50 
    rounded-xl 
    p-4 mb-3 
    cursor-pointer 
    transition-all duration-300 ease-out
    bg-gradient-to-r from-white/30 to-gray-50/20
    backdrop-blur-sm
    hover:border-gray-400/60
    hover:bg-gradient-to-r hover:from-white/50 hover:to-gray-50/30
    hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]
    hover:transform hover:translateY-[-2px]
    active:transform active:translateY-0
    active:shadow-[0_2px_8px_rgba(0,0,0,0.12)]
    relative
    overflow-hidden
    before:absolute before:inset-0 
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    before:transform before:translateX-[-100%]
    hover:before:transform hover:before:translateX-[100%]
    before:transition-transform before:duration-500
  `,

  paymentMethodCardSelected: `
    border-gray-800/60 
    bg-gradient-to-r from-gray-100/60 to-white/40
    shadow-[0_4px_20px_rgba(0,0,0,0.12)]
    transform translateY-[-1px]
    before:bg-gradient-to-r before:from-transparent before:via-gray-300/30 before:to-transparent
  `,

  // Form inputs with glassmorphic styling
  formContainer: `
    p-6 
    border border-gray-200/40 
    rounded-2xl 
    bg-gradient-to-br from-gray-50/30 to-white/20
    backdrop-blur-md
    transition-all duration-300 ease-out
    hover:bg-gradient-to-br hover:from-gray-50/40 hover:to-white/30
    hover:border-gray-300/50
  `,

  inputLabel: `
    block text-sm font-semibold text-gray-800 mb-2
    transition-colors duration-200
    hover:text-black
  `,

  input: `
    w-full p-4 
    border border-gray-300/50 
    rounded-xl 
    bg-white/40 
    backdrop-blur-sm
    focus:ring-2 focus:ring-gray-500/30 
    focus:border-gray-600/60 
    focus:bg-white/60
    transition-all duration-300 ease-out
    hover:border-gray-400/60
    hover:bg-white/50
    placeholder:text-gray-500
    font-medium
    shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]
    focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]
  `,

  // Status messages
  errorMessage: `
    p-4 
    bg-gradient-to-r from-red-50/80 to-pink-50/60 
    border border-red-200/60 
    rounded-xl 
    flex items-center 
    mb-4
    backdrop-blur-sm
    transition-all duration-300 ease-out
    hover:bg-gradient-to-r hover:from-red-50/90 hover:to-pink-50/70
    animate-pulse
  `,

  errorIcon: `
    w-6 h-6 text-red-600 mr-3 
    transition-transform duration-200
    hover:scale-110
  `,

  errorText: `
    text-red-800 font-medium
  `,

  successMessage: `
    text-center
    transition-all duration-500 ease-out
    hover:transform hover:scale-[1.02]
  `,

  successIcon: `
    w-20 h-20 text-green-600 mx-auto mb-6
    transition-all duration-300 ease-out
    hover:text-green-700 hover:scale-110 hover:rotate-12
  `,

  successTitle: `
    text-3xl font-bold 
    bg-gradient-to-r from-gray-900 via-black to-gray-700 
    bg-clip-text text-transparent 
    mb-3
    transition-all duration-200
    hover:from-black hover:via-gray-800 hover:to-black
  `,

  successDescription: `
    text-gray-700 mb-6 font-medium
    transition-colors duration-200
    hover:text-gray-900
  `,

  // Security notice
  securityNotice: `
    p-4 
    bg-gradient-to-r from-green-50/60 to-emerald-50/40 
    border border-green-200/50 
    rounded-xl 
    flex items-center 
    mb-6
    backdrop-blur-sm
    transition-all duration-300 ease-out
    hover:bg-gradient-to-r hover:from-green-50/80 hover:to-emerald-50/60
    hover:border-green-300/60
    hover:shadow-[0_2px_8px_rgba(0,128,0,0.08)]
  `,

  securityIcon: `
    w-6 h-6 text-green-700 mr-3
    transition-all duration-200 ease-out
    hover:text-green-800 hover:scale-110
  `,

  securityText: `
    text-green-800 font-medium
    transition-colors duration-200
    hover:text-green-900
  `,

  // Payment button with advanced effects
  paymentButton: `
    w-full py-4 px-6 
    rounded-xl 
    font-bold text-lg
    transition-all duration-300 ease-out
    bg-gradient-to-r from-gray-900 via-black to-gray-800
    text-white
    shadow-[0_4px_16px_rgba(0,0,0,0.2)]
    hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
    hover:transform hover:translateY-[-2px]
    active:transform active:translateY-0
    active:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
    relative
    overflow-hidden
    before:absolute before:inset-0 
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    before:transform before:translateX-[-100%]
    hover:before:transform hover:before:translateX-[100%]
    before:transition-transform before:duration-700
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:transform-none disabled:hover:shadow-none
  `,

  paymentButtonDisabled: `
    bg-gradient-to-r from-gray-400 to-gray-500
    text-gray-200
    cursor-not-allowed
    shadow-[0_2px_8px_rgba(0,0,0,0.1)]
    hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]
    hover:transform-none
  `,

  // Loading spinner
  loadingSpinner: `
    animate-spin rounded-full h-6 w-6 
    border-b-2 border-white mr-3
    transition-all duration-200
  `,

  // Terms text
  termsText: `
    text-xs text-gray-600 text-center mt-4 
    font-medium
    transition-colors duration-200
    hover:text-gray-800
  `,

  // Radio button styling
  radioInput: `
    mr-4 w-5 h-5 
    text-gray-800 
    border-gray-300 
    focus:ring-gray-500/30 
    focus:ring-2
    transition-all duration-200
    hover:border-gray-400
  `,

  // Grid layouts
  twoColumnGrid: `
    grid grid-cols-2 gap-4
  `,

  // Card brand and last4
  cardInfo: `
    flex-1
    transition-all duration-200
    hover:transform hover:translateX-1
  `,

  cardBrand: `
    font-bold text-gray-900
    transition-colors duration-200
    hover:text-black
  `,

  cardExpiry: `
    text-sm text-gray-600 mt-1
    transition-colors duration-200
    hover:text-gray-800
  `,

  // Micro-interactions for form focus states
  inputFocused: `
    transform scale-[1.02]
    shadow-[0_4px_20px_rgba(0,0,0,0.1)]
  `,

  // Background gradient overlay
  backgroundOverlay: `
    fixed inset-0 -z-10
    bg-gradient-to-br from-gray-50 via-white to-gray-100
    opacity-60
  `
};

// Animation keyframes for CSS-in-JS or styled-components
export const animations = {
  slideIn: `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  shimmer: `
    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `,

  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,

  float: `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-4px);
      }
    }
  `
};

// Utility function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};