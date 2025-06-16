export const productDisplayStyles = {
  interactiveCardStyle: {
    background: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      border: '1px solid #000000',
      '&::before': {
        transform: 'translateX(0%)',
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: 'linear-gradient(90deg, #000000, #333333)',
      transform: 'translateX(-100%)',
      transition: 'transform 0.3s ease',
    }
  },

  buttonStyle: {
    background: '#ffffff',
    color: '#000000',
    border: '2px solid #000000',
    borderRadius: '8px',
    fontWeight: 600,
    textTransform: 'none',
    px: 3,
    py: 1.5,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#000000',
      color: '#ffffff',
      transform: 'scale(1.05)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    }
  },

  loadingContainer: {
    minHeight: '100vh', 
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  loadingBox: {
    textAlign: 'center',
    '& > div': {
      position: 'relative',
      display: 'inline-block',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -20,
        left: -20,
        right: -20,
        bottom: -20,
        border: '2px solid #f0f0f0',
        borderRadius: '50%',
        animation: 'pulse 2s infinite'
      }
    }
  },

  loadingProgress: {
    color: '#000000',
    '& .MuiCircularProgress-circle': {
      strokeLinecap: 'round',
    }
  },

  loadingText: {
    mt: 3,
    color: '#000000',
    fontWeight: 500
  },

  errorContainer: {
    minHeight: '100vh',
    background: '#ffffff',
    py: 8
  },

  errorAlert: {
    border: '2px solid #ff0000',
    '&:hover': {
      border: '2px solid #cc0000',
    }
  },

  warningAlert: {
    border: '2px solid #ff9800',
    '&:hover': {
      border: '2px solid #f57c00',
    }
  },

  mainContainer: {
    minHeight: '100vh',
    background: '#ffffff',
    py: 4
  },

  backButton: {
    '&:hover .MuiSvgIcon-root': {
      transform: 'translateX(-4px)',
    }
  },

  imageCard: {
    height: 'fit-content',
    '&:hover .product-image': {
      transform: 'scale(1.05)',
    }
  },

  imageBox: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '12px'
  },

  productImage: {
    height: { xs: 350, md: 500 },
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '50%',
    p: 1,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    '.MuiCard-root:hover &': {
      opacity: 1,
    }
  },

  noImageBox: {
    height: { xs: 350, md: 500 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f8f8',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#f0f0f0',
    }
  },

  noImageIcon: {
    fontSize: 80,
    color: '#cccccc',
    mb: 2
  },

  noImageText: {
    color: '#666666',
    fontWeight: 500
  },

  detailsCard: {
    height: 'fit-content'
  },

  detailsContent: {
    p: 4
  },

  productTitle: {
    fontWeight: 700,
    color: '#000000',
    mb: 3,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateX(8px)',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
    }
  },

  priceButton: {
    mb: 4,
    borderRadius: '12px',
    p: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#f8f8f8',
      transform: 'scale(1.05)',
    }
  },

  priceSymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    display: 'inline-block',
    transition: 'transform 0.6s ease',
    '.MuiButtonBase-root:hover &': {
      transform: 'rotate(360deg)',
    }
  },

  priceAmount: {
    fontWeight: 700,
    color: '#000000'
  },

  sectionIcon: {
    color: '#000000',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'rotate(10deg) scale(1.1)',
    }
  },

  sectionIconAlt: {
    color: '#000000',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'rotate(-10deg) scale(1.1)',
    }
  },

  sectionTitle: {
    fontWeight: 600,
    color: '#000000'
  },

  descriptionText: {
    lineHeight: 1.8,
    color: '#333333',
    transition: 'all 0.3s ease',
    p: 2,
    borderRadius: '8px',
    '&:hover': {
      background: '#f8f8f8',
      transform: 'translateX(8px)',
      boxShadow: '4px 0 8px rgba(0,0,0,0.1)'
    }
  },

  vendorCard: {
    p: 3,
    background: '#f9f9f9',
    '&:hover': {
      background: '#f5f5f5',
      transform: 'translateY(-4px) scale(1.02)',
    }
  },

  vendorAvatar: {
    bgcolor: '#000000',
    width: 64,
    height: 64,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'rotate(360deg) scale(1.1)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
    }
  },

  vendorName: {
    textDecoration: 'none',
    color: '#000000',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    display: 'inline-block',
    '&:hover': {
      transform: 'translateX(8px)',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
    }
  },

  vendorEmailIcon: {
    fontSize: 18,
    color: '#666666',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#000000',
      transform: 'scale(1.2) rotate(15deg)'
    }
  },

  vendorEmailText: {
    color: '#666666',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#000000',
      transform: 'translateX(4px)'
    }
  },

  reviewsIcon: {
    fontSize: 36,
    color: '#000000',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'rotate(15deg) scale(1.1)',
    }
  },

  reviewsTitle: {
    fontWeight: 700,
    color: '#000000'
  },

  ratingSummaryCard: {
    textAlign: 'center',
    p: 4,
    background: '#000000',
    color: '#ffffff',
    '&:hover': {
      background: '#333333',
      transform: 'translateY(-12px) scale(1.05)',
    }
  },

  ratingSummaryNumber: {
    fontWeight: 700,
    mb: 2
  },

  ratingSummaryText: {
    fontWeight: 500
  },

  statsCard: {
    textAlign: 'center',
    p: 4,
    '&:hover': {
      background: '#f8f8f8',
    }
  },

  statsIcon: {
    fontSize: 32,
    color: '#000000'
  },

  statsNumber: {
    fontWeight: 700,
    color: '#000000'
  },

  statsText: {
    color: '#666666',
    fontWeight: 500
  },

  filterContainer: {
    mb: 4
  },

  filterFormControl: {
    minWidth: 250,
    '& .MuiOutlinedInput-root': {
      '&:hover': {
        transform: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }
    }
  },

  filterLabel: {
    fontWeight: 500,
    color: '#000000'
  },

  filterSelect: {
    '& legend': { display: 'none' },
    '& fieldset': { top: 0 },
    color: '#000000',
    fontWeight: 500,
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#000000',
      borderWidth: 2,
    }
  },

  reviewCard: {
    p: 4,
    '&:hover': {
      transform: 'translateY(-8px) translateX(8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    }
  },

  reviewAvatar: {
    bgcolor: '#000000',
    width: 72,
    height: 72,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'rotate(360deg) scale(1.2)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
    }
  },

  reviewCompanyName: {
    fontWeight: 600,
    color: '#000000',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateX(8px)',
    }
  },

  reviewChip: {
    fontWeight: 500,
    border: '2px solid #000000',
    color: '#000000',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#000000',
      color: '#ffffff',
      transform: 'scale(1.05)',
    }
  },

  reviewText: {
    mb: 4,
    lineHeight: 1.8,
    color: '#333333',
    whiteSpace: 'pre-line',
    transition: 'all 0.3s ease',
    p: 2,
    borderRadius: '8px',
    background: '#f9f9f9',
    '&:hover': {
      background: '#f0f0f0',
      transform: 'translateX(4px)',
      boxShadow: '4px 0 12px rgba(0,0,0,0.1)',
    }
  },

  starFull: {
    color: 'white',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2) rotate(18deg)',
      filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))'
    }
  },

  starHalf: {
    color: 'white',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2)',
    }
  },

  starEmpty: {
    color: '#cccccc',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#000000',
      transform: 'scale(1.1)',
    }
  },

  starFullBlack: {
    color: 'black',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2) rotate(18deg)',
      filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))'
    }
  },

  starHalfBlack: {
    color: 'black',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2)',
    }
  },

  starContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.25
  }
};