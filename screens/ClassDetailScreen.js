import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Button, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { firestore } from '../config/firebase';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ClassDetailScreen = ({ route }) => {
  const { classId } = route.params;
  const [classDetail, setClassDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const classRef = doc(firestore, 'classes', classId);
        const classSnap = await getDoc(classRef);

        if (classSnap.exists()) {
          setClassDetail(classSnap.data());
        } else {
          setError('Class not found');
        }
        console.log(classDetail);
      } catch (error) {
        setError('Error fetching class detail');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid); 
    }
  }, []);

  const handleAddToCart = () => {
    // Show a confirmation alert before adding to cart
    Alert.alert(
      "Confirm Add to Cart",
      "Are you sure you want to add this class to your cart?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => addToCart(),
        }
      ]
    );
  };

  const addToCart = async () => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to add items to the cart");
      return;
    }

    try {
      // Reference to the user's cart in Firestore
      const cartRef = collection(firestore, 'users', userId, 'cart');
      
      // Add the class to the user's cart
      await setDoc(doc(cartRef, classDetail.className), {
        className: classDetail.className,
        courseId: classDetail.courseId,
        date: classDetail.date,
        teacher: classDetail.teacher,
        addedAt: new Date(), // Timestamp of when it was added
      });

      Alert.alert("Success", "Class added to cart successfully!");
      console.log("Class added to cart:", classDetail.className);
    } catch (error) {
      console.error("Error adding class to cart:", error);
      Alert.alert("Error", "Failed to add class to cart");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!classDetail) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Class Information */}
      <Card style={styles.card}>
        <Card.Title title={classDetail.name} />
        <Card.Content>
        <Text>Class: {classDetail.className}</Text>
      <Text>Course ID: {classDetail.courseId}</Text>
      <Text>Date: {classDetail.date}</Text>
      <Text>Teacher: {classDetail.teacher}</Text>
        </Card.Content>
      </Card>

      {/* Add to Cart Button */}
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f8f9fa' },
  card: { marginBottom: 10 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});

export default ClassDetailScreen;
