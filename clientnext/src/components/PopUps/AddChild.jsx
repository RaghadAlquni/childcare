"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = "http://localhost:5000";

/* --------------------------------------------------------- */
/* SweetAlert */
const showAlert = (options) =>
  Swal.fire({
    ...options,
    didOpen: () => {
      const el = document.querySelector(".swal2-container");
      if (el) el.style.zIndex = "20001";
    },
  });

/* --------------------------------------------------------- */
/* العمر */
const getAge = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  const t = new Date();
  let age = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();

  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
  return age;
};

/* --------------------------------------------------------- */
/* رقم سعودي */
function SaudiPhone({ name, label }) {
  const [num, setNum] = useState("");

  const handle = (e) => {
    const d = e.target.value.replace(/\D/g, "");
    if (d.length <= 9) setNum(d);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>

      <div className="flex gap-2 items-center">
        <div className="w-28 h-[52px] flex items-center justify-center gap-1 rounded-xl border bg-gray-100 border-gray-300">
          🇸🇦 <span className="font-semibold">+966</span>
        </div>

        <input
          type="text"
          inputMode="numeric"
          placeholder="5XXXXXXXX"
          value={num}
          onChange={handle}
          className="flex-1 h-[52px] rounded-xl border bg-gray-100 border-gray-300 px-3 text-right outline-none"
        />
      </div>

      <input type="hidden" name={name} value={num ? `+966${num}` : ""} />
    </div>
  );
}

/* --------------------------------------------------------- */
/* Popup */
export default function AddChildPopup({ open, setOpen }) {
  const [active, setActive] = useState("new");
  const [branches, setBranches] = useState([]);
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const b = await axios.get(`${API_BASE}/allBranchs`);
        const s = await axios.get(`${API_BASE}/allSubscription`);
        setBranches(b.data.data || []);
        setSubs(s.data.data || []);
      } catch {
        showAlert({ icon: "error", title: "خطأ", text: "تعذر تحميل البيانات" });
      }
    })();
  }, [open]);

  if (!open) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center px-3"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl border p-6 w-full max-w-[700px] max-h-[90vh] overflow-y-auto relative"
      >
        {/* X */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
        >
          ×
        </button>

        {/* Tabs */}
        <div className="flex justify-center mb-6 mt-8">
          <div className="w-full bg-white rounded-xl border border-gray-200 flex overflow-hidden shadow-sm">
            {["new", "renew"].map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`flex-1 py-3 font-bold flex items-center justify-center ${
                  active === t
                    ? "text-[#F9B236] bg-[rgba(249,178,54,0.1)] border-t-[3px] border-[#F9B236] font-bold"
                    : "text-gray-600"
                }`}
              >
                {t === "new" ? "تسجيل طفل جديد" : "تجديد اشتراك طفل"}
              </button>
            ))}
          </div>
        </div>

        {active === "new" ? (
          <NewForm branches={branches} subs={subs} setOpen={setOpen} />
        ) : (
          <RenewForm subs={subs} setOpen={setOpen} />
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- */
/* تسجيل جديد */
function NewForm({ branches, subs, setOpen }) {
  const [civilId, setCivil] = useState("");
  const [childStatus, setStatus] = useState("");

  const checkChild = async (id) => {
    if (id.length !== 10) return;
    try {
      const r = await axios.get(`${API_BASE}/children/${id}`);
      const c = r.data.child;

      if (!c) return setStatus("new");
      if (c.status === "مؤكد")
        return alertMsg("الطفل مسجل مسبقًا.");
      if (c.status === "مضاف")
        return alertMsg("سبق تسجيل الطفل وهو قيد الانتظار.");
      if (c.status === "غير مفعل")
        return alertMsg("الطفل موجود — استخدمي تجديد الاشتراك.");

      setStatus("new");
    } catch {
      setStatus("new");
    }
  };

  const alertMsg = (t) =>
    showAlert({ icon: "warning", title: "تنبيه", text: t });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);

    if (civilId.length !== 10)
      return alertMsg("السجل يجب أن يكون 10 أرقام.");

    const data = {
      childName: f.get("fullName"),
      idNumber: Number(civilId),
      dateOfBirth: f.get("birthDate"),
      gender: f.get("gender"),
      branch: f.get("branch"),
      shift: f.get("shift"),
      subscriptionId: f.get("subscriptionId"),
      guardian: [
        {
          guardianName: f.get("g1Name"),
          relationship: f.get("g1Rel"),
          phoneNumber: f.get("g1Phone"),
        },
        {
          guardianName: f.get("g2Name"),
          relationship: f.get("g2Rel"),
          phoneNumber: f.get("g2Phone"),
        },
      ],
      status: "مضاف",
    };

    /* تحقق الحقول */
    if (Object.values(data).some((v) => !v))
      return alertMsg("يجب تعبئة جميع الحقول.");

    /* تحقق العمر */
    const age = getAge(data.dateOfBirth);
    if (age < 2 || age > 12)
      return alertMsg("العمر يجب أن يكون بين 2 و 12.");

    try {
      await axios.post(`${API_BASE}/parent/add-child`, data);
      await showAlert({
        icon: "success",
        title: "تم التسجيل",
        text: "تم إرسال الطلب.",
      });
      setOpen(false);
    } catch (err) {
      showAlert({
        icon: "error",
        title: "خطأ",
        text: err?.response?.data?.message || "تعذر إضافة الطفل.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-[22px] font-bold text-gray-800">تسجيل طفل جديد</h2>
      <p className="text-sm text-gray-700 bg-[#FFF8E8] rounded-xl px-4 py-2 border border-[#FFE3A9]">
        <span className="font-semibold">تنبيه:</span> إذا كان الطفل مسجل مسبقًا، اختاري (تجديد اشتراك).
      </p>
      <Input name="fullName" label="اسم الطفل الرباعي" />

      <Input
        name="civilId"
        label="السجل المدني"
        placeholder="10 أرقام"
        value={civilId}
        inputMode="numeric"
        maxLength={10}
        onChange={(e) => setCivil(e.target.value.replace(/\D/g, ""))}
        onBlur={() => civilId.length === 10 && checkChild(civilId)}
      />

      <Input name="birthDate" label="تاريخ الميلاد" type="date" />

      <Select name="gender" label="الجنس">
        <option value="">اختاري الجنس</option>
        <option value="بنت">بنت</option>
        <option value="ولد">ولد</option>
      </Select>

      <Select name="branch" label="الفرع">
        <option value="">اختاري الفرع</option>
        {branches.map((b) => (
          <option key={b._id} value={b._id}>
            {b.branchName}
          </option>
        ))}
      </Select>

      <Select name="shift" label="الفترة">
        <option value="">اختاري الفترة</option>
        <option value="صباح">صباح</option>
        <option value="مساء">مساء</option>
      </Select>

      <Select name="subscriptionId" label="نوع الاشتراك">
        <option value="">اختاري نوع الاشتراك</option>
        {subs.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name} — {s.price} ريال
          </option>
        ))}
      </Select>

      <Guardian index={1} />
      <Guardian index={2} />

      <Submit label="إرسال الطلب" />
    </form>
  );
}

