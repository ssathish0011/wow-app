import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";

import API from "../api/api";
import { getErrorMessage, isValidEmail, saveSession } from "../utils/auth";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await API.post("/users/register", {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      const { token, user } = response.data;
      const userData = user || { name: trimmedName, email: trimmedEmail };

      await saveSession(token, userData);
      router.replace("/dashboard");
    } catch (error: any) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Register</Text>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, loading && styles.disabledInput]}
          placeholder="Enter Name"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errorMessage) setErrorMessage("");
          }}
          autoCapitalize="words"
          editable={!loading}
        />

        <TextInput
          style={[styles.input, loading && styles.disabledInput]}
          placeholder="Enter Email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errorMessage) setErrorMessage("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TextInput
          style={[styles.input, loading && styles.disabledInput]}
          placeholder="Enter Password (min 6 characters)"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errorMessage) setErrorMessage("");
          }}
          secureTextEntry
          editable={!loading}
        />

        <Pressable
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </Pressable>

        <Link href="/login" asChild>
          <Pressable disabled={loading}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  formWrapper: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1e293b",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    marginTop: 18,
    color: "#2563eb",
    fontSize: 15,
  },
});
