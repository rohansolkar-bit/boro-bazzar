'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const defaultOffers = [
  {
    id: 'quality-products',
    eyebrow: 'Only This Week',
    title: 'We provide you the best quality products',
    description: 'A family place for grocery',
    ctaLabel: 'Shop Now',
    href: '/features',
    image: '/banner-slide1.png',
    imageAlt: 'Organic snack bars and ingredients',
    imagePosition: 'right center',
  },
  {
    id: 'exciting-grocery',
    eyebrow: 'Only This Week',
    title: 'We make your grocery shopping more exciting',
    description: 'Shine the morning...',
    ctaLabel: 'Shop Now',
    href: '/features',
    image: '/banner-slide2.png',
    imageAlt: 'Fresh fruits and vegetables',
    imagePosition: 'right center',
  },
  {
    id: 'save-money',
    eyebrow: 'Only This Week',
    title: 'The one supermarket that saves your money',
    description: 'Breakfast made better',
    ctaLabel: 'Shop Now',
    href: '/features',
    image: '/banner-slide3.png',
    imageAlt: 'Premium meat and seafood on a plate',
    imagePosition: 'right center',
  },
];

export function OfferCard({ offer, priority = false, onOfferClick }) {
  return (
    <article className="group relative isolate min-h-56 overflow-hidden rounded-md bg-[#f4f1ec] px-5 py-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 sm:min-h-50 sm:px-6 md:min-h-47" role="listitem">
      {offer.image ? (
        <Image
          src={offer.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 390px"
          className="absolute inset-0 -z-10 object-cover transition duration-300 group-hover:scale-[1.03]"
          style={{ objectPosition: offer.imagePosition || 'right center' }}
        />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#f4f1ec] via-[#f4f1ec]/95 via-65% to-[#f4f1ec]/35 md:via-[#f4f1ec]/90 md:via-58% md:to-[#f4f1ec]/20" />

      <div className="flex max-w-[76%] flex-col items-start gap-2 sm:max-w-[66%] md:max-w-[62%] lg:max-w-[58%]">
        {offer.eyebrow ? (
          <span className="text-[11px] font-extrabold leading-none text-orange-500">
            {offer.eyebrow}
          </span>
        ) : null}

        <h3 className="text-lg font-extrabold leading-tight tracking-normal text-slate-950 sm:text-xl md:text-lg lg:text-xl">
          {offer.title}
        </h3>

        {offer.description ? (
          <p className="text-xs font-medium leading-snug text-slate-500">
            {offer.description}
          </p>
        ) : null}

        <Button
          component={Link}
          href={offer.href || '/features'}
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon fontSize="inherit" />}
          onClick={() => onOfferClick?.(offer)}
          aria-label={`${offer.ctaLabel || 'Shop Now'}: ${offer.title}`}
          sx={{
            mt: 1,
            borderRadius: 999,
            backgroundColor: '#ffffff',
            color: '#1f2937',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
            fontSize: '0.72rem',
            fontWeight: 800,
            minHeight: 40,
            px: 1.6,
            textTransform: 'none',
            '&:focus-visible': {
              outline: '2px solid #f97316',
              outlineOffset: '2px',
            },
            '&:hover': {
              backgroundColor: '#111827',
              color: '#ffffff',
              boxShadow: '0 8px 18px rgba(15, 23, 42, 0.18)',
            },
          }}
        >
          {offer.ctaLabel || 'Shop Now'}
        </Button>
      </div>
    </article>
  );
}

export default function OnlyThisWeekOffer({
  offers = defaultOffers,
  className = '',
  labelledBy,
  onOfferClick,
}) {
  if (!offers?.length) {
    return null;
  }

  return (
    <section
      className={`w-full px-3 py-5 sm:px-5 ${className}`}
      aria-label={labelledBy ? undefined : 'Only this week offers'}
      aria-labelledby={labelledBy}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {offers.map((offer, index) => (
          <OfferCard
            key={offer.id || offer.title}
            offer={offer}
            priority={index === 0}
            onOfferClick={onOfferClick}
          />
        ))}
      </div>
    </section>
  );
}