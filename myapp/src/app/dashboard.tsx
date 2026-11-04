import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { AuthUser, clearSession, getToken, getUser } from "../utils/auth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          if (isMounted) {
            router.replace("/login");
          }
          return;
        }

        const savedUser = await getUser();
        if (isMounted) {
          setUser(savedUser);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const performLogout = async () => {
    try {
      setLoggingOut(true);
      await clearSession();
    } finally {
      router.replace("/login");
    }
  };

  const handleLogout = () => {
    if (loggingOut) return;

    if (Platform.OS === "web") {
      const confirmed =
        typeof window !== "undefined"
          ? window.confirm("Are you sure you want to logout?")
          : true;

      if (confirmed) {
        performLogout();
      }
      return;
    }

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: performLogout,
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>Welcome!</Text>
          <Text style={styles.name}>{user?.name || "User"}</Text>
          <Text style={styles.email}>
            {user?.email || "No email available"}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Account Information</Text>

          <Text style={styles.infoText}>Name: {user?.name || "User"}</Text>
          <Text style={styles.infoText}>
            Email: {user?.email || "No email"}
          </Text>
          <Text style={styles.status}>Account Status: Active</Text>
        </View>

        <Pressable
          style={[
            styles.logoutButton,
            loggingOut && styles.disabledLogoutButton,
          ]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Logout</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f7fb",
    justifyContent: "center",
  },
  container: {
    padding: 24,
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#1e293b",
  },
  card: {
    backgroundColor: "#2563eb",
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    color: "#dbeafe",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  email: {
    fontSize: 15,
    color: "#dbeafe",
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1e293b",
  },
  infoText: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 12,
  },
  status: {
    fontSize: 15,
    color: "#16a34a",
    fontWeight: "600",
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  disabledLogoutButton: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
