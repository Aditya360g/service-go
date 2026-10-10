
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type DimensionValue,
} from "react-native";

type ResetPasswordForm = {
  email: string;
  resetCode: string;
  password: string;
  confirmPassword: string;
};

type ResetPasswordErrors = Partial<
  Record<keyof ResetPasswordForm, string>
>;

type PasswordStrength = {
  label: string;
  width: DimensionValue;
  barClass: string;
  textClass: string;
};

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim().toLowerCase()
  );
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return {
      label: "Weak",
      width: "20%",
      barClass: "bg-red-500",
      textClass: "text-red-600",
    };
  }

  if (score === 2) {
    return {
      label: "Fair",
      width: "40%",
      barClass: "bg-orange-500",
      textClass: "text-orange-600",
    };
  }

  if (score === 3) {
    return {
      label: "Good",
      width: "60%",
      barClass: "bg-amber-500",
      textClass: "text-amber-600",
    };
  }

  if (score === 4) {
    return {
      label: "Strong",
      width: "80%",
      barClass: "bg-green-500",
      textClass: "text-green-600",
    };
  }

  return {
    label: "Very Strong",
    width: "100%",
    barClass: "bg-green-600",
    textClass: "text-green-700",
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <Text accessibilityRole="alert" className="mt-1 text-sm text-red-600">
      {message}
    </Text>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-sm font-bold text-slate-700">
      {children} <Text className="text-red-500">*</Text>
    </Text>
  );
}

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{
    email?: string | string[];
    token?: string | string[];
    otp?: string | string[];
  }>();

  const { width } = useWindowDimensions();
  const isWideScreen = width >= 800;
  const horizontalPadding = width < 360 ? 14 : 20;
  const cardPadding = width < 360 ? 16 : 24;

  const emailFromUrl = getParam(params.email);
  const tokenFromUrl = getParam(params.token);
  const otpFromUrl = getParam(params.otp);

  const [form, setForm] = useState<ResetPasswordForm>({
    email: emailFromUrl,
    resetCode: otpFromUrl || tokenFromUrl,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  const updateField = <K extends keyof ResetPasswordForm>(
    field: K,
    value: ResetPasswordForm[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setError("");
  };

  const validateForm = () => {
    const nextErrors: ResetPasswordErrors = {};
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanCode = form.resetCode.trim();

    if (!cleanEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!isValidEmail(cleanEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!cleanCode) {
      nextErrors.resetCode = "Reset code or OTP is required.";
    } else if (cleanCode.length < 4) {
      nextErrors.resetCode = "Please enter a valid reset code.";
    }

    if (form.password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
    } else if (!/[A-Z]/.test(form.password)) {
      nextErrors.password = "Include at least one uppercase letter.";
    } else if (!/[a-z]/.test(form.password)) {
      nextErrors.password = "Include at least one lowercase letter.";
    } else if (!/\d/.test(form.password)) {
      nextErrors.password = "Include at least one number.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (resetting || !validateForm()) return;

    setResetting(true);
    setError("");

    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        code: form.resetCode.trim(),
        new_password: form.password,
      };

      /*
       * DEMO MODE ONLY.
       *
       * Replace this with your real backend request.
       * Example:
       *
       * await authApi.resetPassword({
       *   email: payload.email,
       *   otp: payload.code,
       *   new_password: payload.new_password,
       * });
       */

      console.log("Reset password request:", {
        email: payload.email,
        codeProvided: Boolean(payload.code),
      });

      await new Promise((resolve) => setTimeout(resolve, 700));
      setSuccess(true);
    } catch (resetError: unknown) {
      console.error("Reset password error:", resetError);

      const message =
        resetError instanceof Error
          ? resetError.message
          : "Unable to reset password.";

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("otp") ||
        lowerMessage.includes("token") ||
        lowerMessage.includes("code")
      ) {
        setErrors((current) => ({
          ...current,
          resetCode: message,
        }));
      } else {
        setError(message);

        if (Platform.OS !== "web") {
          Alert.alert("Reset Failed", message);
        }
      }
    } finally {
      setResetting(false);
    }
  };

  const goToForgotPassword = () => {
    router.push({
      pathname: "/forgot-password",
      params: {
        email: form.email.trim().toLowerCase(),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 bg-slate-50"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 24,
        }}
      >
        {/* HEADER */}
        <View className="border-b border-slate-200 bg-white px-4 py-3">
          <View
            className="mx-auto w-full flex-row items-center justify-between"
            style={{ maxWidth: 1100 }}
          >
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              className="rounded-xl px-3 py-2"
            >
              <Text className="font-semibold text-blue-600">
                ← Back
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/")}
              accessibilityRole="button"
            >
              <Text className="text-xl font-bold text-blue-600">
                ServiGo
              </Text>
            </Pressable>
          </View>
        </View>

        {/* SUCCESS SCREEN */}
        {success ? (
          <View
            className="flex-1 items-center justify-center py-8"
            style={{ paddingHorizontal: horizontalPadding }}
          >
            <View
              className="w-full rounded-3xl border border-green-200 bg-white"
              style={{
                maxWidth: 560,
                padding: cardPadding,
              }}
            >
              <View className="items-center">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Text className="text-3xl font-bold text-green-700">
                    ✓
                  </Text>
                </View>

                <Text className="mt-5 text-center text-2xl font-bold text-slate-900">
                  Password Reset Successful
                </Text>

                <Text className="mt-3 text-center text-sm leading-6 text-slate-500">
                  Your password has been changed successfully.
                  You can now log in with your new password.
                </Text>

                <View className="mt-6 w-full rounded-2xl bg-slate-50 p-4">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Account
                  </Text>

                  <Text selectable className="mt-2 font-bold text-slate-900">
                    {form.email.trim().toLowerCase()}
                  </Text>
                </View>

                <Pressable
                  onPress={() => router.replace("/login")}
                  accessibilityRole="button"
                  className="mt-6 min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-4"
                >
                  <Text className="text-center font-bold text-white">
                    Login with New Password
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.replace("/")}
                  accessibilityRole="button"
                  className="mt-3 px-4 py-3"
                >
                  <Text className="font-semibold text-slate-500">
                    Back to Home
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          /* RESET FORM */
          <View
            className="flex-1 items-center justify-center py-7"
            style={{ paddingHorizontal: horizontalPadding }}
          >
            <View
              className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white"
              style={{ maxWidth: 980 }}
            >
              {/* DESKTOP-ONLY INFORMATION PANEL */}
              {isWideScreen && (
                <View className="flex-row">
                  <View className="flex-1 bg-slate-900 p-8">
                    <Text className="text-sm font-semibold uppercase tracking-widest text-blue-300">
                      Account Recovery
                    </Text>

                    <Text className="mt-4 text-3xl font-bold leading-tight text-white">
                      Create a new{"\n"}password.
                    </Text>

                    <Text className="mt-4 text-sm leading-6 text-slate-300">
                      Verify your reset code and choose a strong
                      password to secure your ServiGo account.
                    </Text>

                    <View className="mt-8 gap-5">
                      {[
                        "Verify your account email",
                        "Enter reset code or OTP",
                        "Set your new password",
                      ].map((item, index) => (
                        <View key={item} className="flex-row items-center">
                          <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-slate-800">
                            <Text className="font-bold text-white">
                              {index + 1}
                            </Text>
                          </View>
                          <Text className="flex-1 text-sm text-slate-300">
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View className="mt-10 rounded-2xl bg-slate-800 p-4">
                      <Text className="font-bold text-white">
                        Security Tip
                      </Text>
                      <Text className="mt-2 text-sm leading-6 text-slate-300">
                        Never share your OTP, reset code, or password
                        with anyone.
                      </Text>
                    </View>
                  </View>

                  <View className="flex-1" />
                </View>
              )}

              <View
                className="w-full"
                style={{
                  padding: cardPadding,
                  maxWidth: isWideScreen ? 620 : undefined,
                  alignSelf: isWideScreen ? "flex-end" : "auto",
                  marginTop: isWideScreen ? -1 : 0,
                }}
              >
                <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Account Recovery
                </Text>

                <Text className="mt-2 text-2xl font-bold text-slate-900">
                  Set New Password
                </Text>

                <Text className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your reset code and create a secure password.
                </Text>

                {!!error && (
                  <View className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                    <Text className="font-bold text-red-700">
                      Reset Failed
                    </Text>
                    <Text className="mt-1 text-sm leading-5 text-red-600">
                      {error}
                    </Text>
                  </View>
                )}

                {/* EMAIL */}
                <View className="mt-6">
                  <FieldLabel>Email Address</FieldLabel>
                  <View
                    className={`rounded-xl border bg-white px-4 ${errors.email
                      ? "border-red-400"
                      : "border-slate-200"
                      }`}
                  >
                    <TextInput
                      value={form.email}
                      onChangeText={(value) => updateField("email", value)}
                      placeholder="you@example.com"
                      placeholderTextColor="#94a3b8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="emailAddress"
                      autoComplete="email"
                      maxLength={120}
                      returnKeyType="next"
                      className="py-4 text-base text-slate-900"
                    />
                  </View>
                  <FieldError message={errors.email} />
                </View>

                {/* RESET CODE */}
                <View className="mt-5">
                  <View className="mb-2 flex-row flex-wrap items-center justify-between gap-2">
                    <FieldLabel>Reset Code / OTP</FieldLabel>
                    <Pressable
                      onPress={goToForgotPassword}
                      accessibilityRole="button"
                      className="py-1"
                    >
                      <Text className="text-sm font-semibold text-blue-600">
                        Request New Code
                      </Text>
                    </Pressable>
                  </View>

                  <View
                    className={`rounded-xl border bg-white px-4 ${errors.resetCode
                      ? "border-red-400"
                      : "border-slate-200"
                      }`}
                  >
                    <TextInput
                      value={form.resetCode}
                      onChangeText={(value) =>
                        updateField("resetCode", value)
                      }
                      placeholder="Enter OTP or reset token"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={200}
                      returnKeyType="next"
                      className="py-4 text-base text-slate-900"
                    />
                  </View>

                  <FieldError message={errors.resetCode} />
                  <Text className="mt-2 text-xs leading-5 text-slate-400">
                    Enter the code provided by your password reset flow.
                  </Text>
                </View>

                {/* NEW PASSWORD */}
                <View className="mt-5">
                  <FieldLabel>New Password</FieldLabel>
                  <View
                    className={`flex-row items-center rounded-xl border bg-white px-4 ${errors.password
                      ? "border-red-400"
                      : "border-slate-200"
                      }`}
                  >
                    <TextInput
                      value={form.password}
                      onChangeText={(value) =>
                        updateField("password", value)
                      }
                      placeholder="Enter new password"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      autoComplete="new-password"
                      maxLength={128}
                      returnKeyType="next"
                      className="flex-1 py-4 text-base text-slate-900"
                    />

                    <Pressable
                      onPress={() =>
                        setShowPassword((current) => !current)
                      }
                      accessibilityRole="button"
                      className="ml-2 px-2 py-2"
                    >
                      <Text className="font-semibold text-blue-600">
                        {showPassword ? "Hide" : "Show"}
                      </Text>
                    </Pressable>
                  </View>

                  <FieldError message={errors.password} />

                  {!!form.password && (
                    <View className="mt-3">
                      <View className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <View
                          className={`h-full rounded-full ${passwordStrength.barClass}`}
                          style={{ width: passwordStrength.width }}
                        />
                      </View>
                      <Text
                        className={`mt-2 text-xs font-semibold ${passwordStrength.textClass}`}
                      >
                        Password strength: {passwordStrength.label}
                      </Text>
                    </View>
                  )}

                  <View className="mt-3 rounded-xl bg-slate-50 p-4">
                    <Text className="text-xs font-semibold text-slate-600">
                      Your password should include:
                    </Text>
                    <Text className="mt-2 text-xs leading-5 text-slate-500">
                      • At least 8 characters{"\n"}
                      • One uppercase letter{"\n"}
                      • One lowercase letter{"\n"}
                      • One number
                    </Text>
                  </View>
                </View>

                {/* CONFIRM PASSWORD */}
                <View className="mt-5">
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <View
                    className={`flex-row items-center rounded-xl border bg-white px-4 ${errors.confirmPassword
                      ? "border-red-400"
                      : "border-slate-200"
                      }`}
                  >
                    <TextInput
                      value={form.confirmPassword}
                      onChangeText={(value) =>
                        updateField("confirmPassword", value)
                      }
                      placeholder="Enter password again"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      maxLength={128}
                      returnKeyType="done"
                      onSubmitEditing={handleResetPassword}
                      className="flex-1 py-4 text-base text-slate-900"
                    />

                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      accessibilityRole="button"
                      className="ml-2 px-2 py-2"
                    >
                      <Text className="font-semibold text-blue-600">
                        {showConfirmPassword ? "Hide" : "Show"}
                      </Text>
                    </Pressable>
                  </View>

                  <FieldError message={errors.confirmPassword} />

                  {!!form.confirmPassword &&
                    form.password === form.confirmPassword && (
                      <Text className="mt-2 text-xs font-semibold text-green-600">
                        ✓ Passwords match
                      </Text>
                    )}
                </View>

                {/* SUBMIT */}
                <Pressable
                  disabled={resetting}
                  onPress={handleResetPassword}
                  accessibilityRole="button"
                  className={`mt-7 min-h-12 items-center justify-center rounded-xl px-4 py-4 ${resetting ? "bg-blue-400" : "bg-blue-600"
                    }`}
                  style={({ pressed }) => ({
                    opacity: pressed && !resetting ? 0.85 : 1,
                  })}
                >
                  <Text className="text-center font-bold text-white">
                    {resetting ? "Resetting Password..." : "Reset Password"}
                  </Text>
                </Pressable>

                <Pressable
                  disabled={resetting}
                  onPress={() => router.replace("/login")}
                  accessibilityRole="button"
                  className="mt-3 min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-4"
                >
                  <Text className="text-center font-bold text-slate-700">
                    Back to Login
                  </Text>
                </Pressable>

                {/* SECURITY NOTE */}
                <View className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
                  <Text className="font-bold text-green-800">
                    Secure Password Reset
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-green-700">
                    Your backend must validate the reset code before
                    changing the password and store only a secure
                    password hash.
                  </Text>
                </View>

                {/* SUPPORT */}
                <View className="mt-5 items-center">
                  <Text className="text-center text-sm text-slate-500">
                    Having trouble resetting your password?
                  </Text>
                  <Pressable
                    onPress={() => router.push("/support")}
                    accessibilityRole="button"
                    className="mt-1 px-4 py-2"
                  >
                    <Text className="font-semibold text-blue-600">
                      Contact ServiGo Support
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}