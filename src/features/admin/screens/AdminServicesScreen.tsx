import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

type ServiceStatus =
  | "active"
  | "inactive";

type ServiceFilter =
  | "all"
  | ServiceStatus;

type Service = {
  id: number;
  name: string;
  icon: string;
  category: string;
  description: string;
  basePrice: string;
  providers: number;
  bookings: number;
  rating: number;
  status: ServiceStatus;
};

type ServiceForm = {
  name: string;
  icon: string;
  category: string;
  description: string;
  basePrice: string;
};

const sidebarItems = [
  {
    label: "Dashboard",
    icon: "▦",
    route: "/admin",
  },
  {
    label: "Users",
    icon: "👥",
    route: "/admin/users",
  },
  {
    label: "Providers",
    icon: "🧑‍🔧",
    route: "/admin/providers",
  },
  {
    label: "Services",
    icon: "🛠️",
    route: "/admin/services",
  },
  {
    label: "Bookings",
    icon: "📅",
    route: "/admin/bookings",
  },
  {
    label: "Payments",
    icon: "₹",
    route: "/admin/payments",
  },
  {
    label: "Reviews",
    icon: "⭐",
    route: "/admin/reviews",
  },
  {
    label: "Reports",
    icon: "📊",
    route: "/admin/reports",
  },
] as const;

const initialServices: Service[] = [
  {
    id: 1,
    name: "Home Cleaning",
    icon: "🧹",
    category: "Cleaning",
    description:
      "Professional home cleaning for rooms, kitchen and common areas.",
    basePrice: "499",
    providers: 34,
    bookings: 486,
    rating: 4.8,
    status: "active",
  },
  {
    id: 2,
    name: "Electrician",
    icon: "⚡",
    category: "Electrical",
    description:
      "Electrical repairs, switchboards, wiring and installation services.",
    basePrice: "249",
    providers: 28,
    bookings: 418,
    rating: 4.7,
    status: "active",
  },
  {
    id: 3,
    name: "Plumber",
    icon: "🔧",
    category: "Plumbing",
    description:
      "Professional plumbing, leakage, fitting and repair services.",
    basePrice: "299",
    providers: 25,
    bookings: 392,
    rating: 4.9,
    status: "active",
  },
  {
    id: 4,
    name: "AC Repair",
    icon: "❄️",
    category: "Appliance Repair",
    description:
      "AC inspection, repair, servicing and maintenance.",
    basePrice: "399",
    providers: 22,
    bookings: 365,
    rating: 4.6,
    status: "active",
  },
  {
    id: 5,
    name: "Washing Machine Repair",
    icon: "🧺",
    category: "Appliance Repair",
    description:
      "Washing machine diagnosis, maintenance and repair service.",
    basePrice: "599",
    providers: 18,
    bookings: 348,
    rating: 5,
    status: "active",
  },
  {
    id: 6,
    name: "Painting",
    icon: "🎨",
    category: "Home Improvement",
    description:
      "Interior and exterior painting services for residential spaces.",
    basePrice: "999",
    providers: 16,
    bookings: 174,
    rating: 4.5,
    status: "active",
  },
  {
    id: 7,
    name: "Carpenter",
    icon: "🪚",
    category: "Carpentry",
    description:
      "Furniture repair, assembly and general carpentry work.",
    basePrice: "299",
    providers: 14,
    bookings: 156,
    rating: 4.7,
    status: "active",
  },
  {
    id: 8,
    name: "Bathroom Cleaning",
    icon: "🚿",
    category: "Cleaning",
    description:
      "Deep bathroom cleaning and sanitisation service.",
    basePrice: "399",
    providers: 21,
    bookings: 231,
    rating: 4.8,
    status: "inactive",
  },
];

