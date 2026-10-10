import { router } from "expo-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  page: "#F3F9F6",
  white: "#FFFFFF",
  primary: "#16796F",
  primaryHover: "#11665D",
  deep: "#17433D",
  text: "#193D37",
  muted: "#708780",
  border: "#D9E8E1",
  light: "#E8F4EE",
  mint: "#D8F3E5",
  mintText: "#236958",
  subtle: "#F8FCF9",
  heroBorder: "#34675D",
};

const MAX_CONTENT_WIDTH = 1520;

const services = [
  {
    name: "Cleaning",
    icon: "✦",
    description: "A cleaner, fresher home.",
    tag: "HOME CARE",
  },
  {
    name: "Electrician",
    icon: "ϟ",
    description: "Electrical work, handled.",
    tag: "ELECTRICAL",
  },
  {
    name: "Plumber",
    icon: "⌁",
    description: "Repairs without the hassle.",
    tag: "REPAIRS",
  },
  {
    name: "AC Repair",
    icon: "❄",
    description: "Comfort in every season.",
    tag: "COOLING",
  },
  {
    name: "Appliance",
    icon: "▧",
    description: "Get things working again.",
    tag: "APPLIANCES",
  },
  {
    name: "Painting",
    icon: "◈",
    description: "Give your home a new look.",
    tag: "HOME MAKEOVER",
  },
];

const features = [
  {
    number: "01",
    title: "Trusted professionals",
    description:
      "Explore service providers for your home and find an option that suits your needs.",
    icon: "✓",
  },
  {
    number: "02",
    title: "Effortless booking",
    description:
      "Choose the service you need and move through a simple booking experience.",
    icon: "↗",
  },
  {
    number: "03",
    title: "Stay in control",
    description:
      "Keep your appointments and service details organised in one place.",
    icon: "◎",
  },
];

type MotionPressableProps = {
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  disabled?: boolean;
};

