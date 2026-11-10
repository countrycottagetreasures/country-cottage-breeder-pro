import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { signInWithCredential } from 'firebase/auth';
import MyDogs from './MyDogs';
export default function App() {
  const [user, setUser] = useState(undefined);

    useEffect(() => {
        !Capacitor.isNativePlatform() && getRedirectResult(auth).catch(error => alert(error.code + ": " + error.message));
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
              setUser(currentUser);
                  });
                      return unsubscribe;
                        }, []);

                          async function login() {
                              try {
                                    if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithGoogle({ skipNativeAuth: true, useCredentialManager: false });
        const token = result.credential?.idToken;
        if (!token) throw new Error('Google ID token missing');
        await signInWithCredential(auth, GoogleAuthProvider.credential(token));
      } else {
        await signInWithRedirect(auth, new GoogleAuthProvider());
      }
                                        } catch (error) {
                                              alert(error.message);
                                                  }
                                                    }

                                                      async function logout() {
                                                          await signOut(auth);
                                                            }


    const sections = [
        'My Dogs',
            'Breeding & Litters',
                'DNA & Genetics',
                    'Pedigrees',
                        'Health & Vet Records',
                            'Vaccinations',
                                'Calendar & Reminders',
                                    'Documents'
                                      ]

                                        return (
                                            <div style={{ padding: 24, fontFamily: 'Arial', background: '#f6f4ee', minHeight: '100vh' }}>
                                                      {user === undefined ? (
  <p>Checking sign-in...</p>
) : user ? (
  <div>
    <p>Signed in as {user.displayName || user.email}</p>
    <button type="button" onClick={logout}>Sign Out</button>
  </div>
) : (
  <button type="button" onClick={login}>Sign In with Google</button>
)}
      <header style={{ background: '#365b43', color: 'white', padding: 24, borderRadius: 14 }}>
                                                          <h1>🐾 Country Cottage Breeder Pro</h1>
                                                                  <p>Dog Breeding & Health Management</p>
                                                                        </header>
                                                                              <h2>Dashboard</h2>
                                                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                                                                                            {sections.map((name) => (
                                                                                                      <div key={name} style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #ddd' }}>
                                                                                                                  <h3>{name}</h3>
                                                                                                                              {name === 'My Dogs' ? <MyDogs user={user} /> : <p>Coming soon</p>}
                                                                                                                                        </div>
                                                                                                                                                ))}
                                                                                                                                                      </div>
                                                                                                                                                          </div>
                                                                                                                                                            )
                                                                                                                                                            }
