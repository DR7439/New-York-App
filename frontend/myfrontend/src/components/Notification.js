import { notification } from "antd";
import { useEffect } from "react";

export default function Notification() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    let isNotificationOpen = localStorage.getItem("isNotificationOpen");
    if (!isNotificationOpen) {
      localStorage.setItem("isNotificationOpen", true);
      api.open({
        message: "Welcome to Ad Optima",
        description:
          "Start optimizing advertisements for your business now with a free search from us!",
        duration: 0,
      });
      api.open({
        message: "Run out of credits?",
        description:
          "Credits are used to run your searches. If you are out of credits, top up more from the Credits menu tab!",
        duration: 0,
      });
    }
  };
  useEffect(() => {
    openNotification();
  }, []);
  return contextHolder;
}
