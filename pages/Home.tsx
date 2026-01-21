import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';

const Home: React.FC = () => {
    return (
        <div className="flex flex-1 flex-col w-full">
            <div className="flex flex-col w-full gap-8 md:gap-12 pb-12">
                <Hero />
                <div className="px-4 lg:px-8 flex flex-col gap-8 md:gap-16 max-w-[1920px] mx-auto w-full">
                    <Features />
                    <Categories />
                    <FeaturedProducts />
                    <Newsletter />
                </div>
            </div>
        </div>
    );
};

export default Home;
