import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { ColorChooser, ImageLoader, MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import { displayMoney } from '@/helpers/utils';
import {
  useBasket,
  useDocumentTitle,
  useProduct,
  useRecommendedProducts,
  useScrollTop
} from '@/hooks';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';

const ViewProduct = () => {
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  useDocumentTitle(`View ${product?.name || 'Item'}`);

  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null); // default to null for no color selected

  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useRecommendedProducts(6);

  useEffect(() => {
    setSelectedImage(product?.image);
  }, [product]);

  const onSelectedSizeChange = (newValue) => {
    setSelectedSize(newValue.value);
  };

  const onSelectedColorChange = (color) => {
    // If color is empty or null, reset the selected color and remove the shadow
    if (!color) {
      setSelectedColor(null); // Deselect color
      document.documentElement.style.removeProperty('--selected-color'); // Remove the CSS variable
    } else {
      setSelectedColor(color);
      // Set the selected color as a CSS variable
      document.documentElement.style.setProperty('--selected-color', color);
    }
  };

  const handleAddToBasket = () => {
    addToBasket({ ...product, selectedColor, selectedSize: selectedSize || product.sizes[0] });
  };

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h4>Loading Product...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: '3rem' }} />
        </div>
      )}
      {error && <MessageDisplay message={error} />}
      {product && !isLoading && (
        <>
          <div className="product-view">
            <Link to={SHOP}>
              <h3 className="button-link d-inline-flex">
                <ArrowLeftOutlined />
                &nbsp; Back to shop
              </h3>
            </Link>
            <div className="product-modal">
              {product.imageCollection.length !== 0 && (
                <div className="product-modal-image-collection">
                  {product.imageCollection.map((image) => (
                    <div
                      className="product-modal-image-collection-wrapper"
                      key={image.id}
                      onClick={() => setSelectedImage(image.url)}
                      role="presentation"
                    >
                      <ImageLoader
                        className="product-modal-image-collection-img"
                        src={image.url}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="product-modal-image-wrapper">
                <ImageLoader
                  alt={product.name}
                  className="product-modal-image"
                  src={selectedImage}
                />
                {/* Conditionally render the duplicate image only when a color is selected */}
                {selectedColor && (
                  <ImageLoader
                    alt={product.name}
                    className="product-modal-image-duplicate"
                    style={{
                      filter: `drop-shadow(0px 10px 10px ${selectedColor})`, // Apply selected color
                    }}
                    src={selectedImage}
                  />
                )}
              </div>

              <div className="product-modal-details">
                <br />
                <span className="text-subtle">{product.brand}</span>
                <h1 className="margin-top-0">{product.name}</h1>
                <span>{product.description}</span>
                <br />
                <br />
                <div className="divider" />
                <br />
                <div>
                  <span className="text-subtle">Size</span>
                  <br />
                  <br />
                  <Select
                    placeholder="--Select Size--"
                    onChange={onSelectedSizeChange}
                    options={product.sizes
                      .sort((a, b) => (a < b ? -1 : 1))
                      .map((size) => ({ label: `${size}`, value: size }))} 
                    styles={{ menu: (provided) => ({ ...provided, zIndex: 10 }) }}
                  />
                </div>
                <br />
                {product.availableColors.length >= 1 && (
                  <div>
                    <span className="text-subtle">Choose Color</span>
                    <br />
                    <br />
                    <ColorChooser
                      availableColors={product.availableColors}
                      onSelectedColorChange={onSelectedColorChange}
                    />
                  </div>
                )}
                <h1>{displayMoney(product.price)}</h1>
                <div className="product-modal-action">
                  <button
                    className={`button button-small ${
                      isItemOnBasket(product.id) ? 'button-border button-border-gray' : ''
                    }`}
                    onClick={handleAddToBasket}
                    type="button"
                  >
                    {isItemOnBasket(product.id) ? 'Remove From Basket' : 'Add To Basket'}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '10rem' }}>
              <div className="display-header">
                <h1>Recommended</h1>
                <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
              </div>
              {errorFeatured && !isLoadingFeatured ? (
                <MessageDisplay
                  message={error}
                  action={fetchRecommendedProducts}
                  buttonLabel="Try Again"
                />
              ) : (
                <ProductShowcaseGrid products={recommendedProducts} skeletonCount={3} />
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default ViewProduct;
