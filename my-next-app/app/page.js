"use client";
import HomeBanner from '@/src/components/HomeBanner.js';
import OnlyThisWeekOffer from '@/src/components/onlyThisWeekOffer.js';
import ProductSection from '@/src/components/ProductSection.js';
import TopCategories from '@/src/components/TopCategories.js';
import { defaultPopularProducts, defaultLatestProducts, defaultTabs } from '../app/static Data/staticData.js';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function HomePage() {

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) {
      router.push("/register");
    }
  }, [router]);


  return (
    <main className="min-h-screen ">
      <section className='bg-[#FAFAFA]'>
        {/* Hero Banner Slider */}
        <section className=" md:pt-6 max-w-7xl mx-auto">
          <HomeBanner />
        </section>

        {/* Top Categories */}
        <section className="max-w-7xl mx-auto">
          <TopCategories />
        </section>



      </section>


      <section className='bg-white'>
        <section className="pb-10 max-w-7xl mx-auto ">
          <ProductSection
            title="Popular Products"
            subtitle="Do not miss the current offers"
            tabs={defaultTabs}
            products={defaultPopularProducts}
          />
          <section className="max-w-7xl mx-auto">
            <OnlyThisWeekOffer />
          </section>
          <ProductSection
            title="Latest Products"
            subtitle="Do not miss the current offers"
            tabs={defaultTabs}
            products={defaultLatestProducts}
          />
        </section>
      </section>
    </main>
  );
}
