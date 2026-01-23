import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';
import ProductFilter from '../components/ProductFilter';
import { useSearchParams } from 'react-router-dom';

const Home: React.FC = () => {
    const [searchParams] = useSearchParams();
    return (
        <div className="flex flex-1 flex-col w-full">
            <div className="flex flex-col w-full gap-8 md:gap-12 pb-12">
                {!searchParams.get('q') && !searchParams.get('categoryId') && <Hero />}

                <div className="px-4 lg:px-8 max-w-[1920px] mx-auto w-full">
                    {/* Layout for Sort/Filter when searching */}
                    {(searchParams.get('q') || searchParams.get('categoryId') || searchParams.get('minPrice')) ? (
                        <div className="flex flex-col md:flex-row gap-8">
                            <aside className="w-full md:w-[280px] shrink-0">
                                <ProductFilter className="sticky top-24" />
                            </aside>
                            <div className="flex-1 flex flex-col gap-8">
                                <FeaturedProducts title={searchParams.get('q') ? `Kết quả cho "${searchParams.get('q')}"` : "Sản phẩm"} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 md:gap-16">
                            <Features />
                            <Categories />
                            <FeaturedProducts />
                            <Newsletter />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
