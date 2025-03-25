import { AppButton } from "@/components";
import TodoContext from "@/context/Todo.context";
import { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
} from "react-native";
import { TextInput } from "react-native-paper";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from '@/utils/supabase';
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 768;

export default function CreateTodo() {
  const { addTodo } = useContext(TodoContext);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const backAction = () => {
      router.replace('/');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // ดีบัก bucket ที่มีอยู่ใน Supabase Storage
  useEffect(() => {
    const checkBuckets = async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error('Error listing buckets:', error.message);
          return;
        }
        console.log('Available buckets:', buckets);
      } catch (error: any) {
        console.error('Error in checkBuckets:', error.message);
      }
    };
    checkBuckets();
  }, []);

  const handleAddTodo = async () => {
    if (!text.trim() && !imageUrl) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลหรือเพิ่มรูปภาพ");
      return;
    }

    try {
      if (imageUrl) {
        const { error } = await supabase
          .from('product_images')
          .insert({ image_url: imageUrl });

        if (error) {
          console.error('Error inserting into product_images:', error.message);
          throw error;
        }
      }

      addTodo?.({ text, image: imageUrl });
      setText("");
      setImage(null);
      setImageUrl(null);
      Alert.alert("สำเร็จ", "เพิ่มรายการเรียบร้อยแล้ว", [
        {
          text: "ตกลง",
          onPress: () => router.replace('/'),
        },
      ]);
    } catch (error: any) {
      console.error('Error in handleAddTodo:', error.message);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเพิ่มรายการได้ กรุณาลองใหม่");
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("ข้อผิดพลาด", "ต้องให้สิทธิ์ในการเข้าถึงแกลเลอรี");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      try {
        setImage(result.assets[0].uri);

        const fileName = `product_image_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('product-images') // เปลี่ยนจาก 'product_images' เป็น 'product-images'
          .upload(fileName, decode(result.assets[0].base64), {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError.message);
          if (uploadError.message.includes('Bucket not found')) {
            Alert.alert("ข้อผิดพลาด", "ไม่พบ bucket 'product-images' ใน Supabase Storage กรุณาตรวจสอบการตั้งค่า bucket");
          } else {
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่");
          }
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('product-images') // เปลี่ยนจาก 'product_images' เป็น 'product-images'
          .getPublicUrl(fileName);

        const publicUrl = data.publicUrl;
        setImageUrl(publicUrl);
      } catch (error: any) {
        console.error('Error in pickImage:', error.message);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Ionicons name="arrow-back-outline" size={isLargeScreen ? 30 : width * 0.06} color="#FFFFFF" style={styles.backIcon} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="create-outline" size={isLargeScreen ? 30 : width * 0.06} color="#FFFFFF" style={styles.headerIconLeft} />
            <Text style={styles.headerText}>เพิ่มรายการใหม่</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <TextInput
            label="กรอกรายการ"
            value={text}
            onChangeText={(text) => setText(text)}
            mode="outlined"
            placeholder="พิมพ์รายการของคุณที่นี่"
            style={styles.input}
            outlineColor="#000000"
            activeOutlineColor="#000000"
            textColor="#000000"
            placeholderTextColor="#666666"
            multiline
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAddTodo}
          />
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color="#FFFFFF" />
            <Text style={styles.imageButtonText}>เพิ่มรูปภาพ</Text>
          </TouchableOpacity>
          {imageUrl && (
            <TextInput
              label="URL รูปภาพ"
              value={imageUrl}
              editable={false}
              mode="outlined"
              style={styles.input}
              outlineColor="#000000"
              activeOutlineColor="#000000"
              textColor="#000000"
              placeholderTextColor="#666666"
            />
          )}
          <AppButton onPress={handleAddTodo} style={styles.createButton}>
            <Text style={styles.buttonText}>สร้างรายการ</Text>
          </AppButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1 },
  header: {
    backgroundColor: "#000000",
    paddingVertical: isLargeScreen ? 15 : 10,
    paddingHorizontal: width * 0.04,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backIcon: { 
    marginLeft: 10,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerIconLeft: { 
    marginRight: 10,
  },
  headerText: {
    fontSize: isLargeScreen ? 26 : width * 0.055,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: isLargeScreen ? 40 : width * 0.05,
    paddingVertical: isLargeScreen ? 50 : 30,
    marginTop: 20,
  },
  input: {
    width: isLargeScreen ? "80%" : "90%",
    maxWidth: 600,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    fontSize: isLargeScreen ? 18 : width * 0.045,
    padding: 15,
    marginBottom: isLargeScreen ? 30 : 20,
    borderColor: "#000000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  imageButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  imagePreview: {
    width: isLargeScreen ? 300 : width * 0.7,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#000000",
  },
  createButton: {
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    paddingVertical: isLargeScreen ? 16 : 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: isLargeScreen ? "50%" : "80%",
    maxWidth: 300,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    fontSize: isLargeScreen ? 20 : width * 0.045,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});