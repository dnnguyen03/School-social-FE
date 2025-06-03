import { X } from "lucide-react";

const MediaPreview = ({ mediaFiles, setMediaFiles }) => {
  if (mediaFiles.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg overflow-hidden max-h-80 overflow-y-auto pr-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {mediaFiles.map((file, idx) => {
          const isFileObject = file instanceof File;

          const url = isFileObject ? URL.createObjectURL(file) : file.url;
          const type = isFileObject ? file.type : file.type;

          const isImage = type.startsWith("image");
          const isVideo = type.startsWith("video");

          return (
            <div key={idx} className="relative group">
              {isImage && (
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-full h-40 object-cover rounded"
                />
              )}

              {isVideo && (
                <video
                  src={url}
                  className="w-full h-40 object-cover rounded"
                  muted
                  controls
                />
              )}

              <button
                onClick={() =>
                  setMediaFiles((prev) =>
                    prev.filter((_, index) => index !== idx)
                  )
                }
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                title="Xóa"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MediaPreview;
