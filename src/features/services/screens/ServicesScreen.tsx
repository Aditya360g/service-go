import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMemo, useState } from "react";

type Service = {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
};

const services: Service[] = [
  {
    id: 1,
    name: "Home Cleaning",
    description: "Professional cleaning for your home.",
    icon: "🧹",
    category: "Cleaning",
  },
  {
    id: 2,
    name: "Electrician",
    description: "Electrical repairs, fittings and installations.",
    icon: "⚡",
    category: "Electrical",
  },
  {
    id: 3,
    name: "Plumber",
    description: "Leak repairs, pipe fitting and plumbing work.",
    icon: "🔧",
    category: "Plumbing",
  },
  {
    id: 4,
    name: "AC Repair",
    description: "AC service, repair and installation.",
    icon: "❄️",
    category: "Appliance",
  },
  {
    id: 5,
    name: "Washing Machine Repair",
    description: "Repair and maintenance for washing machines.",
    icon: "🫧",
    category: "Appliance",
  },
  {
    id: 6,
    name: "Painting",
    description: "Interior and exterior home painting.",
    icon: "🎨",
    category: "Painting",
  },
  {
    id: 7,
    name: "Carpenter",
    description: "Furniture repair and custom wood work.",
    icon: "🪚",
    category: "Carpentry",
  },
  {
    id: 8,
    name: "Bathroom Cleaning",
    description: "Deep cleaning for bathrooms and washrooms.",
    icon: "🚿",
    category: "Cleaning",
  },
];

export default function ServicesScreen() {
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return services;
    }

    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );
  }, [search]);

  const openService = (serviceId: number) => {
    router.push(`/services/${serviceId}`);
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="border-b border-slate-200 bg-white px-5 py-5">
        <View
          className="mx-auto w-full"
          style={{ maxWidth: 1200 }}
        >
          <Pressable
            onPress={() => router.back()}
            className="mb-4 self-start"
          >
            <Text className="font-semibold text-blue-600">
              ← Back
            </Text>
          </Pressable>

          <Text className="text-3xl font-bold text-slate-900">
            Services
          </Text>

          <Text className="mt-2 text-base text-slate-500">
            Find the right professional service for your home.
          </Text>
        </View>
      </View>

      <View
        className="mx-auto w-full px-5 py-8"
        style={{ maxWidth: 1200 }}
      >
        {/* Search */}
        <View className="mb-8 rounded-2xl border border-slate-200 bg-white p-3">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search cleaning, plumber, AC repair..."
            placeholderTextColor="#94a3b8"
            className="px-3 py-3 text-base text-slate-900 outline-none"
          />
        </View>

        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-slate-900">
            Available Services
          </Text>

          <Text className="text-sm text-slate-500">
            {filteredServices.length} services
          </Text>
        </View>

        {/* Services Grid */}
        <View className="flex-row flex-wrap gap-4">
          {filteredServices.map((service) => (
            <Pressable
              key={service.id}
              onPress={() => openService(service.id)}
              className="rounded-2xl border border-slate-200 bg-white p-5"
              style={{
                minWidth: 240,
                flexBasis: 280,
                flexGrow: 1,
              }}
            >
              <View className="mb-5 h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <Text className="text-3xl">{service.icon}</Text>
              </View>

              <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                {service.category}
              </Text>

              <Text className="mb-2 text-lg font-bold text-slate-900">
                {service.name}
              </Text>

              <Text className="mb-5 leading-6 text-slate-500">
                {service.description}
              </Text>

              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-blue-600">
                  View details
                </Text>

                <Text className="text-lg text-slate-400">
                  →
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {filteredServices.length === 0 && (
          <View className="items-center rounded-2xl border border-slate-200 bg-white px-5 py-16">
            <Text className="text-lg font-bold text-slate-900">
              No services found
            </Text>

            <Text className="mt-2 text-center text-slate-500">
              Try searching with another service name.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}