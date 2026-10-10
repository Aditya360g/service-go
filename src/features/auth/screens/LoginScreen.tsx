import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

type UserRole = "customer" | "provider" | "admin";

type LoginUser = {
  id: number | string;
  name?: string;
  email: string;
  role: UserRole;
  status?: "active" | "inactive" | "blocked";
  email_verified_at?: string | null;
  is_email_verified?: boolean;
};

type LoginResponse = {
  access_token?: string;
  refresh_token?: string;
  token?: string;
  token_type?: string;
  user?: LoginUser;
  detail?: string | { msg?: string }[];
  message?: string;
  code?: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

type PremiumPressableProps = {
  children: ReactNode;
  onPress: () => void;
  className?: string;
  hoverClassName?: string;
  pressedClassName?: string;
  disabled?: boolean;
  accessibilityRole?: "button" | "link" | "checkbox";
  accessibilityLabel?: string;
  accessibilityState?: {
    checked?: boolean;
    disabled?: boolean;
  };
};

const DEMO_MODE = true;

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? ""
).replace(/\/+$/, "");

const LOGIN_ENDPOINT =
  process.env.EXPO_PUBLIC_LOGIN_PATH ?? "/auth/login";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COLORS = {
  page: "#F3F4F6",
  black: "#111827",
  border: "#111827",
  inputBackground: "#FFFFFF",
};

const textInputStyle =
  Platform.OS === "web"
    ? ({
      minWidth: 0,
      height: 54,
      paddingVertical: 0,
      borderWidth: 0,
      outlineStyle: "none",
      outlineWidth: 0,
      backgroundColor: "transparent",
      boxShadow: "none",
    } as never)
    : undefined;

function PremiumPressable({
  children,
  onPress,
  className = "",
  hoverClassName = "",
  pressedClassName = "",
  disabled = false,
  accessibilityRole = "button",
  accessibilityLabel,
  accessibilityState,
}: PremiumPressableProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const currentClassName = [
    className,
    isHovered && !disabled ? hoverClassName : "",
    isPressed && !disabled ? pressedClassName : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        ...accessibilityState,
        disabled,
      }}
      className={currentClassName}
    >
      {children}
    </Pressable>
  );
}

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim().toLowerCase());
}

function getErrorMessage(
  data: LoginResponse,
  fallback: string,
) {
  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(" ");
  }

  return data.message || fallback;
}

function isVerificationError(
  message: string,
  data: LoginResponse,
) {
  const value = `${message} ${data.code ?? ""}`.toLowerCase();

  return (
    value.includes("verify email") ||
    value.includes("email not verified") ||
    value.includes("email verification required") ||
    value.includes("email_not_verified")
  );
}

function getFocusGlow(focused: boolean) {
  if (Platform.OS !== "web" || !focused) {
    return undefined;
  }

  return {
    boxShadow: "0 0 0 3px rgba(17, 24, 39, 0.12)",
  } as never;
}

