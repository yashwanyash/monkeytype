import * as TribeState from "../tribe/tribe-state";
import * as TribeConfigSyncEvent from "../observables/tribe-config-sync-event";

import {
  CustomTextData,
  CustomTextLimit,
  CustomTextLimitMode,
  CustomTextMode,
} from "@monkeytype/shared-types";

let text: string[] = [
  "The",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "the",
  "lazy",
  "dog",
];

let mode: CustomTextMode = "repeat";
const limit: CustomTextLimit = {
  value: 9,
  mode: "word",
};
let pipeDelimiter = false;

export function getText(): string[] {
  return text;
}

export function setText(txt: string[], tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  text = txt;
  limit.value = text.length;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function getMode(): CustomTextMode {
  return mode;
}

export function setMode(val: CustomTextMode, tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  mode = val;
  limit.value = text.length;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function getLimit(): CustomTextLimit {
  return limit;
}

export function getLimitValue(): number {
  return limit.value;
}

export function getLimitMode(): CustomTextLimitMode {
  return limit.mode;
}

export function setLimitValue(val: number, tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  limit.value = val;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function setLimitMode(
  val: CustomTextLimitMode,
  tribeOverride = false
): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  limit.mode = val;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function getPipeDelimiter(): boolean {
  return pipeDelimiter;
}

export function setPipeDelimiter(val: boolean, tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  pipeDelimiter = val;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function getData(): CustomTextData {
  return {
    text,
    mode,
    limit,
    pipeDelimiter,
  };
}

type CustomTextObject = Record<string, string>;

type CustomTextLongObject = Record<string, { text: string; progress: number }>;

export function getCustomText(name: string, long = false): string[] {
  if (long) {
    const customTextLong = getLocalStorageLong();
    const customText = customTextLong[name];
    if (customText === undefined)
      throw new Error(`Custom text ${name} not found`);
    return customText.text.split(/ +/);
  } else {
    const customText = getLocalStorage()[name];
    if (customText === undefined)
      throw new Error(`Custom text ${name} not found`);
    return customText.split(/ +/);
  }
}

export function setCustomText(
  name: string,
  text: string | string[],
  long = false
): void {
  if (long) {
    const customText = getLocalStorageLong();

    customText[name] = {
      text: "",
      progress: 0,
    };

    const textByName = customText[name];
    if (textByName === undefined) {
      throw new Error("Custom text not found");
    }

    if (typeof text === "string") {
      textByName.text = text;
    } else {
      textByName.text = text.join(" ");
    }

    setLocalStorageLong(customText);
  } else {
    const customText = getLocalStorage();

    if (typeof text === "string") {
      customText[name] = text;
    } else {
      customText[name] = text.join(" ");
    }

    setLocalStorage(customText);
  }
}

export function deleteCustomText(name: string, long: boolean): void {
  const customText = long ? getLocalStorageLong() : getLocalStorage();

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete customText[name];

  if (long) {
    setLocalStorageLong(customText as CustomTextLongObject);
  } else {
    setLocalStorage(customText as CustomTextObject);
  }
}

export function getCustomTextLongProgress(name: string): number {
  const customText = getLocalStorageLong()[name];
  if (customText === undefined) throw new Error("Custom text not found");

  return customText.progress ?? 0;
}

export function setCustomTextLongProgress(
  name: string,
  progress: number
): void {
  const customTexts = getLocalStorageLong();
  const customText = customTexts[name];
  if (customText === undefined) throw new Error("Custom text not found");

  customText.progress = progress;
  setLocalStorageLong(customTexts);
}

function getLocalStorage(): CustomTextObject {
  return JSON.parse(
    window.localStorage.getItem("customText") ?? "{}"
  ) as CustomTextObject;
}

function getLocalStorageLong(): CustomTextLongObject {
  return JSON.parse(
    window.localStorage.getItem("customTextLong") ?? "{}"
  ) as CustomTextLongObject;
}

function setLocalStorage(data: CustomTextObject): void {
  window.localStorage.setItem("customText", JSON.stringify(data));
}

function setLocalStorageLong(data: CustomTextLongObject): void {
  window.localStorage.setItem("customTextLong", JSON.stringify(data));
}

export function getCustomTextNames(long = false): string[] {
  if (long) {
    return Object.keys(getLocalStorageLong());
  } else {
    return Object.keys(getLocalStorage());
  }
}
