import { CheckCircle, WarningCircle, XCircle } from 'phosphor-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  visible, 
  onHide, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'rgba(34, 197, 94, 0.9)'; // Green
      case 'error': return 'rgba(239, 68, 68, 0.9)';   // Red
      case 'warning': return 'rgba(234, 179, 8, 0.9)'; // Yellow
      default: return 'rgba(34, 197, 94, 0.9)';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={24} color="#fff" weight="fill" />;
      case 'error': return <XCircle size={24} color="#fff" weight="fill" />;
      case 'warning': return <WarningCircle size={24} color="#fff" weight="fill" />;
      default: return <CheckCircle size={24} color="#fff" weight="fill" />;
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp.springify()} 
      exiting={FadeOutUp}
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
    >
      <View style={styles.content}>
        {getIcon()}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // adjust based on header height/status bar
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 16,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});

export default Toast;
