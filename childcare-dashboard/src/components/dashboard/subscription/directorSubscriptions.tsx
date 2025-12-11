"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AddSubscriptionPopup from "@/components/dashboard/popUps/AddSubscription";

interface Subscription {
  _id: string;
  name: string;
  durationType: string;
  price: number;
  shift: string;
  isActive: boolean;
  subscriptionStart: string;
  subscriptionEnd: string;
  branch?: {
    branchName: string;
  };
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);

  const getSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/subscription/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubscriptions(res.data.subscriptions);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptions();
  }, []);

  // ⭐ تفعيل / تعطيل الاشتراك
  const toggleSubscription = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/toggleSubscriptionStatus/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: res.data.message,
        timer: 1500,
        showConfirmButton: false,
         didOpen: () => {
    const swal = document.querySelector(".swal2-container") as HTMLElement;
    if (swal) swal.style.zIndex = "40000";
  }
      });

      getSubscriptions();
    } catch (err: any) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ أثناء تغيير حالة الاشتراك",
        text: err.response?.data?.message || "",
         didOpen: () => {
    const swal = document.querySelector(".swal2-container") as HTMLElement;
    if (swal) swal.style.zIndex = "40000";
  }
      });
    }
  };

  return (
    <div className="p-2 md:p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[var(--text)]">
          الاشتراكات
        </h1>

        <button
          className="px-4 py-2 bg-[#F9B236] text-white rounded-xl"
          onClick={() => setOpenPopup(true)}
        >
          + اضافة اشتراك
        </button>
      </div>

      {/* Loading state */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {/* Empty state */}
      {!loading && subscriptions.length === 0 && (
        <p className="text-gray-500 text-center">لا توجد اشتراكات بعد</p>
      )}

      {/* Cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subscriptions.map((sub) => (
          <div
            key={sub._id}
            className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">{sub.name}</h2>

              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  sub.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {sub.isActive ? "نشط" : "غير نشط"}
              </span>
            </div>

            {/* Info */}
            <div className="text-gray-700 space-y-1 text-sm">
              <p>
                <span className="font-medium">الفرع:</span>{" "}
                {sub.branch?.branchName || "-"}
              </p>

              <p>
                <span className="font-medium">الفترة:</span> {sub.shift}
              </p>

              <p>
                <span className="font-medium">السعر:</span> {sub.price} SAR
              </p>

              <p>
                <span className="font-medium">نوع الاشتراك:</span>{" "}
                {sub.durationType}
              </p>

              <p>
                <span className="font-medium">بداية الاشتراك:</span>{" "}
                {sub.subscriptionStart
                  ? new Date(sub.subscriptionStart).toLocaleDateString("en-GB")
                  : "-"}
              </p>

              <p>
                <span className="font-medium">نهاية الاشتراك:</span>{" "}
                {sub.subscriptionEnd
                  ? new Date(sub.subscriptionEnd).toLocaleDateString("en-GB")
                  : "-"}
              </p>
            </div>

            {/* Edit Button */}
            <button className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
              تعديل
            </button>

            {/* Toggle Active Button */}
            <button
              onClick={() => toggleSubscription(sub._id)}
              className={`mt-3 w-full px-4 py-2 rounded-lg ${
                sub.isActive
                  ? "bg-red-200 hover:bg-red-300 text-red-700"
                  : "bg-green-200 hover:bg-green-300 text-green-700"
              }`}
            >
              {sub.isActive ? "تعطيل الاشتراك" : "تفعيل الاشتراك"}
            </button>
          </div>
        ))}
      </div>

      {/* Popup */}
      <AddSubscriptionPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onAdded={getSubscriptions}
      />
    </div>
  );
}
