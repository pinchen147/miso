import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';

export function ThemedText({ style, children, ...rest }: TextProps) {
  const process = (node: any): React.ReactNode => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node).toLowerCase();
    }
    if (Array.isArray(node)) {
      return node.map(process);
    }
    return node;
  };

  return (
    <Text style={[styles.default, style]} {...rest}>
      {process(children)}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'GenRyuBody', // body font
  },
});
