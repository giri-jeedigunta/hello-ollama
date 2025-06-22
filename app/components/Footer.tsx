'use client';

import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-gray-200 py-6 mt-12">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} | Made with ❤️
                </p>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <a
                        href="https://wtfe.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        WhatTheFrontend
                    </a>

                    <span className="text-gray-300">|</span>

                    <a
                        href="https://github.com/giri-jeedigunta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
};
