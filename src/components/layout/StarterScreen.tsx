import { Link } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function StarterScreen({ title }: { title: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6 py-12">
      <Animated.View
        entering={FadeInDown.duration(450)}
        style={{ width: "100%", maxWidth: 640 }}
      >
        <View className="rounded-3xl border border-blue-100 bg-white p-8">
          <Text className="mb-4 text-xl font-bold text-brand-600">
            ServiGo
          </Text>
          <Text className="mb-4 text-3xl font-bold text-slate-900">
            {title}
          </Text>
          <Text className="mb-6 text-base leading-7 text-slate-500">
            Web + Android foundation is ready.
            This screen is a placeholder.
          </Text>
          <Link href="/" className="py-3 text-base font-semibold text-brand-600">
            Go to home
          </Link>
        </View>
      </Animated.View>
    </View>
  );
}