const filters: {
  label: string;
  value: ServiceFilter;
}[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

const emptyForm: ServiceForm = {
  name: "",
  icon: "🛠️",
  category: "",
  description: "",
  basePrice: "",
};

function getStatusStyle(
  status: ServiceStatus
) {
  if (status === "active") {
    return {
      label: "Active",
      wrapper:
        "border-green-200 bg-green-50",
      text: "text-green-700",
    };
  }

  return {
    label: "Inactive",
    wrapper:
      "border-slate-200 bg-slate-100",
    text: "text-slate-600",
  };
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View
      className="rounded-2xl border border-slate-200 bg-white p-5"
      style={{
        minWidth: 170,
        flexBasis: 220,
        flexGrow: 1,
      }}
    >
      <View className="flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Text className="text-xl">
            {icon}
          </Text>
        </View>

        <View className="ml-4">
          <Text className="text-2xl font-black text-slate-900">
            {value}
          </Text>

          <Text className="text-sm text-slate-500">
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function AdminServicesScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [
    services,
    setServices,
  ] =
    useState<Service[]>(
      initialServices
    );

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<ServiceFilter>(
      "all"
    );

  const [
    modalVisible,
    setModalVisible,
  ] =
    useState(false);

  const [
    editingId,
    setEditingId,
  ] =
    useState<number | null>(
      null
    );

  const [form, setForm] =
    useState<ServiceForm>(
      emptyForm
    );

  const [
    formError,
    setFormError,
  ] =
    useState("");

  const filteredServices =
    useMemo(() => {
      let result = [
        ...services,
      ];

      if (filter !== "all") {
        result =
          result.filter(
            (service) =>
              service.status ===
              filter
          );
      }

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (service) =>
              [
                service.id,
                service.name,
                service.category,
                service.description,
                service.status,
              ]
                .join(" ")
                .toLowerCase()
                .includes(query)
          );
      }

      return result;
    }, [
      services,
      search,
      filter,
    ]);

  const activeCount =
    services.filter(
      (service) =>
        service.status ===
        "active"
    ).length;

  const inactiveCount =
    services.filter(
      (service) =>
        service.status ===
        "inactive"
    ).length;

  const totalProviders =
    services.reduce(
      (sum, service) =>
        sum +
        service.providers,
      0
    );

  const totalBookings =
    services.reduce(
      (sum, service) =>
        sum +
        service.bookings,
      0
    );

  const openAddService = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalVisible(true);
  };

  const openEditService = (
    service: Service
  ) => {
    setEditingId(
      service.id
    );

    setForm({
      name: service.name,
      icon: service.icon,
      category:
        service.category,
      description:
        service.description,
      basePrice:
        service.basePrice,
    });

    setFormError("");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const updateForm = (
    field: keyof ServiceForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFormError("");
  };

  const saveService = () => {
    const name =
      form.name.trim();

    const category =
      form.category.trim();

    const description =
      form.description.trim();

    const basePrice =
      form.basePrice.replace(
        /[^0-9]/g,
        ""
      );

    const icon =
      form.icon.trim() ||
      "🛠️";

    if (!name) {
      setFormError(
        "Service name is required."
      );
      return;
    }

    if (!category) {
      setFormError(
        "Category is required."
      );
      return;
    }

    if (!basePrice) {
      setFormError(
        "Base price is required."
      );
      return;
    }

    if (
      editingId !== null
    ) {
      setServices(
        (current) =>
          current.map(
            (service) =>
              service.id ===
                editingId
                ? {
                  ...service,
                  name,
                  icon,
                  category,
                  description,
                  basePrice,
                }
                : service
          )
      );
    } else {
      const nextId =
        services.length > 0
          ? Math.max(
            ...services.map(
              (service) =>
                service.id
            )
          ) + 1
          : 1;

      const newService: Service =
      {
        id: nextId,
        name,
        icon,
        category,
        description,
        basePrice,
        providers: 0,
        bookings: 0,
        rating: 0,
        status: "active",
      };

      setServices(
        (current) => [
          newService,
          ...current,
        ]
      );
    }

    closeModal();
  };

  const toggleStatus = (
    serviceId: number
  ) => {
    setServices(
      (current) =>
        current.map(
          (service) =>
            service.id ===
              serviceId
              ? {
                ...service,
                status:
                  service.status ===
                    "active"
                    ? "inactive"
                    : "active",
              }
              : service
        )
    );
  };

  const deleteService = (
    serviceId: number
  ) => {
    setServices(
      (current) =>
        current.filter(
          (service) =>
            service.id !==
            serviceId
        )
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View
        className={
          isDesktop
            ? "flex-1 flex-row"
            : "flex-1"
        }
      >
        {/* SIDEBAR */}
        {isDesktop && (
          <View
            className="border-r border-slate-200 bg-white px-5 py-6"
            style={{
              width: 250,
            }}
          >
            <Pressable
              onPress={() =>
                router.replace(
                  "/admin"
                )
              }
              className="mb-8 flex-row items-center px-2"
            >
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <Text className="text-lg font-black text-white">
                  S
                </Text>
              </View>

              <View className="ml-3">
                <Text className="text-xl font-black text-slate-900">
                  ServiGo
                </Text>

                <Text className="text-xs font-semibold text-slate-400">
                  Admin Panel
                </Text>
              </View>
            </Pressable>

            <View className="gap-1">
              {sidebarItems.map(
                (item) => {
                  const active =
                    item.route ===
                    "/admin/services";

                  return (
                    <Pressable
                      key={
                        item.label
                      }
                      onPress={() =>
                        router.push(
                          item.route
                        )
                      }
                      className={
                        active
                          ? "flex-row items-center rounded-xl bg-blue-50 px-4 py-4"
                          : "flex-row items-center rounded-xl px-4 py-4"
                      }
                    >
                      <View className="w-8 items-center">
                        <Text className="text-xl">
                          {
                            item.icon
                          }
                        </Text>
                      </View>

                      <Text
                        className={
                          active
                            ? "ml-3 font-bold text-blue-700"
                            : "ml-3 font-semibold text-slate-600"
                        }
                      >
                        {
                          item.label
                        }
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>
        )}

        {/* MAIN */}
        <View className="flex-1">
          {/* HEADER */}
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between">
              {isDesktop ? (
                <View>
                  <Text className="text-lg font-bold text-slate-900">
                    Services
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Manage ServiGo service catalog
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-black text-blue-600">
                  ServiGo
                </Text>
              )}

              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-900">
                  <Text className="font-bold text-white">
                    AD
                  </Text>
                </View>

                {isDesktop && (
                  <View className="ml-3">
                    <Text className="font-bold text-slate-900">
                      Admin
                    </Text>

                    <Text className="text-xs text-slate-400">
                      Administrator
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {!isDesktop && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                className="mt-4"
              >
                <View className="flex-row gap-2">
                  {sidebarItems.map(
                    (item) => {
                      const active =
                        item.route ===
                        "/admin/services";

                      return (
                        <Pressable
                          key={
                            item.label
                          }
                          onPress={() =>
                            router.push(
                              item.route
                            )
                          }
                          className={
                            active
                              ? "rounded-full bg-blue-600 px-4 py-2.5"
                              : "rounded-full border border-slate-200 bg-white px-4 py-2.5"
                          }
                        >
                          <Text
                            className={
                              active
                                ? "font-semibold text-white"
                                : "font-semibold text-slate-600"
                            }
                          >
                            {
                              item.label
                            }
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </ScrollView>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 60,
            }}
          >
            <View className="p-5 md:p-8">
              {/* TITLE */}
              <View className="mb-6 flex-row flex-wrap items-end justify-between gap-4">
                <View>
                  <Text className="text-3xl font-black text-slate-900">
                    Manage Services
                  </Text>

                  <Text className="mt-2 text-slate-500">
                    Create, edit and control
                    services available on
                    ServiGo.
                  </Text>
                </View>

                <Pressable
                  onPress={
                    openAddService
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3.5"
                >
                  <Text className="font-bold text-white">
                    + Add Service
                  </Text>
                </Pressable>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="🛠️"
                  label="Total Services"
                  value={String(
                    services.length
                  )}
                />

                <StatCard
                  icon="✅"
                  label="Active"
                  value={String(
                    activeCount
                  )}
                />

                <StatCard
                  icon="🚫"
                  label="Inactive"
                  value={String(
                    inactiveCount
                  )}
                />

                <StatCard
                  icon="🧑‍🔧"
                  label="Provider Listings"
                  value={String(
                    totalProviders
                  )}
                />

                <StatCard
                  icon="📅"
                  label="Total Bookings"
                  value={totalBookings.toLocaleString(
                    "en-IN"
                  )}
                />
              </View>

              {/* SEARCH */}
              <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
                <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Text className="mr-2 text-lg">
                    🔎
                  </Text>

                  <TextInput
                    value={search}
                    onChangeText={
                      setSearch
                    }
                    placeholder="Search service, category or description"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 py-3.5 text-sm text-slate-900 outline-none"
                  />
                </View>
              </View>

              {/* FILTERS */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                className="mb-5"
              >
                <View className="flex-row gap-2">
                  {filters.map(
                    (item) => {
                      const selected =
                        filter ===
                        item.value;

                      return (
                        <Pressable
                          key={
                            item.value
                          }
                          onPress={() =>
                            setFilter(
                              item.value
                            )
                          }
                          className={
                            selected
                              ? "rounded-full bg-blue-600 px-5 py-2.5"
                              : "rounded-full border border-slate-200 bg-white px-5 py-2.5"
                          }
                        >
                          <Text
                            className={
                              selected
                                ? "font-semibold text-white"
                                : "font-semibold text-slate-600"
                            }
                          >
                            {
                              item.label
                            }
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </ScrollView>

              {/* SERVICE CARDS */}
              {filteredServices.length >
                0 ? (
                <View className="flex-row flex-wrap gap-5">
                  {filteredServices.map(
                    (service) => {
                      const status =
                        getStatusStyle(
                          service.status
                        );

                      return (
                        <View
                          key={
                            service.id
                          }
                          className="rounded-2xl border border-slate-200 bg-white p-5"
                          style={{
                            minWidth: 290,
                            flexBasis: 380,
                            flexGrow: 1,
                          }}
                        >
                          {/* TOP */}
                          <View className="flex-row items-start justify-between gap-4">
                            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                              <Text className="text-2xl">
                                {
                                  service.icon
                                }
                              </Text>
                            </View>

                            <View
                              className={`rounded-full border px-3 py-1.5 ${status.wrapper}`}
                            >
                              <Text
                                className={`text-xs font-bold ${status.text}`}
                              >
                                {
                                  status.label
                                }
                              </Text>
                            </View>
                          </View>

                          {/* INFO */}
                          <View className="mt-4">
                            <Text className="text-xl font-black text-slate-900">
                              {
                                service.name
                              }
                            </Text>

                            <Text className="mt-1 text-sm font-semibold text-blue-600">
                              {
                                service.category
                              }
                            </Text>

                            <Text className="mt-3 text-sm leading-6 text-slate-500">
                              {
                                service.description
                              }
                            </Text>
                          </View>

                          {/* METRICS */}
                          <View className="mt-5 flex-row flex-wrap gap-3">
                            <View
                              className="rounded-xl bg-slate-50 p-3"
                              style={{
                                minWidth: 95,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="text-xs text-slate-400">
                                Base Price
                              </Text>

                              <Text className="mt-1 text-lg font-black text-slate-900">
                                ₹
                                {
                                  service.basePrice
                                }
                              </Text>
                            </View>

                            <View
                              className="rounded-xl bg-slate-50 p-3"
                              style={{
                                minWidth: 95,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="text-xs text-slate-400">
                                Providers
                              </Text>

                              <Text className="mt-1 text-lg font-black text-slate-900">
                                {
                                  service.providers
                                }
                              </Text>
                            </View>

                            <View
                              className="rounded-xl bg-slate-50 p-3"
                              style={{
                                minWidth: 95,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="text-xs text-slate-400">
                                Bookings
                              </Text>

                              <Text className="mt-1 text-lg font-black text-slate-900">
                                {
                                  service.bookings
                                }
                              </Text>
                            </View>
                          </View>

                          <View className="mt-4 flex-row items-center justify-between">
                            <Text className="text-xs text-slate-400">
                              Service ID: #
                              {
                                service.id
                              }
                            </Text>

                            <Text className="font-bold text-slate-700">
                              {service.rating >
                                0
                                ? `⭐ ${service.rating}`
                                : "No rating"}
                            </Text>
                          </View>

                          {/* ACTIONS */}
                          <View className="mt-5 flex-row flex-wrap gap-2 border-t border-slate-100 pt-5">
                            <Pressable
                              onPress={() =>
                                openEditService(
                                  service
                                )
                              }
                              className="flex-1 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3"
                              style={{
                                minWidth: 90,
                              }}
                            >
                              <Text className="text-center text-xs font-bold text-blue-700">
                                Edit
                              </Text>
                            </Pressable>

                            <Pressable
                              onPress={() =>
                                toggleStatus(
                                  service.id
                                )
                              }
                              className={
                                service.status ===
                                  "active"
                                  ? "flex-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
                                  : "flex-1 rounded-lg border border-green-200 bg-green-50 px-4 py-3"
                              }
                              style={{
                                minWidth: 90,
                              }}
                            >
                              <Text
                                className={
                                  service.status ===
                                    "active"
                                    ? "text-center text-xs font-bold text-amber-700"
                                    : "text-center text-xs font-bold text-green-700"
                                }
                              >
                                {service.status ===
                                  "active"
                                  ? "Disable"
                                  : "Enable"}
                              </Text>
                            </Pressable>

                            <Pressable
                              onPress={() =>
                                deleteService(
                                  service.id
                                )
                              }
                              className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                              style={{
                                minWidth: 90,
                              }}
                            >
                              <Text className="text-center text-xs font-bold text-red-600">
                                Delete
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    }
                  )}
                </View>
              ) : (
                <View className="items-center rounded-2xl border border-slate-200 bg-white px-5 py-16">
                  <Text className="text-5xl">
                    🛠️
                  </Text>

                  <Text className="mt-4 text-xl font-bold text-slate-900">
                    No services found
                  </Text>

                  <Text className="mt-2 text-center text-sm text-slate-500">
                    Change search or filter.
                  </Text>

                  <Pressable
                    onPress={() => {
                      setSearch("");
                      setFilter(
                        "all"
                      );
                    }}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-3"
                  >
                    <Text className="font-bold text-white">
                      Clear Filters
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* ADD / EDIT MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={
          closeModal
        }
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-4 py-8">
          <View
            className="w-full overflow-hidden rounded-3xl bg-white"
            style={{
              maxWidth: 620,
              maxHeight: "92%",
            }}
          >
            <View className="flex-row items-center justify-between border-b border-slate-100 px-6 py-5">
              <View>
                <Text className="text-xl font-black text-slate-900">
                  {editingId !==
                    null
                    ? "Edit Service"
                    : "Add Service"}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  Enter service information.
                </Text>
              </View>

              <Pressable
                onPress={
                  closeModal
                }
                className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <Text className="text-lg font-bold text-slate-600">
                  ×
                </Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >
              <View className="p-6">
                {!!formError && (
                  <View className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
                    <Text className="font-semibold text-red-600">
                      {formError}
                    </Text>
                  </View>
                )}

                {/* NAME */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-slate-700">
                    Service Name
                  </Text>

                  <View className="rounded-xl border border-slate-200 px-4">
                    <TextInput
                      value={
                        form.name
                      }
                      onChangeText={(
                        value
                      ) =>
                        updateForm(
                          "name",
                          value
                        )
                      }
                      placeholder="Home Cleaning"
                      placeholderTextColor="#94a3b8"
                      className="py-4 text-base text-slate-900 outline-none"
                    />
                  </View>
                </View>

                {/* CATEGORY */}
                <View className="mt-5">
                  <Text className="mb-2 text-sm font-bold text-slate-700">
                    Category
                  </Text>

                  <View className="rounded-xl border border-slate-200 px-4">
                    <TextInput
                      value={
                        form.category
                      }
                      onChangeText={(
                        value
                      ) =>
                        updateForm(
                          "category",
                          value
                        )
                      }
                      placeholder="Cleaning"
                      placeholderTextColor="#94a3b8"
                      className="py-4 text-base text-slate-900 outline-none"
                    />
                  </View>
                </View>

                {/* ICON + PRICE */}
                <View className="mt-5 flex-row flex-wrap gap-4">
                  <View
                    style={{
                      minWidth: 160,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="mb-2 text-sm font-bold text-slate-700">
                      Icon
                    </Text>

                    <View className="rounded-xl border border-slate-200 px-4">
                      <TextInput
                        value={
                          form.icon
                        }
                        onChangeText={(
                          value
                        ) =>
                          updateForm(
                            "icon",
                            value
                          )
                        }
                        placeholder="🛠️"
                        placeholderTextColor="#94a3b8"
                        className="py-4 text-base text-slate-900 outline-none"
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      minWidth: 180,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="mb-2 text-sm font-bold text-slate-700">
                      Base Price
                    </Text>

                    <View className="flex-row items-center rounded-xl border border-slate-200 px-4">
                      <Text className="mr-2 font-bold text-slate-500">
                        ₹
                      </Text>

                      <TextInput
                        value={
                          form.basePrice
                        }
                        onChangeText={(
                          value
                        ) =>
                          updateForm(
                            "basePrice",
                            value.replace(
                              /[^0-9]/g,
                              ""
                            )
                          )
                        }
                        placeholder="499"
                        placeholderTextColor="#94a3b8"
                        keyboardType="number-pad"
                        className="flex-1 py-4 text-base text-slate-900 outline-none"
                      />
                    </View>
                  </View>
                </View>

                {/* DESCRIPTION */}
                <View className="mt-5">
                  <Text className="mb-2 text-sm font-bold text-slate-700">
                    Description
                  </Text>

                  <View className="rounded-xl border border-slate-200 px-4">
                    <TextInput
                      value={
                        form.description
                      }
                      onChangeText={(
                        value
                      ) =>
                        updateForm(
                          "description",
                          value
                        )
                      }
                      placeholder="Describe the service..."
                      placeholderTextColor="#94a3b8"
                      multiline
                      className="py-4 text-base text-slate-900 outline-none"
                      style={{
                        minHeight: 120,
                        textAlignVertical:
                          "top",
                      }}
                    />
                  </View>
                </View>

                {/* BUTTONS */}
                <View className="mt-7 flex-row gap-3">
                  <Pressable
                    onPress={
                      closeModal
                    }
                    className="flex-1 items-center rounded-xl border border-slate-200 px-5 py-4"
                  >
                    <Text className="font-bold text-slate-600">
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={
                      saveService
                    }
                    className="flex-1 items-center rounded-xl bg-blue-600 px-5 py-4"
                  >
                    <Text className="font-bold text-white">
                      {editingId !==
                        null
                        ? "Save Changes"
                        : "Add Service"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}