import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { REPORT_REASONS } from "../../shared/reportReasons";

const ReportDialog = ({ show, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    const reason =
      selectedReason === "Khác" ? customReason.trim() : selectedReason;
    if (!reason) return alert("Vui lòng chọn hoặc nhập lý do.");
    onSubmit(reason);
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      {/* Lớp phủ nền mờ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        aria-hidden="true"
      />

      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 space-y-4 z-50">
          <Dialog.Title className="text-lg font-bold">
            Báo cáo bài viết
          </Dialog.Title>

          <div className="space-y-2">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                />
                <span>{reason}</span>
              </label>
            ))}

            {selectedReason === "Khác" && (
              <textarea
                className="w-full p-2 border rounded mt-2"
                rows={3}
                placeholder="Nhập lý do cụ thể..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleSubmit}
            >
              Gửi báo cáo
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReportDialog;
