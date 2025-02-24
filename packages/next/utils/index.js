import moment from "moment";
import BigNumber from "bignumber.js";

BigNumber.config({ EXPONENTIAL_AT: 36 });

export const encodeURIQuery = (q) =>
  Object.keys(q)
    .map((k) => `${k}=${encodeURIComponent(q[k])}`)
    .join("&");

export function addressEllipsis(address, start = 4, end = 4) {
  if (!address) return;
  if (address.length <= start + end) return address;
  if (!address.slice) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function hashEllipsis(hash = "", start = 6, end = 6) {
  if (!hash) {
    return hash;
  }

  if (hash.length <= start + end) {
    return hash;
  }

  let prefix;
  let main = hash;
  if (hash.startsWith("0x")) {
    prefix = "0x";
    main = hash.slice(2);
  }

  return `${prefix}${main.slice(0, start)}...${hash.slice(-end)}`;
}

export function timeDuration(time, roughly = false) {
  if (!time) {
    return "Unknown time";
  }
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ",
      s: (number) => number + " secs ago ",
      ss: "%d secs ago",
      m: "1 min ago",
      mm: "%d mins ago",
      h: "1 hour ago ",
      hh: "%d hours ago",
      d: "1 day ago",
      dd: "%dd ago",
      M: "1 month ago ",
      MM: "%d months ago ",
      y: "1 year ago",
      yy: "%d years ago",
    },
  });
  const now = moment();
  if (!now.isAfter(time)) {
    //todo 讨论当客户端时间不准时应当如何处理
    return moment(time).fromNow();
  }
  let ss = now.diff(time, "seconds");
  let mm = now.diff(time, "minutes");
  let hh = now.diff(time, "hours");
  let dd = now.diff(time, "days");
  if (dd) {
    hh %= 24;
    if (hh && !roughly) {
      return `${dd} day${dd > 1 ? "s" : ""} ${hh} hr${hh > 1 ? "s" : ""} ago`;
    }
    return `${dd} day${dd > 1 ? "s" : ""} ago`;
  }
  if (hh) {
    mm %= 60;
    if (mm && !roughly) {
      return `${hh} hr${hh > 1 ? "s" : ""} ${mm} min${mm > 1 ? "s" : ""} ago`;
    }
    return `${hh} hr${hh > 1 ? "s" : ""} ago`;
  }
  if (mm) {
    ss %= 60;
    if (ss && !roughly) {
      return `${mm} min${mm > 1 ? "s" : ""} ${ss} sec${ss > 1 ? "s" : ""} ago`;
    }
    return `${mm} min${mm > 1 ? "s" : ""} ago`;
  }
  return `${ss} sec${ss > 1 ? "s" : ""} ago`;
}

export function timeUTC(time) {
  return moment.utc(time).format("YYYY-MM-DD HH:mm:ss (+UTC)");
}

export function time(time) {
  if (!time) {
    return "Unknown";
  }
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
}

export function capitalize(string) {
  if (!string || typeof string !== string || string.length === 0) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getPrecision(symbol) {
  switch (symbol) {
    case "KSM":
      return 12;
    case "DOT":
      return 10;
    default:
      return 18;
  }
}

export function fromSymbolUnit(value, symbol) {
  const precision = getPrecision(symbol);
  if (value.hasOwnProperty("$numberDecimal")) {
    return new BigNumber(value["$numberDecimal"])
      .dividedBy(Math.pow(10, precision))
      .toString();
  } else {
    return new BigNumber(value).dividedBy(Math.pow(10, precision)).toString();
  }
}

export function toSymbolUnit(value, symbol) {
  const precision = getPrecision(symbol);
  return new BigNumber(value).multipliedBy(Math.pow(10, precision)).toString();
}

export function fromAssetUnit(value, decimals) {
  if (value.hasOwnProperty("$numberDecimal")) {
    return new BigNumber(value["$numberDecimal"])
      .dividedBy(Math.pow(10, decimals))
      .toString();
  } else {
    return new BigNumber(value).dividedBy(Math.pow(10, decimals)).toString();
  }
}

export function bigNumber2Locale(x) {
  let result = "";
  const [Int, Decimals] = x.split(".");
  result += Int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (Decimals) {
    result += `.${Decimals.substr(0, 6)}`; // Only display up to 6 decimals
  }
  return result;
}

export function zip(arrLeft, arrRight) {
  return arrLeft.map((val, i) => [val, arrRight[i]]);
}

export function makeTablePairs(keys, vals) {
  const result = {
    object_type: "table_pairs",
    object_data: zip(keys, vals),
  };
  result.object_data.map((pair) => {
    if (pair[0] === "Engine" && pair[1] === "0x61757261") {
      pair[1] = "AURA";
    } else if (pair[0] === "Engine" && pair[1] === "0x42454546") {
      pair[1] = "BEEFY";
    }
  });
  return result;
}

export function isNoIdentity(identity) {
  return !identity || identity?.info?.status === "NO_ID";
}
