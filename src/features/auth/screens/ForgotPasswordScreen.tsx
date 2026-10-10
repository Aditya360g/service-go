import { router } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
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

type ForgotPasswordResponse = {
  message: string;
  resetToken?: string;
  otp?: string;
};

type PremiumPressableProps = {
  children: ReactNode;
  onPress: () => void;
  className?: string;
  hoverClassName?: string;
  pressedClassName?: string;
  disabled?: boolean;
  accessibilityRole?: "button" | "link";
  accessibilityLabel?: string;
};

const RESEND_SECONDS = 30;

const COLORS = {
  page: "#F1F6FD",
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  text: "#172B4D",
  muted: "#70829B",
  border: "#D5E3F3",
  input: "#F8FBFF",
};

/**
 * Desktop/web: hover effect.
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
      accessibilityState={{ disabled }}
      className={currentClassName}
    >
      {children}
    </Pressable>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim().toLowerCase(),
  );
}

const webInputStyle =
  Platform.OS === "web"
    ? ({
      outlineStyle: "none",
      outlineWidth: 0,
      borderWidth: 0,
      backgroundColor: "transparent",
      boxShadow: "none",
    } as never)
    : undefined;

function getFocusGlow(focused: boolean) {
  if (Platform.OS !== "web" || !focused) {
    return undefined;
  }

  return {
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.13)",
  } as never;
}

export default function ForgotPasswordScreen() {
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const horizontalPadding = isSmallScreen ? 14 : width >= 768 ? 28 : 20;
  const cardPadding = isSmallScreen ? 17 : width >= 768 ? 30 : 23;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = setTimeout(() => {
      setResendSeconds((current) =>
        current > 0 ? current - 1 : 0,
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendSeconds]);

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

  const requestPasswordReset = async () => {
    if (sending || !validateEmail()) return;

    setSending(true);
    setError("");

    try {
      const payload = {
        email: email.trim().toLowerCase(),
      };

      /*
       * DEMO MODE:
       * Replace this block with your actual backend API.
       *
       * Example:
       * const response = await authApi.forgotPassword(payload);
       * const data: ForgotPasswordResponse = response.data;
       */

      console.log("Forgot password payload:", payload);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockResponse: ForgotPasswordResponse = {
        message:
          "If an account exists for this email, password reset instructions have been sent.",
      };

      setResponseMessage(mockResponse.message);
      setSent(true);
      setResendSeconds(RESEND_SECONDS);
    } catch (requestError: unknown) {
      console.error("Forgot password error:", requestError);

      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to request password reset.";

      setError(message);
    } finally {
      setSending(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0 || sending) return;
    await requestPasswordReset();
  };

  const changeEmail = () => {
    setSent(false);
    setResponseMessage("");
    setError("");
    setEmailError("");
    setResendSeconds(0);
  };

  const openLogin = () => router.replace("/login");
  const openHome = () => router.replace("/");
  const openSupport = () => router.push("/support");

  const requestResetBorder = emailError
    ? "#F87171"
    : emailFocused
      ? "#3B82F6"
      : COLORS.border;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: COLORS.page }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 24,
        }}
      >
        {/* HEADER */}
        <View
          className="border-b bg-white px-4 py-3"
          style={{ borderColor: "#E0EAF6" }}
        >
          <View
            className="mx-auto w-full flex-row items-center justify-between"
            style={{ maxWidth: 1100 }}
          >
            <PremiumPressable
              onPress={() => router.back()}
              accessibilityLabel="Go back"
              className="rounded-xl border border-transparent px-3 py-2.5"
              hoverClassName="border-blue-100 bg-blue-50"
              pressedClassName="bg-blue-100"
            >
              <Text className="font-semibold text-blue-600">
                ← Back
              </Text>
            </PremiumPressable>

            <PremiumPressable
              onPress={openHome}
              accessibilityLabel="ServiGo home"
              className="rounded-xl border border-transparent px-3 py-2.5"
              hoverClassName="border-blue-100 bg-blue-50"
              pressedClassName="bg-blue-100"
            >
              <Text className="text-xl font-extrabold tracking-tight text-blue-600">
                ServiGo
              </Text>
            </PremiumPressable>
          </View>
        </View>

        {/* PAGE CONTENT */}
        <View
          className="flex-1 items-center justify-center py-8"
          style={{ paddingHorizontal: horizontalPadding }}
        >
          <View className="w-full" style={{ maxWidth: 520 }}>
            {!sent ? (
              <>
                {/* INTRO */}
                <View className="items-center">
                  <View
                    className="h-16 w-16 items-center justify-center rounded-2xl border bg-blue-50"
                    style={{
                      borderColor: "#D8E7FF",
                      shadowColor: "#2563EB",
                      shadowOffset: { width: 0, height: 5 },
                      shadowOpacity: 0.08,
                      shadowRadius: 12,
                      elevation: 2,
                    }}
                  >
                    <Text className="text-3xl">🔐</Text>
                  </View>

                  <Text className="mt-5 text-center text-2xl font-extrabold tracking-tight text-slate-900">
                    Forgot Password?
                  </Text>

                  <Text className="mt-3 max-w-sm text-center text-sm leading-6 text-slate-500">
                    Enter the email linked to your ServiGo account
                    and we&apos;ll help you reset your password.
                  </Text>
                </View>

                {/* FORM CARD */}
                <View
                  className="mt-7 rounded-3xl border bg-white"
                  style={{
                    padding: cardPadding,
                    borderColor: "#D9E5F3",
                    shadowColor: "#416B9C",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.09,
                    shadowRadius: 26,
                    elevation: 4,
                  }}
                >
                  <Text className="text-sm font-bold text-slate-700">
                    Email address
                    <Text className="text-red-500"> *</Text>
                  </Text>

                  {/* EMAIL INPUT */}
                  <View
                    className="mt-2 flex-row items-center rounded-xl px-4"
                    style={[
                      {
                        minHeight: 56,
                        borderWidth: emailFocused ? 1.5 : 1,
                        borderColor: requestResetBorder,
                        backgroundColor: emailFocused
                          ? "#F3F8FF"
                          : COLORS.input,
                      },
                      getFocusGlow(emailFocused),
                    ]}
                  >
                    <Text
                      className={`mr-3 text-lg ${emailFocused ? "text-blue-600" : "text-slate-400"
                        }`}
                    >
                      ✉
                    </Text>

                    <TextInput
                      value={email}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      onChangeText={(value) => {
                        setEmail(value);
                        setEmailError("");
                        setError("");
                      }}
                      onSubmitEditing={requestPasswordReset}
                      placeholder="you@example.com"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      autoComplete="email"
                      maxLength={120}
                      returnKeyType="send"
                      accessibilityLabel="Email address"
                      className="flex-1 text-base text-slate-900"
                      style={webInputStyle}
                      underlineColorAndroid="transparent"
                    />
                  </View>

                  {!!emailError && (
                    <Text
                      accessibilityRole="alert"
                      className="mt-2 text-sm font-medium text-red-600"
                    >
                      {emailError}
                    </Text>
                  )}

                  {!!error && (
                    <View className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                      <Text className="text-sm leading-5 text-red-700">
                        {error}
                      </Text>
                    </View>
                  )}

                  {/* SEND RESET INSTRUCTIONS */}
                  <PremiumPressable
                    disabled={sending}
                    onPress={requestPasswordReset}
                    accessibilityLabel="Send reset instructions"
                    className={`mt-6 min-h-12 flex-row items-center justify-center rounded-xl border px-4 py-4 ${sending
                      ? "border-blue-400 bg-blue-400"
                      : "border-blue-600 bg-blue-600"
                      }`}
                    hoverClassName="border-blue-700 bg-blue-700"
                    pressedClassName="bg-blue-800"
                  >
                    {sending && (
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                        style={{ marginRight: 9 }}
                      />
                    )}

                    <Text className="text-center font-bold text-white">
                      {sending
                        ? "Sending..."
                        : "Send Reset Instructions  →"}
                    </Text>
                  </PremiumPressable>

                  {/* DIVIDER */}
                  <View className="my-5 flex-row items-center">
                    <View className="h-px flex-1 bg-slate-200" />

                    <Text className="mx-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                      or
                    </Text>

                    <View className="h-px flex-1 bg-slate-200" />
                  </View>

                  {/* BACK TO LOGIN */}
                  <PremiumPressable
                    onPress={openLogin}
                    className="min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-4"
                    hoverClassName="border-blue-300 bg-blue-50"
                    pressedClassName="bg-blue-100"
                  >
                    <Text className="text-center font-bold text-slate-700">
                      ← Back to Login
                    </Text>
                  </PremiumPressable>
                </View>

                {/* SECURITY NOTE */}
                <View className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <Text className="font-bold text-blue-800">
                    <Text className="mr-1">ⓘ </Text>
                    Account Security
                  </Text>

                  <Text className="mt-2 text-sm leading-6 text-blue-700">
                    For security, the app should show the same
                    confirmation message whether or not an account
                    exists for the email address.
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* SUCCESS CARD */}
                <View
                  className="rounded-3xl border bg-white"
                  style={{
                    padding: cardPadding,
                    borderColor: "#BBF7D0",
                    shadowColor: "#166534",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.07,
                    shadowRadius: 24,
                    elevation: 4,
                  }}
                >
                  <View className="items-center">
                    <View className="h-16 w-16 items-center justify-center rounded-full border border-green-200 bg-green-50">
                      <Text className="text-3xl font-bold text-green-700">
                        ✓
                      </Text>
                    </View>

                    <Text className="mt-5 text-center text-2xl font-extrabold text-slate-900">
                      Check Your Email
                    </Text>

                    <Text className="mt-3 text-center text-sm leading-6 text-slate-500">
                      {responseMessage}
                    </Text>

                    {/* EMAIL SUMMARY */}
                    <View className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Reset requested for
                      </Text>

                      <Text
                        selectable
                        className="mt-2 font-semibold text-slate-900"
                      >
                        {email.trim().toLowerCase()}
                      </Text>
                    </View>

                    {/* CONTINUE TO RESET */}
                    <PremiumPressable
                      onPress={() =>
                        router.push({
                          pathname: "/reset-password",
                          params: {
                            email: email.trim().toLowerCase(),
                          },
                        })
                      }
                      className="mt-5 min-h-12 w-full items-center justify-center rounded-xl border border-blue-600 bg-blue-600 px-4 py-4"
                      hoverClassName="border-blue-700 bg-blue-700"
                      pressedClassName="bg-blue-800"
                    >
                      <Text className="text-center font-bold text-white">
                        Continue to Reset Password  →
                      </Text>
                    </PremiumPressable>

                    {/* RESEND */}
                    <PremiumPressable
                      disabled={resendSeconds > 0 || sending}
                      onPress={handleResend}
                      className={`mt-3 min-h-12 w-full items-center justify-center rounded-xl border px-4 py-4 ${resendSeconds > 0 || sending
                        ? "border-slate-200 bg-slate-100"
                        : "border-blue-200 bg-blue-50"
                        }`}
                      hoverClassName={
                        resendSeconds > 0 || sending
                          ? ""
                          : "border-blue-300 bg-blue-100"
                      }
                      pressedClassName="bg-blue-200"
                    >
                      <Text
                        className={`text-center font-bold ${resendSeconds > 0 || sending
                          ? "text-slate-400"
                          : "text-blue-700"
                          }`}
                      >
                        {sending
                          ? "Sending..."
                          : resendSeconds > 0
                            ? `Resend in ${resendSeconds}s`
                            : "↻ Resend Reset Instructions"}
                      </Text>
                    </PremiumPressable>

                    {/* CHANGE EMAIL */}
                    <PremiumPressable
                      onPress={changeEmail}
                      className="mt-2 rounded-xl border border-transparent px-4 py-3"
                      hoverClassName="border-blue-100 bg-blue-50"
                      pressedClassName="bg-blue-100"
                    >
                      <Text className="text-center font-semibold text-blue-600">
                        Use Different Email
                      </Text>
                    </PremiumPressable>

                    {/* BACK TO LOGIN */}
                    <PremiumPressable
                      onPress={openLogin}
                      className="rounded-xl border border-transparent px-4 py-3"
                      hoverClassName="border-slate-200 bg-slate-50"
                      pressedClassName="bg-slate-100"
                    >
                      <Text className="text-center font-semibold text-slate-500">
                        ← Back to Login
                      </Text>
                    </PremiumPressable>
                  </View>
                </View>

                {/* HELP CARD */}
                <View className="mt-4 rounded-2xl border border-slate-700 bg-slate-900 p-5">
                  <Text className="text-lg font-bold text-white">
                    Didn&apos;t receive anything?
                  </Text>

                  <Text className="mt-2 text-sm leading-6 text-slate-300">
                    Check your spam folder, verify your email address,
                    or try resending the reset instructions.
                  </Text>

                  <PremiumPressable
                    onPress={openSupport}
                    className="mt-3 self-start rounded-lg border border-transparent px-3 py-2"
                    hoverClassName="border-slate-600 bg-slate-800"
                    pressedClassName="bg-slate-700"
                  >
                    <Text className="font-semibold text-blue-300">
                      Contact Support  →
                    </Text>
                  </PremiumPressable>
                </View>
              </>
            )}

            <Text className="mt-6 text-center text-xs leading-5 text-slate-400">
              Keep your account secure. Never share your password or
              verification codes.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}