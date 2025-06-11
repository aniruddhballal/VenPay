// this works:
// use MUI and give a glassmorphic, user responsive, interactive, and modern look to the page.
// make sure to use appropriate light-dark colours to make sure of the visibility of all the components
// keep the whole page white-black simple formal sleek look based,
// but make it very very interactive on user hover etc
//
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Avatar,
  Rating,
  Chip,
  Divider,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Backdrop,
  CircularProgress,
  Alert,
  AlertTitle,
  Tooltip,
  ButtonBase,
} from "@mui/material";
import {
  ArrowBack,
  Email,
  Store,
  Reviews,
  ShoppingCart,
  Star,
  StarHalf,
  StarBorder,
  Person,
  Business,
  AttachMoney,
  Description,
  FilterList,
  Visibility,
  ThumbUp,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  vendorId: {
    _id: string;
    name: string;
    email: string;
    userType: "vendor";
  };
}

interface ProductRating {
  _id: string;
  productId: string;
  productRequestId: {
    _id: string;
    createdAt: string;
    quantity: number;
    unitPrice?: number;
    totalPrice?: number;
  };
  companyId: {
    _id: string;
    name: string;
    email: string;
    userType: "company";
  };
  rating: number;
  review?: string;
  date: string;
}

interface RatingsResponse {
  ratings: ProductRating[];
  averageRating: number;
  totalRatings: number;
}

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [ratings, setRatings] = useState<RatingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authErrorShown, setAuthErrorShown] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Enhanced interactive styles
  const interactiveCardStyle = {
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
  };

  const buttonStyle = {
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
  };

  const getUniqueCompanies = () => {
    if (!ratings?.ratings) return [];
    const companies = ratings.ratings.map((rating) => rating.companyId);
    return companies.filter(
      (company, index, self) =>
        index === self.findIndex((c) => c._id === company._id)
    );
  };

  const filteredRatings =
    selectedCompany === "all"
      ? ratings?.ratings || []
      : ratings?.ratings.filter(
          (rating) => rating.companyId._id === selectedCompany
        ) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:5000/api/auth/me`, {
          withCredentials: true,
        });
        setCurrentUser(userRes.data);

        const productRes = await axios.get(
          `http://localhost:5000/api/products/${id}`,
          {
            withCredentials: true,
          }
        );
        setProduct(productRes.data);

        setRatingsLoading(true);
        try {
          const ratingsRes = await axios.get(
            `http://localhost:5000/api/productratings/product/${id}`,
            {
              withCredentials: true,
            }
          );
          setRatings(ratingsRes.data);
        } catch (ratingsErr: any) {
          console.error("Ratings fetch error:", ratingsErr);
          const message =
            ratingsErr.response?.data?.error || "Failed to fetch ratings.";
          toast.error(message);
          setRatings({
            ratings: [],
            averageRating: 0,
            totalRatings: 0,
          });
        } finally {
          setRatingsLoading(false);
        }
      } catch (err: any) {
        console.error("Main fetch error:", err);
        const message = err.response?.data?.error || "Failed to fetch data.";

        if (message === "No token, authorization denied") {
          if (!authErrorShown) {
            toast.error(message);
            setAuthErrorShown(true);
          }
        } else {
          toast.error(message);
        }

        if (message === "No token, authorization denied") {
          setError("Please log in to view product details.");
          setCurrentUser(null);
          setProduct(null);
          setRatings(null);
        } else {
          setError("Failed to load product details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, authErrorShown]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const renderCustomStars = (rating: number, size = 24) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} sx={{ 
          color: 'white', 
          fontSize: size,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.2) rotate(18deg)',
            filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))'
          }
        }} />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" sx={{ 
          color: 'white', 
          fontSize: size,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.2)',
          }
        }} />
      );
    }
    
    while (stars.length < 5) {
      stars.push(
        <StarBorder key={`empty-${stars.length}`} sx={{ 
          color: '#cccccc', 
          fontSize: size,
          transition: 'all 0.2s ease',
          '&:hover': {
            color: '#000000',
            transform: 'scale(1.1)',
          }
        }} />
      );
    }
    
    return <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>{stars}</Box>;
  };

  const renderCustomStars2 = (rating: number, size = 24) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} sx={{ 
          color: 'black', 
          fontSize: size,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.2) rotate(18deg)',
            filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))'
          }
        }} />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" sx={{ 
          color: 'black', 
          fontSize: size,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.2)',
          }
        }} />
      );
    }
    
    while (stars.length < 5) {
      stars.push(
        <StarBorder key={`empty-${stars.length}`} sx={{ 
          color: '#cccccc', 
          fontSize: size,
          transition: 'all 0.2s ease',
          '&:hover': {
            color: '#000000',
            transform: 'scale(1.1)',
          }
        }} />
      );
    }
    
    return <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>{stars}</Box>;
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ 
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
          }}>
            <CircularProgress 
              size={60} 
              sx={{ 
                color: '#000000',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
          </Box>
          <Typography variant="h6" sx={{ mt: 3, color: '#000000', fontWeight: 500 }}>
            Loading product details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !currentUser) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#ffffff', py: 8 }}>
        <Container maxWidth="md">
          <Fade in>
            <Alert 
              severity="error" 
              sx={{ 
                ...interactiveCardStyle,
                border: '2px solid #ff0000',
                '&:hover': {
                  border: '2px solid #cc0000',
                }
              }}
            >
              <AlertTitle sx={{ fontWeight: 600 }}>
                {error || "Authentication Required"}
              </AlertTitle>
              Please log in to view product details.
            </Alert>
          </Fade>
        </Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#ffffff', py: 8 }}>
        <Container maxWidth="md">
          <Fade in>
            <Alert 
              severity="warning"
              sx={{ 
                ...interactiveCardStyle,
                border: '2px solid #ff9800',
                '&:hover': {
                  border: '2px solid #f57c00',
                }
              }}
            >
              <AlertTitle sx={{ fontWeight: 600 }}>Product Not Found</AlertTitle>
              The requested product could not be found.
            </Alert>
          </Fade>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#ffffff',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Back Button */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                ...buttonStyle,
                '&:hover .MuiSvgIcon-root': {
                  transform: 'translateX(-4px)',
                }
              }}
            >
              Go Back
            </Button>
          </Box>
        </Fade>

        <Grid container spacing={6}>
          {/* Product Image Section */}
          <Grid item xs={12} md={6}>
            <Zoom in timeout={800}>
              <Card sx={{ 
                ...interactiveCardStyle,
                height: 'fit-content',
                '&:hover .product-image': {
                  transform: 'scale(1.05)',
                }
              }}>
                {product.image ? (
                  <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      className="product-image"
                      onLoad={() => setImageLoaded(true)}
                      sx={{
                        height: { xs: 350, md: 500 },
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: imageLoaded ? 'none' : 'blur(5px)',
                      }}
                    />
                    <Box 
                      onClick={() => window.open(product.image, '_blank')}
                    sx={{
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
                    }}>
                      <Visibility sx={{ fontSize: 20, color: '#000000' }} />
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
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
                    }}
                  >
                    <ShoppingCart sx={{ fontSize: 80, color: '#cccccc', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#666666', fontWeight: 500 }}>
                      No image available
                    </Typography>
                  </Box>
                )}
              </Card>
            </Zoom>
          </Grid>

          {/* Product Details Section */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Card sx={{ ...interactiveCardStyle, height: 'fit-content' }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Product Title */}
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      color: '#000000',
                      mb: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Price */}
