import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

import OutlinedInput from '@mui/material/OutlinedInput';
import { Box, Container, Typography, Button, Card, CardContent, CardMedia, Grid, Avatar, Chip, Select, MenuItem, FormControl,
  Stack, useTheme, useMediaQuery, Fade, Zoom, CircularProgress, Alert, AlertTitle, ButtonBase
} from "@mui/material";
import { ArrowBack, Email, Store, Reviews, ShoppingCart, Star, StarHalf, StarBorder, Person, Business, AttachMoney,
  Description, FilterList, Visibility, ThumbUp, Schedule, TrendingUp
} from "@mui/icons-material";

import { productDisplayStyles } from "../styles/productDisplayStyles";

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
        const userRes = await api.get("/auth/me");
        setCurrentUser(userRes.data);

        const productRes = await api.get(`/products/${id}`);

        setProduct(productRes.data);

        setRatingsLoading(true);
        try {
          const ratingsRes = await api.get(`/productratings/product/${id}`);
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
          ...productDisplayStyles.starFull,
          fontSize: size,
        }} />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" sx={{ 
          ...productDisplayStyles.starHalf,
          fontSize: size,
        }} />
      );
    }
    
    while (stars.length < 5) {
      stars.push(
        <StarBorder key={`empty-${stars.length}`} sx={{ 
          ...productDisplayStyles.starEmpty,
          fontSize: size,
        }} />
      );
    }
    
    return <Box sx={productDisplayStyles.starContainer}>{stars}</Box>;
  };

  const renderCustomStars2 = (rating: number, size = 24) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} sx={{ 
          ...productDisplayStyles.starFullBlack,
          fontSize: size,
        }} />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" sx={{ 
          ...productDisplayStyles.starHalfBlack,
          fontSize: size,
        }} />
      );
    }
    
    while (stars.length < 5) {
      stars.push(
        <StarBorder key={`empty-${stars.length}`} sx={{ 
          ...productDisplayStyles.starEmpty,
          fontSize: size,
        }} />
      );
    }
    
    return <Box sx={productDisplayStyles.starContainer}>{stars}</Box>;
  };

  if (loading) {
    return (
      <Box sx={productDisplayStyles.loadingContainer}>
        <Box sx={productDisplayStyles.loadingBox}>
          <Box>
            <CircularProgress 
              size={60} 
              sx={productDisplayStyles.loadingProgress} 
            />
          </Box>
          <Typography variant="h6" sx={productDisplayStyles.loadingText}>
            Loading product details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !currentUser) {
    return (
      <Box sx={productDisplayStyles.errorContainer}>
        <Container maxWidth="md">
          <Fade in>
            <Alert 
              severity="error" 
              sx={{ 
                ...productDisplayStyles.interactiveCardStyle,
                ...productDisplayStyles.errorAlert
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
      <Box sx={productDisplayStyles.errorContainer}>
        <Container maxWidth="md">
          <Fade in>
            <Alert 
              severity="warning"
              sx={{ 
                ...productDisplayStyles.interactiveCardStyle,
                ...productDisplayStyles.warningAlert
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
    <Box sx={productDisplayStyles.mainContainer}>
      <Container maxWidth="xl">
        {/* Back Button */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                ...productDisplayStyles.buttonStyle,
                ...productDisplayStyles.backButton
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
                ...productDisplayStyles.interactiveCardStyle,
                ...productDisplayStyles.imageCard
              }}>
                {product.image ? (
                  <Box sx={productDisplayStyles.imageBox}>
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      className="product-image"
                      onLoad={() => setImageLoaded(true)}
                      sx={{
                        ...productDisplayStyles.productImage,
                        filter: imageLoaded ? 'none' : 'blur(5px)',
                      }}
                    />
                    <Box
                    onClick={() => window.open(product.image, '_blank')}
                    sx={productDisplayStyles.imageOverlay}>
                      <Visibility sx={{ fontSize: 20, color: '#000000' }} />
                    </Box>
                  </Box>
                ) : (
                  <Box sx={productDisplayStyles.noImageBox}>
                    <ShoppingCart sx={productDisplayStyles.noImageIcon} />
                    <Typography variant="h6" sx={productDisplayStyles.noImageText}>
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
              <Card sx={{ 
                ...productDisplayStyles.interactiveCardStyle, 
                ...productDisplayStyles.detailsCard 
              }}>
                <CardContent sx={productDisplayStyles.detailsContent}>
                  {/* Product Title */}
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom
                    sx={productDisplayStyles.productTitle}
                  >
                    {product.name}
                  </Typography>

                  {/* Price */}
                  <ButtonBase sx={productDisplayStyles.priceButton}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography sx={productDisplayStyles.priceSymbol}>
                        ₹
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={productDisplayStyles.priceAmount}
                      >
                        {product.price.toFixed(2)}
                      </Typography>
                    </Stack>
                  </ButtonBase>

                  {/* Description */}
                  <Box sx={{ mb: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Description sx={productDisplayStyles.sectionIcon} />
                      <Typography variant="h6" sx={productDisplayStyles.sectionTitle}>
                        Description
                      </Typography>
                    </Stack>
                    <Typography 
                      variant="body1" 
                      sx={productDisplayStyles.descriptionText}
                    >
                      {product.description}
                    </Typography>
                  </Box>

                  {/* Vendor Information */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Store sx={productDisplayStyles.sectionIconAlt} />
                      <Typography variant="h6" sx={productDisplayStyles.sectionTitle}>
                        Vendor Information
                      </Typography>
                    </Stack>
                    <Card sx={{ 
                      ...productDisplayStyles.interactiveCardStyle,
                      ...productDisplayStyles.vendorCard
                    }}>
                      <Stack direction="row" alignItems="center" spacing={3}>
                        <Avatar sx={productDisplayStyles.vendorAvatar}>
                          <Person sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            component={Link} 
                            to={`/user/${product.vendorId._id}`}
                            sx={productDisplayStyles.vendorName}
                          >
                            {product.vendorId.name}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                            <Email sx={productDisplayStyles.vendorEmailIcon} />
                            <Typography 
                              variant="body2" 
                              component="a" 
                              href={`mailto:${product.vendorId.email}`}
                              sx={productDisplayStyles.vendorEmailText}
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
              <Card sx={productDisplayStyles.interactiveCardStyle}>
                <CardContent sx={productDisplayStyles.detailsContent}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <Reviews sx={productDisplayStyles.reviewsIcon} />
                    <Typography variant="h4" sx={productDisplayStyles.reviewsTitle}>
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
                              ...productDisplayStyles.interactiveCardStyle,
                              ...productDisplayStyles.ratingSummaryCard
                            }}>
                              <Typography variant="h2" sx={productDisplayStyles.ratingSummaryNumber}>
                                {ratings.averageRating.toFixed(1)}
                              </Typography>
                              <Box sx={{ my: 2 }}>
                                {renderCustomStars(ratings.averageRating, 28)}
                              </Box>
                              <Typography variant="body1" sx={productDisplayStyles.ratingSummaryText}>
                                Average Rating
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Card sx={{ 
                              ...productDisplayStyles.interactiveCardStyle, 
                              ...productDisplayStyles.statsCard
                            }}>
                              <Stack alignItems="center" spacing={1}>
                                <ThumbUp sx={productDisplayStyles.statsIcon} />
                                <Typography variant="h2" sx={productDisplayStyles.statsNumber}>
                                  {ratings.totalRatings}
                                </Typography>
                                <Typography variant="body1" sx={productDisplayStyles.statsText}>
                                  Total Reviews
                                </Typography>
                              </Stack>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Card sx={{ 
                              ...productDisplayStyles.interactiveCardStyle, 
                              ...productDisplayStyles.statsCard
                            }}>
                              <Stack alignItems="center" spacing={1}>
                                <Business sx={productDisplayStyles.statsIcon} />
                                <Typography variant="h2" sx={productDisplayStyles.statsNumber}>
                                  {getUniqueCompanies().length}
                                </Typography>
                                <Typography variant="body1" sx={productDisplayStyles.statsText}>
                                  Companies
                                </Typography>
                              </Stack>
                            </Card>
                          </Grid>
                        </Grid>
                      )}

                      {/* Company Filter */}
                      <Box sx={productDisplayStyles.filterContainer}>
                        <FormControl 
                          fullWidth={isMobile} 
                          sx={{
                            ...productDisplayStyles.filterFormControl,
                            '& .MuiOutlinedInput-root': {
                              ...productDisplayStyles.interactiveCardStyle,
                              ...productDisplayStyles.filterFormControl['& .MuiOutlinedInput-root']
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <FilterList sx={{ mr: 1, fontSize: 28 }} />
                            <Typography sx={productDisplayStyles.filterLabel}>
                              Filter
                            </Typography>
                          </Box>

                          <Select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            displayEmpty
                            input={<OutlinedInput label="Filter by Company" />}
                            sx={productDisplayStyles.filterSelect}
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
                        <Alert severity="info" sx={productDisplayStyles.interactiveCardStyle}>
                          No reviews found for the selected company.
                        </Alert>
                      ) : (
                        <Grid container spacing={4}>
                          {filteredRatings.map((rating, index) => (
                            <Grid item xs={12} key={rating._id}>
                              <Fade in timeout={500 + index * 100}>
                                <Card sx={{ 
                                  ...productDisplayStyles.interactiveCardStyle,
                                  ...productDisplayStyles.reviewCard
                                }}>
                                  <Stack direction={isMobile ? 'column' : 'row'} spacing={4}>
                                    <Avatar sx={productDisplayStyles.reviewAvatar}>
                                      <Business sx={{ fontSize: 36 }} />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Stack 
                                        direction={isMobile ? 'column' : 'row'} 
                                        justifyContent="space-between" 
                                        alignItems={isMobile ? 'flex-start' : 'center'}
                                        sx={{ mb: 3 }}
                                      >
                                        <Typography variant="h5" sx={productDisplayStyles.reviewCompanyName}>
                                          {rating.companyId.name}
                                        </Typography>
                                        <Chip 
                                          icon={<Schedule />}
                                          label={formatDate(rating.productRequestId.createdAt)}
                                          variant="outlined"
                                          sx={productDisplayStyles.reviewChip}
                                        />
                                      </Stack>
                                      
                                      <Box sx={{ mb: 3 }}>
                                        {renderCustomStars2(rating.rating, 28)}
                                      </Box>
                                      
                                      <Typography 
                                        variant="body1" 
                                        sx={productDisplayStyles.reviewText}
                                      >
                                        {rating.review || "No review provided."}
                                      </Typography>

                                      <Stack direction="row" spacing={3} flexWrap="wrap">
                                        <Chip
                                          icon={<AttachMoney />}
                                          label={`Unit Price: ₹${rating.productRequestId.unitPrice?.toFixed(2) ?? 'N/A'}`}
                                          variant="outlined"
                                          sx={productDisplayStyles.reviewChip}
                                        />
                                        <Chip
                                          icon={<Description />}
                                          label={`Quantity: ${rating.productRequestId.quantity}`}
                                          variant="outlined"
                                          sx={productDisplayStyles.reviewChip}
                                        />
                                        <Chip
                                          icon={<TrendingUp />}
                                          label={`Total Price: ₹${rating.productRequestId.totalPrice?.toFixed(2) ?? 'N/A'}`}
                                          variant="outlined"
                                          sx={productDisplayStyles.reviewChip}
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
