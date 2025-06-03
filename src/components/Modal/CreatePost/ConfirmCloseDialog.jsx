const ConfirmCloseDialog = ({
  show,
  onCancel,
  onConfirm,
  isEditing = false,
}) => {
  if (!show) return null;

  const title = isEditing ? "Hủy chỉnh sửa?" : "Hủy bài viết?";
  const message = isEditing
    ? "Các thay đổi bạn vừa thực hiện sẽ bị mất. Bạn có chắc chắn muốn hủy chỉnh sửa?"
    : "Mọi nội dung đang viết sẽ bị xóa. Bạn có chắc chắn?";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[99999]">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            {isEditing ? "Tiếp tục chỉnh sửa" : "Tiếp tục viết"}
          </button>
          <button
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            {isEditing ? "Hủy chỉnh sửa" : "Hủy bài viết"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCloseDialog;
