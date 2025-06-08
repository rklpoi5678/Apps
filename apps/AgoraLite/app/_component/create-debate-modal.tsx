"use client"

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { X } from 'lucide-react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

const categories = [
  '기술',
  '경제',
  '사회',
  '직장 & 커리어',
  '정치',
  "스포츠",
  "과학",
  "철학",
  "대중문화",
  '환경',
  '교육',
  '건강',
  '기타',
];

export default function CreateDebateModal() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = auth.currentUser

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      return;
    }
    setSubmitting(true);
    // Handle form submission
    try {
      await addDoc(collection(db, 'debates'), {
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        tags,
        createdAt: serverTimestamp(),
        updateAt: serverTimestamp(),
        isFeature: false,
        trending: false,
        participants: 0,
        timeLift: '',
        votes: 0,
        likes: 0,
        dislikes: 0,
        comment: 0,
        author: user?.displayName || '익명', //필요시 실제 사용자 명으로 교체
        timeAgo: '',
      });
      navigation.goBack()      
    } catch (error) {
      console.log('토큰 생성 실패:', error)
      Alert.alert('오류', '토론을 생성하는데 실패했습니다. 다시 시도해주세요.');
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.input}
          placeholder="토론 주제를 입력하세요 (최대 200자)"
          placeholderTextColor="#999"
          value={title}
          onChangeText={(text) => {
            if (text.length <= 200) setTitle(text);
          }}
          returnKeyType="next"
        />

        <Text style={[styles.label, { marginTop: 20 }]}>상세 설명</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="토론에 대한 상세한 설명을 작성해주세요"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
          returnKeyType="default"
        />
        
        <Text style={[styles.label, { marginTop: 20 }]}>카테고리</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryOption,
                selectedCategory === category && styles.categoryOptionActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryOptionText, selectedCategory === category && styles.categoryOptionTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Text style={[styles.label, { marginTop: 20 }]}>태그</Text>
        <View style={styles.tagInputContainer}>
          <TextInput
            style={[styles.input, styles.tagInput]}
            placeholder="태그를 입력하세요 (엔터로 추가)"
            placeholderTextColor="#999"
            value={currentTag}
            onChangeText={setCurrentTag}
            onSubmitEditing={handleAddTag}
            returnKeyType="done"
          />
        </View>
        
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
              <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                <X size={14} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        

        
        <TouchableOpacity 
          style={[styles.submitButton, (!title.trim() || !description.trim() || submitting ) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!title.trim() || !description.trim() || submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? '토론 시작 중...' : '토론 시작하기'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: Platform.OS === 'ios' ? 50 : 0,
    },
    content: {
      padding: 16,
      flexWrap: 'wrap',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#f8f8f8',
      color: '#333',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#f8f8f8',
    },
    categoryOption: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    categoryOptionActive: {
      backgroundColor: '#666',
    },
    categoryOptionText: {
      fontSize: 12,
      color: '#374151',
    },
    categoryOptionTextActive: {
      color: '#fff',
    },
    tagInputContainer: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    tagInput: {
      flex: 1,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontSize: 14,
      color: '#333',
      marginRight: 4,
    },
    multilineInput: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    submitButton: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 16,
    },
    disabledButton: {
      backgroundColor: '#a0c4ff',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  