// ============================================
// Products Page
// ============================================
import React, { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [filters.page, filters.category, filters.sortBy, filters.sortOrder]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getProducts(filters);
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
        if (response.data.categories) {
          setCategories(response.data.categories);
        }
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    loadProducts();
  };

  const handleCategoryClick = (category) => {
    setFilters({
      ...filters,
      category: filters.category === category ? "" : category,
      page: 1,
    });
  };

  const handleSort = (e) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    setFilters({ ...filters, sortBy, sortOrder, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <h1>Products</h1>
          <p>Browse our collection of quality products</p>
        </div>

        {/* Search & Sort Bar */}
        <div className="products-toolbar">
          <form onSubmit={handleSearch} className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <button type="submit" className="btn-search">
              Search
            </button>
          </form>

          <div className="toolbar-actions">
            <button
              className="btn-filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
            </button>
            <select
              className="sort-select"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={handleSort}
            >
              <option value="createdAt-desc">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Best Rating</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className={`products-sidebar ${showFilters ? "show" : ""}`}>
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="category-list">
                <button
                  className={`category-btn ${!filters.category ? "active" : ""}`}
                  onClick={() =>
                    setFilters({ ...filters, category: "", page: 1 })
                  }
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn ${
                      filters.category === cat ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="products-grid-container">
            {isLoading ? (
              <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => handlePageChange(filters.page - 1)}
                    >
                      <FiChevronLeft />
                    </button>
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        className={`page-btn ${
                          page === filters.page ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="page-btn"
                      disabled={!pagination.hasNextPage}
                      onClick={() => handlePageChange(filters.page + 1)}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;