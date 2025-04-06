"use server";

export async function getMockNotifications() {
  return [
    {
      id: 1,
      title: "Notification 1",
      description: "Notification 1 description",
    },
  ];
}
