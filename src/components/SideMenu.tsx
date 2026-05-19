import { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Animated, Dimensions, Image, Modal, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppColors } from '../theme/colors';
import { Routes, type RootStackParamList } from '../navigation/routes';

const menuIcon = require('../assets/menu.png');
const screenWidth = Dimensions.get('window').width;
const sideMenuWidth = screenWidth * 0.86;

type SideMenuProps = {
  theme: AppColors;
  buttonStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
};

function SideMenu({
  theme,
  buttonStyle,
  iconColor,
}: SideMenuProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const navigation =  useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuTranslateX = useRef(new Animated.Value(sideMenuWidth)).current;

  function openMenu() {
    setMenuVisible(true);
    setMenuOpen(true);
    Animated.timing(menuTranslateX, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }

  function closeMenu() {
    setMenuOpen(false);
    Animated.timing(menuTranslateX, {
      toValue: sideMenuWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  }

  function goToAbout() {
    setMenuOpen(false);
    Animated.timing(menuTranslateX, {
      toValue: sideMenuWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      navigation.navigate(Routes.About);
    });
  }

  function goToFavourites() {
    setMenuOpen(false);
    Animated.timing(menuTranslateX, {
      toValue: sideMenuWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      navigation.navigate(Routes.Favourites);
    });
  }

  function goToHome() {
    setMenuOpen(false);
    Animated.timing(menuTranslateX, {
      toValue: sideMenuWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      navigation.navigate(Routes.Home);
    });
  }
  
  return (
    <>
      <Pressable
        style={[styles.menuButton, buttonStyle]}
        onPress={menuOpen ? closeMenu : openMenu}
      >
        <Image
          source={menuIcon}
          style={[styles.menuIcon, { tintColor: iconColor ?? theme.text }]}
        />
      </Pressable>

      <Modal
        transparent
        visible={menuVisible}
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeMenu}
      >
        <View
          style={[
            styles.menuOverlay,
            {
              paddingTop: safeAreaInsets.top,
              paddingBottom: safeAreaInsets.bottom,
            },
          ]}
        >
          <Pressable style={styles.menuBackdrop} onPress={closeMenu} />
          <Animated.View
            style={[
              styles.sideMenu,
              {
                backgroundColor: theme.card,
                paddingTop: safeAreaInsets.top + 16,
                paddingBottom: safeAreaInsets.bottom + 16,
                transform: [{ translateX: menuTranslateX }],
              },
            ]}
          >
            <View style={styles.sideMenuHeader}>
              <Text style={[styles.sideMenuTitle, { color: theme.text }]}>
                Menu
              </Text>
              <Pressable style={styles.sideMenuButton} onPress={closeMenu}>
                <Image
                  source={menuIcon}
                  style={[styles.menuIcon, { tintColor: theme.text }]}
                />
              </Pressable>
            </View>

            <Pressable style={styles.menuItem} onPress={goToHome}>
              <Text style={[styles.menuItemText, { color: theme.text }]}>
                Inicio
              </Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={goToFavourites}>
              <Text style={[styles.menuItemText, { color: theme.text }]}>
                Favoritos
              </Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={goToAbout}>
              <Text style={[styles.menuItemText, { color: theme.text }]}>
                Acerca de
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  menuOverlay: {
    flex: 1,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#00000099',
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '86%',
    paddingHorizontal: 20,
    elevation: 31,
    zIndex: 31,
  },
  sideMenuHeader: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sideMenuTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  sideMenuButton: {
    position: 'absolute',
    right: 0,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SideMenu;