function MotionPressable({
  children,
  onPress,
  style,
  hoverStyle,
  accessibilityLabel,
  disabled = false,
}: MotionPressableProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      friction: 7,
      tension: 180,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onHoverIn={() => {
          if (Platform.OS === "web") {
            setHovered(true);
            animateScale(1.015);
          }
        }}
        onHoverOut={() => {
          setHovered(false);
          animateScale(1);
        }}
        onPressIn={() => {
          setPressed(true);
          animateScale(0.985);
        }}
        onPressOut={() => {
          setPressed(false);
          animateScale(
            Platform.OS === "web" && hovered ? 1.015 : 1,
          );
        }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        style={[
          style,
          hovered && !disabled ? hoverStyle : undefined,
          pressed && !disabled ? { opacity: 0.92 } : undefined,
          disabled ? { opacity: 0.55 } : undefined,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.34,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 9,
        elevation: 3,
      }}
    >
      <Text
        style={{
          color: COLORS.white,
          fontSize: size * 0.58,
          fontWeight: "900",
          letterSpacing: -1.5,
        }}
      >
        S
      </Text>
    </View>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <View style={{ marginBottom: 25 }}>
      <Text
        style={{
          color: COLORS.primary,
          fontSize: 11,
          fontWeight: "800",
          letterSpacing: 2,
          marginBottom: 0,
        }}
      >
        {eyebrow}
      </Text>

      <Text
        style={{
          color: COLORS.text,
          fontSize: 29,
          lineHeight: 38,
          fontWeight: "900",
          letterSpacing: -0.8,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: COLORS.muted,
          fontSize: 14,
          lineHeight: 23,
          marginTop: 9,
          maxWidth: 620,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const isSmallPhone = width < 380;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 900;

  const horizontalPadding = isSmallPhone
    ? 16
    : isMobile
      ? 20
      : width >= 1440
        ? 36
        : 28;

  const containerWidth = Math.min(width, MAX_CONTENT_WIDTH);

  const contentWidth = Math.max(
    0,
    containerWidth - horizontalPadding * 2,
  );

  const serviceColumns = isMobile ? 2 : 3;
  const featureColumns = isMobile ? 1 : 3;
  const cardGap = isMobile ? 12 : 18;

  const serviceCardWidth =
    (contentWidth - cardGap * (serviceColumns - 1)) /
    serviceColumns;

  const featureCardWidth =
    (contentWidth - cardGap * (featureColumns - 1)) /
    featureColumns;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      useNativeDriver: Platform.OS !== "web",
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [entrance]);

  const entranceStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  const openServices = (category?: string) => {
    Keyboard.dismiss();
    setMenuOpen(false);

    const query = (category ?? searchQuery).trim();

    if (query.length > 0) {
      router.push({
        pathname: "/services",
        params: { search: query },
      });
      return;
    }

    router.push("/services");
  };

  const openProviders = () => {
    Keyboard.dismiss();
    setMenuOpen(false);
    router.push("/providers");
  };

  const openBookings = () => {
    Keyboard.dismiss();
    setMenuOpen(false);
    router.push("/bookings");
  };

  const openProfile = () => {
    Keyboard.dismiss();
    setMenuOpen(false);
    router.push("/profile");
  };

  return (
    <SafeAreaView
      // FIX 1: Top status bar aur bottom navigation area dono
      // ke liye safe space reserve hoti hai.
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.page,
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 6,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ==================== HEADER ==================== */}

          <View
            style={{
              backgroundColor: COLORS.white,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
              zIndex: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: MAX_CONTENT_WIDTH,
                alignSelf: "center",
                paddingHorizontal: horizontalPadding,
                paddingVertical: 15,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.replace("/");
                }}
                accessibilityRole="button"
                accessibilityLabel="ServiGo home"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 11,
                  flexShrink: 1,
                }}
              >
                <BrandMark />

                <View style={{ flexShrink: 1 }}>
                  <Text
                    style={{
                      color: COLORS.deep,
                      fontSize: 22,
                      fontWeight: "900",
                      letterSpacing: -0.8,
                    }}
                  >
                    ServiGo
                  </Text>

                  {!isSmallPhone && (
                    <Text
                      style={{
                        color: COLORS.muted,
                        fontSize: 9,
                        fontWeight: "800",
                        letterSpacing: 1.2,
                        marginTop: 1,
                      }}
                    >
                      SERVICES, SIMPLIFIED
                    </Text>
                  )}
                </View>
              </Pressable>

              {isMobile ? (
                <MotionPressable
                  onPress={() =>
                    setMenuOpen((current) => !current)
                  }
                  accessibilityLabel="Toggle navigation menu"
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 11,
                    backgroundColor: menuOpen
                      ? COLORS.light
                      : COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: 12,
                  }}
                  hoverStyle={{
                    backgroundColor: COLORS.light,
                    borderColor: COLORS.primary,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.deep,
                      fontSize: 13,
                      fontWeight: "800",
                    }}
                  >
                    {menuOpen ? "Close  ×" : "Menu  ☰"}
                  </Text>
                </MotionPressable>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: isTablet ? 3 : 8,
                  }}
                >
                  <MotionPressable
                    onPress={() => openServices()}
                    style={{
                      paddingHorizontal: isTablet ? 10 : 16,
                      paddingVertical: 12,
                      borderRadius: 11,
                    }}
                    hoverStyle={{
                      backgroundColor: COLORS.light,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.text,
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      Services
                    </Text>
                  </MotionPressable>

                  <MotionPressable
                    onPress={openBookings}
                    style={{
                      paddingHorizontal: isTablet ? 10 : 16,
                      paddingVertical: 12,
                      borderRadius: 11,
                    }}
                    hoverStyle={{
                      backgroundColor: COLORS.light,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.text,
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      My Bookings
                    </Text>
                  </MotionPressable>

                  <MotionPressable
                    onPress={openProfile}
                    style={{
                      paddingHorizontal: isTablet ? 12 : 18,
                      paddingVertical: 12,
                      backgroundColor: COLORS.primary,
                      borderRadius: 12,
                    }}
                    hoverStyle={{
                      backgroundColor: COLORS.primaryHover,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 13,
                        fontWeight: "800",
                      }}
                    >
                      My Account  ↗
                    </Text>
                  </MotionPressable>
                </View>
              )}
            </View>

            {/* MOBILE MENU */}

            {isMobile && menuOpen && (
              <View
                style={{
                  paddingHorizontal: horizontalPadding,
                  paddingBottom: 16,
                  gap: 8,
                }}
              >
                {[
                  {
                    label: "Browse Services",
                    description:
                      "Explore services for your home",
                    icon: "⌕",
                    action: () => openServices(),
                  },
                  {
                    label: "My Bookings",
                    description: "View your appointments",
                    icon: "▤",
                    action: openBookings,
                  },
                  {
                    label: "My Account",
                    description: "Open your account",
                    icon: "◎",
                    action: openProfile,
                  },
                ].map((item) => (
                  <MotionPressable
                    key={item.label}
                    onPress={item.action}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 15,
                      paddingVertical: 13,
                      borderRadius: 13,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.white,
                      gap: 12,
                    }}
                    hoverStyle={{
                      backgroundColor: COLORS.light,
                      borderColor: COLORS.primary,
                    }}
                  >
                    <View
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: COLORS.light,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.primary,
                          fontSize: 20,
                          fontWeight: "800",
                        }}
                      >
                        {item.icon}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: COLORS.text,
                          fontSize: 13,
                          fontWeight: "800",
                        }}
                      >
                        {item.label}
                      </Text>

                      <Text
                        style={{
                          color: COLORS.muted,
                          fontSize: 11,
                          marginTop: 3,
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: COLORS.primary,
                        fontSize: 18,
                        fontWeight: "800",
                      }}
                    >
                      →
                    </Text>
                  </MotionPressable>
                ))}
              </View>
            )}
          </View>

          <Animated.View style={entranceStyle}>
            <View
              style={{
                width: "100%",
                maxWidth: MAX_CONTENT_WIDTH,
                alignSelf: "center",
                paddingHorizontal: horizontalPadding,
              }}
            >
              {/* ==================== HERO ==================== */}

              <View
                style={{
                  paddingTop: isMobile ? 20 : 30,
                  paddingBottom: isMobile ? 38 : 48,
                }}
              >
                <View
                  style={{
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: COLORS.deep,
                    borderRadius: isMobile ? 23 : 30,
                    borderWidth: 1,
                    borderColor: COLORS.heroBorder,
                    paddingHorizontal: isSmallPhone
                      ? 19
                      : isMobile
                        ? 24
                        : 58,
                    paddingVertical: isMobile ? 30 : 54,
                  }}
                >
                  {/* Decorative circles */}

                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      width: isMobile ? 175 : 300,
                      height: isMobile ? 175 : 300,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: "#5B8C7C",
                      right: -90,
                      top: isMobile ? -65 : -105,
                      opacity: 0.4,
                    }}
                  />

                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      width: isMobile ? 110 : 190,
                      height: isMobile ? 110 : 190,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: "#5B8C7C",
                      right: isMobile ? -40 : -35,
                      top: isMobile ? -32 : -50,
                      opacity: 0.3,
                    }}
                  />

                  <View
                    style={{
                      alignSelf: "flex-start",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 100,
                      borderWidth: 1,
                      borderColor: "#537C70",
                      backgroundColor: "#24564B",
                      marginBottom: 25,
                    }}
                  >
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 99,
                        backgroundColor: "#A7E8C6",
                      }}
                    />

                    <Text
                      style={{
                        color: "#DDF5E7",
                        fontSize: 10,
                        fontWeight: "800",
                        letterSpacing: 1.2,
                      }}
                    >
                      HOME SERVICES, REIMAGINED
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: isSmallPhone
                        ? 35
                        : isMobile
                          ? 40
                          : 62,
                      lineHeight: isSmallPhone
                        ? 43
                        : isMobile
                          ? 49
                          : 72,
                      fontWeight: "900",
                      letterSpacing: isMobile ? -1.4 : -2.5,
                      maxWidth: 800,
                    }}
                  >
                    Your home.
                    {"\n"}
                    Your standards.
                    {"\n"}
                    <Text style={{ color: "#9FE0BC" }}>
                      Our expertise.
                    </Text>
                  </Text>

                  <Text
                    style={{
                      color: "#D0E3DA",
                      fontSize: isMobile ? 14 : 16,
                      lineHeight: isMobile ? 24 : 28,
                      marginTop: 20,
                      marginBottom: 29,
                      maxWidth: 650,
                    }}
                  >
                    Book trusted professionals for your everyday home
                    services. A better way to care for your space starts
                    right here.
                  </Text>

                  {/* SEARCH BAR */}

                  <View
                    style={{
                      width: "100%",
                      maxWidth: 720,
                      flexDirection: isSmallPhone
                        ? "column"
                        : "row",
                      alignItems: "stretch",
                      gap: 8,
                      padding: 7,
                      borderRadius: 17,
                      backgroundColor: COLORS.white,
                      borderWidth: 2,
                      borderColor: searchFocused
                        ? "#8AD4B0"
                        : "#FFFFFF",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        minWidth: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: 13,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 25,
                          color: COLORS.primary,
                          marginRight: 10,
                        }}
                      >
                        ⌕
                      </Text>

                      <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        onSubmitEditing={() => openServices()}
                        placeholder="Your Needs?"
                        placeholderTextColor="#82958E"
                        accessibilityLabel="Search home services"
                        returnKeyType="search"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          minHeight: 49,
                          fontSize: 14,
                          color: COLORS.text,
                          paddingVertical: 10,
                          backgroundColor: "transparent",
                        }}
                      />
                    </View>

                    <MotionPressable
                      onPress={() => openServices()}
                      accessibilityLabel="Search services"
                      style={{
                        minHeight: 49,
                        minWidth: isSmallPhone ? undefined : 145,
                        paddingHorizontal: 20,
                        paddingVertical: 14,
                        borderRadius: 12,
                        backgroundColor: COLORS.primary,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      hoverStyle={{
                        backgroundColor: COLORS.primaryHover,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: COLORS.white,
                          fontWeight: "900",
                        }}
                      >
                        Find a service  →
                      </Text>
                    </MotionPressable>
                  </View>

                  {/* BENEFITS */}

                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 16,
                      marginTop: 23,
                    }}
                  >
                    {[
                      "Convenient booking",
                      "Multiple services",
                      "Simple experience",
                    ].map((item) => (
                      <View
                        key={item}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <Text
                          style={{
                            color: "#9FE0BC",
                            fontSize: 13,
                            fontWeight: "900",
                          }}
                        >
                          ✓
                        </Text>

                        <Text
                          style={{
                            color: "#D0E3DA",
                            fontSize: 11,
                            fontWeight: "600",
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* ==================== POPULAR SERVICES ==================== */}

              <View style={{ marginBottom: 52 }}>
                <View
                  style={{
                    flexDirection: isSmallPhone ? "column" : "row",
                    alignItems: isSmallPhone
                      ? "flex-start"
                      : "flex-end",
                    justifyContent: "space-between",
                    gap: 14,
                    marginBottom: 24,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontSize: 10,
                        fontWeight: "900",
                        letterSpacing: 2,
                        marginBottom: 9,
                      }}
                    >
                      EXPLORE WHAT WE DO
                    </Text>

                    <Text
                      style={{
                        color: COLORS.text,
                        fontSize: isSmallPhone ? 27 : 30,
                        lineHeight: 38,
                        fontWeight: "900",
                        letterSpacing: -1,
                      }}
                    >
                      Popular services
                    </Text>

                    <Text
                      style={{
                        color: COLORS.muted,
                        fontSize: 14,
                        lineHeight: 23,
                        marginTop: 6,
                      }}
                    >
                      Everything your home needs, all in one place.
                    </Text>
                  </View>

                  <MotionPressable
                    onPress={() => openServices()}
                    style={{
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.white,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                    }}
                    hoverStyle={{
                      backgroundColor: COLORS.light,
                      borderColor: COLORS.primary,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontSize: 12,
                        fontWeight: "800",
                      }}
                    >
                      View all services  →
                    </Text>
                  </MotionPressable>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: cardGap,
                  }}
                >
                  {services.map((service) => (
                    <MotionPressable
                      key={service.name}
                      onPress={() => openServices(service.name)}
                      accessibilityLabel={`Explore ${service.name}`}
                      style={{
                        width: serviceCardWidth,
                        minWidth: 0,
                        padding: isSmallPhone ? 14 : 21,
                        borderRadius: 21,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.white,
                        shadowColor: COLORS.deep,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.035,
                        shadowRadius: 12,
                        elevation: 1,
                      }}
                      hoverStyle={{
                        borderColor: COLORS.primary,
                        backgroundColor: COLORS.subtle,
                        shadowOpacity: 0.1,
                        shadowRadius: 15,
                        elevation: 3,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 6,
                          marginBottom: 18,
                        }}
                      >
                        <View
                          style={{
                            height: isSmallPhone ? 45 : 52,
                            width: isSmallPhone ? 45 : 52,
                            borderRadius: 16,
                            backgroundColor: COLORS.mint,
                            borderWidth: 1,
                            borderColor: "#C7EBDD",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.primary,
                              fontSize: 25,
                              fontWeight: "800",
                            }}
                          >
                            {service.icon}
                          </Text>
                        </View>

                        <Text
                          style={{
                            color: "#8CA69B",
                            fontSize: 8,
                            fontWeight: "900",
                            letterSpacing: 0.5,
                            flexShrink: 1,
                            textAlign: "right",
                          }}
                        >
                          {service.tag}
                        </Text>
                      </View>

                      <Text
                        style={{
                          color: COLORS.text,
                          fontSize: isSmallPhone ? 14 : 16,
                          fontWeight: "900",
                          letterSpacing: -0.25,
                        }}
                        numberOfLines={2}
                      >
                        {service.name}
                      </Text>

                      <Text
                        style={{
                          marginTop: 7,
                          marginBottom: 18,
                          color: COLORS.muted,
                          fontSize: 11,
                          lineHeight: 18,
                          minHeight: 36,
                        }}
                        numberOfLines={2}
                      >
                        {service.description}
                      </Text>

                      <View
                        style={{
                          borderTopWidth: 1,
                          borderTopColor: COLORS.border,
                          paddingTop: 13,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.mintText,
                            fontSize: 11,
                            fontWeight: "900",
                          }}
                        >
                          Explore
                        </Text>

                        <Text
                          style={{
                            color: COLORS.primary,
                            fontSize: 17,
                            fontWeight: "900",
                          }}
                        >
                          ↗
                        </Text>
                      </View>
                    </MotionPressable>
                  ))}
                </View>
              </View>

              {/* ==================== WHY SERVIGO ==================== */}

              <View style={{ marginBottom: 54 }}>
                <SectionHeading
                  eyebrow="THE SERVIGO DIFFERENCE"
                  title="A better way to get things done."
                  description="A simpler home service experience, designed around convenience, clarity and control."
                />

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: cardGap,
                  }}
                >
                  {features.map((feature) => (
                    <MotionPressable
                      key={feature.number}
                      onPress={() => openServices()}
                      style={{
                        width: featureCardWidth,
                        minWidth: 0,
                        borderRadius: 21,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                        padding: isMobile ? 21 : 27,
                        backgroundColor: COLORS.white,
                      }}
                      hoverStyle={{
                        borderColor: COLORS.primary,
                        backgroundColor: COLORS.subtle,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 25,
                        }}
                      >
                        <View
                          style={{
                            height: 45,
                            width: 45,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 15,
                            backgroundColor: COLORS.light,
                            borderWidth: 1,
                            borderColor: "#CBE6DA",
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.primary,
                              fontSize: 20,
                              fontWeight: "900",
                            }}
                          >
                            {feature.icon}
                          </Text>
                        </View>

                        <Text
                          style={{
                            color: "#8FA79D",
                            fontSize: 12,
                            fontWeight: "900",
                            letterSpacing: 1,
                          }}
                        >
                          {feature.number}
                        </Text>
                      </View>

                      <Text
                        style={{
                          color: COLORS.text,
                          fontSize: 18,
                          lineHeight: 26,
                          fontWeight: "900",
                          marginBottom: 10,
                        }}
                      >
                        {feature.title}
                      </Text>

                      <Text
                        style={{
                          color: COLORS.muted,
                          fontSize: 13,
                          lineHeight: 22,
                        }}
                      >
                        {feature.description}
                      </Text>
                    </MotionPressable>
                  ))}
                </View>
              </View>

              {/* ==================== PROVIDER CTA ==================== */}

              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#2F6D60",
                  backgroundColor: COLORS.deep,
                  borderRadius: 26,
                  paddingHorizontal: isSmallPhone
                    ? 20
                    : isMobile
                      ? 24
                      : 42,
                  paddingVertical: isMobile ? 28 : 38,
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "stretch" : "center",
                  justifyContent: "space-between",
                  gap: 24,
                  marginBottom: 38,
                  overflow: "hidden",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#A9D8C0",
                      fontSize: 10,
                      fontWeight: "900",
                      letterSpacing: 2,
                      marginBottom: 10,
                    }}
                  >
                    FOR YOUR NEXT PROJECT
                  </Text>

                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: isMobile ? 25 : 32,
                      lineHeight: isMobile ? 34 : 41,
                      fontWeight: "900",
                      letterSpacing: -0.8,
                    }}
                  >
                    Your home deserves
                    {"\n"}
                    the right expert.
                  </Text>

                  <Text
                    style={{
                      color: "#C8E0D5",
                      fontSize: 13,
                      lineHeight: 23,
                      marginTop: 12,
                      maxWidth: 570,
                    }}
                  >
                    Explore service providers and look for the right
                    professional for your next home project.
                  </Text>
                </View>

                <MotionPressable
                  onPress={openProviders}
                  style={{
                    alignSelf: isMobile ? "flex-start" : "center",
                    minHeight: 51,
                    justifyContent: "center",
                    borderRadius: 13,
                    paddingHorizontal: 22,
                    paddingVertical: 14,
                    backgroundColor: "#BDEBD2",
                    borderWidth: 1,
                    borderColor: "#BDEBD2",
                  }}
                  hoverStyle={{
                    backgroundColor: "#D6F5E4",
                    borderColor: "#D6F5E4",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.deep,
                      fontSize: 13,
                      fontWeight: "900",
                    }}
                  >
                    Find providers  →
                  </Text>
                </MotionPressable>
              </View>

              {/* ==================== FOOTER ==================== */}

              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  paddingTop: 24,
                  paddingBottom: 5,
                  borderTopWidth: 1,
                  borderTopColor: COLORS.border,
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: isMobile
                    ? "center"
                    : "space-between",
                  gap: 18,
                }}
              >
                {/* BRAND: centered on mobile */}

                <Pressable
                  onPress={() => router.replace("/")}
                  accessibilityRole="button"
                  accessibilityLabel="ServiGo home"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: isMobile ? "center" : "flex-start",
                    alignSelf: isMobile ? "center" : "auto",
                    gap: 10,
                  }}
                >
                  <BrandMark size={38} />

                  <View
                    style={{
                      alignItems: isMobile ? "center" : "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.deep,
                        fontSize: 18,
                        fontWeight: "900",
                        textAlign: isMobile ? "center" : "left",
                      }}
                    >
                      ServiGo
                    </Text>

                    <Text
                      style={{
                        color: COLORS.muted,
                        fontSize: 11,
                        lineHeight: 18,
                        marginTop: 4,
                        textAlign: isMobile ? "center" : "left",
                      }}
                    >
                      Better home services. A simpler experience.
                    </Text>
                  </View>
                </Pressable>

                {/* FOOTER LINKS: centered on mobile */}

                <View
                  style={{
                    width: isMobile ? "100%" : undefined,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                  }}
                >
                  {[
                    {
                      label: "Services",
                      action: () => openServices(),
                    },
                    {
                      label: "Bookings",
                      action: openBookings,
                    },
                    {
                      label: "Account",
                      action: openProfile,
                    },
                  ].map((item) => (
                    <MotionPressable
                      key={item.label}
                      onPress={item.action}
                      style={{
                        paddingHorizontal: 13,
                        paddingVertical: 10,
                        borderRadius: 10,
                      }}
                      hoverStyle={{
                        backgroundColor: COLORS.light,
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.text,
                          fontSize: 11,
                          fontWeight: "800",
                        }}
                      >
                        {item.label}
                      </Text>
                    </MotionPressable>
                  ))}
                </View>
              </View>

              {/* COPYRIGHT */}

              <Text
                style={{
                  width: "100%",
                  marginTop: 8,
                  marginBottom: 8,
                  paddingHorizontal: 4,
                  color: "#8A9E95",
                  fontSize: 10,
                  lineHeight: 18,
                  textAlign: "center",
                }}
              >
                © {new Date().getFullYear()} ServiGo. All rights reserved.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}