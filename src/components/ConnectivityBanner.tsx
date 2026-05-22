import { useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModules, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ConnectivityEvent = {
    isConnected: boolean;
};

function ConnectivityBanner() {
    const [message, setMessage] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(true);
    const insets = useSafeAreaInsets();
    const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const connectivityModule = NativeModules.ConnectivityModule;
        const eventEmitter = new NativeEventEmitter(connectivityModule);

        const subscription = eventEmitter.addListener(
        'connectivityChanged',
        (event: ConnectivityEvent) => {
            setIsConnected(event.isConnected);

            if (hideTimeout.current) {
            clearTimeout(hideTimeout.current);
            hideTimeout.current = null;
            }

            if (event.isConnected) {
            setMessage('Conexion restaurada');

            hideTimeout.current = setTimeout(() => {
                setMessage(null);
                hideTimeout.current = null;
            }, 3000);
            } else {
            setMessage('Conexion perdida');
            }
        },
        );

        return () => {
        if (hideTimeout.current) {
            clearTimeout(hideTimeout.current);
        }

        subscription.remove();
        };
    }, []);

    if (!message) {
        return null;
    }

    return (
        <View style={[styles.container, { marginTop: insets.top }, isConnected ? styles.connected : styles.disconnected,]}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    connected: {
        backgroundColor: '#2e7d32',
    },
    disconnected: {
        backgroundColor: '#c62828',
    },
    text: {
        color: '#ffffff',
        fontWeight: '700',
    },
});

export default ConnectivityBanner;
