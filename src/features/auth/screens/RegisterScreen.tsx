import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  findNodeHandle,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AccountType = "customer" | "provider";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;
type FocusedField = keyof RegisterForm | null;

type ApiResponse = {
  detail?: string | { msg?: string }[];
  message?: string;
};

type PremiumPressableProps = {
  children: ReactNode;
  onPress: () => void;
  className?: string;
  hoverClassName?: string;
  pressedClassName?: string;
  disabled?: boolean;
  accessibilityRole?: "button" | "link" | "checkbox" | "radio";
  accessibilityLabel?: string;
  accessibilityState?: {
    checked?: boolean;
    disabled?: boolean;
  };
};

/*
 * FRONTEND DEMO MODE
 * true  = Dummy registration, no API required.
 * false = Connect to your backend API.
 */
const DEMO_MODE = true;

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? ""
).replace(/\/+$/, "");

const REGISTER_ENDPOINT =
  process.env.EXPO_PUBLIC_REGISTER_PATH ?? "/auth/register";

const BLACK = "#111827";
const SOFT_BORDER = "#D1D5DB";
const INPUT_BACKGROUND = "#FFFFFF";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const webInputStyle =
  Platform.OS === "web"
    ? ({
      outlineStyle: "none",
      outlineWidth: 0,
      borderWidth: 0,
      backgroundColor: "transparent",
      boxShadow: "none",
      minWidth: 0,
    } as never)
    : undefined;

/**
 * Web/Desktop: hover effect.
 * Mobile: press effect.
 */
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
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const combinedClassName = [
    className,
    hovered && !disabled ? hoverClassName : "",
    pressed && !disabled ? pressedClassName : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        ...accessibilityState,
        disabled,
      }}
      className={combinedClassName}
    >
      {children}
    </Pressable>
  );
}

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim().toLowerCase());
}

function getApiErrorMessage(
  data: ApiResponse,
  fallback: string,
) {
  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail)) {
    const messages = data.detail
      .map((item) => item.msg)
      .filter(Boolean);

    if (messages.length) {
      return messages.join(" ");
    }
  }

  return data.message || fallback;
}

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return {
      label: "Weak",
      width: "20%" as const,
      color: "#EF4444",
    };
  }

  if (score === 2) {
    return {
      label: "Fair",
      width: "40%" as const,
      color: "#F97316",
    };
  }

  if (score === 3) {
    return {
      label: "Good",
      width: "65%" as const,
      color: "#EAB308",
    };
  }

  if (score === 4) {
    return {
      label: "Strong",
      width: "85%" as const,
      color: "#22C55E",
    };
  }

  return {
    label: "Very strong",
    width: "100%" as const,
    color: "#16A34A",
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <Text
      accessibilityRole="alert"
      className="mt-1.5 text-xs font-medium text-red-600"
    >
      {message}
    </Text>
  );
}

