import { Link, useRouter } from "expo-router";
import { CaretLeft, ClipboardText, QrCode } from "phosphor-react-native";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ImportPhrase = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <CaretLeft color="#ffffff" size={24} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Import Secret Phrase</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.qrButton}>
            <QrCode size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            style={styles.inputSection}
          >
            <Text style={styles.label}>Secret Recovery Phrase</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter or paste your recovery phrase..."
                multiline
                textAlignVertical="top"
                style={styles.textArea}
                placeholderTextColor="#6b7280"
                selectionColor="#ac71ff"
              />
              <TouchableOpacity activeOpacity={0.7} style={styles.pasteButton}>
                <ClipboardText size={20} color="#ac71ff" />
                <Text style={styles.pasteText}>PASTE</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              Typically 12 (sometimes 24) words separated by single spaces.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(600).delay(100).springify()}
            style={styles.inputSection}
          >
            <Text style={styles.label}>Wallet Name</Text>
            <View style={styles.singleInputContainer}>
              <TextInput
                placeholder=" e.g. My Main Wallet"
                style={styles.singleInput}
                placeholderTextColor="#6b7280"
                selectionColor="#ac71ff"
              />
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Link href={"/createwallet"} asChild>
            <AnimatedTouchableOpacity
              entering={FadeInUp.duration(600).delay(200).springify()}
              activeOpacity={0.8}
              style={[styles.button, styles.primaryButton]}
            >
              <Text style={styles.primaryButtonText}>Import Wallet</Text>
            </AnimatedTouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020105',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  qrButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 100,
    gap: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputSection: {
    marginBottom: 0,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    height: 160,
  },
  textArea: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(172, 113, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(172, 113, 255, 0.2)',
    gap: 6,
  },
  pasteText: {
    color: '#ac71ff',
    fontSize: 12,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    marginLeft: 4,
  },
  singleInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  singleInput: {
    color: '#ffffff',
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#ac71ff',
    shadowColor: '#ac71ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ImportPhrase;
