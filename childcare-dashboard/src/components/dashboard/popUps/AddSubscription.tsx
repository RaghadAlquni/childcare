"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Branch {
  _id: string;
  branchName: string;
}

interface AddSubscriptionPopupProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddSubscriptionPopup({
  open,
  onClose,
  onAdded,
}: AddSubscriptionPopupProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  const showAlert = (title: string, text: string, icon: any = "error") => {
  Swal.fire({
    title,
    text,
    icon,
    didOpen: () => {
      const swal = document.querySelector(".swal2-container") as HTMLElement;
      if (swal) swal.style.zIndex = "9999";
    },
  });
};


  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    durationType: "",
    ageFrom: "",
    ageTo: "",
    subscriptionStart: "",
    subscriptionEnd: "",
    branch: "",
    shift: "",
    isActive: true,
  });

  // Fetch branches
  const getBranches = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/allBranchs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBranches(res.data.data || []);
    } catch (err) {
      console.log(err);
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
  if (open) {
    setForm({
      name: "",
      price: "",
      description: "",
      durationType: "",
      ageFrom: "",
      ageTo: "",
      subscriptionStart: "",
      subscriptionEnd: "",
      branch: "",
      shift: "",
      isActive: true,
    });

    getBranches();
  }
}, [open]);
  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      // Validation
      if (!form.name)
        return showAlert("خطأ", "الرجاء كتابة اسم الاشتراك", "error");
      if (!form.price)
        
        return showAlert("خطأ", "الرجاء كتابة السعر", "error");
      if (!form.durationType)
        return showAlert("خطأ", "الرجاء اختيار نوع المدة", "error");
      if (!form.ageFrom || !form.ageTo)
        return showAlert("خطأ", "الرجاء إدخال الفئة العمرية", "error");
      if (!form.branch)
        return showAlert("خطأ", "الرجاء اختيار الفرع", "error");
      if (!form.shift)
        return showAlert("خطأ", "الرجاء اختيار الشفت", "error");

      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        durationType: form.durationType,

        ageRange: {
          from: form.ageFrom,
          to: form.ageTo,
        },

        subscriptionStart: form.subscriptionStart,
        subscriptionEnd: form.subscriptionEnd,
        branch: form.branch,
        shift: form.shift,
        isActive: form.isActive,
      };

      await axios.post("http://localhost:5000/subscription/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showAlert("تم!", "تم إضافة الاشتراك بنجاح", "success");

      onAdded();
      onClose();
    } catch (err: any) {
      console.log(err);

      showAlert(
        "فشل!",
        err.response?.data?.message || "حدث خطأ أثناء إضافة الاشتراك",
        "error"
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[2000]">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg animate-fade">
        <h2 className="text-xl font-semibold mb-4">Add New Subscription</h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Subscription Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium mb-1">Price (SAR)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            ></textarea>
          </div>

          {/* Duration Type */}
          <div>
            <label className="block font-medium mb-1">Duration Type</label>
            <select
              name="durationType"
              value={form.durationType}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">اختر المدة</option>
              <option value="اسبوعي">اسبوعي</option>
              <option value="شهري">شهري</option>
              <option value="فصلي">فصلي</option>
            </select>
          </div>

          {/* Age Range */}
          <div>
            <label className="block font-medium mb-1">Age Range (From)</label>
            <input
              type="text"
              name="ageFrom"
              value={form.ageFrom}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="مثال: 3 سنوات"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Age Range (To)</label>
            <input
              type="text"
              name="ageTo"
              value={form.ageTo}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="مثال: 5 سنوات"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block font-medium mb-1">Subscription Start</label>
            <input
              type="date"
              name="subscriptionStart"
              value={form.subscriptionStart}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block font-medium mb-1">Subscription End</label>
            <input
              type="date"
              name="subscriptionEnd"
              value={form.subscriptionEnd}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block font-medium mb-1">Branch</label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Choose branch</option>

              {!loadingBranches &&
                Array.isArray(branches) &&
                branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.branchName}
                  </option>
                ))}
            </select>
          </div>

          {/* Shift */}
          <div>
            <label className="block font-medium mb-1">Shift</label>
            <select
              name="shift"
              value={form.shift}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select shift</option>
              <option value="صباح">صباح</option>
              <option value="مساء">مساء</option>
            </select>
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <label className="font-medium">Active Status</label>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={() =>
                setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
              }
            />
            <span>{form.isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

