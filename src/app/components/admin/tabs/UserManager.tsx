
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firestore, auth } from '@/firebase';
import { AppUser } from '@/app/types';
import { Card, SectionHeader, InputGroup, TextInput, Button, confirmDelete } from '../ui/AdminShared';

const ALL_PERMISSIONS = ['Analytics', 'Projects', 'Quote Generator', 'Quote Template', 'Print Rates', 'Curation', 'About', 'Trusted By', 'Settings', 'Users & Roles', 'Orders'] as const;

export const UserManager: React.FC = () => {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<AppUser | null>(null);
    const [newUser, setNewUser] = useState<{email: string, pass: string, role: AppUser['role'], permissions: string[]}>({
        email: '', pass: '', role: 'Editor', permissions: []
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const usersColRef = collection(firestore, 'users');
        const unsubscribe = onSnapshot(usersColRef, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AppUser));
            setUsers(usersData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);
    
    const handleCreateUser = async () => {
        if (!newUser.email || !newUser.pass) {
            alert('Email and password are required.');
            return;
        }
        try {
            // Note: This creates the user in the current session's auth instance.
            // A more robust backend solution would use the Admin SDK. For this tool, this is sufficient.
            const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.pass);
            const uid = userCredential.user.uid;
            
            const userDoc: Omit<AppUser, 'uid'> = {
                email: newUser.email,
                role: newUser.role,
                permissions: newUser.permissions
            };

            await setDoc(doc(firestore, 'users', uid), userDoc);
            
            alert('User created successfully! The new user can now log in.');
            setIsCreating(false);
            setNewUser({ email: '', pass: '', role: 'Editor', permissions: [] });

        } catch (error: any) {
            alert(`Error creating user: ${error.message}`);
        }
    };
    
    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            const { uid, ...userData } = editingUser;
            await setDoc(doc(firestore, 'users', uid), userData, { merge: true });
            alert('User updated successfully!');
            setEditingUser(null);
        } catch (error: any) {
             alert(`Error updating user: ${error.message}`);
        }
    };
    
    const handleDeleteUser = async (uid: string) => {
        if (confirmDelete('This will delete the user profile from the database, but will NOT delete their authentication record. That must be done from the Firebase Console. Continue?')) {
            try {
                await deleteDoc(doc(firestore, 'users', uid));
                alert('User data deleted from Firestore.');
            } catch (error: any) {
                alert(`Error deleting user: ${error.message}`);
            }
        }
    };
    
    const handleNewUserPermChange = (permission: string) => {
        const currentPerms = newUser.permissions;
        const newPerms = currentPerms.includes(permission)
            ? currentPerms.filter(p => p !== permission)
            : [...currentPerms, permission];
        setNewUser({...newUser, permissions: newPerms});
    };

    const handleEditUserPermChange = (permission: string) => {
        if (!editingUser) return;
        const currentPerms = editingUser.permissions || [];
        const newPerms = currentPerms.includes(permission)
            ? currentPerms.filter(p => p !== permission)
            : [...currentPerms, permission];
        setEditingUser({...editingUser, permissions: newPerms});
    };

    if (isLoading) return <p>Loading users...</p>;

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <Card>
                <SectionHeader title="Users & Roles" action={!isCreating && <Button onClick={() => setIsCreating(true)}>+ Add User</Button>} />
                
                {isCreating && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8 space-y-4">
                        <h4 className="font-bold">Create New User</h4>
                        <InputGroup label="Email"><TextInput type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} /></InputGroup>
                        <InputGroup label="Password"><TextInput type="password" value={newUser.pass} onChange={e => setNewUser({...newUser, pass: e.target.value})} /></InputGroup>
                        <InputGroup label="Role">
                           <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as AppUser['role']})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                <option value="Editor">Editor</option>
                                <option value="Sales">Sales</option>
                                <option value="Super Admin">Super Admin</option>
                           </select>
                        </InputGroup>
                        <InputGroup label="Permissions">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                {ALL_PERMISSIONS.map(perm => (
                                    <label key={perm} className="flex items-center gap-2 p-2 bg-white rounded border">
                                        <input type="checkbox" checked={newUser.permissions.includes(perm)} onChange={() => handleNewUserPermChange(perm)} />
                                        {perm}
                                    </label>
                                ))}
                            </div>
                        </InputGroup>
                        <div className="flex gap-2">
                            <Button variant="success" onClick={handleCreateUser}>Create User</Button>
                            <Button variant="secondary" onClick={() => setIsCreating(false)}>Cancel</Button>
                        </div>
                    </div>
                )}
                
                <div className="space-y-4">
                    {users.map(user => (
                        <div key={user.uid} className="p-4 border rounded-lg bg-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{user.email}</p>
                                    <p className="text-xs px-2 py-0.5 inline-block bg-gray-200 text-gray-800 rounded-full font-semibold">{user.role}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={() => setEditingUser(user)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDeleteUser(user.uid)}>Delete</Button>
                                </div>
                            </div>
                            
                            {editingUser?.uid === user.uid && (
                                <div className="mt-4 pt-4 border-t space-y-4">
                                    <InputGroup label="Role">
                                        <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as AppUser['role']})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                            <option value="Editor">Editor</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Super Admin">Super Admin</option>
                                        </select>
                                    </InputGroup>
                                    <InputGroup label="Permissions">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                            {ALL_PERMISSIONS.map(perm => (
                                                <label key={perm} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                                                    <input type="checkbox" checked={editingUser.permissions?.includes(perm)} onChange={() => handleEditUserPermChange(perm)} />
                                                    {perm}
                                                </label>
                                            ))}
                                        </div>
                                    </InputGroup>
                                    <div className="flex gap-2">
                                        <Button variant="success" onClick={handleUpdateUser}>Save Changes</Button>
                                        <Button variant="secondary" onClick={() => setEditingUser(null)}>Cancel</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
