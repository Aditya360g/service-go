import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
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

type VerificationState = "idle" | "sending" | "verifying";

type InteractivePressableProps = {
  children: ReactNode;
  onPress: () => void;
  className: string;
  hoverClassName?: string;
  pressedClassName?: string;
  disabled?: boolean;
  accessibilityRole?: "button" | "link";
  accessibilityLabel?: string;
};

const DEMO_OTP = "123456";
const RESEND_SECONDS = 30;

const COLORS = {
  black: "#111827",
  blackHover: "#27272A",
  border: "#D1D5DB",
  page: "#F3F4F6",
  inputBackground: "#FFFFFF",
  muted: "#6B7280",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Desktop/web: hover effect.
 * Mobile: press effect.
 */
function InteractivePressable({
  children,
  onPress,
  className,
  hoverClassName = "",
  pressedClassName = "",
  disabled = false,
  accessibilityRole = "button",
  accessibilityLabel,
}: InteractivePressableProps) {
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
      accessibilityState={{ disabled }}
      className={combinedClassName}
    >
      {children}
    </Pressable>
  );
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim().toLowerCase());
}

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

function getFocusGlow(focused: boolean) {
  if (Platform.OS !== "web" || !focused) {
    return undefined;
  }

  return {
    boxShadow: "0 0 0 3px rgba(17, 24, 39, 0.12)",
  } as never;
}

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{
    email?: string | string[];
    otp?: string | string[];
  }>();

  const { width } = useWindowDimensions();

  const isSmallScreen = width < 380;
  const isWideScreen = width >= 850;

  const scrollRef = useRef<ScrollView>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const emailFromUrl = getParam(params.email);
  const otpFromUrl = getParam(params.otp);

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState(
    otpFromUrl.replace(/\D/g, "").slice(0, 6),
  );

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const [verificationState, setVerificationState] =
    useState<VerificationState>("idle");

  const [resendSeconds, setResendSeconds] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [codeRequested, setCodeRequested] = useState(
    Boolean(otpFromUrl),
  );

  const [isVerified, setIsVerified] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = setTimeout(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendSeconds]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }

      scrollTimer.current = setTimeout(() => {
        scrollRef.current?.scrollToEnd({
          animated: true,
        });
      }, 250);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  const validateEmail = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setEmailError("Email address is required.");
      return false;
    }

    if (!isValidEmail(cleanEmail)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validateOtp = () => {
    const cleanOtp = otp.replace(/\D/g, "");

    if (!cleanOtp) {
      setOtpError("Verification code is required.");
      return false;
    }

    if (cleanOtp.length !== 6) {
      setOtpError("Enter the complete 6-digit verification code.");
      return false;
    }

    setOtpError("");
    return true;
  };

  /**
   * FRONTEND DEMO:
   * No backend API request is made.
   * The screen simulates sending a code and shows the demo OTP.
   */
  const requestVerificationCode = async () => {
    if (verificationState !== "idle" || !validateEmail()) {
      return;
    }

    setVerificationState("sending");
    setError("");
    setOtpError("");
    setResponseMessage("");

    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      setCodeRequested(true);
      setResendSeconds(RESEND_SECONDS);
      setResponseMessage(
        `Demo mode: your verification code is ${DEMO_OTP}. Enter this code below to continue.`,
      );
      setOtp("");
    } catch {
      setError("Unable to prepare the demo verification code.");
    } finally {
      setVerificationState("idle");
    }
  };

  /**
   * FRONTEND DEMO:
   * Accepts 123456 only. No API call is made.
   */
  const verifyEmail = async () => {
    if (
      verificationState !== "idle" ||
      !validateEmail() ||
      !validateOtp()
    ) {
      return;
    }

    Keyboard.dismiss();

    setVerificationState("verifying");
    setError("");
    setOtpError("");

    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      if (otp.replace(/\D/g, "") !== DEMO_OTP) {
        setOtpError(
          `Incorrect demo code. Enter ${DEMO_OTP} to verify this screen.`,
        );
        return;
      }

      setResponseMessage(
        "Demo verification completed successfully. No account was verified on a backend.",
      );
      setIsVerified(true);
    } catch {
      setError("Unable to complete demo verification.");
    } finally {
      setVerificationState("idle");
    }
  };

  const handleResend = async () => {
    if (
      resendSeconds > 0 ||
      verificationState !== "idle"
    ) {
      return;
    }

    await requestVerificationCode();
  };

  const handleChangeEmail = () => {
    setCodeRequested(false);
    setOtp("");
    setOtpError("");
    setEmailError("");
    setError("");
    setResponseMessage("");
    setResendSeconds(0);
    setIsVerified(false);
    setEmailFocused(false);
    setOtpFocused(false);
  };

  const goToLogin = () => router.replace("/login");
  const goToHome = () => router.replace("/");
  const goToSupport = () => router.push("/support");

  if (isVerified) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: isSmallScreen ? 14 : 24,
          }}
        >
          <View
            className="w-full self-center overflow-hidden rounded-3xl border bg-white p-6"
            style={{
              maxWidth: 500,
              borderColor: COLORS.black,
              borderWidth: 1,
              shadowColor: COLORS.black,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.08,
              shadowRadius: 25,
              elevation: 4,
            }}
          >
            <View className="h-20 w-20 items-center justify-center self-center rounded-full border border-green-300 bg-green-50">
              <Text className="text-4xl font-bold text-green-700">
                ✓
              </Text>
            </View>

            <Text className="mt-5 text-center text-2xl font-extrabold text-gray-950">
              Demo verification complete
            </Text>

            <Text className="mt-2 text-center text-sm leading-6 text-gray-600">
              {responseMessage}
            </Text>

            <View className="mt-6 rounded-2xl border border-gray-300 bg-gray-50 p-4">
              <Text className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Email entered
              </Text>

              <Text className="mt-2 text-sm font-bold text-gray-950">
                {email.trim().toLowerCase()}
              </Text>

              <View className="mt-3 self-start rounded-full border border-green-300 bg-white px-3 py-1">
                <Text className="text-xs font-bold text-green-700">
                  ✓ Demo complete
                </Text>
              </View>
            </View>

            <InteractivePressable
              onPress={goToLogin}
              className="mt-6 min-h-12 items-center justify-center rounded-xl border border-black bg-black px-4 py-3"
              hoverClassName="border-gray-700 bg-gray-800"
              pressedClassName="bg-gray-900"
            >
              <Text className="font-bold text-white">
                Continue to login →
              </Text>
            </InteractivePressable>

            <InteractivePressable
              onPress={goToHome}
              className="mt-3 min-h-12 items-center justify-center rounded-xl border border-black bg-white px-4 py-3"
              hoverClassName="bg-gray-100"
              pressedClassName="bg-gray-200"
            >
              <Text className="font-bold text-gray-950">
                Back to home
              </Text>
            </InteractivePressable>

            <Text className="mt-5 text-center text-xs leading-5 text-gray-500">
              Frontend demo only. No account or email status was saved.
            </Text>
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
            justifyContent: keyboardVisible ? "flex-start" : "center",
            paddingHorizontal: isSmallScreen ? 12 : 20,
            paddingTop: keyboardVisible ? 8 : 24,
            paddingBottom: keyboardVisible ? 180 : 24,
          }}
        >
          {/* MAIN PREMIUM CARD */}
          <View
            className="w-full self-center overflow-hidden rounded-3xl border bg-white"
            style={{
              maxWidth: 980,
              flexDirection: isWideScreen ? "row" : "column",
              borderColor: COLORS.black,
              borderWidth: 1,
              shadowColor: COLORS.black,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.08,
              shadowRadius: 24,
              elevation: 4,
            }}
          >
            {/* DESKTOP PANEL */}
            {isWideScreen && (
              <View
                className="flex-1 bg-gray-950 p-8"
                style={{ flexBasis: 0 }}
              >
                <View className="self-start rounded-full border border-gray-600 bg-gray-800 px-3 py-2">
                  <Text className="text-xs font-bold uppercase tracking-widest text-white">
                    Account security
                  </Text>
                </View>

                <Text className="mt-6 text-3xl font-extrabold leading-tight text-white">
                  Verify your email address.
                </Text>

                <Text className="mt-4 text-sm leading-6 text-gray-300">
                  This frontend demo helps you preview the complete
                  email verification experience before connecting your
                  backend.
                </Text>

                <View className="mt-8 gap-5">
                  {[
                    {
                      number: "01",
                      title: "Enter your email",
                      description:
                        "Use the email you want to preview in this demo.",
                    },
                    {
                      number: "02",
                      title: "Display demo code",
                      description:
                        "The page will show a temporary test code.",
                    },
                    {
                      number: "03",
                      title: "Complete the flow",
                      description:
                        "Enter the demo code to see the success screen.",
                    },
                  ].map((item) => (
                    <View
                      key={item.number}
                      className="flex-row items-start"
                    >
                      <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl border border-gray-600 bg-gray-800">
                        <Text className="text-xs font-bold text-white">
                          {item.number}
                        </Text>
                      </View>

                      <View className="flex-1 pt-0.5">
                        <Text className="text-sm font-bold text-white">
                          {item.title}
                        </Text>

                        <Text className="mt-1 text-xs leading-5 text-gray-300">
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View className="mt-8 rounded-2xl border border-gray-700 bg-gray-900 p-4">
                  <Text className="text-sm font-bold text-white">
                    Frontend demo
                  </Text>

                  <Text className="mt-2 text-xs leading-5 text-gray-300">
                    No backend, database, email service or API URL is
                    required for this preview.
                  </Text>
                </View>
              </View>
            )}

            {/* FORM */}
            <View
              className="flex-1"
              style={{
                flexBasis: isWideScreen ? 0 : undefined,
                padding: isSmallScreen
                  ? 18
                  : isWideScreen
                    ? 32
                    : 24,
              }}
            >
              <View className="self-start rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5">
                <Text className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Email verification
                </Text>
              </View>

              <Text className="mt-4 text-2xl font-extrabold tracking-tight text-gray-950">
                Confirm your email
              </Text>

              <Text className="mt-2 text-sm leading-6 text-gray-600">
                {codeRequested
                  ? "Enter the demo verification code shown below."
                  : "Enter your email address to start the verification demo."}
              </Text>

              {!!error && (
                <View className="mt-5 rounded-2xl border border-red-400 bg-red-50 p-4">
                  <Text className="text-xs font-bold uppercase tracking-wide text-red-800">
                    Something went wrong
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-red-700">
                    {error}
                  </Text>
                </View>
              )}

              {!!responseMessage && !isVerified && (
                <View className="mt-5 rounded-2xl border border-gray-400 bg-gray-50 p-4">
                  <Text className="text-sm leading-5 text-gray-800">
                    {responseMessage}
                  </Text>
                </View>
              )}

              {/* EMAIL INPUT */}
              <View className="mt-6">
                <Text className="mb-2 text-sm font-bold text-gray-900">
                  Email address
                  <Text className="text-red-600"> *</Text>
                </Text>

                <View
                  className="flex-row items-center rounded-xl border px-3"
                  style={[
                    {
                      minHeight: 56,
                      borderWidth: emailFocused ? 1.8 : 1,
                      borderColor: emailError
                        ? "#DC2626"
                        : emailFocused
                          ? COLORS.black
                          : COLORS.border,
                      backgroundColor: emailFocused
                        ? "#F9FAFB"
                        : COLORS.inputBackground,
                    },
                    getFocusGlow(emailFocused),
                  ]}
                >
                  <Text
                    className={`mr-2 text-lg ${emailFocused ? "text-black" : "text-gray-500"
                      }`}
                  >
                    ✉
                  </Text>

                  <TextInput
                    value={email}
                    editable={!codeRequested}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onChangeText={(value) => {
                      setEmail(value);
                      setEmailError("");
                      setError("");
                      setResponseMessage("");
                    }}
                    placeholder="you@example.com"
                    placeholderTextColor="#6B7280"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    autoComplete="email"
                    maxLength={120}
                    accessibilityLabel="Email address"
                    returnKeyType="done"
                    className="min-h-12 min-w-0 flex-1 py-3 text-sm text-gray-950"
                    style={webInputStyle}
                    underlineColorAndroid="transparent"
                  />

                  {codeRequested && (
                    <View className="ml-2 h-6 w-6 items-center justify-center rounded-full border border-green-300 bg-green-50">
                      <Text className="text-xs font-bold text-green-700">
                        ✓
                      </Text>
                    </View>
                  )}
                </View>

                {!!emailError && (
                  <Text className="mt-2 text-xs font-medium text-red-600">
                    {emailError}
                  </Text>
                )}

                {codeRequested && (
                  <InteractivePressable
                    onPress={handleChangeEmail}
                    className="mt-2 self-start rounded-lg border border-transparent px-2 py-1"
                    hoverClassName="border-gray-300 bg-gray-100"
                    pressedClassName="bg-gray-200"
                  >
                    <Text className="text-sm font-bold text-gray-950">
                      ← Change email
                    </Text>
                  </InteractivePressable>
                )}
              </View>

              {/* SEND CODE */}
              {!codeRequested && (
                <InteractivePressable
                  disabled={verificationState !== "idle"}
                  onPress={requestVerificationCode}
                  className={`mt-5 min-h-12 flex-row items-center justify-center rounded-xl border px-4 py-3 ${verificationState === "sending"
                    ? "border-gray-500 bg-gray-500"
                    : "border-black bg-black"
                    }`}
                  hoverClassName="border-gray-700 bg-gray-800"
                  pressedClassName="bg-gray-900"
                  accessibilityLabel="Send demo verification code"
                >
                  {verificationState === "sending" && (
                    <ActivityIndicator
                      color="#FFFFFF"
                      size="small"
                      style={{ marginRight: 9 }}
                    />
                  )}

                  <Text className="text-center text-sm font-bold text-white">
                    {verificationState === "sending"
                      ? "Preparing demo code..."
                      : "Send verification code →"}
                  </Text>
                </InteractivePressable>
              )}

              {/* OTP AREA */}
              {codeRequested && (
                <>
                  {/* Demo code banner */}
                  <View className="mt-5 rounded-xl border border-dashed border-gray-500 bg-gray-50 p-4">
                    <Text className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Demo verification code
                    </Text>

                    <Text className="mt-2 text-2xl font-extrabold tracking-[6px] text-gray-950">
                      {DEMO_OTP}
                    </Text>

                    <Text className="mt-2 text-xs leading-5 text-gray-600">
                      Use this temporary code to test the frontend.
                      It is not sent by email.
                    </Text>
                  </View>

                  <View className="mt-5">
                    <Text className="mb-2 text-sm font-bold text-gray-900">
                      6-digit verification code
                      <Text className="text-red-600"> *</Text>
                    </Text>

                    <View
                      className="rounded-xl border px-3"
                      style={[
                        {
                          borderWidth: otpFocused ? 1.8 : 1,
                          borderColor: otpError
                            ? "#DC2626"
                            : otpFocused
                              ? COLORS.black
                              : COLORS.border,
                          backgroundColor: otpFocused
                            ? "#F9FAFB"
                            : COLORS.inputBackground,
                        },
                        getFocusGlow(otpFocused),
                      ]}
                    >
                      <TextInput
                        value={otp}
                        onFocus={() => {
                          setOtpFocused(true);

                          if (
                            Platform.OS !== "web" &&
                            scrollTimer.current
                          ) {
                            clearTimeout(scrollTimer.current);
                          }

                          if (Platform.OS !== "web") {
                            scrollTimer.current = setTimeout(() => {
                              scrollRef.current?.scrollToEnd({
                                animated: true,
                              });
                            }, 250);
                          }
                        }}
                        onBlur={() => setOtpFocused(false)}
                        onChangeText={(value) => {
                          setOtp(value.replace(/\D/g, "").slice(0, 6));
                          setOtpError("");
                          setError("");
                        }}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor="#6B7280"
                        keyboardType="number-pad"
                        maxLength={6}
                        textContentType="oneTimeCode"
                        autoComplete="one-time-code"
                        returnKeyType="done"
                        onSubmitEditing={verifyEmail}
                        accessibilityLabel="Six-digit verification code"
                        className="min-h-12 py-3 text-center text-lg font-bold tracking-widest text-gray-950"
                        style={webInputStyle}
                        underlineColorAndroid="transparent"
                      />
                    </View>

                    {!!otpError && (
                      <Text className="mt-2 text-xs font-medium text-red-600">
                        {otpError}
                      </Text>
                    )}

                    <Text className="mt-2 text-center text-xs leading-5 text-gray-500">
                      Enter all 6 digits shown in the demo code above.
                    </Text>
                  </View>

                  {/* OTP VISUAL BOXES */}
                  <View className="mt-4 flex-row justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => {
                      const digit = otp[index] ?? "";
                      const boxWidth = isSmallScreen ? 36 : 42;

                      return (
                        <View
                          key={index}
                          style={{
                            width: boxWidth,
                            height: 44,
                          }}
                          className={`items-center justify-center rounded-xl border ${digit
                            ? "border-black bg-gray-100"
                            : "border-gray-300 bg-white"
                            }`}
                        >
                          <Text
                            className={`text-base font-bold ${digit ? "text-gray-950" : "text-gray-400"
                              }`}
                          >
                            {digit || "•"}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* VERIFY BUTTON */}
                  <InteractivePressable
                    disabled={verificationState !== "idle"}
                    onPress={verifyEmail}
                    className={`mt-5 min-h-12 flex-row items-center justify-center rounded-xl border px-4 py-3 ${verificationState === "verifying"
                      ? "border-gray-500 bg-gray-500"
                      : "border-black bg-black"
                      }`}
                    hoverClassName="border-gray-700 bg-gray-800"
                    pressedClassName="bg-gray-900"
                    accessibilityLabel="Verify demo email"
                  >
                    {verificationState === "verifying" && (
                      <ActivityIndicator
                        color="#FFFFFF"
                        size="small"
                        style={{ marginRight: 9 }}
                      />
                    )}

                    <Text className="text-center text-sm font-bold text-white">
                      {verificationState === "verifying"
                        ? "Checking demo code..."
                        : "Verify email →"}
                    </Text>
                  </InteractivePressable>

                  {/* RESEND */}
                  <InteractivePressable
                    disabled={
                      resendSeconds > 0 ||
                      verificationState !== "idle"
                    }
                    onPress={handleResend}
                    className={`mt-3 min-h-12 items-center justify-center rounded-xl border px-3 py-3 ${resendSeconds > 0 ||
                      verificationState !== "idle"
                      ? "border-gray-300 bg-gray-100"
                      : "border-black bg-white"
                      }`}
                    hoverClassName="bg-gray-100"
                    pressedClassName="bg-gray-200"
                  >
                    <Text
                      className={`text-center text-sm font-bold ${resendSeconds > 0 ||
                        verificationState !== "idle"
                        ? "text-gray-500"
                        : "text-gray-950"
                        }`}
                    >
                      {verificationState === "sending"
                        ? "Preparing code..."
                        : resendSeconds > 0
                          ? `Resend code in ${resendSeconds}s`
                          : "↻ Resend verification code"}
                    </Text>
                  </InteractivePressable>
                </>
              )}

              {/* DIVIDER */}
              <View className="my-6 flex-row items-center">
                <View className="h-px flex-1 bg-gray-300" />

                <Text className="mx-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Account
                </Text>

                <View className="h-px flex-1 bg-gray-300" />
              </View>

              {/* BACK TO LOGIN */}
              <InteractivePressable
                onPress={goToLogin}
                className="min-h-12 items-center justify-center rounded-xl border border-black bg-white px-4 py-3"
                hoverClassName="bg-gray-100"
                pressedClassName="bg-gray-200"
              >
                <Text className="text-sm font-bold text-gray-950">
                  ← Back to login
                </Text>
              </InteractivePressable>

              {/* SUPPORT */}
              <View className="mt-5 rounded-2xl border border-gray-300 bg-gray-50 p-4">
                <Text className="text-sm font-bold text-gray-950">
                  Didn&apos;t receive the code?
                </Text>

                <Text className="mt-1 text-xs leading-5 text-gray-600">
                  This is a frontend preview, so no real email is sent.
                  The test code is displayed above.
                </Text>

                <InteractivePressable
                  onPress={goToSupport}
                  accessibilityRole="link"
                  className="mt-3 self-start rounded-lg border border-transparent px-2 py-1"
                  hoverClassName="border-gray-300 bg-white"
                  pressedClassName="bg-gray-200"
                >
                  <Text className="text-sm font-bold text-gray-950">
                    Contact support →
                  </Text>
                </InteractivePressable>
              </View>

              <Text className="mt-5 text-center text-xs leading-5 text-gray-500">
                Frontend demo only. No email is sent and no account
                verification is saved.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}