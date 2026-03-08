
import React, { useState, useEffect } from 'react';
import { TextInput, Button } from './ui/AdminShared';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, firestore } from '@/firebase';

interface LoginViewProps {
    onExit: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onExit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isFirstUserCheck, setIsFirstUserCheck] = useState(true);
    const [isFirstUser, setIsFirstUser] = useState(false);

    useEffect(() => {
        const checkUsers = async () => {
            try {
                const usersCollection = collection(firestore, 'users');
                const userSnapshot = await getDocs(usersCollection);
                if (userSnapshot.empty) {
                    setIsFirstUser(true);
                }
            } catch (err) {
                console.error("Error checking for first user:", err);
                setError("Could not connect to the database to verify user status.");
            } finally {
                setIsFirstUserCheck(false);
            }
        };
        checkUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (isFirstUser) {
            // Create Super Admin flow
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                // AuthProvider will detect the new user and call bootstrapSuperAdmin
            } catch (err: any) {
                setError(`Failed to create admin account: ${err.message}`);
                console.error(err);
            }
        } else {
            // Standard sign in flow
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (err: any) {
                if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                   setError('Invalid credentials. Please try again.');
                } else {
                   setError('An unknown error occurred during sign-in.');
                }
                console.error(err);
            }
        }
    };
    
    if (isFirstUserCheck) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <p className="text-gray-600 font-medium">Verifying admin status...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 font-sans p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm space-y-6 border border-gray-200">
                <div className="text-center">
                    <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                        <span className="text-white font-serif font-bold text-2xl">A</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {isFirstUser ? 'Create Super Admin' : 'Admin Access'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        {isFirstUser ? 'This will be the primary administrator account.' : 'Imaginative 369 Management'}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                    <TextInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
                    <TextInput type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div className="space-y-4 pt-4">
                    <Button type="submit" className="w-full py-3 shadow-lg">
                        {isFirstUser ? 'Create Account' : 'Sign In'}
                    </Button>
                    <button type="button" onClick={onExit} className="w-full text-center text-xs text-gray-500 hover:text-gray-800 uppercase tracking-widest font-bold">
                        ← Return to Website
                    </button>
                </div>
            </form>
        </div>
    );
};
