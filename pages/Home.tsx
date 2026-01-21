import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';

const Home: React.FC = () => {
    return (
        <div className="flex flex-1 justify-center py-4 md:py-8 px-2 md:px-4 lg:px-0">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full gap-5 md:gap-10">
                <Hero />
                <Features />
                <Categories />
                <FeaturedProducts />
                <Newsletter />
            </div>
        </div>
    );
};

export default Home;
