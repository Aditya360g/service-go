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

type ProviderService = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  bookings: number;
  active: boolean;
};

type ServiceForm = {
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
};

const sidebarItems = [
  {
    label: "Dashboard",
    icon: "▦",
    route: "/provider",
  },
  {
    label: "Bookings",
    icon: "📅",
    route: "/provider/bookings",
  },
  {
    label: "My Services",
    icon: "🛠️",
    route: "/provider/services",
  },
  {
    label: "Availability",
    icon: "🕒",
    route: "/provider/availability",
  },
  {
    label: "Earnings",
    icon: "₹",
    route: "/provider/earnings",
  },
  {
    label: "Reviews",
    icon: "⭐",
    route: "/provider/reviews",
  },
  {
    label: "Profile",
    icon: "👤",
    route: "/provider/profile",
  },
] as const;

const initialServices: ProviderService[] = [
  {
    id: 501,
    name: "Washing Machine Repair",
    category: "Appliance Repair",
    description:
      "Diagnosis and repair of washing machine problems including spinning, draining and noise issues.",
    price: "599",
    duration: "60 min",
    bookings: 68,
    active: true,
  },
  {
    id: 502,
    name: "Appliance Inspection",
    category: "Appliance Repair",
    description:
      "Complete appliance inspection to identify faults and estimate required repair work.",
    price: "399",
    duration: "45 min",
    bookings: 31,
    active: true,
  },
  {
    id: 503,
    name: "Installation Service",
    category: "Installation",
    description:
      "Professional installation and setup of supported home appliances.",
    price: "499",
    duration: "60 min",
    bookings: 22,
    active: false,
  },
];

const emptyForm: ServiceForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  duration: "",
};

