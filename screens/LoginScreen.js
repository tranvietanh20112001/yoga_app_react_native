import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    // Reset previous error messages
    setEmailError('');
    setPasswordError('');

    if (!email || !password) {
      if (!email) setEmailError('Email is required.');
      if (!password) setPasswordError('Password is required.');
      return;
    }

    try {
      // Log in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert('Success', `Welcome back, ${user.email}!`);
      navigation.navigate('Home'); // Redirect to Home Screen
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message);
      if (error.code === 'auth/invalid-email') {
        setEmailError('Invalid email format.');
      } else if (error.code === 'auth/wrong-password') {
        setPasswordError('Incorrect password.');
      } else {
        setEmailError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        error={!!emailError}
        helperText={emailError}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        error={!!passwordError}
        helperText={passwordError}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
});

export default LoginScreen;
