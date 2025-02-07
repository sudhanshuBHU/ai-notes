"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Email and password are required');
            toast.error('Email and password are required');
            setIsLoading(false);
            return;
        }
        if (!email.includes('@')) {
            setError('Invalid email');
            toast.error('Invalid email');
            setIsLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            toast.error('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            // console.log(`${process.env.BASE_URL}/api/login`);
            const response = await fetch(`${process.env.BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            const { token, user, name, status } = data as { token: string; user: string, name: string, status: boolean };
            if (!status) {
                setError('Invalid email or password');
                toast.error('Invalid email or password');
                setIsLoading(false);
                return;
            }
            localStorage.setItem('tars_name', name);
            localStorage.setItem('tars_email', email);
            localStorage.setItem('tars_token', token);
            localStorage.setItem('tars_userId', user);
            // console.log(token, user, name);
            // console.log("logged in");
            toast.success('Logged in successfully');
            router.push('/dashboard');
        } catch (error) {
            console.log(error);
            setError('Invalid email or password');
            toast.error('Network error');
        }
        finally {
            setIsLoading(false);
        }
    };


    // check if user is already logged in
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('tars_token');
            const user = localStorage.getItem('tars_userId');
            if (token && user) {
                toast.success('You are already logged in');
                router.push('/dashboard');
            }
        }
    });

    return (
        <div className="min-h-screen flex mt-6 justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        AI voice Note Using NextJs
                    </h2>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            Don&apos;t have an account? Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

