import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type Service = {
  id: number;
  name: string;
  category: string;
  icon: string;
  shortDescription: string;
  description: string;
  startingPrice: number;
  duration: string;
  benefits: string[];
  includes: string[];
};

const services: Service[] = [
  {
    id: 1,
    name: "Home Cleaning",
    category: "Cleaning",
    icon: "🧹",
    shortDescription: "Professional cleaning for your home.",
    description:
      "Get your home professionally cleaned by trusted ServiGo experts. Choose experienced professionals for regular cleaning, deep cleaning and complete home care.",
    startingPrice: 499,
    duration: "2 - 4 hours",
    benefits: [
      "Verified service professionals",
      "Professional cleaning equipment",
      "Transparent pricing",
      "Easy online booking",
    ],
    includes: [
      "Floor cleaning",
      "Dusting",
      "Kitchen cleaning",
      "Bathroom cleaning",
      "Furniture surface cleaning",
    ],
  },
  {
    id: 2,
    name: "Electrician",
    category: "Electrical",
    icon: "⚡",
    shortDescription: "Electrical repairs, fittings and installations.",
    description:
      "Book trained electricians for electrical repairs, switch and socket replacement, fan installation, lighting and other common electrical work.",
    startingPrice: 249,
    duration: "30 min - 2 hours",
    benefits: [
      "Experienced electricians",
      "Quick doorstep service",
      "Transparent pricing",
      "Safe electrical work",
    ],
    includes: [
      "Switch and socket repair",
      "Fan installation",
      "Light installation",
      "Basic wiring repair",
      "Electrical inspection",
    ],
  },
  {
    id: 3,
    name: "Plumber",
    category: "Plumbing",
    icon: "🔧",
    shortDescription: "Leak repairs, pipe fitting and plumbing work.",
    description:
      "Find professional plumbers for leakage repairs, taps, pipes, drainage problems and other household plumbing requirements.",
    startingPrice: 299,
    duration: "30 min - 2 hours",
    benefits: [
      "Trusted plumbers",
      "Doorstep service",
      "Clear pricing",
      "Quick issue diagnosis",
    ],
    includes: [
      "Tap repair",
      "Pipe leakage repair",
      "Drainage inspection",
      "Bathroom fittings",
      "Basic plumbing installation",
    ],
  },
  {
    id: 4,
    name: "AC Repair",
    category: "Appliance",
    icon: "❄️",
    shortDescription: "AC service, repair and installation.",
    description:
      "Book trained AC technicians for servicing, cooling issues, installation, inspection and common AC repairs.",
    startingPrice: 399,
    duration: "1 - 2 hours",
    benefits: [
      "Experienced technicians",
      "AC inspection",
      "Convenient scheduling",
      "Doorstep support",
    ],
    includes: [
      "AC inspection",
      "Filter cleaning",
      "Cooling issue diagnosis",
      "Basic servicing",
      "Installation inspection",
    ],
  },
  {
    id: 5,
    name: "Washing Machine Repair",
    category: "Appliance",
    icon: "🫧",
    shortDescription: "Repair and maintenance for washing machines.",
    description:
      "Get your washing machine inspected and repaired by experienced appliance service professionals.",
    startingPrice: 349,
    duration: "1 - 2 hours",
    benefits: [
      "Experienced technicians",
      "Doorstep diagnosis",
      "Transparent service charges",
      "Convenient booking",
    ],
    includes: [
      "Machine inspection",
      "Drainage issue check",
      "Spin issue diagnosis",
      "Noise inspection",
      "Basic repair assistance",
    ],
  },
  {
    id: 6,
    name: "Painting",
    category: "Painting",
    icon: "🎨",
    shortDescription: "Interior and exterior home painting.",
    description:
      "Transform your home with professional painting services for rooms, walls and complete properties.",
    startingPrice: 999,
    duration: "Depends on property",
    benefits: [
      "Professional painters",
      "Clean finishing",
      "Color consultation",
      "Flexible scheduling",
    ],
    includes: [
      "Wall inspection",
      "Surface preparation",
      "Interior painting",
      "Basic finishing",
      "Post-service cleanup",
    ],
  },
  {
    id: 7,
    name: "Carpenter",
    category: "Carpentry",
    icon: "🪚",
    shortDescription: "Furniture repair and custom wood work.",
    description:
      "Book skilled carpenters for furniture repairs, installation and household woodwork.",
    startingPrice: 299,
    duration: "1 - 3 hours",
    benefits: [
      "Skilled carpenters",
      "Home visit",
      "Upfront service pricing",
      "Multiple carpentry services",
    ],
    includes: [
      "Furniture repair",
      "Door repair",
      "Shelf installation",
      "Basic woodwork",
      "Furniture inspection",
    ],
  },
  {
    id: 8,
    name: "Bathroom Cleaning",
    category: "Cleaning",
    icon: "🚿",
    shortDescription: "Deep cleaning for bathrooms and washrooms.",
    description:
      "Professional bathroom cleaning service designed for deep cleaning of floors, tiles, fixtures and commonly used bathroom surfaces.",
    startingPrice: 399,
    duration: "1 - 2 hours",
    benefits: [
      "Deep cleaning",
      "Professional equipment",
      "Verified professionals",
      "Convenient scheduling",
    ],
    includes: [
      "Floor cleaning",
      "Tile cleaning",
      "Washbasin cleaning",
      "Toilet cleaning",
      "Bathroom fixture cleaning",
    ],
  },
];

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 rounded-2xl bg-slate-50 p-4">
      <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </Text>

      <Text className="text-base font-bold text-slate-900">
        {value}
      </Text>
    </View>
  );
}