<ButtonBase
  sx={{ 
    mb: 4,
    borderRadius: '12px',
    p: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#f8f8f8',
      transform: 'scale(1.05)',
    }
  }}
>
  <Stack direction="row" alignItems="center" spacing={1}>
    <Typography
      sx={{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
        display: 'inline-block',
        transition: 'transform 0.6s ease',
        '.MuiButtonBase-root:hover &': {
          transform: 'rotate(360deg)',
        }
      }}
    >
      ₹
    </Typography>
    <Typography 
      variant="h4" 
      sx={{ 
        fontWeight: 700,
        color: '#000000'
      }}
    >
      {product.price.toFixed(2)}
    </Typography>
  </Stack>
</ButtonBase>

                  {/* Description */}
                  <Box sx={{ mb: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Description sx={{ 
                        color: '#000000',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'rotate(10deg) scale(1.1)',
                        }
                      }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000' }}>
                        Description
                      </Typography>
                    </Stack>
                    <Typography 
                      variant="body1" 
                      sx={{ 
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
                      }}
                    >
                      {product.description}
                    </Typography>
                  </Box>

                  {/* Vendor Information */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Store sx={{ 
                        color: '#000000',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'rotate(-10deg) scale(1.1)',
                        }
                      }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000' }}>
                        Vendor Information
                      </Typography>
                    </Stack>
                    <Card sx={{ 
                      ...interactiveCardStyle,
                      p: 3,
                      background: '#f9f9f9',
                      '&:hover': {
                        background: '#f5f5f5',
                        transform: 'translateY(-4px) scale(1.02)',
                      }
                    }}>
                      <Stack direction="row" alignItems="center" spacing={3}>
                        <Avatar sx={{ 
                          bgcolor: '#000000', 
                          width: 64, 
                          height: 64,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'rotate(360deg) scale(1.1)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                          }
                        }}>
                          <Person sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            component={Link} 
                            to={`/user/${product.vendorId._id}`}
                            sx={{ 
                              textDecoration: 'none',
                              color: '#000000',
                              fontWeight: 600,
                              transition: 'all 0.3s ease',
                              display: 'inline-block',
                              '&:hover': {
                                transform: 'translateX(8px)',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                              }
                            }}
                          >
                            {product.vendorId.name}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                            <Email sx={{ 
                              fontSize: 18, 
                              color: '#666666',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                color: '#000000',
                                transform: 'scale(1.2) rotate(15deg)'
                              }
                            }} />
                            <Typography 
                              variant="body2" 
                              component="a" 
                              href={`mailto:${product.vendorId.email}`}
                              sx={{ 
                                color: '#666666',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  color: '#000000',
                                  transform: 'translateX(4px)'
                                }
                              }}
                            >
                              {product.vendorId.email}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Card>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Reviews Section */}
        {currentUser?.user && (
          <Fade in timeout={1200}>
            <Box sx={{ mt: 8 }}>
              <Card sx={{ ...interactiveCardStyle }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <Reviews sx={{ 
                      fontSize: 36, 
                      color: '#000000',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'rotate(15deg) scale(1.1)',
                      }
                    }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000' }}>
                      Product Reviews
                    </Typography>
                  </Stack>

                  {ratingsLoading && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <CircularProgress sx={{ color: '#000000' }} />
                      <Typography variant="body1" sx={{ mt: 2, color: '#666666' }}>
                        Loading reviews...
                      </Typography>
                    </Box>
                  )}

                  {ratings && !ratingsLoading && (
                    <>
                      {/* Rating Summary */}
                      {ratings.totalRatings > 0 && (
                        <Grid container spacing={4} sx={{ mb: 6 }}>
                          <Grid item xs={12} sm={4}>
                            <Card sx={{ 
                              ...interactiveCardStyle,
                              textAlign: 'center', 
                              p: 4,
                              background: '#000000',
                              color: '#ffffff',
                              '&:hover': {
                                background: '#333333',
                                transform: 'translateY(-12px) scale(1.05)',
                              }
                            }}>
                              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                                {ratings.averageRating.toFixed(1)}
                              </Typography>
                              <Box sx={{ my: 2 }}>
                                {renderCustomStars(ratings.averageRating, 28)}
                              </Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Average Rating
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Card sx={{ 
                              ...interactiveCardStyle, 
                              textAlign: 'center', 
                              p: 4,
                              '&:hover': {
                                background: '#f8f8f8',
                              }
                            }}>
                              <Stack alignItems="center" spacing={1}>
                                <ThumbUp sx={{ fontSize: 32, color: '#000000' }} />
                                <Typography variant="h2" sx={{ fontWeight: 700, color: '#000000' }}>
                                  {ratings.totalRatings}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666666', fontWeight: 500 }}>
                                  Total Reviews
                                </Typography>
                              </Stack>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Card sx={{ 
                              ...interactiveCardStyle, 
                              textAlign: 'center', 
                              p: 4,
                              '&:hover': {
                                background: '#f8f8f8',
                              }
                            }}>
                              <Stack alignItems="center" spacing={1}>
                                <Business sx={{ fontSize: 32, color: '#000000' }} />
                                <Typography variant="h2" sx={{ fontWeight: 700, color: '#000000' }}>
                                  {getUniqueCompanies().length}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666666', fontWeight: 500 }}>
                                  Companies
                                </Typography>
                              </Stack>
                            </Card>
                          </Grid>
                        </Grid>
                      )}

                      {/* Company Filter */}
                      <Box sx={{ mb: 4 }}>
                        <FormControl 
                          fullWidth={isMobile} 
                          sx={{ 
                            minWidth: 250,
                            '& .MuiOutlinedInput-root': {
                              ...interactiveCardStyle,
                              '&:hover': {
                                transform: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }
                            }
                          }}
                        >
                          <InputLabel sx={{ 
                            color: '#000000',
                            fontWeight: 500,
                            '&.Mui-focused': {
                              color: '#000000',
                            }
                          }}>
                            <FilterList sx={{ mr: 1, fontSize: 18 }} />
                            Filter Company
                          </InputLabel>
                          <Select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            label="Filter by Company"
                            sx={{ 
                              color: '#000000',
                              fontWeight: 500,
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#000000',
                                borderWidth: 2,
                              }
                            }}
                          >
                            <MenuItem value="all">All Companies</MenuItem>
                            {getUniqueCompanies().map((company) => (
                              <MenuItem key={company._id} value={company._id}>
                                {company.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Reviews List */}
                      {filteredRatings.length === 0 ? (
                        <Alert severity="info" sx={{ ...interactiveCardStyle }}>
                          No reviews found for the selected company.
                        </Alert>
                      ) : (
                        <Grid container spacing={4}>
                          {filteredRatings.map((rating, index) => (
                            <Grid item xs={12} key={rating._id}>
                              <Fade in timeout={500 + index * 100}>
                                <Card sx={{ 
                                  ...interactiveCardStyle,
                                  p: 4,
                                  '&:hover': {
                                    transform: 'translateY(-8px) translateX(8px)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                  }
                                }}>
                                  <Stack direction={isMobile ? 'column' : 'row'} spacing={4}>
                                    <Avatar sx={{ 
                                      bgcolor: '#000000', 
                                      width: 72, 
                                      height: 72,
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'rotate(360deg) scale(1.2)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                                      }
                                    }}>
                                      <Business sx={{ fontSize: 36 }} />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Stack 
                                        direction={isMobile ? 'column' : 'row'} 
                                        justifyContent="space-between" 
                                        alignItems={isMobile ? 'flex-start' : 'center'}
                                        sx={{ mb: 3 }}
                                      >
                                        <Typography variant="h5" sx={{ 
                                          fontWeight: 600,
                                          color: '#000000',
                                          transition: 'transform 0.3s ease',
                                          '&:hover': {
                                            transform: 'translateX(8px)',
                                          }
                                        }}>
                                          {rating.companyId.name}
                                        </Typography>
                                        <Chip 
                                          icon={<Schedule />}
                                          label={formatDate(rating.productRequestId.createdAt)}
                                          variant="outlined"
                                          sx={{ 
                                            fontWeight: 500,
                                            border: '2px solid #000000',
                                            color: '#000000',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                              background: '#000000',
                                              color: '#ffffff',
                                              transform: 'scale(1.05)',
                                            }
                                          }}
                                        />
                                      </Stack>
                                      
                                      <Box sx={{ mb: 3 }}>
                                        {renderCustomStars2(rating.rating, 28)}
                                      </Box>
                                      
                                      <Typography 
                                        variant="body1" 
                                        sx={{ 
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
                                      }}
                                      >
                                        {rating.review || "No review provided."}
                                      </Typography>

                                      <Stack direction="row" spacing={3} flexWrap="wrap">
                                        <Chip
                                          icon={<AttachMoney />}
                                          label={`Unit Price: ₹${rating.productRequestId.unitPrice?.toFixed(2) ?? 'N/A'}`}
                                          variant="outlined"
                                          sx={{
                                            border: '2px solid #000000',
                                            color: '#000000',
                                            fontWeight: 500,
                                            '&:hover': {
                                              background: '#000000',
                                              color: '#ffffff',
                                              transform: 'scale(1.05)',
                                            }
                                          }}
                                        />
                                        <Chip
                                          icon={<Description />}
                                          label={`Quantity: ${rating.productRequestId.quantity}`}
                                          variant="outlined"
                                          sx={{
                                            border: '2px solid #000000',
                                            color: '#000000',
                                            fontWeight: 500,
                                            '&:hover': {
                                              background: '#000000',
                                              color: '#ffffff',
                                              transform: 'scale(1.05)',
                                            }
                                          }}
                                        />
                                        <Chip
                                          icon={<TrendingUp />}
                                          label={`Total Price: ₹${rating.productRequestId.totalPrice?.toFixed(2) ?? 'N/A'}`}
                                          variant="outlined"
                                          sx={{
                                            border: '2px solid #000000',
                                            color: '#000000',
                                            fontWeight: 500,
                                            '&:hover': {
                                              background: '#000000',
                                              color: '#ffffff',
                                              transform: 'scale(1.05)',
                                            }
                                          }}
                                        />
                                      </Stack>
                                    </Box>
                                  </Stack>
                                </Card>
                              </Fade>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}