export default function ProviderServicesScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1000;

  const [services, setServices] =
    useState<ProviderService[]>(
      initialServices
    );

  const [search, setSearch] =
    useState("");

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(
      null
    );

  const [form, setForm] =
    useState<ServiceForm>(
      emptyForm
    );

  const [formError, setFormError] =
    useState("");

  const filteredServices =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return services;
      }

      return services.filter(
        (service) =>
          [
            service.name,
            service.category,
            service.description,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
      );
    }, [search, services]);

  const activeCount =
    services.filter(
      (service) =>
        service.active
    ).length;

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
    service: ProviderService
  ) => {
    setEditingId(
      service.id
    );

    setForm({
      name: service.name,
      category:
        service.category,
      description:
        service.description,
      price: service.price,
      duration:
        service.duration,
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

    const price =
      form.price
        .replace(
          /[^0-9]/g,
          ""
        )
        .trim();

    const duration =
      form.duration.trim();

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

    if (!price) {
      setFormError(
        "Price is required."
      );
      return;
    }

    if (!duration) {
      setFormError(
        "Duration is required."
      );
      return;
    }

    if (editingId !== null) {
      setServices(
        (current) =>
          current.map(
            (service) =>
              service.id ===
                editingId
                ? {
                  ...service,
                  name,
                  category,
                  description,
                  price,
                  duration,
                }
                : service
          )
      );
    } else {
      const newService: ProviderService =
      {
        id:
          Date.now(),
        name,
        category,
        description,
        price,
        duration,
        bookings: 0,
        active: true,
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

  const toggleService = (
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
                active:
                  !service.active,
              }
              : service
        )
    );
  };

  const removeService = (
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
                  "/provider"
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
                  Provider Panel
                </Text>
              </View>
            </Pressable>

            <View className="gap-1">
              {sidebarItems.map(
                (item) => {
                  const active =
                    item.route ===
                    "/provider/services";

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
                    My Services
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Manage services and
                    pricing
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-black text-blue-600">
                  ServiGo
                </Text>
              )}

              <Pressable
                onPress={() =>
                  router.push(
                    "/provider/profile"
                  )
                }
                className="flex-row items-center"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Text className="font-bold text-blue-700">
                    RP
                  </Text>
                </View>

                {isDesktop && (
                  <View className="ml-3">
                    <Text className="font-bold text-slate-900">
                      Rahul Provider
                    </Text>

                    <Text className="text-xs text-slate-400">
                      Appliance Technician
                    </Text>
                  </View>
                )}
              </Pressable>
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
                        "/provider/services";

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
                    My Services
                  </Text>

                  <Text className="mt-2 text-slate-500">
                    Add, edit and manage
                    the services you
                    provide.
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
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 170,
                    flexBasis: 220,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Total Services
                  </Text>

                  <Text className="mt-2 text-3xl font-black text-slate-900">
                    {services.length}
                  </Text>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 170,
                    flexBasis: 220,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Active Services
                  </Text>

                  <Text className="mt-2 text-3xl font-black text-green-600">
                    {activeCount}
                  </Text>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 170,
                    flexBasis: 220,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Total Bookings
                  </Text>

                  <Text className="mt-2 text-3xl font-black text-slate-900">
                    {totalBookings}
                  </Text>
                </View>
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
                    placeholder="Search your services"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 py-3.5 text-sm text-slate-900 outline-none"
                  />
                </View>
              </View>

              {/* SERVICES */}
              {filteredServices.length >
                0 ? (
                <View className="flex-row flex-wrap gap-5">
                  {filteredServices.map(
                    (service) => (
                      <View
                        key={
                          service.id
                        }
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                        style={{
                          minWidth: 280,
                          flexBasis: 360,
                          flexGrow: 1,
                        }}
                      >
                        {/* TOP */}
                        <View className="flex-row items-start justify-between gap-4">
                          <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                            <Text className="text-2xl">
                              🛠️
                            </Text>
                          </View>

                          <Pressable
                            onPress={() =>
                              toggleService(
                                service.id
                              )
                            }
                            className={
                              service.active
                                ? "h-8 w-14 justify-center rounded-full bg-green-500 px-1"
                                : "h-8 w-14 justify-center rounded-full bg-slate-300 px-1"
                            }
                          >
                            <View
                              className="h-6 w-6 rounded-full bg-white"
                              style={{
                                alignSelf:
                                  service.active
                                    ? "flex-end"
                                    : "flex-start",
                              }}
                            />
                          </Pressable>
                        </View>

                        <View className="mt-4">
                          <View className="flex-row flex-wrap items-center gap-2">
                            <Text className="text-lg font-bold text-slate-900">
                              {
                                service.name
                              }
                            </Text>

                            <View
                              className={
                                service.active
                                  ? "rounded-full bg-green-50 px-3 py-1"
                                  : "rounded-full bg-slate-100 px-3 py-1"
                              }
                            >
                              <Text
                                className={
                                  service.active
                                    ? "text-xs font-bold text-green-700"
                                    : "text-xs font-bold text-slate-500"
                                }
                              >
                                {service.active
                                  ? "Active"
                                  : "Inactive"}
                              </Text>
                            </View>
                          </View>

                          <Text className="mt-2 text-sm font-semibold text-blue-600">
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

                        {/* INFO */}
                        <View className="mt-5 flex-row flex-wrap gap-3">
                          <View
                            className="rounded-xl bg-slate-50 p-3"
                            style={{
                              minWidth: 100,
                              flexGrow: 1,
                            }}
                          >
                            <Text className="text-xs text-slate-400">
                              Price
                            </Text>

                            <Text className="mt-1 text-lg font-black text-slate-900">
                              ₹
                              {
                                service.price
                              }
                            </Text>
                          </View>

                          <View
                            className="rounded-xl bg-slate-50 p-3"
                            style={{
                              minWidth: 100,
                              flexGrow: 1,
                            }}
                          >
                            <Text className="text-xs text-slate-400">
                              Duration
                            </Text>

                            <Text className="mt-1 font-bold text-slate-900">
                              {
                                service.duration
                              }
                            </Text>
                          </View>

                          <View
                            className="rounded-xl bg-slate-50 p-3"
                            style={{
                              minWidth: 100,
                              flexGrow: 1,
                            }}
                          >
                            <Text className="text-xs text-slate-400">
                              Bookings
                            </Text>

                            <Text className="mt-1 font-bold text-slate-900">
                              {
                                service.bookings
                              }
                            </Text>
                          </View>
                        </View>

                        {/* ACTIONS */}
                        <View className="mt-5 flex-row gap-3 border-t border-slate-100 pt-5">
                          <Pressable
                            onPress={() =>
                              openEditService(
                                service
                              )
                            }
                            className="flex-1 items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3"
                          >
                            <Text className="font-bold text-blue-700">
                              Edit
                            </Text>
                          </Pressable>

                          <Pressable
                            onPress={() =>
                              removeService(
                                service.id
                              )
                            }
                            className="flex-1 items-center rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                          >
                            <Text className="font-bold text-red-600">
                              Remove
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    )
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
                    Add a service or
                    change your search.
                  </Text>

                  <Pressable
                    onPress={
                      openAddService
                    }
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-3"
                  >
                    <Text className="font-bold text-white">
                      Add Service
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
                  Enter service details.
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
                      placeholder="Washing Machine Repair"
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
                      placeholder="Appliance Repair"
                      placeholderTextColor="#94a3b8"
                      className="py-4 text-base text-slate-900 outline-none"
                    />
                  </View>
                </View>

                {/* PRICE / DURATION */}
                <View className="mt-5 flex-row flex-wrap gap-4">
                  <View
                    style={{
                      minWidth: 180,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="mb-2 text-sm font-bold text-slate-700">
                      Price
                    </Text>

                    <View className="flex-row items-center rounded-xl border border-slate-200 px-4">
                      <Text className="mr-2 font-bold text-slate-500">
                        ₹
                      </Text>

                      <TextInput
                        value={
                          form.price
                        }
                        onChangeText={(
                          value
                        ) =>
                          updateForm(
                            "price",
                            value.replace(
                              /[^0-9]/g,
                              ""
                            )
                          )
                        }
                        placeholder="599"
                        placeholderTextColor="#94a3b8"
                        keyboardType="number-pad"
                        className="flex-1 py-4 text-base text-slate-900 outline-none"
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
                      Duration
                    </Text>

                    <View className="rounded-xl border border-slate-200 px-4">
                      <TextInput
                        value={
                          form.duration
                        }
                        onChangeText={(
                          value
                        ) =>
                          updateForm(
                            "duration",
                            value
                          )
                        }
                        placeholder="60 min"
                        placeholderTextColor="#94a3b8"
                        className="py-4 text-base text-slate-900 outline-none"
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