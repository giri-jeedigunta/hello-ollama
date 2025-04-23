'use client'

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-lg py-4 z-50 border-b border-gray-200 backdrop-blur-sm">
            <div className="w-full px-8 mx-auto">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 drop-shadow-[0_0_0.3rem_#00000020] transition-all duration-300 hover:drop-shadow-[0_0_0.5rem_#00000030]">
                            Chef<span className="text-emerald-600">GPT</span>
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Your AI Sous-Chef for Perfect Recipes
                        </p>
                    </div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-800 relative font-medium transition-all duration-300 hover:text-emerald-600 
                                      after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-emerald-600 
                                      after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/chroma"
                                    className="text-gray-800 relative font-medium transition-all duration-300 hover:text-emerald-600 
                                      after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-emerald-600 
                                      after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    Chroma DB
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;