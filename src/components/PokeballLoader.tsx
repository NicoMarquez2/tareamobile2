import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageSourcePropType, StyleSheet } from 'react-native';

type PokeballLoaderProps = {
    source: ImageSourcePropType;
    size?: number;
};

function PokeballLoader({ source, size = 48 }: PokeballLoaderProps) {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
        Animated.timing(rotation, {
            toValue: 1,
            duration: 900,
            easing: Easing.linear,
            useNativeDriver: true,
        }),
        );

        animation.start();

        return () => {
        animation.stop();
        };
    }, [rotation]);

    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.Image
        source={source}
        style={[
            styles.image,
            {
            width: size,
            height: size,
            transform: [{ rotate }],
            },
        ]}
        />
    );
}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain',
    },
});

export default PokeballLoader;