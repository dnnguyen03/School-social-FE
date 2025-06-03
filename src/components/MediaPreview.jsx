const MediaPreview = ({ media = [], onClick }) => {
  if (media.length === 0) return null;

  const count = media.length;
  const previewClass = "object-cover rounded-lg h-60 w-full";

  if (count === 1) {
    return (
      <img
        src={media[0].url}
        className={`${previewClass} mb-2 cursor-pointer`}
        onClick={onClick}
      />
    );
  }

  if (count === 2) {
    return (
      <div className="flex gap-2 mb-2" onClick={onClick}>
        {media.slice(0, 2).map((m, i) => (
          <img
            key={i}
            src={m.url}
            className="w-1/2 h-60 object-cover rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="flex gap-2 mb-2" onClick={onClick}>
        <img
          src={media[0].url}
          className="w-1/2 h-60 object-cover rounded-lg"
        />
        <div className="flex flex-col gap-2 w-1/2">
          <img
            src={media[1].url}
            className="w-full h-28 object-cover rounded-lg"
          />
          <img
            src={media[2].url}
            className="w-full h-28 object-cover rounded-lg"
          />
        </div>
      </div>
    );
  }

  if (count > 3) {
    return (
      <div className="flex gap-2 mb-2" onClick={onClick}>
        <img
          src={media[0].url}
          className="w-1/2 h-60 object-cover rounded-lg"
        />
        <div className="flex flex-col justify-between gap-2 w-1/2">
          <img
            src={media[1].url}
            className="w-full h-28 object-cover rounded-lg"
          />
          <div className="relative h-28">
            <img
              src={media[2].url}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-xl rounded-lg">
              +{count - 3}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MediaPreview;
