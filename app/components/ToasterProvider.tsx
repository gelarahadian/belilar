import { Toaster } from "react-hot-toast";
import {
  HiCheckCircle,
  HiXCircle,
  HiInformationCircle,
  HiExclamation,
  HiX,
} from "react-icons/hi";

const ICON = {
  success: <HiCheckCircle className="text-xl text-emerald-400 flex-shrink-0" />,
  error: <HiXCircle className="text-xl text-red-400 flex-shrink-0" />,
  loading: (
    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin flex-shrink-0" />
  ),
  blank: (
    <HiInformationCircle className="text-xl text-blue-400 flex-shrink-0" />
  ),
  custom: (
    <HiExclamation className="text-xl text-secondary-400 flex-shrink-0" />
  ),
};

export default function ToasterProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{ top: 72 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#111827",
            fontSize: "13px",
            fontWeight: 500,
            borderRadius: "12px",
            padding: "10px 14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            border: "1px solid #f3f4f6",
            maxWidth: "320px",
          },
          success: {
            iconTheme: { primary: "#16a34a", secondary: "#f0fdf4" },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: "#ef4444", secondary: "#fef2f2" },
          },
          loading: {
            iconTheme: { primary: "#6b7280", secondary: "#f9fafb" },
          },
        }}
      />
      {children}
    </>
  );
}
