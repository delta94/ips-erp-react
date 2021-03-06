import { notification } from "antd";
import differenceInMinutes from "date-fns/differenceInMinutes";

export const openNotification = (type, msg) => {
  let message = "";
  if (msg instanceof Object) {
    for (let [key, value] of Object.entries(msg)) {
      message += `${key}: ${value}`;
    }
  } else {
    message = msg;
  }
  notification[type]({
    message: message,
  });
};

export const propComparator = key => {
  return function compare(a, b) {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  };
};

const modifyDate = (time, kind, val) => {
  if (kind === "date") {
    time = new Date(time).setDate(new Date(time).getDate() + val);
  }
  return time;
};

// this has to be fix at some point
export const calEndTime = (time, estimate) => {
  console.log(`start time: ${time}`);
  const estimateMin = estimate * 60;
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();

  const morningFirstStart = new Date(year, month, day, 8, 0, 0).getTime();
  const morningFirstEnd = new Date(year, month, day, 12, 0, 0).getTime();
  const morningFirstGapStart = new Date(year, month, day, 12, 0, 0).getTime();
  const morningFirstGapEnd = new Date(year, month, day, 13, 30, 0).getTime();

  const morningSecStart = new Date(year, month, day, 13, 30, 0).getTime();
  const morningSecEnd = new Date(year, month, day, 17, 30, 0).getTime();
  const morningSecGapStart = new Date(year, month, day, 17, 30, 0);
  const morningSecGapEnd = new Date(year, month, day, 18, 0, 0);

  const morningThirdStart = new Date(year, month, day, 18, 0, 0).getTime();
  const morningThirdEnd = new Date(year, month, day, 20, 0, 0).getTime();

  const nightFirstStart = new Date(year, month, day, 20, 0, 0).getTime();
  const nightFirstEnd = new Date(year, month, day + 1, 0, 0, 0).getTime();
  const nightFirstGapStart = new Date(year, month, day + 1, 0, 0, 0).getTime();
  const nightFirstGapEnd = new Date(year, month, day + 1, 0, 30, 0).getTime();

  const nightSecStart = new Date(year, month, day + 1, 0, 30, 0).getTime();
  const nightSecEnd = new Date(year, month, day + 1, 4, 30, 0).getTime();

  const nightThirdStart = new Date(year, month, day + 1, 4, 30, 0).getTime();
  const nightThirdEnd = new Date(year, month, day + 1, 7, 0, 0).getTime();

  let end_time = new Date(time);
  if (modifyDate(nightThirdEnd, "date", -1) < time && time <= morningFirstEnd) {
    end_time = new Date(morningFirstStart);
    let dif = differenceInMinutes(morningFirstEnd, time);
    if (estimateMin <= dif) {
      end_time.setMinutes(end_time.getMinutes() + estimateMin);
    } else {
      end_time = new Date(morningSecStart);
      end_time.setMinutes(end_time.getMinutes() + (estimateMin - dif));
    }
  } else if (morningFirstGapStart <= time && time <= morningSecEnd) {
    if (time < morningFirstGapEnd) {
      end_time = new Date(morningSecStart);
      if (estimateMin <= 4 * 60) {
        end_time.setMinutes(end_time.getMinutes() + estimateMin);
      } else {
        end_time = new Date(morningThirdStart);
        end_time.setMinutes(end_time.getMinutes() + (estimateMin - 4 * 60));
      }
    } else {
      let dif = differenceInMinutes(morningSecEnd, time);
      if (estimateMin <= dif) {
        end_time.setMinutes(end_time.getMinutes() + estimateMin);
      } else {
        end_time = new Date(morningThirdStart);
        end_time.setMinutes(end_time.getMinutes() + (estimateMin - dif));
      }
    }
  } else if (morningSecGapStart <= time && time <= morningThirdEnd) {
    if (time < morningSecGapEnd) {
      end_time = new Date(morningThirdStart);
      if (estimateMin <= 2 * 60) {
        end_time.setMinutes(end_time.getMinutes() + estimateMin);
      } else {
        end_time = new Date(nightFirstStart);
        end_time.setMinutes(end_time.getMinutes() + (estimateMin - 2 * 60));
      }
    } else {
      let dif = differenceInMinutes(morningThirdEnd, time);
      if (estimateMin <= dif) {
        end_time.setMinutes(end_time.getMinutes + estimateMin);
      } else {
        end_time = new Date(nightFirstStart);
        end_time.setMinutes(end_time.getMinutes() + (estimateMin - dif));
      }
    }
  } else if (nightFirstStart <= time && time <= nightFirstEnd) {
    let dif = differenceInMinutes(nightFirstEnd, time);
    if (estimateMin <= dif) {
      end_time.setMinutes(end_time.getMinutes() + estimateMin);
    } else {
      end_time = new Date(nightSecStart);
      end_time.setMinutes(end_time.getMinutes() + (estimateMin - dif));
    }
  } else if (modifyDate(nightFirstGapStart, "date", -1) <= time && time <= modifyDate(nightSecEnd, "date", -1)) {
    if (time < modifyDate(nightFirstGapEnd, "date", -1)) {
      end_time = new Date(modifyDate(nightSecStart, "date", -1));
      if (estimateMin <= 4 * 60) {
        end_time.setMinutes(end_time.getMinutes() + estimateMin);
      } else {
        end_time = new Date(modifyDate(nightThirdStart, "date", -1));
        end_time.setMinutes(end_time.getMinutes() + (estimateMin - 4 * 60));
      }
    } else {
      let dif = differenceInMinutes(modifyDate(nightSecEnd, "date", -1), time);
      if (estimateMin <= dif) {
        end_time.setMinutes(end_time.getMinutes() + estimateMin);
      } else if (estimateMin - dif <= 150) {
        end_time = new Date(modifyDate(nightThirdStart, "date", -1));
        end_time.setMinutes(end_time.getMinutes() + (estimateMin - dif));
      } else {
        end_time = new Date(morningFirstStart);
        end_time.setMinutes(end_time.getMinutes() + (estimateMin - dif - 150));
      }
    }
  } else if (modifyDate(nightThirdStart, "date", -1) <= time && time <= modifyDate(nightThirdEnd, "date", -1)) {
    let dif = differenceInMinutes(modifyDate(nightThirdEnd, "date", -1), time);
    if (estimateMin <= dif) {
      end_time.setMinutes(end_time.getMinutes() + estimateMin);
    } else {
      end_time = new Date(year, month, day, 8, 0, 0);
      end_time.setMinutes(end_time.getMinutes() + (estimateMin - dif));
    }
  }
  console.log(`end_time: ${end_time}`);
  return end_time;
};

const util = (() => {
  // 获取数据类型
  let getType = obj => {
    let type = Object.prototype.toString.call(obj);
    return /object\s(.*)]/.exec(type)[1];
  };

  let isType = (obj, type) => {
    obj = getType(obj).toLowerCase();
    return obj === type;
  };

  return {
    isType: isType,
  };
})();

// 将obj对象传入，return一个复制后的对象出来
export const deepCopy = obj => {
  // 若不是对象类型或是null类型，直接输出
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  let i;
  // 根据目标是Array类型还是object来设置目标参数的类型
  let target = util.isType(obj, "array") ? [] : {};
  for (i in obj) {
    // 判断当前复制的对象是否为对象类型数据
    if (typeof obj[i] === "object") {
      deepCopy(obj[i]);
    }
    target[i] = obj[i];
  }
  return target;
};
