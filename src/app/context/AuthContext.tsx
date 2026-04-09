'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase';
import { AppUser } from '@/app/types';

interface AuthContextType {
    user: FirebaseUser | null;
    appUser: AppUser | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to create the Super Admin profile
const createSuperAdminProfile = async (firebaseUser: FirebaseUser) => {
    const userDocRef = doc(firestore, 'users', firebaseUser.uid);
    const superAdminData: Omit<AppUser, 'uid'> = {
        email: firebaseUser.email!,
        role: 'Super Admin',
        permissions: ['Analytics', 'Projects', 'Quote Generator', 'Quotation History', 'Quote Template', 'Print Rates', 'Finishing Rates', 'Curation', 'About', 'Trusted By', 'Settings', 'Users & Roles', 'Orders']
    };
    await setDoc(userDocRef, superAdminData);
    return { uid: firebaseUser.uid, ...superAdminData };
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                const userDocRef = doc(firestore, 'users', firebaseUser.uid);
                
                const unsubProfile = onSnapshot(userDocRef, async (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        setAppUser({ uid: docSnapshot.id, ...docSnapshot.data() } as AppUser);
                        setLoading(false);
                    } else {
                        // User is authenticated but has no profile document.
                        // Check if this is the designated super admin.
                        if (firebaseUser.email === 'menu@i369.com') {
                            // It IS the super admin. Create their profile.
                            const adminUser = await createSuperAdminProfile(firebaseUser);
                            setAppUser(adminUser);
                        } else {
                            // Any other user without a profile is unauthorized and will be logged out.
                            console.error(`Authenticated user ${firebaseUser.email} has no profile in Firestore. Logging out for security.`);
                            await signOut(auth);
                            setAppUser(null);
                        }
                        setLoading(false);
                    }
                }, (error) => {
                    console.error("Error listening to user profile:", error);
                    setAppUser(null);
                    setLoading(false);
                });

                return () => unsubProfile();
            } else {
                setUser(null);
                setAppUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);
    
    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, appUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
