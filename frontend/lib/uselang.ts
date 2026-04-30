// /lib/uselang.ts

import { useEffect, useState } from "react";
import { translations } from "./multilang";

type Lang = keyof typeof translations;

let listeners: Function[] = [];
let currentLang: Lang = "en";

export function useLang() {
  const [lang, setLang] = useState(currentLang);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved in translations) currentLang = saved as Lang;
    setLang(currentLang);

    listeners.push(setLang);

    return () => {
      listeners = listeners.filter((l) => l !== setLang);
    };
  }, []);

  const changeLang = (newLang: Lang) => {
    currentLang = newLang;
    localStorage.setItem("lang", newLang);

    // 🔥 notify ALL components
    listeners.forEach((l) => l(newLang));
  };

  const t = translations[lang];

  return { lang, changeLang, t };
}