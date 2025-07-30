import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-40 z-50">
      <div className="bg-white p-5 rounded-xl shadow-xl w-[90%] max-w-[350px] sm:max-w-[300px]">
        <h2 className="text-lg font-semibold mb-2 text-center">
          {title || 'Xác nhận'}
        </h2>
        <p className="mb-4 text-sm text-center">
          {message || 'Bạn có chắc chắn muốn tiếp tục không?'}
        </p>
        <div className="flex justify-center gap-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={onConfirm}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
