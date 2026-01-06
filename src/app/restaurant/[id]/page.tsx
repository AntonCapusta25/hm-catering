"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMerchantMenu, searchRestaurants, type MerchantMenu, type Restaurant } from "@/lib/hyperzod";
import Link from "next/link";

export default function RestaurantMenuPage() {
    const params = useParams();
    const router = useRouter();
    const restaurantId = params.id as string;

    const [menu, setMenu] = useState<MerchantMenu | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                // Fetch menu
                const menuData = await getMerchantMenu(restaurantId);
                setMenu(menuData);

                // Fetch all restaurants to find this one (to get full details)
                const restaurants = await searchRestaurants({ limit: 100 });
                const restaurantData = restaurants.find(r => r.id === restaurantId);
                setRestaurant(restaurantData || null);
            } catch (err) {
                console.error("Failed to fetch menu:", err);
                setError("Failed to load menu");
            } finally {
                setLoading(false);
            }
        }

        if (restaurantId) {
            fetchData();
        }
    }, [restaurantId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
                    <p className="mt-4 text-dark">Loading menu...</p>
                </div>
            </div>
        );
    }

    if (error || !menu) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 font-semibold">{error || "Menu not found"}</p>
                    <Link href="/" className="mt-4 inline-block text-orange hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header with Back Button */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.1868 43.9947L9.7144 30.5228H52.5144C53.9067 30.5228 55.0368 29.3927 55.0368 28.0004C55.0368 26.608 53.9067 25.478 52.5144 25.478H9.71438L23.1868 12.0056C24.1727 11.0196 24.1727 9.42543 23.1868 8.43947L23.1867 8.4394C22.2003 7.45357 20.6061 7.45347 19.6201 8.43947L1.84253 26.2149L1.84169 26.2158C1.60841 26.4509 1.4251 26.7307 1.29779 27.0358L1.29746 27.0366C1.04251 27.6525 1.04251 28.3483 1.29746 28.9642L1.29779 28.965C1.4252 29.2703 1.60852 29.5494 1.84142 29.7848L1.84253 29.7859L19.62 47.5612C20.1116 48.0534 20.758 48.3004 21.4035 48.3004C22.0485 48.3004 22.6948 48.0533 23.1868 47.5613C24.1728 46.5753 24.1727 44.9812 23.1868 43.9947L23.1868 43.9947Z" fill="black" stroke="black" strokeWidth="0.6" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-dark truncate flex-1 text-center px-4">
                        {restaurant?.name || menu.merchant.name}
                    </h1>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>
            </div>

            {/* Restaurant Header */}
            <div className="relative">
                {/* Cover Image */}
                <div className="w-full aspect-video md:aspect-[16/7] lg:aspect-[16/5]">
                    {restaurant?.image ? (
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-orange to-dark"></div>
                    )}
                </div>

                {/* Restaurant Info */}
                <div className="px-4 pb-4 pt-3">
                    <div className="relative">
                        {/* Logo */}
                        {restaurant?.logo && (
                            <div className="absolute left-0 -top-7 w-[100px] h-[100px] rounded-lg overflow-hidden border-4 border-white bg-white shadow-lg">
                                <img
                                    src={restaurant.logo}
                                    alt={`${restaurant.name} logo`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Restaurant Details */}
                        <div className={restaurant?.logo ? "ml-28 pt-2" : "pt-2"}>
                            <h1 className="text-2xl font-bold text-dark capitalize mb-1">
                                {restaurant?.name || menu.merchant.name}
                            </h1>
                            <p className="text-sm text-gray-600 mb-1">
                                {restaurant?.address || menu.merchant.address}
                            </p>
                            <p className="text-sm font-medium text-dark capitalize">
                                {restaurant?.cuisine || menu.merchant.cuisine}
                            </p>
                        </div>

                        {/* Stats */}
                        {restaurant && (
                            <div className="mt-4 flex items-center justify-center text-xs font-medium text-dark gap-2">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 fill-current text-yellow-400 mr-1" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                    <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
                                </div>
                                <div className="w-1 h-1 bg-dark rounded-full"></div>
                                <span className="font-semibold capitalize">{restaurant.priceRange}</span>
                                {restaurant.deliveryFee && (
                                    <>
                                        <div className="w-1 h-1 bg-dark rounded-full"></div>
                                        <span className="font-semibold">€{restaurant.deliveryFee} Delivery</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Category Navigation */}
            <div className="sticky top-[55px] z-40 bg-white border-b-2 border-gray-200">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-5 px-4 py-3 min-w-max">
                        {menu.categories.map((category) => (
                            <a
                                key={category.id}
                                href={`#cat_${category.id}`}
                                className="text-xs font-medium text-dark hover:text-orange transition-colors whitespace-nowrap capitalize"
                            >
                                {category.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Categories */}
            <div className="px-4 pb-24">
                {menu.categories.map((category) => (
                    <div key={category.id} id={`cat_${category.id}`} className="mb-8 pt-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-dark capitalize mb-4">
                            {category.name}
                        </h3>

                        {/* Horizontal Scrollable Product List */}
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                            {category.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex-shrink-0 w-[280px] bg-white rounded-[2rem] shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                                >
                                    {/* Product Image - Large */}
                                    <div className="relative w-full aspect-square">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-sm">No image</span>
                                            </div>
                                        )}

                                        {/* Out of Stock Overlay */}
                                        {!product.available && (
                                            <div className="absolute inset-0 bg-black/20 z-10">
                                                <div className="absolute left-0 top-0 w-full flex justify-center z-20">
                                                    <div className="block w-full bg-black/75 text-center text-xs text-white px-4 py-1">
                                                        Out Of Stock
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info - Compact */}
                                    <div className="p-4">
                                        <h4 className="text-base font-semibold text-dark truncate mb-1">
                                            {product.name}
                                        </h4>
                                        {product.description && (
                                            <p
                                                className="text-xs text-gray-600 line-clamp-2 mb-3 min-h-[32px] font-medium"
                                                dangerouslySetInnerHTML={{ __html: product.description }}
                                            />
                                        )}
                                        <div className="flex items-center justify-between border-t border-dark/10 pt-3">
                                            <h4 className="text-lg font-bold text-dark">
                                                €{product.price.toFixed(2)}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Fixed Book Now Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
                <Link
                    href="/#booking"
                    className="block w-full bg-orange text-white text-center text-lg font-bold uppercase tracking-wider py-4 rounded-full hover:bg-dark transition-colors shadow-md"
                >
                    Book Now →
                </Link>
            </div>

            {/* Add custom scrollbar hiding */}
            <style jsx global>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
