import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Container,
  Avatar,
  Link,
  Stack,
  /*Skeleton*/
} from '@mui/material';
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Star as StarIcon,
  ShoppingCart as ShoppingCartIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

// Styled components for custom styling
/*const ProductImage = styled(CardMedia)(({ theme }) => ({
  '& img': {
    height: 400,
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  },
}));*/

const PriceChip = styled(Chip)(({ /*theme*/ }) => ({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  padding: '8px 16px',
  height: 'auto',
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

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

  // Get unique companies from ratings
  const getUniqueCompanies = () => {
    if (!ratings?.ratings) return [];
    const companies = ratings.ratings.map((rating) => rating.companyId);
    const uniqueCompanies = companies.filter(
      (company, index, self) =>
        index === self.findIndex((c) => c._id === company._id)
    );
    return uniqueCompanies;
  };

  // Filter ratings based on selected company
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingContainer>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading product...
          </Typography>
        </LoadingContainer>
      </Container>
    );
  }

  if (error || !currentUser) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error || "Please log in to view product details."}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Product not found.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
       <Grid container spacing={4}>
        {/* Product Image Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {product.image ? (
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              sx={{
                height: 400,
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 80, color: 'grey.400' }} />
            </Box>
          )}
        </Card>
      </Grid>


        {/* Product Details Section */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            {/* Product Title */}
            <Typography variant="h3" component="h1" fontWeight="bold">
              {product.name}
            </Typography>

            {/* Price Section */}
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Price
              </Typography>
              <PriceChip
                label={`₹${product.price.toFixed(2)}`}
                color="success"
                variant="filled"
              />
            </Box>

            {/* Description Section */}
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
            </Box>

            {/* Vendor Section */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Vendor Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {product.vendorId.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {product.vendorId.name}
                  </Typography>
                  <Link
                    href={`mailto:${product.vendorId.email}`}
                    sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                  >
                    <EmailIcon sx={{ mr: 0.5, fontSize: 16 }} />
                    {product.vendorId.email}
                  </Link>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Reviews Section - Only show for vendors */}
      {currentUser?.user?.userType === "vendor" && (
        <Box sx={{ mt: 6 }}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h4" component="h2">
                Product Reviews
              </Typography>
              {ratingsLoading && (
                <CircularProgress size={24} sx={{ ml: 2 }} />
              )}
            </Box>

            {ratings && !ratingsLoading && (
              <>
                {/* Rating Summary */}
                {ratings.totalRatings > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Card elevation={1} sx={{ p: 3, bgcolor: 'primary.50' }}>
                      <Stack
                        direction="row"
                        spacing={3}
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" component="div" fontWeight="bold">
                            {ratings.averageRating.toFixed(1)}
                          </Typography>
                          <Rating
                            value={ratings.averageRating}
                            readOnly
                            precision={0.1}
                            size="large"
                          />
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                          <Typography variant="h6" color="text.secondary">
                            {ratings.totalRatings} {ratings.totalRatings === 1 ? 'Review' : 'Reviews'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Based on customer feedback
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  </Box>
                )}

                {/* Company Filter */}
                {ratings.ratings.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <FormControl variant="outlined" sx={{ minWidth: 250 }}>
                      <InputLabel>Filter by Company</InputLabel>
                      <Select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        label="Filter by Company"
                      >
                        <MenuItem value="all">
                          All Companies ({ratings.totalRatings})
                        </MenuItem>
                        {getUniqueCompanies().map((company) => {
                          const companyRatingCount = ratings.ratings.filter(
                            (r) => r.companyId._id === company._id
                          ).length;
                          return (
                            <MenuItem key={company._id} value={company._id}>
                              {company.name} ({companyRatingCount})
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                )}

                {/* Reviews List */}
                <Stack spacing={2}>
                  {filteredRatings.length > 0 ? (
                    filteredRatings.map((rating) => (
                      <ReviewCard key={rating._id} elevation={1}>
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 2,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                                {rating.companyId.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" component="div">
                                  {rating.companyId.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {rating.companyId.email}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Rating value={rating.rating} readOnly size="small" />
                              <Typography variant="body2" color="text.secondary">
                                <CalendarIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                {formatDate(rating.date)}
                              </Typography>
                            </Box>
                          </Box>

                          {rating.review && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body1" paragraph>
                                {rating.review}
                              </Typography>
                            </Box>
                          )}

                          <Divider sx={{ my: 2 }} />

                          <Stack direction="row" spacing={2}>
                            <Chip
                              label={`Quantity: ${rating.productRequestId.quantity}`}
                              variant="outlined"
                              size="small"
                            />
                            {rating.productRequestId.totalPrice && (
                              <Chip
                                label={`Total: ₹${rating.productRequestId.totalPrice.toFixed(2)}`}
                                variant="outlined"
                                size="small"
                                color="success"
                              />
                            )}
                          </Stack>
                        </CardContent>
                      </ReviewCard>
                    ))
                  ) : (
                    <Alert severity="info">
                      {selectedCompany === "all"
                        ? "No reviews available for this product yet."
                        : "No reviews from the selected company."}
                    </Alert>
                  )}
                </Stack>
              </>
            )}

            {(!ratings || ratings.totalRatings === 0) && !ratingsLoading && (
              <Alert severity="info">
                No reviews available for this product yet.
              </Alert>
            )}
          </Paper>
        </Box>
      )}
    </Container>
  );
}
