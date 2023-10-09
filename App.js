import React, { useState, useEffect } from 'react';
import { Button, Image, View, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';


export default function App() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    (async () => {
      const images = await AsyncStorage.getItem('images')
      if (images === null) {
        setImages([]);
      } else {
        setImages(JSON.parse(images))
      }
    })()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('result', result);

    if (!result.canceled) {
      const uri = result.assets[0].uri
      const newImages = {
        id: uuid.v4(),
        uri: uri
      }

      setImages([...images, newImages]);
      await AsyncStorage.setItem('images', JSON.stringify([...images, newImages]))
    }
  };

  const deleteImage = async (image) => {
    const imageId = image.id
    const images = await AsyncStorage.getItem('images')
    const imagesList = JSON.parse(images)
    const filteredImages = imagesList.filter(image => image.id !== imageId)
    setImages(filteredImages)
    await AsyncStorage.setItem('images', JSON.stringify(filteredImages))
  }

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 60, }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 20, marginVertical: 20 }}>
        <ScrollView >
          {images.map((image, index) => {
            return (
              <TouchableOpacity onLongPress={() => deleteImage(image)}>
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  style={styles.images}
                />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  images: {
    width: 350,
    height: 300
  }
}