// app/_layout.js

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "@/firebase-config"; // Make sure the path is correct
import { useRouter, Stack } from 'expo-router';

// The RootLayout component's main job is to set up the navigator
// and handle the authentication-based redirection.
const RootLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This listener checks for login/logout changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // This effect handles the redirection
    if (loading) {
      return; // Do nothing while we're waiting for the user state
    }

    if (user) {
      // If the user is logged in, navigate them to the 'home' screen
      router.replace('/(tabs)');
    } else {
      // If the user is not logged in, navigate them to the 'login' screen
      router.replace('/login');
    }
  }, [user, loading]); // It runs when user or loading state changes

  // This is the key change:
  // We are ALWAYS rendering the Stack navigator.
  // The useEffect hooks above will handle redirecting the user to the correct
  // screen that is defined within this Stack.
  // The app will show a brief blank screen while loading, which is fine for now.
  return (
      <Stack>
        {/* Define all the screens that our router can possibly navigate to */}
        {/* We hide the header for a cleaner look */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
  );
};

export default RootLayout;