/* --------------------------------------------------------- */
/* تجديد */
function RenewForm({ subs, setOpen }) {
  const [civilId, setCivil] = useState("");
  const [step, setStep] = useState(1);
  const [childId, setChild] = useState("");
  const [selected, setSelected] = useState("");

  const check = async (id) => {
    if (id.length !== 10) return;

    try {
      const r = await axios.get(`${API_BASE}/parent/check-child/${id}`);
      const { exists, status, child } = r.data;

      if (!exists)
        return showAlert({
          icon: "error",
          title: "غير موجود",
          text: "لا يوجد طفل بهذا السجل.",
        });

      const age = getAge(child.dateOfBirth);
      if (age < 2 || age > 12)
        return showAlert({
          icon: "warning",
          title: "العمر غير مناسب",
          text: "لا يمكن التجديد.",
        });

      if (status !== "غير مفعل")
        return showAlert({
          icon: "warning",
          title: "لا يمكن التجديد",
          text: "تم تقديم طلب سابق أو الاشتراك فعال.",
        });

      setChild(child._id);
      setStep(2);
    } catch {
      showAlert({ icon: "error", title: "خطأ", text: "تعذر التحقق" });
    }
  };

  const doRenew = async () => {
    if (!selected)
      return showAlert({
        icon: "warning",
        title: "تنبيه",
        text: "اختاري الاشتراك.",
      });

    try {
      await axios.post(`${API_BASE}/parent/renew-subscription`, {
        childId,
        subscriptionId: selected,
      });

      await showAlert({
        icon: "success",
        title: "تم التجديد",
        text: "تم استلام الطلب.",
      });

      setOpen(false);
    } catch {
      showAlert({
        icon: "error",
        title: "خطأ",
        text: "تعذر التجديد.",
      });
    }
  };

  return (
    <form className="flex flex-col gap-6">
<h2 className="text-[22px] font-bold text-gray-800">تجديد الاشتراك</h2>

      <p className="text-sm text-gray-700 bg-[#FFF8E8] rounded-xl px-4 py-2 border border-[#FFE3A9]">
        <span className="font-semibold">تنبيه:</span> لا يمكن التجديد لطفل اشتراكه ما زال فعالًا.
      </p>

      {step === 1 && (
        <Input
          name="civilId"
          label="السجل المدني"
          placeholder="10 أرقام"
          value={civilId}
          inputMode="numeric"
          maxLength={10}
          onChange={(e) => setCivil(e.target.value.replace(/\D/g, ""))}
          onBlur={() => civilId.length === 10 && check(civilId)}
        />
      )}

      {step === 2 && (
        <>
          <Select
            name="subscription"
            label="اختاري نوع الاشتراك"
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">اختاري الاشتراك</option>
            {subs.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} — {s.price} ريال
              </option>
            ))}
          </Select>

          <button
            type="button"
            onClick={doRenew}
            className="w-full bg-green-600 text-white h-[52px] rounded-xl text-lg font-semibold flex items-center justify-center"
          >
            تأكيد التجديد
          </button>
        </>
      )}
    </form>
  );
}

/* --------------------------------------------------------- */
/* Components */
function Title({ children }) {
  return (
    <h2 className="text-[22px] font-bold text-gray-800 text-center">
      {children}
    </h2>
  );
}

function Input({ name, label, placeholder, type = "text", ...rest }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-[52px] rounded-xl border bg-gray-100 border-gray-300 px-3 text-right outline-none"
        {...rest}
      />
    </div>
  );
}

function Select({ name, label, children, ...rest }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <select
        name={name}
        defaultValue=""
        className="h-[52px] rounded-xl border bg-gray-100 border-gray-300 px-3 text-right outline-none"
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

function Guardian({ index }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 bg-white">
      <Input name={`g${index}Name`} label={`اسم ولي الأمر ${index}`} />
      <Input name={`g${index}Rel`} label="صلة القرابة" />
      <SaudiPhone name={`g${index}Phone`} label="رقم الجوال" />
    </div>
  );
}

function Submit({ label }) {
  return (
    <button
      type="submit"
      className="w-full h-[52px] rounded-xl bg-[#F9B236] text-white text-lg font-semibold flex items-center justify-center"
    >
      {label}
    </button>
  );
}
