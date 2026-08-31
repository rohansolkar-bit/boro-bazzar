'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

  
function ProductVisual({ product }) {
  if (product.img) {
    return (
      <Image
        src={product.img}
        alt={product.name}
        width={150}
        height={130}
        className="h-[130px] w-full max-w-[150px] object-contain"
      />
    );
  }

  const baseClass = 'relative flex items-center justify-center overflow-hidden text-center font-extrabold text-white shadow-[0_14px_24px_rgba(15,23,42,0.12)]';
  const shapeClass = {
    bottle: 'h-[116px] w-[58px] rounded-t-[24px] rounded-b-2xl before:absolute before:left-[18px] before:top-0 before:z-10 before:h-5 before:w-[22px] before:rounded-t-[5px] before:rounded-b-sm before:bg-slate-900/35',
    box: 'h-[116px] w-[116px] rounded',
    bag: 'h-[116px] w-[98px] -skew-x-3 rounded-t-[14px] rounded-b-[22px]',
    rolls: 'h-[92px] w-28 rounded-lg before:absolute before:left-4 before:right-4 before:top-4 before:z-10 before:h-7 before:rounded-full before:bg-white after:absolute after:left-4 after:right-4 after:bottom-4 after:z-10 after:h-7 after:rounded-full after:bg-white',
  }[product.imageType || 'box'];

  return (
    <div className={`${baseClass} ${shapeClass}`} role="img" aria-label={product.name}>
      <span
        className="absolute inset-0"
        style={{ backgroundColor: product.accent || '#10b981' }}
      />
      <span className="relative z-20 max-w-[82px] text-base leading-none text-white drop-shadow-sm">
        {product.label || 'Fresh'}
      </span>
    </div>
  );
}

export function ProductCard({ product, quantity = 0, onAddToCart }) {
  return (
    <article className="flex min-h-72 flex-col rounded-md border border-slate-200 bg-white px-3 py-3 shadow-[0_2px_0_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 sm:min-h-[330px]" role="listitem">
      <Link
        href={product.href || '/features'}
        className="mb-2 flex h-36 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        aria-label={`View ${product.name}`}
      >
        <ProductVisual product={product} />
      </Link>

      <Link
        href={product.href || '/features'}
        className="line-clamp-2 min-h-10 text-xs font-bold leading-relaxed text-slate-700 outline-none transition hover:text-emerald-600 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        {product.name}
      </Link>

      <Rating
        value={product.rating || 0}
        readOnly
        precision={0.5}
        size="small"
        className="mt-2"
        aria-label={`${product.rating || 0} out of 5 stars`}
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm font-extrabold text-red-600">{product.price}</span>
        {product.originalPrice ? (
          <span className="text-xs font-bold text-slate-400 line-through">
            {product.originalPrice}
          </span>
        ) : null}
      </div>

      <div className="mt-auto pt-3">
        <Button
          type="button"
          fullWidth
          variant={quantity > 0 ? 'contained' : 'outlined'}
          color="success"
          size="small"
          startIcon={<AddShoppingCartIcon fontSize="small" />}
          onClick={() => onAddToCart?.(product)}
          aria-label={`Add ${product.name} to cart`}
          sx={{
            borderRadius: 1,
            fontSize: '0.72rem',
            fontWeight: 800,
            minHeight: 40,
            textTransform: 'none',
          }}
        >
          {quantity > 0 ? `Added (${quantity})` : 'Add to Cart'}
        </Button>
      </div>
    </article>
  );
}

export default function ProductSection({
  title = '',
  subtitle = '',
  tabs = [],
  activeTab,
  products = [],
  onTabChange,
  onAddToCart,
}) {
  const headingId = useId();
  const [selectedTab, setSelectedTab] = useState(activeTab || tabs[0] || '');
  const [cartQuantities, setCartQuantities] = useState({});
  const currentTab = activeTab || selectedTab;
  const hasCategorizedProducts = products.some((product) => product.category);
  const visibleProducts = hasCategorizedProducts
    ? products.filter((product) => product.category === currentTab)
    : products;
  const cartCount = Object.values(cartQuantities).reduce((total, quantity) => total + quantity, 0);

  function handleTabChange(_, nextTab) {
    setSelectedTab(nextTab);
    onTabChange?.(nextTab);
  }

  function handleAddToCart(product) {
    setCartQuantities((currentQuantities) => ({
      ...currentQuantities,
      [product.id]: (currentQuantities[product.id] || 0) + 1,
    }));
    onAddToCart?.(product);
  }

  return (
    <section className="w-full px-3 py-5 sm:px-5 sm:py-7" aria-labelledby={headingId}>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 id={headingId} className="text-lg font-bold leading-tight text-slate-950">
              {title}
            </h2>
            <Badge badgeContent={cartCount} color="success" showZero aria-label={`${cartCount} items in cart`}>
              <ShoppingCartOutlinedIcon className="text-slate-600" fontSize="small" />
            </Badge>
          </div>
          {subtitle ? <p className="mt-1.5 text-sm leading-snug text-slate-500">{subtitle}</p> : null}
        </div>

        {tabs.length > 0 ? <div className="flex w-full min-w-0 items-center gap-1 lg:w-auto">
           
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label={`${title || 'Product'} categories`}
            sx={{
              minHeight: 36,
              maxWidth: { xs: 'calc(100vw - 56px)', sm: '100%', lg: 620 },
              '& .MuiTabs-indicator': { backgroundColor: '#0d9488' },
              '& .MuiTab-root': {
                color: '#5b616b',
                fontSize: '0.8rem',
                fontWeight: 600,
                minHeight: 36,
                minWidth: 'auto',
                px: 1.5,
                textTransform: 'none',
              },
              '& .Mui-selected': { color: '#111827' },
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab} value={tab} label={tab} />
            ))}
          </Tabs>
          <ChevronRightIcon className="shrink-0 text-slate-500" aria-hidden="true" />
        </div> : null} 
        
      </div>

      {visibleProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 rounded-2xl shadow-neutral-400 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" role="list" aria-label={`${title || 'Products'} list`}>
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cartQuantities[product.id] || 0}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
          <Chip label={currentTab || 'Products'} color="success" variant="outlined" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No products found in this category.
          </p>
        </div>
      )}
    </section>
  );
}