export default function RegisterScreen() {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 380;
  const isShortScreen = height < 760;

  const scrollRef = useRef<ScrollView>(null);
  const activeInputRef = useRef<TextInput | null>(null);
  const activeExtraOffsetRef = useRef(100);

  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedField, setFocusedField] =
    useState<FocusedField>(null);

  const [accountType, setAccountType] =
    useState<AccountType>("customer");

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [registrationError, setRegistrationError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password],
  );

  const scrollFocusedInput = () => {
    if (Platform.OS === "web") return;

    const input = activeInputRef.current;
    const handle = findNodeHandle(input);

    if (!input || handle == null || !scrollRef.current) return;

    const responder = scrollRef.current.getScrollResponder();

    responder.scrollResponderScrollNativeHandleToKeyboard(
      handle,
      activeExtraOffsetRef.current,
      true,
    );
  };

  const scheduleInputScroll = (delay = 250) => {
    if (Platform.OS === "web") return;

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      scrollFocusedInput();
    }, delay);
  };

  const handleInputFocus = (
    input: TextInput | null,
    field: keyof RegisterForm,
    extraOffset = 100,
  ) => {
    activeInputRef.current = input;
    activeExtraOffsetRef.current = extraOffset;
    setFocusedField(field);
    scheduleInputScroll(350);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  useEffect(() => {
    if (Platform.OS === "web") return;

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        scheduleInputScroll(180);
      },
    );

    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();

      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const updateField = <K extends keyof RegisterForm>(
    field: K,
    value: RegisterForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setRegistrationError("");
  };

  const getFieldStyle = (field: keyof RegisterForm) => {
    const hasError = Boolean(errors[field]);
    const isFocused = focusedField === field;

    const style: Record<string, unknown> = {
      borderColor: hasError
        ? "#DC2626"
        : isFocused
          ? BLACK
          : SOFT_BORDER,
      borderWidth: isFocused ? 1.8 : 1,
      backgroundColor: isFocused ? "#F9FAFB" : INPUT_BACKGROUND,
    };

    if (Platform.OS === "web" && isFocused) {
      style.boxShadow = "0 0 0 3px rgba(17, 24, 39, 0.10)";
    }

    return style as never;
  };

  const validateForm = () => {
    const nextErrors: RegisterErrors = {};

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.replace(/\D/g, "");

    if (name.length < 2) {
      nextErrors.name = "Please enter your full name.";
    } else if (name.length > 80) {
      nextErrors.name = "Name cannot exceed 80 characters.";
    }

    if (!email) {
      nextErrors.email = "Email address is required.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (phone.length !== 10) {
      nextErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (form.password.length < 8) {
      nextErrors.password =
        "Password must contain at least 8 characters.";
    } else if (!/[A-Z]/.test(form.password)) {
      nextErrors.password =
        "Include at least one uppercase letter.";
    } else if (!/[a-z]/.test(form.password)) {
      nextErrors.password =
        "Include at least one lowercase letter.";
    } else if (!/\d/.test(form.password)) {
      nextErrors.password = "Include at least one number.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = Object.keys(
        nextErrors,
      )[0] as keyof RegisterForm;

      const refs = {
        name: nameRef,
        email: emailRef,
        phone: phoneRef,
        password: passwordRef,
        confirmPassword: confirmPasswordRef,
      };

      refs[firstInvalidField]?.current?.focus();
      return false;
    }

    if (!acceptedTerms) {
      setRegistrationError(
        "Please accept the Terms of Service and Privacy Policy.",
      );
      return false;
    }

    setRegistrationError("");
    return true;
  };

  const handleRegister = async () => {
    if (submitting || !validateForm()) return;

    Keyboard.dismiss();
    setFocusedField(null);
    setSubmitting(true);
    setRegistrationError("");

    /*
     * FRONTEND DEMO:
     * Do not check API_BASE_URL or call fetch while DEMO_MODE is true.
     */
    if (DEMO_MODE) {
      try {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 700);
        });

        setRegistered(true);
      } catch {
        setRegistrationError(
          "Unable to complete demo registration. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }

      return;
    }

    // Real backend mode: API URL is required.
    if (!API_BASE_URL) {
      setRegistrationError(
        "API URL is missing. Configure EXPO_PUBLIC_API_URL in your .env file.",
      );
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.replace(/\D/g, ""),
      password: form.password,
      role: accountType,
    };

    try {
      const normalizedPath = REGISTER_ENDPOINT.startsWith("/")
        ? REGISTER_ENDPOINT
        : `/${REGISTER_ENDPOINT}`;

      const endpoint = `${API_BASE_URL}${normalizedPath}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data: ApiResponse = {};

      try {
        data = (await response.json()) as ApiResponse;
      } catch {
        if (!response.ok) {
          throw new Error(
            "The server returned an invalid response.",
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            data,
            `Registration failed (${response.status}). Please check your details.`,
          ),
        );
      }

      setRegistered(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create account. Please try again.";

      setRegistrationError(message);

      if (Platform.OS !== "web") {
        Alert.alert("Registration failed", message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const goToVerification = () => {
    router.replace({
      pathname: "/verify-email",
      params: {
        email: form.email.trim().toLowerCase(),
      },
    });
  };

  const goToLogin = () => router.replace("/login");

  if (registered) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 14,
            paddingVertical: 16,
          }}
        >
          <View
            className="w-full self-center rounded-3xl border bg-white p-5"
            style={{
              maxWidth: 440,
              borderColor: BLACK,
              borderWidth: 1,
              shadowColor: BLACK,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 20,
              elevation: 3,
            }}
          >
            <View className="mb-3 h-14 w-14 items-center justify-center self-center rounded-2xl border border-green-300 bg-green-50">
              <Text className="text-2xl font-bold text-green-700">
                ✓
              </Text>
            </View>

            <Text className="text-center text-2xl font-extrabold text-gray-900">
              Demo registration complete
            </Text>

            <Text className="mt-2 text-center text-sm leading-6 text-gray-600">
              Your frontend demo for the {accountType} account is
              complete. No account has been saved to a backend.
            </Text>

            <View className="mt-5 rounded-xl border border-gray-300 bg-gray-50 p-4">
              <Text className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Email entered
              </Text>

              <Text className="mt-2 text-sm font-semibold text-gray-900">
                {form.email.trim().toLowerCase()}
              </Text>

              <Text className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Account type
              </Text>

              <Text className="mt-1 text-sm font-semibold capitalize text-gray-900">
                {accountType}
              </Text>

              <View className="mt-4 self-start rounded-full border border-amber-300 bg-amber-50 px-3 py-1">
                <Text className="text-xs font-bold text-amber-800">
                  Frontend demo only
                </Text>
              </View>
            </View>

            <Text className="mt-4 text-center text-sm leading-6 text-gray-600">
              You can continue to the email verification demo or return
              to the login page.
            </Text>

            <PremiumPressable
              onPress={goToVerification}
              className="mt-5 min-h-12 items-center justify-center rounded-xl border border-black bg-black px-4 py-3"
              hoverClassName="border-gray-700 bg-gray-800"
              pressedClassName="bg-gray-900"
            >
              <Text className="text-sm font-bold text-white">
                Continue to verification →
              </Text>
            </PremiumPressable>

            <PremiumPressable
              onPress={goToLogin}
              className="mt-3 min-h-12 items-center justify-center rounded-xl border border-black bg-white px-4 py-3"
              hoverClassName="bg-gray-100"
              pressedClassName="bg-gray-200"
            >
              <Text className="text-sm font-bold text-gray-900">
                Go to sign in
              </Text>
            </PremiumPressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent:
              keyboardVisible || isShortScreen
                ? "flex-start"
                : "center",
            paddingHorizontal: isSmallScreen ? 10 : 14,
            paddingTop: keyboardVisible ? 6 : 14,
            paddingBottom: keyboardVisible ? 260 : 14,
          }}
        >
          {/* MAIN REGISTRATION CARD */}
          <View
            className="w-full self-center rounded-2xl border bg-white"
            style={{
              maxWidth: 520,
              padding: isSmallScreen ? 13 : 18,
              borderColor: BLACK,
              borderWidth: 1,
              shadowColor: BLACK,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 2,
            }}
          >
            <Text className="text-2xl font-extrabold tracking-tight text-gray-950">
              Create your account
            </Text>

            <Text className="mt-1 text-sm leading-5 text-gray-600">
              Choose your account type and enter your details.
            </Text>

            {/* ACCOUNT TYPE */}
            <Text className="mb-2 mt-5 text-sm font-bold text-gray-900">
              Choose account type
            </Text>

            <View className="gap-2">
              <PremiumPressable
                onPress={() => setAccountType("customer")}
                accessibilityRole="radio"
                accessibilityLabel="Book services account"
                accessibilityState={{
                  checked: accountType === "customer",
                }}
                className={`rounded-xl border p-3 ${accountType === "customer"
                  ? "border-black bg-gray-100"
                  : "border-gray-400 bg-white"
                  }`}
                hoverClassName="border-black bg-gray-100"
                pressedClassName="bg-gray-200"
              >
                <View className="flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white">
                    <Text className="text-xl">🏠</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-950">
                      Book services
                    </Text>

                    <Text className="mt-1 text-xs text-gray-600">
                      I want to hire a professional.
                    </Text>
                  </View>

                  <View
                    className={`h-5 w-5 items-center justify-center rounded-full border ${accountType === "customer"
                      ? "border-black bg-black"
                      : "border-gray-400 bg-white"
                      }`}
                  >
                    {accountType === "customer" && (
                      <Text className="text-xs font-bold text-white">
                        ✓
                      </Text>
                    )}
                  </View>
                </View>
              </PremiumPressable>

              <PremiumPressable
                onPress={() => setAccountType("provider")}
                accessibilityRole="radio"
                accessibilityLabel="Provide services account"
                accessibilityState={{
                  checked: accountType === "provider",
                }}
                className={`rounded-xl border p-3 ${accountType === "provider"
                  ? "border-black bg-gray-100"
                  : "border-gray-400 bg-white"
                  }`}
                hoverClassName="border-black bg-gray-100"
                pressedClassName="bg-gray-200"
              >
                <View className="flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white">
                    <Text className="text-xl">🧰</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-950">
                      Provide services
                    </Text>

                    <Text className="mt-1 text-xs text-gray-600">
                      I want to offer my services.
                    </Text>
                  </View>

                  <View
                    className={`h-5 w-5 items-center justify-center rounded-full border ${accountType === "provider"
                      ? "border-black bg-black"
                      : "border-gray-400 bg-white"
                      }`}
                  >
                    {accountType === "provider" && (
                      <Text className="text-xs font-bold text-white">
                        ✓
                      </Text>
                    )}
                  </View>
                </View>
              </PremiumPressable>
            </View>

            {/* ERROR MESSAGE */}
            {!!registrationError && (
              <View className="mt-4 rounded-xl border border-red-500 bg-red-50 p-3">
                <Text
                  accessibilityRole="alert"
                  className="text-xs leading-5 text-red-800"
                >
                  {registrationError}
                </Text>
              </View>
            )}

            {/* FULL NAME */}
            <View className="mt-4">
              <Text className="mb-1.5 text-xs font-bold text-gray-900">
                Full name *
              </Text>

              <View
                className="rounded-xl border px-3"
                style={getFieldStyle("name")}
              >
                <TextInput
                  ref={nameRef}
                  value={form.name}
                  onFocus={() =>
                    handleInputFocus(nameRef.current, "name", 90)
                  }
                  onBlur={handleInputBlur}
                  onChangeText={(value) => updateField("name", value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#6B7280"
                  autoCapitalize="words"
                  autoCorrect={false}
                  textContentType="name"
                  autoComplete="name"
                  maxLength={80}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  accessibilityLabel="Full name"
                  className="min-h-11 text-sm text-gray-950"
                  style={webInputStyle}
                />
              </View>

              <FieldError message={errors.name} />
            </View>

            {/* EMAIL */}
            <View className="mt-3">
              <Text className="mb-1.5 text-xs font-bold text-gray-900">
                Email address *
              </Text>

              <View
                className="rounded-xl border px-3"
                style={getFieldStyle("email")}
              >
                <TextInput
                  ref={emailRef}
                  value={form.email}
                  onFocus={() =>
                    handleInputFocus(emailRef.current, "email", 90)
                  }
                  onBlur={handleInputBlur}
                  onChangeText={(value) => updateField("email", value)}
                  placeholder="you@example.com"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  autoComplete="email"
                  maxLength={120}
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                  accessibilityLabel="Email address"
                  className="min-h-11 text-sm text-gray-950"
                  style={webInputStyle}
                />
              </View>

              <FieldError message={errors.email} />
            </View>

            {/* MOBILE NUMBER */}
            <View className="mt-3">
              <Text className="mb-1.5 text-xs font-bold text-gray-900">
                Mobile number *
              </Text>

              <View
                className="min-h-12 flex-row items-center rounded-xl border px-3"
                style={getFieldStyle("phone")}
              >
                <Text className="mr-3 border-r border-gray-300 pr-3 text-sm font-bold text-gray-900">
                  +91
                </Text>

                <TextInput
                  ref={phoneRef}
                  value={form.phone}
                  onFocus={() =>
                    handleInputFocus(phoneRef.current, "phone", 100)
                  }
                  onBlur={handleInputBlur}
                  onChangeText={(value) =>
                    updateField(
                      "phone",
                      value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="9876543210"
                  placeholderTextColor="#6B7280"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  autoComplete="tel-national"
                  maxLength={10}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  accessibilityLabel="Mobile number"
                  className="min-h-11 min-w-0 flex-1 text-sm text-gray-950"
                  style={webInputStyle}
                />
              </View>

              <FieldError message={errors.phone} />
            </View>

            {/* PASSWORD */}
            <View className="mt-3">
              <Text className="mb-1.5 text-xs font-bold text-gray-900">
                Password *
              </Text>

              <View
                className="flex-row items-center rounded-xl border pl-3 pr-1"
                style={getFieldStyle("password")}
              >
                <TextInput
                  ref={passwordRef}
                  value={form.password}
                  onFocus={() =>
                    handleInputFocus(
                      passwordRef.current,
                      "password",
                      130,
                    )
                  }
                  onBlur={handleInputBlur}
                  onChangeText={(value) =>
                    updateField("password", value)
                  }
                  placeholder="Create a password"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  autoComplete="new-password"
                  maxLength={128}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    confirmPasswordRef.current?.focus()
                  }
                  accessibilityLabel="Password"
                  className="min-h-11 min-w-0 flex-1 text-sm text-gray-950"
                  style={webInputStyle}
                />

                <PremiumPressable
                  onPress={() =>
                    setShowPassword((current) => !current)
                  }
                  className="rounded-lg border border-transparent px-2.5 py-2"
                  hoverClassName="border-gray-300 bg-gray-100"
                  pressedClassName="bg-gray-200"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <Text className="text-xs font-bold text-gray-950">
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </PremiumPressable>
              </View>

              <FieldError message={errors.password} />

              {!!form.password && (
                <View className="mt-2">
                  <View className="h-1.5 overflow-hidden rounded-full border border-gray-300 bg-gray-100">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: passwordStrength.width,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </View>

                  <Text
                    className="mt-1 text-xs font-bold"
                    style={{ color: passwordStrength.color }}
                  >
                    Password strength: {passwordStrength.label}
                  </Text>
                </View>
              )}

              <Text className="mt-1 text-xs leading-4 text-gray-600">
                Use at least 8 characters, uppercase, lowercase and a
                number.
              </Text>
            </View>

            {/* CONFIRM PASSWORD */}
            <View className="mt-3">
              <Text className="mb-1.5 text-xs font-bold text-gray-900">
                Confirm password *
              </Text>

              <View
                className="flex-row items-center rounded-xl border pl-3 pr-1"
                style={getFieldStyle("confirmPassword")}
              >
                <TextInput
                  ref={confirmPasswordRef}
                  value={form.confirmPassword}
                  onFocus={() =>
                    handleInputFocus(
                      confirmPasswordRef.current,
                      "confirmPassword",
                      230,
                    )
                  }
                  onBlur={handleInputBlur}
                  onChangeText={(value) =>
                    updateField("confirmPassword", value)
                  }
                  placeholder="Enter password again"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  autoComplete="new-password"
                  maxLength={128}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  accessibilityLabel="Confirm password"
                  className="min-h-11 min-w-0 flex-1 text-sm text-gray-950"
                  style={webInputStyle}
                />

                <PremiumPressable
                  onPress={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  className="rounded-lg border border-transparent px-2.5 py-2"
                  hoverClassName="border-gray-300 bg-gray-100"
                  pressedClassName="bg-gray-200"
                  accessibilityLabel={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  <Text className="text-xs font-bold text-gray-950">
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
                </PremiumPressable>
              </View>

              <FieldError message={errors.confirmPassword} />

              {!!form.confirmPassword &&
                form.password === form.confirmPassword && (
                  <Text className="mt-1 text-xs font-bold text-green-700">
                    ✓ Passwords match
                  </Text>
                )}
            </View>

            {/* TERMS */}
            <PremiumPressable
              onPress={() => {
                setAcceptedTerms((current) => !current);
                setRegistrationError("");
              }}
              accessibilityRole="checkbox"
              accessibilityLabel="Accept terms and privacy policy"
              accessibilityState={{ checked: acceptedTerms }}
              className="mt-4 flex-row items-start rounded-xl border border-transparent p-2"
              hoverClassName="border-gray-300 bg-gray-50"
              pressedClassName="bg-gray-100"
            >
              <View
                className={`mr-2 mt-0.5 h-5 w-5 items-center justify-center rounded border ${acceptedTerms
                  ? "border-black bg-black"
                  : "border-gray-500 bg-white"
                  }`}
              >
                {acceptedTerms && (
                  <Text className="text-xs font-bold text-white">
                    ✓
                  </Text>
                )}
              </View>

              <Text className="flex-1 text-xs leading-5 text-gray-700">
                I agree to the Terms of Service and Privacy Policy.
              </Text>
            </PremiumPressable>

            {/* REGISTER BUTTON */}
            <PremiumPressable
              disabled={submitting}
              onPress={handleRegister}
              accessibilityLabel="Create account"
              className={`mt-4 min-h-12 flex-row items-center justify-center rounded-xl border px-3 py-3 ${submitting
                ? "border-gray-500 bg-gray-500"
                : "border-black bg-black"
                }`}
              hoverClassName="border-gray-700 bg-gray-800"
              pressedClassName="bg-gray-900"
            >
              {submitting && (
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                  style={{ marginRight: 9 }}
                />
              )}

              <Text className="text-center text-sm font-extrabold text-white">
                {submitting
                  ? "Creating account..."
                  : accountType === "provider"
                    ? "Create provider account →"
                    : "Create customer account →"}
              </Text>
            </PremiumPressable>

            {/* SIGN IN LINK */}
            <View className="mt-4 flex-row flex-wrap items-center justify-center">
              <Text className="text-xs text-gray-600">
                Already have an account?{" "}
              </Text>

              <PremiumPressable
                onPress={goToLogin}
                accessibilityRole="link"
                className="rounded-lg border border-transparent px-2 py-1"
                hoverClassName="border-gray-300 bg-gray-100"
                pressedClassName="bg-gray-200"
              >
                <Text className="text-xs font-extrabold text-gray-950">
                  Sign in
                </Text>
              </PremiumPressable>
            </View>

            {/* SECURITY NOTE */}
            <View className="mt-4 flex-row items-start rounded-xl border border-gray-300 bg-gray-50 p-3">
              <Text className="mr-2 text-base text-gray-900">
                ⓘ
              </Text>

              <Text className="flex-1 text-xs leading-5 text-gray-600">
                Keep your password private. Your account information
                should only be entered on the official ServiGo app.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}