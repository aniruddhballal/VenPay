import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Fade,
  Grow,
  Container
} from "@mui/material";
import {
  ShoppingBag,
  Store,
  Email,
  Star,
} from "@mui/icons-material";

import InventoryIcon from '@mui/icons-material/Inventory';

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
        // First, fetch current user info
        const userRes = await axios.get(`http://localhost:5000/api/auth/me`, {
          withCredentials: true,
        });
        setCurrentUser(userRes.data);

        // Then, fetch product details
        const productRes = await axios.get(
          `http://localhost:5000/api/products/${id}`,
          {
            withCredentials: true,
          }
        );
        setProduct(productRes.data);

        // Fetch product ratings
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

        // Show authorization denied toast once
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

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: "#3b82f6",
              mb: 2,
              filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.3))"
            }} 
          />
          <Typography sx={{ color: "#475569", fontSize: "1.1rem" }}>
            Loading product...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error || !currentUser) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
          px: 2,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 32px 64px -12px rgba(0,0,0,0.15)",
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#dc2626",
              mb: 2,
              fontWeight: 600,
            }}
          >
            {error || "Authentication Required"}
          </Typography>
          <Typography sx={{ color: "#64748b" }}>
            Please log in to view product details.
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        }}
      >
        <Typography sx={{ color: "#475569", fontSize: "1.2rem" }}>
          Product not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
            {/* Product Image Section */}
            <Grow in timeout={1000}>
              <Paper
                elevation={24}
                sx={{
                  flex: { xs: "none", lg: "0 0 400px" },
                  height: { xs: 300, lg: 400 },
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 32px 64px -12px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
                  }
                }}
              >
                {product.image ? (
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      }
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
                    }}
                  >
                    <ShoppingBag 
                      sx={{ 
                        fontSize: 80, 
                        color: "#64748b",
                        filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.2))"
                      }} 
                    />
                  </Box>
                )}
              </Paper>
            </Grow>

            {/* Product Details Section */}
            <Grow in timeout={1200}>
              <Paper
                elevation={24}
                sx={{
                  flex: 1,
                  p: { xs: 3, sm: 4 },
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 32px 64px -12px rgba(0,0,0,0.15)",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
                    borderRadius: "16px 16px 0 0",
                  }
                }}
              >
                {/* Product Title */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 3,
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                    letterSpacing: -0.5
                  }}
                >
                  {product.name}
                </Typography>

                {/* Price */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#059669",
                      fontWeight: 700,
                      fontSize: { xs: "1.8rem", sm: "2.2rem" },
                      filter: "drop-shadow(0 2px 10px rgba(5, 150, 105, 0.3))"
                    }}
                  >
                    ₹{product.price.toFixed(2)}
                  </Typography>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#3b82f6",
                      fontWeight: 600,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                  >
                  <InventoryIcon sx={{ fontSize: 20 }} />
                    Description
                  </Typography>
                  <Typography
                    sx={{
                      color: "#475569",
                      lineHeight: 1.7,
                      fontSize: "1.1rem"
                    }}
                  >
                    {product.description}
                  </Typography>
                </Box>

                {/* Vendor Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#3b82f6",
                      fontWeight: 600,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                  >
                    <Store sx={{ fontSize: 20 }} />
                    Vendor Information
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "rgba(59, 130, 246, 0.05)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.08)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)"
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      {product.vendorId.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Email sx={{ fontSize: 16, color: "#3b82f6" }} />
                      <Typography
                        component="a"
                        href={`mailto:${product.vendorId.email}`}
                        sx={{
                          color: "#3b82f6",
                          textDecoration: "none",
                          "&:hover": {
                            color: "#1d4ed8",
                            textDecoration: "underline"
                          }
                        }}
                      >
                        {product.vendorId.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grow>
          </Box>
        </Fade>

        {/* Reviews Section - Only show for vendors */}
        {currentUser?.user?.userType === "vendor" && (
          <Fade in timeout={1400}>
            <Paper
              elevation={24}
              sx={{
                mt: 4,
                p: { xs: 3, sm: 4 },
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 32px 64px -12px rgba(0,0,0,0.15)",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
                  borderRadius: "16px 16px 0 0",
                }
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2
                }}
              >
                <Star sx={{ color: "#f59e0b" }} />
                Product Reviews
              </Typography>

              {ratingsLoading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <CircularProgress size={24} sx={{ color: "#3b82f6" }} />
                  <Typography sx={{ color: "#64748b" }}>
                    Loading reviews...
                  </Typography>
                </Box>
              )}

              {ratings && !ratingsLoading && (
                <>
                  {/* Rating Summary */}
                  {ratings.totalRatings > 0 && (
                    <Box
                      sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        flexWrap: "wrap"
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          color: "#f59e0b",
                          fontWeight: 700,
                        }}
                      >
                        {ratings.averageRating.toFixed(1)}
                      </Typography>
                      <Box>
                        <Rating
                          value={ratings.averageRating}
                          readOnly
                          precision={0.1}
                          sx={{
                            "& .MuiRating-iconFilled": {
                              color: "#f59e0b",
                            },
                            mb: 0.5
                          }}
                        />
                        <Typography sx={{ color: "#64748b" }}>
                          {ratings.totalRatings} reviews
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Company Filter */}
                  {ratings.ratings.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <FormControl 
                        fullWidth 
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "#1e293b",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)",
                            },
                            "& fieldset": {
                              borderColor: "rgba(0, 0, 0, 0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(0, 0, 0, 0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#3b82f6",
                            }
                          },
                          "& .MuiInputLabel-root": {
                            color: "#64748b",
                            "&.Mui-focused": {
                              color: "#3b82f6",
                            }
                          },
                          "& .MuiSelect-icon": {
                            color: "#64748b",
                          }
                        }}
                      >
                        <InputLabel>Filter by Company</InputLabel>
                        <Select
                          value={selectedCompany}
                          onChange={(e) => setSelectedCompany(e.target.value)}
                          label="Filter by Company"
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                background: "rgba(255, 255, 255, 0.95)",
                                backdropFilter: "blur(30px)",
                                border: "1px solid rgba(0,0,0,0.1)",
                                "& .MuiMenuItem-root": {
                                  color: "#1e293b",
                                  "&:hover": {
                                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                                  },
                                  "&.Mui-selected": {
                                    backgroundColor: "rgba(59, 130, 246, 0.15)",
                                  }
                                }
                              }
                            }
                          }}
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
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {filteredRatings.length > 0 ? (
                      filteredRatings.map((rating) => (
                        <Card
                          key={rating._id}
                          elevation={8}
                          sx={{
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(0,0,0,0.1)",
                            borderRadius: 3,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.9)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 30px rgba(59, 130, 246, 0.15)"
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#1e293b",
                                    fontWeight: 600,
                                    mb: 0.5
                                  }}
                                >
                                  {rating.companyId.name}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#3b82f6",
                                    fontSize: "0.9rem"
                                  }}
                                >
                                  {rating.companyId.email}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Rating
                                  value={rating.rating}
                                  readOnly
                                  size="small"
                                  sx={{
                                    "& .MuiRating-iconFilled": {
                                      color: "#f59e0b",
                                    },
                                    mb: 0.5
                                  }}
                                />
                                <Typography
                                  sx={{
                                    color: "#64748b",
                                    fontSize: "0.8rem"
                                  }}
                                >
                                  {formatDate(rating.date)}
                                </Typography>
                              </Box>
                            </Box>

                            {rating.review && (
                              <Typography
                                sx={{
                                  color: "#475569",
                                  mb: 2,
                                  lineHeight: 1.6,
                                  fontStyle: "italic"
                                }}
                              >
                                "{rating.review}"
                              </Typography>
                            )}

                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                              <Chip
                                label={`Quantity: ${rating.productRequestId.quantity}`}
                                size="small"
                                sx={{
                                  background: "rgba(59, 130, 246, 0.1)",
                                  color: "#3b82f6",
                                  border: "1px solid rgba(59, 130, 246, 0.3)"
                                }}
                              />
                              {rating.productRequestId.totalPrice && (
                                <Chip
                                  label={`Total: ₹${rating.productRequestId.totalPrice.toFixed(2)}`}
                                  size="small"
                                  sx={{
                                    background: "rgba(5, 150, 105, 0.1)",
                                    color: "#059669",
                                    border: "1px solid rgba(5, 150, 105, 0.3)"
                                  }}
                                />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 6,
                          color: "#64748b"
                        }}
                      >
                        <Star sx={{ fontSize: 60, mb: 2, opacity: 0.3 }} />
                        <Typography variant="h6">
                          {selectedCompany === "all"
                            ? "No reviews available for this product yet."
                            : "No reviews from the selected company."}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {(!ratings || ratings.totalRatings === 0) && !ratingsLoading && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    color: "#64748b"
                  }}
                >
                  <Star sx={{ fontSize: 60, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6">
                    No reviews available for this product yet.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Fade>
        )}
      </Container>
    </Box>
  );
}
