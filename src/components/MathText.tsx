import { Text, type StyleProp, type TextStyle } from 'react-native';
import { formatMathText } from '@/lib/mathText';
import type { ReactNode } from 'react';

type MathTextProps = {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export function MathText({ children, style, numberOfLines }: MathTextProps) {
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {formatMathText(flattenText(children))}
    </Text>
  );
}

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join('');
  return '';
}
