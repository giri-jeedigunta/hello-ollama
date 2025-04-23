'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-[#f8f5e6] py-4 z-50 border-b border-[#dcd7c9] px-8">
            <div className="w-full mx-auto">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col ml-12">
                        <h1 className="text-3xl md:text-4xl font-semibold text-[#9c4a1a] font-caveat">
                            Chef<span className="text-[#5a3e2b]">GPT</span>
                        </h1>
                        <p className="text-[#5a3e2b] text-sm font-medium">
                            Your AI Sous-Chef for Perfect Recipes
                        </p>
                    </div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link
                                    href="/"
                                    className="text-[#5a3e2b] relative font-medium transition-all duration-300 hover:text-[#9c4a1a]
                                      after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-[#9c4a1a] 
                                      after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/chroma"
                                    className="text-[#5a3e2b] relative font-medium transition-all duration-300 hover:text-[#9c4a1a]
                                      after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-[#9c4a1a] 
                                      after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    Recipe Book
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