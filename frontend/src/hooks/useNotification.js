import { useEffect } from "react";
import socket from "../socket";
import { toast } from "react-toastify";

const useNotification = () => {
  useEffect(() => {
    socket.on("newNotification", (data) => {
      // Premium toast styling with enhanced options
      toast.info(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "linear-gradient(135deg, #1c1f4c 0%, #1c1f4c/95 100%)",
          color: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 16px",
        },
        icon: (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00848c] to-[#00848c]/80 flex items-center justify-center shadow-lg">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8V11.1C6 12.4 5.5 13.6 4.7 14.5L4.5 14.7C3.5 15.9 4.2 17.6 5.8 17.9C10.4 18.7 13.6 18.7 18.2 17.9C19.8 17.6 20.5 15.9 19.5 14.7L19.3 14.5C18.5 13.6 18 12.3 18 11.1V8Z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M9 18C9.5 19.5 10.8 20.5 12.5 20.5C14.2 20.5 15.5 19.5 16 18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        ),
      });
    });

    return () => socket.off("newNotification");
  }, []);
};

export default useNotification;
