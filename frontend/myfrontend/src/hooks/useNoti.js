import { message, notification } from "antd";
import { atom, useRecoilState } from "recoil";
const notifications = [
  {
    key: "welcome",
    message: "Welcome to Ad Optima",
    description:
      "Start optimizing advertisements for your business now with a free search from us!",
    duration: 0,
  },
  {
    key: "credits",
    message: "Run out of credits?",
    description:
      "Credits are used to run your searches. If you are out of credits, top up more from the Credits menu tab!",
    duration: 0,
  },
];

const notiState = atom({
  key: "notiState",
  default: getNotiNumber(),
});

function getNotiNumber() {
  let notiNumber = 0;
  for (let i = 0; i < notifications.length; i++) {
    if (!localStorage.getItem(notifications[i].key)) {
      notiNumber++;
    }
  }
  return notiNumber;
}

export function useNoti() {
  const [api, notiHolder] = notification.useNotification({
    top: 60,
  });

  function checkNoti() {
    let notiNumber = getNotiNumber();
    setNotiNumber(notiNumber);
  }

  const [notiNumber, setNotiNumber] = useRecoilState(notiState);
  const openNotification = () => {
    if (notiNumber > 0) {
      notifications.forEach((noti) => {
        if (!localStorage.getItem(noti.key)) {
          api.open(noti);
          localStorage.setItem(noti.key, true);
        }
      });
      setNotiNumber(0);
    } else {
      message.info("No new notification");
    }
  };

  return {
    openNotification,
    notiHolder,
    notiNumber,
    checkNoti,
  };
}