export default function LoginScreen() {
  const { width } = useWindowDimensions();

  const isWideScreen = width >= 760;
  const isSmallScreen = width < 360;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [
    emailVerificationRequired,
    setEmailVerificationRequired,
  ] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const updateEmail = (value: string) => {
    setEmail(value);

    setErrors((current) => ({
      ...current,
      email: undefined,
    }));

    setLoginError("");
    setEmailVerificationRequired(false);
  };

  const updatePassword = (value: string) => {
    setPassword(value);

    setErrors((current) => ({
      ...current,
      password: undefined,
    }));

    setLoginError("");
  };

  const validateForm = () => {
    const nextErrors: LoginErrors = {};
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!isValidEmail(cleanEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password =
        "Password must contain at least 6 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const redirectUser = (role: UserRole) => {
    if (role === "provider") {
      router.replace("/provider");
      return;
    }

    if (role === "admin") {
      router.replace("/admin");
      return;
    }

    router.replace("/");
  };

  const handleLogin = async () => {
    if (loggingIn || !validateForm()) {
      return;
    }

    setLoggingIn(true);
    setLoginError("");
    setEmailVerificationRequired(false);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (DEMO_MODE) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 650);
        });

        const demoRole: UserRole = cleanEmail.startsWith("admin@")
          ? "admin"
          : cleanEmail.startsWith("provider@")
            ? "provider"
            : "customer";

        redirectUser(demoRole);
        return;
      }

      if (!API_BASE_URL) {
        throw new Error(
          "API URL is not configured. Add EXPO_PUBLIC_API_URL to your .env file and restart Expo.",
        );
      }

      const normalizedPath = LOGIN_ENDPOINT.startsWith("/")
        ? LOGIN_ENDPOINT
        : `/${LOGIN_ENDPOINT}`;

      const response = await fetch(
        `${API_BASE_URL}${normalizedPath}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            password,
            remember_me: rememberMe,
          }),
        },
      );

      let data: LoginResponse;

      try {
        data = (await response.json()) as LoginResponse;
      } catch {
        throw new Error(
          "The server returned an invalid response. Please try again.",
        );
      }

      if (!response.ok) {
        const message = getErrorMessage(
          data,
          `Login failed (${response.status}). Please check your credentials.`,
        );

        if (isVerificationError(message, data)) {
          setEmailVerificationRequired(true);
        }

        throw new Error(message);
      }

      const user = data.user;
      const accessToken = data.access_token ?? data.token;
      const refreshToken = data.refresh_token;

      if (!user || !accessToken) {
        throw new Error(
          "The server response is missing the user or access token. Check your backend login response.",
        );
      }

      if (
        user.role !== "customer" &&
        user.role !== "provider" &&
        user.role !== "admin"
      ) {
        throw new Error(
          "Your account has an unsupported user role.",
        );
      }

      if (user.status && user.status !== "active") {
        throw new Error(
          user.status === "blocked"
            ? "Your account has been blocked. Please contact support."
            : "Your account is inactive. Please contact support.",
        );
      }

      if (
        user.is_email_verified === false ||
        ("email_verified_at" in user &&
          user.email_verified_at === null)
      ) {
        setEmailVerificationRequired(true);

        throw new Error(
          "Please verify your email address before signing in.",
        );
      }

      if (Platform.OS !== "web") {
        await SecureStore.setItemAsync(
          "servigo_access_token",
          accessToken,
        );

        if (refreshToken) {
          await SecureStore.setItemAsync(
            "servigo_refresh_token",
            refreshToken,
          );
        } else {
          await SecureStore.deleteItemAsync(
            "servigo_refresh_token",
          );
        }
      }

      redirectUser(user.role);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.";

      setLoginError(message);
      console.error("ServiGo login error:", message);
    } finally {
      setLoggingIn(false);
    }
  };

  const openVerification = () => {
    router.push({
      pathname: "/verify-email",
      params: {
        email: email.trim().toLowerCase(),
      },
    });
  };

  const openRegister = () => {
    router.push("/register");
  };

  const openForgotPassword = () => {
    router.push("/forgot-password");
  };

  const openSupport = () => {
    router.push("/support");
  };

  const emailBorderColor = errors.email
    ? "#DC2626"
    : emailFocused
      ? COLORS.black
      : COLORS.border;

  const passwordBorderColor = errors.password
    ? "#DC2626"
    : passwordFocused
      ? COLORS.black
      : COLORS.border;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: COLORS.page }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: isSmallScreen
            ? 12
            : isWideScreen
              ? 28
              : 18,
          paddingVertical: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full self-center"
          style={{ maxWidth: 1080 }}
        >
          <View
            className={`w-full overflow-hidden rounded-[26px] bg-white ${isWideScreen ? "flex-row" : "flex-col"
              }`}
            style={{
              borderWidth: 1,
              borderColor: COLORS.black,
              shadowColor: COLORS.black,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.09,
              shadowRadius: 24,
              elevation: 4,
            }}
          >
            {isWideScreen && (
              <View
                className="flex-1 p-9"
                style={{
                  flexBasis: 0,
                  backgroundColor: COLORS.black,
                }}
              >
                <View className="self-start rounded-full border border-white/30 bg-white/10 px-3 py-2">
                  <Text className="text-xs font-bold tracking-wider text-white">
                    YOUR EVERYDAY SERVICE PARTNER
                  </Text>
                </View>

                <Text className="mt-8 text-4xl font-extrabold leading-tight text-white">
                  Everything you need.
                  {"\n"}
                  One trusted place.
                </Text>

                <Text className="mt-5 text-base leading-7 text-gray-300">
                  Sign in to manage your account and continue your
                  journey with ServiGo.
                </Text>

                <View className="mt-9 gap-6">
                  {[
                    {
                      icon: "✓",
                      title: "Simple account access",
                      description:
                        "Get back to your account in just a few steps.",
                    },
                    {
                      icon: "⌘",
                      title: "One account, your workspace",
                      description:
                        "Continue to the relevant account dashboard.",
                    },
                    {
                      icon: "↗",
                      title: "Convenient service access",
                      description:
                        "Pick up where you left off, whenever you need.",
                    },
                  ].map((item) => (
                    <View
                      key={item.title}
                      className="flex-row items-center"
                    >
                      <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/10">
                        <Text className="text-xl font-bold text-white">
                          {item.icon}
                        </Text>
                      </View>

                      <View className="flex-1">
                        <Text className="font-bold text-white">
                          {item.title}
                        </Text>

                        <Text className="mt-1 text-sm leading-5 text-gray-300">
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5">
                  <Text className="text-sm font-bold text-white">
                    Welcome to ServiGo
                  </Text>

                  <Text className="mt-2 text-sm leading-6 text-gray-300">
                    Sign in to continue managing your services and
                    account.
                  </Text>
                </View>
              </View>
            )}

            <View
              className="flex-1 bg-white"
              style={{
                flexBasis: isWideScreen ? 0 : undefined,
                padding: isSmallScreen
                  ? 18
                  : isWideScreen
                    ? 42
                    : 24,
              }}
            >
              <View className="mb-7">
                <View className="mb-5 h-1.5 w-12 rounded-full bg-black" />

                <Text className="text-3xl font-extrabold tracking-tight text-gray-950">
                  Welcome back
                </Text>

                <Text className="mt-2 text-base leading-6 text-gray-600">
                  Sign in to continue to your ServiGo account.
                </Text>
              </View>

              {!!loginError && (
                <View className="mb-5 rounded-2xl border border-red-300 bg-red-50 p-4">
                  <Text className="font-bold text-red-800">
                    Sign-in unsuccessful
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-red-700">
                    {loginError}
                  </Text>

                  {emailVerificationRequired && (
                    <PremiumPressable
                      onPress={openVerification}
                      disabled={!isValidEmail(email)}
                      className="mt-3 self-start rounded-xl border border-red-400 bg-white px-4 py-3"
                      hoverClassName="border-red-500 bg-red-100"
                      pressedClassName="bg-red-200"
                    >
                      <Text className="font-bold text-red-900">
                        Verify email →
                      </Text>
                    </PremiumPressable>
                  )}
                </View>
              )}

              {/* EMAIL */}
              <View className="mb-5">
                <Text className="mb-2.5 text-sm font-bold text-gray-900">
                  Email address
                  <Text className="text-red-600"> *</Text>
                </Text>

                <View
                  className="flex-row items-center rounded-xl px-4"
                  style={[
                    {
                      minHeight: 58,
                      borderWidth: emailFocused ? 1.8 : 1,
                      borderColor: emailBorderColor,
                      backgroundColor: emailFocused
                        ? "#F9FAFB"
                        : COLORS.inputBackground,
                    },
                    getFocusGlow(emailFocused),
                  ]}
                >
                  <Text
                    accessible={false}
                    className={`mr-3 text-lg ${emailFocused ? "text-black" : "text-gray-500"
                      }`}
                  >
                    ✉
                  </Text>

                  <TextInput
                    value={email}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onChangeText={updateEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="#6B7280"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoComplete="email"
                    maxLength={120}
                    accessibilityLabel="Email address"
                    returnKeyType="next"
                    className="flex-1 text-base text-gray-950"
                    style={textInputStyle}
                    underlineColorAndroid="transparent"
                  />
                </View>

                {!!errors.email && (
                  <Text className="mt-2 text-sm font-medium text-red-600">
                    {errors.email}
                  </Text>
                )}

                {!errors.email && (
                  <Text className="mt-2 text-xs leading-5 text-gray-500">
                    Use the email address linked to your account.
                  </Text>
                )}
              </View>

              {/* PASSWORD */}
              <View className="mb-4">
                <View className="mb-2.5 flex-row items-center justify-between">
                  <Text className="text-sm font-bold text-gray-900">
                    Password
                    <Text className="text-red-600"> *</Text>
                  </Text>

                  <PremiumPressable
                    onPress={openForgotPassword}
                    className="rounded-lg border border-transparent px-2 py-1"
                    hoverClassName="border-gray-300 bg-gray-100"
                    pressedClassName="bg-gray-200"
                    accessibilityRole="link"
                  >
                    <Text className="text-sm font-bold text-gray-900">
                      Forgot password?
                    </Text>
                  </PremiumPressable>
                </View>

                <View
                  className="flex-row items-center rounded-xl pl-4 pr-2"
                  style={[
                    {
                      minHeight: 58,
                      borderWidth: passwordFocused ? 1.8 : 1,
                      borderColor: passwordBorderColor,
                      backgroundColor: passwordFocused
                        ? "#F9FAFB"
                        : COLORS.inputBackground,
                    },
                    getFocusGlow(passwordFocused),
                  ]}
                >
                  <Text
                    accessible={false}
                    className={`mr-3 text-lg ${passwordFocused ? "text-black" : "text-gray-500"
                      }`}
                  >
                    ▣
                  </Text>

                  <TextInput
                    value={password}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onChangeText={updatePassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showPassword}
                    textContentType="password"
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={128}
                    accessibilityLabel="Password"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    className="flex-1 text-base text-gray-950"
                    style={textInputStyle}
                    underlineColorAndroid="transparent"
                  />

                  <PremiumPressable
                    onPress={() =>
                      setShowPassword((current) => !current)
                    }
                    className="ml-1 rounded-lg border border-transparent px-2.5 py-2"
                    hoverClassName="border-gray-300 bg-gray-100"
                    pressedClassName="bg-gray-200"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <Text className="text-sm font-bold text-gray-950">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </PremiumPressable>
                </View>

                {!!errors.password && (
                  <Text className="mt-2 text-sm font-medium text-red-600">
                    {errors.password}
                  </Text>
                )}
              </View>

              {/* REMEMBER ME */}
              <PremiumPressable
                onPress={() =>
                  setRememberMe((current) => !current)
                }
                accessibilityRole="checkbox"
                accessibilityLabel="Remember me"
                accessibilityState={{ checked: rememberMe }}
                className="mb-6 self-start flex-row items-center rounded-xl border border-transparent px-2 py-2"
                hoverClassName="border-gray-300 bg-gray-100"
                pressedClassName="bg-gray-200"
              >
                <View
                  className={`mr-3 h-5 w-5 items-center justify-center rounded-md border ${rememberMe
                    ? "border-black bg-black"
                    : "border-gray-500 bg-white"
                    }`}
                >
                  {rememberMe && (
                    <Text className="text-xs font-black text-white">
                      ✓
                    </Text>
                  )}
                </View>

                <Text className="text-sm font-medium text-gray-700">
                  Remember me
                </Text>
              </PremiumPressable>

              {/* SIGN IN */}
              <PremiumPressable
                disabled={loggingIn}
                onPress={handleLogin}
                className={`min-h-14 flex-row items-center justify-center rounded-xl border px-5 py-4 ${loggingIn
                  ? "border-gray-500 bg-gray-500"
                  : "border-black bg-black"
                  }`}
                hoverClassName="border-gray-700 bg-gray-800"
                pressedClassName="bg-gray-900"
                accessibilityLabel="Sign in to ServiGo"
              >
                {loggingIn && (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                    style={{ marginRight: 10 }}
                  />
                )}

                <Text className="text-base font-extrabold text-white">
                  {loggingIn
                    ? "Signing in..."
                    : "Sign in to ServiGo  →"}
                </Text>
              </PremiumPressable>

              {/* CREATE ACCOUNT */}
              <View className="mt-7 flex-row flex-wrap items-center justify-center">
                <Text className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                </Text>

                <PremiumPressable
                  onPress={openRegister}
                  className="rounded-lg border border-transparent px-2 py-1"
                  hoverClassName="border-gray-300 bg-gray-100"
                  pressedClassName="bg-gray-200"
                  accessibilityRole="link"
                >
                  <Text className="text-sm font-extrabold text-gray-950">
                    Create account
                  </Text>
                </PremiumPressable>
              </View>

              {/* DIVIDER */}
              <View className="my-6 flex-row items-center">
                <View className="h-px flex-1 bg-gray-300" />

                <Text className="mx-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Need help?
                </Text>

                <View className="h-px flex-1 bg-gray-300" />
              </View>

              {/* SUPPORT */}
              <PremiumPressable
                onPress={openSupport}
                className="min-h-12 items-center justify-center rounded-xl border border-black bg-white px-4 py-3"
                hoverClassName="bg-gray-100"
                pressedClassName="bg-gray-200"
              >
                <Text className="font-bold text-gray-950">
                  Contact support
                </Text>
              </PremiumPressable>

              {/* SECURITY NOTE */}
              <View className="mt-5 flex-row items-start rounded-xl border border-gray-300 bg-gray-50 p-3.5">
                <Text className="mr-2 text-base text-gray-900">
                  ⓘ
                </Text>

                <Text className="flex-1 text-xs leading-5 text-gray-600">
                  Never share your password or verification code with
                  anyone.
                </Text>
              </View>
            </View>
          </View>

          {/* FOOTER */}
          <Text className="mt-5 px-3 text-center text-xs leading-5 text-gray-500">
            By signing in, you agree to ServiGo&apos;s Terms of Service
            and Privacy Policy.
          </Text>

          <Text className="mt-2 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} ServiGo. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}