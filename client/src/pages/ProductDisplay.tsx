import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ProductDisplay.module.css";
import { toast } from "react-toastify";

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

  // Get unique companies from ratings
  const getUniqueCompanies = () => {
    if (!ratings?.ratings) return [];
    const companies = ratings.ratings.map(rating => rating.companyId);
    const uniqueCompanies = companies.filter((company, index, self) => 
      index === self.findIndex(c => c._id === company._id)
    );
    return uniqueCompanies;
  };

  // Filter ratings based on selected company
  const filteredRatings = selectedCompany === "all" 
    ? ratings?.ratings || []
    : ratings?.ratings.filter(rating => rating.companyId._id === selectedCompany) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details
        const productRes = await axios.get(`http://localhost:5000/api/products/${id}`, {
          withCredentials: true,
        });
        setProduct(productRes.data);
        //console.log("Product data:", productRes.data);

        // Get current user info (to check if they're a vendor)
        try {
          const userRes = await axios.get(`http://localhost:5000/api/auth/me`, {
            withCredentials: true,
          });
          setCurrentUser(userRes.data);
          //console.log("Current user:", userRes.data);
          //console.log("User type:", userRes.data.user?.userType);

          // Always try to fetch ratings for now (for debugging)
          setRatingsLoading(true);
          try {
            //console.log("Fetching ratings for product ID:", id);
            const ratingsRes = await axios.get(`http://localhost:5000/api/productratings/product/${id}`, {
              withCredentials: true,
            });
            setRatings(ratingsRes.data);
            //console.log("Ratings data:", ratingsRes.data);
          } catch (ratingsErr: any) {
            console.error(ratingsErr);
            const message = ratingsErr.response?.data?.error || "Failed to fetch ratings.";
            toast.error(message);
            // Set empty ratings instead of leaving it null
            setRatings({
              ratings: [],
              averageRating: 0,
              totalRatings: 0
            });
          } finally {
            setRatingsLoading(false);
          }
        } catch (userErr: any) {
            console.error(userErr);
            const message = userErr.response?.data?.error || "Failed to fetch user data.";
            toast.error(message);
            
            // Still try to fetch ratings even if user fetch fails
          setRatingsLoading(true);
          try {
            const ratingsRes = await axios.get(`http://localhost:5000/api/productratings/product/${id}`, {
              withCredentials: true,
            });
            setRatings(ratingsRes.data);
            //console.log("Ratings data:", ratingsRes.data);
          } catch (ratingsErr: any) {
            console.error(ratingsErr);
            const message = ratingsErr.response?.data?.error || "Failed to fetch ratings.";
            toast.error(message);
            
            // Set empty ratings instead of leaving it null
            setRatings({
              ratings: [],
              averageRating: 0,
              totalRatings: 0
            });
          } finally {
            setRatingsLoading(false);
          }
        }
      } catch (err: any) {
        console.error(err);
        const message = err.response?.data?.error || "Failed to fetch data.";
        toast.error(message);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className={styles.loadingState}>Loading product...</div>;
  if (error) return <div className={styles.errorState}>{error}</div>;
  if (!product) return <div className={styles.notFoundState}>Product not found.</div>;

  return (
    <div className={styles.container}>
      {/* Image Section */}
      <div className={styles.imageSection}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}></div>
        )}
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        {/* Product Title */}
        <h1 className={styles.productTitle}>{product.name}</h1>

        {/* Price Section */}
        <div className={styles.priceSection}>
          <div className={styles.priceLabel}>Price</div>
          <div className={styles.priceValue}>₹{product.price.toFixed(2)}</div>
        </div>

        {/* Description Section */}
        <div className={styles.descriptionSection}>
          <div className={styles.descriptionLabel}>Description</div>
          <p className={styles.descriptionText}>{product.description}</p>
        </div>

        {/* Vendor Section */}
        <div className={styles.vendorSection}>
          <div className={styles.vendorLabel}>Vendor Information</div>
          <div className={styles.vendorInfo}>
            <h3 className={styles.vendorName}>{product.vendorId.name}</h3>
            <a
              href={`mailto:${product.vendorId.email}`}
              className={styles.vendorEmail}
            >
              {product.vendorId.email}
            </a>
          </div>
        </div>

        {/* Reviews Section - Only show for vendors */}
        {currentUser?.user?.userType === "vendor" && (
          <div className={styles.reviewsSection}>
            <div className={styles.reviewsHeader}>
              <div className={styles.reviewsLabel}>Product Reviews</div>
              {ratingsLoading && <div className={styles.ratingsLoading}>Loading reviews...</div>}
            </div>

            {ratings && !ratingsLoading && (
              <>
                {/* Rating Summary */}
                {ratings.totalRatings > 0 && (
                  <div className={styles.ratingSummary}>
                    <div className={styles.averageRating}>
                      <span className={styles.ratingValue}>{ratings.averageRating.toFixed(1)}</span>
                      <span className={styles.ratingStars}>{renderStars(Math.round(ratings.averageRating))}</span>
                      <span className={styles.ratingCount}>({ratings.totalRatings} reviews)</span>
                    </div>
                  </div>
                )}

                {/* Company Filter */}
                {ratings.ratings.length > 0 && (
                  <div className={styles.filterSection}>
                    <label htmlFor="companyFilter" className={styles.filterLabel}>
                      Filter by Company:
                    </label>
                    <select
                      id="companyFilter"
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className={styles.companyFilter}
                    >
                      <option value="all">All Companies ({ratings.totalRatings})</option>
                      {getUniqueCompanies().map(company => {
                        const companyRatingCount = ratings.ratings.filter(r => r.companyId._id === company._id).length;
                        return (
                          <option key={company._id} value={company._id}>
                            {company.name} ({companyRatingCount})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {/* Reviews List */}
                <div className={styles.reviewsList}>
                  {filteredRatings.length > 0 ? (
                    filteredRatings.map(rating => (
                      <div key={rating._id} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.reviewCompany}>
                            <strong>{rating.companyId.name}</strong>
                            <span className={styles.reviewEmail}>{rating.companyId.email}</span>
                          </div>
                          <div className={styles.reviewMeta}>
                            <span className={styles.reviewRating}>
                              {renderStars(rating.rating)} ({rating.rating}/5)
                            </span>
                            <span className={styles.reviewDate}>
                              {formatDate(rating.date)}
                            </span>
                          </div>
                        </div>
                        
                        {rating.review && (
                          <div className={styles.reviewText}>
                            <p>{rating.review}</p>
                          </div>
                        )}
                        
                        <div className={styles.reviewDetails}>
                          <span className={styles.reviewQuantity}>
                            Quantity: {rating.productRequestId.quantity}
                          </span>
                          {rating.productRequestId.totalPrice && (
                            <span className={styles.reviewPrice}>
                              Total: ₹{rating.productRequestId.totalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noReviews}>
                      {selectedCompany === "all" 
                        ? "No reviews available for this product yet."
                        : "No reviews from the selected company."
                      }
                    </div>
                  )}
                </div>
              </>
            )}

            {(!ratings || ratings.totalRatings === 0) && !ratingsLoading && (
              <div className={styles.noReviews}>
                No reviews available for this product yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
