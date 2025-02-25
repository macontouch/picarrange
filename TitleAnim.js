// TitleAnim.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

const TitleAnim = () => {
  const letters = 'PIC ARRANGE'.split('');
  
  const initialPositions = [
    { x: -200, y: -200 },
    { x: 200, y: -200 },
    { x: -200, y: 200 },
    { x: 200, y: 200 },
    { x: -200, y: 0 },
    { x: 200, y: 0 },
    { x: 0, y: -200 },
    { x: 0, y: 200 },
    { x: -100, y: -100 },
    { x: 100, y: 100 },
  ];

  // Final positions for each letter to form "PIC ARRANGE"
  const finalPositions = [
    { x: -80, y: 0 }, // P
    { x: -40, y: 0 }, // I
    { x: 0, y: 0 }, // C
    { x: 40, y: 0 }, // (space)
    { x: 80, y: 0 }, // A
    { x: 120, y: 0 }, // R
    { x: 160, y: 0 }, // R
    { x: 200, y: 0 }, // A
    { x: 240, y: 0 }, // N
    { x: 280, y: 0 }, // G
    { x: 320, y: 0 }, // E
  ];

  const translateX = initialPositions.map((pos, index) => useRef(new Animated.Value(pos.x)).current);
  const translateY = initialPositions.map((pos, index) => useRef(new Animated.Value(pos.y)).current);

  useEffect(() => {
    const animations = translateX.map((x, i) =>
      Animated.parallel([
        Animated.spring(x, {
          toValue: finalPositions[i].x,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(translateY[i], {
          toValue: finalPositions[i].y,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(100, animations).start();
  }, [translateX, translateY]);

  return (
    <View style={styles.container}>
      {letters.map((letter, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.text,
            {
              transform: [
                { translateX: translateX[index] },
                { translateY: translateY[index] },
              ],
              position: 'absolute',
            },
          ]}
        >
          {letter}
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    color: 'rgb(32, 98, 124)',
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default TitleAnim;
