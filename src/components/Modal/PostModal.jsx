import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import RenderInfor from "../RederInfor";

const PostModal = ({
  post,
  isOpen,
  onClose,
  nextMedia,
  prevMedia,
  mediaIndex,
  direction,
  isAdminView = false,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <Dialog.Panel
        className={`bg-white ${
          post.media.length > 0
            ? "w-[90%] h-[80%] flex"
            : "w-full max-w-screen-sm h-[80%]"
        } rounded-lg overflow-hidden relative`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-700 hover:text-black"
        >
          <X size={24} />
        </button>

        {post.media.length > 0 ? (
          <>
            {/* Left - Media Slide */}
            <div className="w-[70%] bg-black flex items-center justify-center relative">
              {post.media.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-4 text-white text-3xl font-bold z-10"
                  >
                    ❮
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-4 text-white text-3xl font-bold z-10"
                  >
                    ❯
                  </button>
                </>
              )}
              <div className="max-w-full max-h-full overflow-hidden w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mediaIndex}
                    initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {post.media[mediaIndex].type.startsWith("video") ? (
                      <video
                        src={post.media[mediaIndex].url}
                        controls
                        className="max-h-full max-w-full object-contain rounded-md"
                      />
                    ) : (
                      <img
                        src={post.media[mediaIndex].url}
                        alt="Post media"
                        className="max-h-full max-w-full object-contain rounded-md"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right - Info */}
            <div className="w-[30%] h-full">
              <div className="h-full max-h-full overflow-y-auto p-4 pr-2">
                <RenderInfor post={post} isAdminView={isAdminView} />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full">
            <div className="h-full max-h-full overflow-y-auto p-5 pr-2">
              <RenderInfor post={post} isAdminView={isAdminView} />
            </div>
          </div>
        )}
      </Dialog.Panel>
    </Dialog>
  );
};
export default PostModal;
