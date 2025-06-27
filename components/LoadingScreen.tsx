import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const mustacheAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(mustacheAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(mustacheAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const mustacheOpacity = mustacheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.mustacheContainer,
            {
              opacity: mustacheOpacity,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Animated.Text style={styles.mustache}>🧔</Animated.Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.scissorsContainer,
            {
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          <Animated.Text style={styles.scissors}>✂️</Animated.Text>
        </Animated.View>
        <View style={styles.decorativeElements}>
          <Animated.Text style={styles.decorativeText}>✂️</Animated.Text>
          <Animated.Text style={styles.decorativeText}>💈</Animated.Text>
          <Animated.Text style={styles.decorativeText}>🧔</Animated.Text>
          <Animated.Text style={styles.decorativeText}>✂️</Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mustacheContainer: {
    marginBottom: 20,
  },
  mustache: {
    fontSize: 80,
    textAlign: 'center',
  },
  scissorsContainer: {
    marginBottom: 30,
  },
  scissors: {
    fontSize: 40,
  },
  decorativeElements: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  decorativeText: {
    fontSize: 20,
    opacity: 0.6,
  },
}); 