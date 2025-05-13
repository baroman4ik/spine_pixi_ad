export function playableLoaded() {
  console.log("%c Test.js: playableLoaded — плеер загружен", "color: green; font-weight: bold;");
}

export function playableStarted() {
  console.log("%c Test.js: playableStarted — плеер запущен", "color: blue; font-weight: bold;");
}

export function playableFinished() {
  console.log("%c Test.js: playableFinished — плеер завершён", "color: orange; font-weight: bold;");
}

export function playableGoToStore() {
  console.log("%c Test.js: playableGoToStore — переход в магазин", "color: red; font-weight: bold;");
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const iosStoreLink = "https://apps.apple.com/app/id967819908";
  const androidStoreLink =
    "https://play.google.com/store/apps/details?id=com.awem.cradleofempires.andr";

  if (/android/i.test(userAgent)) window.open(androidStoreLink, "_blank");
  else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
    window.open(iosStoreLink, "_blank");
  else window.open(androidStoreLink, "_blank");
}
