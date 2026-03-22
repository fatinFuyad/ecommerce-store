import { useEffect } from "react";
import { useRef } from "react";

// listen capturing while working with modals and popups or custom toast, context menu

function useClickOutside(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }

      document.addEventListener("click", handleClick, listenCapturing); // this is important that event needs to happen in the capturing phase;

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );
  return ref;
}

export default useClickOutside;
