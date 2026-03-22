const animationMap = {
  "animate-none": "none",
  "animate-spin": "tadka-spin 1s linear infinite",
  "animate-ping": "tadka-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
  "animate-pulse": "tadka-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  "animate-bounce": "tadka-bounce 1s infinite",
};

let injected = false;

export function ensureAnimationKeyframes() {
  if (injected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.id = "tadka-keyframes";
  style.textContent = `
@keyframes tadka-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes tadka-ping { 75%, 100% { transform: scale(2); opacity: 0; } }
@keyframes tadka-pulse { 50% { opacity: .5; } }
@keyframes tadka-bounce {
  0%,100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,.2,1); }
}`;
  document.head.appendChild(style);
  injected = true;
}

export function resolveAnimations(token) {
  if (!animationMap[token]) return null;
  ensureAnimationKeyframes();
  return { animation: animationMap[token] };
}
