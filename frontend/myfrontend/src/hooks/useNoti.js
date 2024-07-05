import { notification } from "antd";
import { useState } from "react";
const notifications = [
  {
    message: "Welcome to Ad Optima",
    description:
      "Start optimizing advertisements for your business now with a free search from us!",
    duration: 0,
  },
  {
    message: "Run out of credits?",
    description:
      "Credits are used to run your searches. If you are out of credits, top up more from the Credits menu tab!",
    duration: 0,
  },
];

export function useNoti() {
  const [api, notiHolder] = notification.useNotification({
    top: 60,
  });
  const [notiNumber, setNotiNumber] = useState(() => {
    let notiNumber = 0;
    let isNotificationOpen = localStorage.getItem("isNotificationOpen");
    if (!isNotificationOpen) {
      notiNumber = notifications.length;
    }
    return notiNumber;
  });
  const openNotification = () => {
    if (notiNumber > 0) {
      notifications.forEach((noti) => {
        api.open(noti);
      });
      localStorage.setItem("isNotificationOpen", true);
      setNotiNumber(0);
    }
  };
  return {
    openNotification,
    notiHolder,
    notiNumber,
  };
}
