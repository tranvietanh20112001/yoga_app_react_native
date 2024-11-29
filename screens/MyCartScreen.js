import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { firestore } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const MyCartScreen = () => {
  const [cartItems, setCartItems] = useState([]); // Lưu danh sách lớp học trong giỏ hàng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [userId, setUserId] = useState(null); // Lưu id người dùng

  useEffect(() => {
    // Lấy thông tin người dùng đang đăng nhập
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid); // Lưu ID người dùng
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      setLoading(true); // Bắt đầu quá trình tải dữ liệu
      // Lấy dữ liệu từ Firestore trong collection 'users/{userId}/cart'
      const cartRef = collection(firestore, 'users', userId, 'cart');
      const querySnapshot = await getDocs(cartRef);
      
      // Chuyển đổi snapshot thành một danh sách các lớp học
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id, // ID của document
        ...doc.data(),
      }));
      setCartItems(items); // Lưu vào state cartItems
    } catch (error) {
      setError('Error fetching cart items');
      console.error(error);
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  const handleRemoveFromCart = async (classId) => {
    // Cảnh báo xác nhận trước khi xóa
    Alert.alert(
      "Confirm Remove",
      "Are you sure you want to remove this class from your cart?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => removeClassFromCart(classId),
        }
      ]
    );
  };

  const removeClassFromCart = async (classId) => {
    try {
      // Thực hiện xóa lớp học khỏi giỏ hàng trong Firestore
      const cartItemRef = doc(firestore, 'users', userId, 'cart', classId);
      await deleteDoc(cartItemRef);
      // Sau khi xóa, gọi lại hàm fetchCartItems để cập nhật danh sách giỏ hàng
      fetchCartItems();
      Alert.alert("Success", "Class removed from cart!");
    } catch (error) {
      console.error("Error removing class from cart:", error);
      Alert.alert("Error", "Failed to remove class from cart");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (cartItems.length === 0) {
    return <Text style={styles.emptyCartText}>Your cart is empty!</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.className}>{item.className}</Text>
            <Text>Course ID: {item.courseId}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Teacher: {item.teacher}</Text>
            <Button
              title="Remove from Cart"
              onPress={() => handleRemoveFromCart(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
});

export default MyCartScreen;