export default function ServiceDetailsScreen() {
  const params = useLocalSearchParams<{ serviceId?: string | string[] }>();

  const rawServiceId = Array.isArray(params.serviceId)
    ? params.serviceId[0]
    : params.serviceId;

  const serviceId = Number(rawServiceId);

  const service = services.find((item) => item.id === serviceId);

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-slate-200 bg-white p-8"
          style={{ maxWidth: 520 }}
        >
          <Text className="mb-3 text-center text-5xl">
            🔍
          </Text>

          <Text className="text-center text-2xl font-bold text-slate-900">
            Service not found
          </Text>

          <Text className="mt-2 text-center leading-6 text-slate-500">
            The service you are looking for is not available.
          </Text>

          <Pressable
            onPress={() => router.replace("/services")}
            className="mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
          >
            <Text className="font-bold text-white">
              View Services
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const findProviders = () => {
    router.push({
      pathname: "/providers",
      params: {
        serviceId: String(service.id),
        serviceName: service.name,
      },
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row items-center justify-between"
          style={{ maxWidth: 1200 }}
        >
          <Pressable
            onPress={() => router.back()}
            className="rounded-xl px-2 py-2"
          >
            <Text className="font-semibold text-blue-600">
              ← Back
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/")}
          >
            <Text className="text-xl font-bold text-blue-600">
              ServiGo
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        className="mx-auto w-full px-5 py-8"
        style={{ maxWidth: 1200 }}
      >
        {/* Hero Section */}
        <View className="mb-6 rounded-3xl bg-blue-600 p-7 md:p-10">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-white">
            <Text className="text-4xl">
              {service.icon}
            </Text>
          </View>

          <Text className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-100">
            {service.category}
          </Text>

          <Text
            className="mb-4 font-bold text-white"
            style={{ fontSize: 38 }}
          >
            {service.name}
          </Text>

          <Text className="max-w-3xl text-base leading-7 text-blue-100">
            {service.description}
          </Text>
        </View>

        {/* Price & Duration */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <View className="flex-row flex-wrap gap-4">
            <InfoRow
              label="Starting from"
              value={`₹${service.startingPrice}`}
            />

            <InfoRow
              label="Estimated time"
              value={service.duration}
            />
          </View>
        </View>

        <View className="flex-row flex-wrap gap-6">
          {/* What's Included */}
          <View
            className="rounded-3xl border border-slate-200 bg-white p-6"
            style={{
              minWidth: 280,
              flexBasis: 500,
              flexGrow: 1,
            }}
          >
            <Text className="mb-2 text-2xl font-bold text-slate-900">
              What's included
            </Text>

            <Text className="mb-6 leading-6 text-slate-500">
              Services may vary depending on the selected professional and
              your exact requirement.
            </Text>

            <View className="gap-3">
              {service.includes.map((item) => (
                <View
                  key={item}
                  className="flex-row items-start"
                >
                  <View className="mr-3 mt-1 h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <Text className="text-xs font-bold text-green-700">
                      ✓
                    </Text>
                  </View>

                  <Text className="flex-1 text-base leading-6 text-slate-700">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Why Book */}
          <View
            className="rounded-3xl border border-slate-200 bg-white p-6"
            style={{
              minWidth: 280,
              flexBasis: 500,
              flexGrow: 1,
            }}
          >
            <Text className="mb-2 text-2xl font-bold text-slate-900">
              Why book with ServiGo?
            </Text>

            <Text className="mb-6 leading-6 text-slate-500">
              A simple way to find and book home-service professionals.
            </Text>

            <View className="gap-3">
              {service.benefits.map((item) => (
                <View
                  key={item}
                  className="flex-row items-start"
                >
                  <View className="mr-3 mt-1 h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <Text className="text-xs font-bold text-blue-700">
                      ✓
                    </Text>
                  </View>

                  <Text className="flex-1 text-base leading-6 text-slate-700">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Booking CTA */}
        <View className="mt-6 rounded-3xl bg-slate-900 p-7 md:p-8">
          <View className="flex-row flex-wrap items-center justify-between gap-6">
            <View style={{ flexBasis: 500, flexGrow: 1 }}>
              <Text className="mb-2 text-2xl font-bold text-white">
                Ready to book {service.name}?
              </Text>

              <Text className="leading-6 text-slate-300">
                Compare available professionals and choose the provider that
                fits your requirements.
              </Text>
            </View>

            <Pressable
              onPress={findProviders}
              className="rounded-xl bg-white px-7 py-4"
            >
              <Text className="font-bold text-slate-900">
                Find Providers →
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}