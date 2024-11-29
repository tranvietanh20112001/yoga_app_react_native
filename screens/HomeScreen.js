import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Menu, Appbar, Card, Text, Button } from 'react-native-paper';
import { firestore } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]); 
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'classes'));
        const classList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClasses(classList);
        setFilteredClasses(classList); // Set the initial filtered classes
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      setFilteredClasses(classes); // Reset filter
    } else {
      const filtered = classes.filter(item =>
        item.className.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredClasses(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Universal Yoga" style={styles.appbarContent} />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="account-circle"
              onPress={toggleMenu}
              style={styles.menuIcon}
            />
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item onPress={() => navigation.navigate('UserDetail')} title="User Detail" />
          <Menu.Item onPress={() => navigation.navigate('MyCart')} title="My Cart" />
          <Menu.Item onPress={() => navigation.navigate('Login')} title="Logout" />
        </Menu>
      </Appbar.Header>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Class by Name"
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Classes List */}
      <FlatList
        data={filteredClasses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ClassDetail', { classId: item.id })}>
            <Card style={styles.card}>
              <Card.Title title={item.className} />
              <Card.Content>
                <Text style={styles.classDetails}>Day: {item.date}</Text>
                <Text style={styles.classDetails}>Teacher: {item.teacher}</Text>
              </Card.Content>
              <Card.Actions>
                <Button>Details</Button>
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  appbar: { backgroundColor: '#6200ee' },
  appbarContent: { color: 'white' },
  menuIcon: { color: 'white' },
  menuContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginLeft: -10,
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  list: { padding: 10 },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  classDetails: {
    color: '#555',
    fontSize: 14,
  },
});

export default HomeScreen;
