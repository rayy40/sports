import Image from "next/image";
import { useEffect, useState } from "react";

const fallbackImage = "https://media.api-sports.io/basketball/teams/4921.png";

const ImageWithFallback = ({
  fallback = fallbackImage,
  alt,
  src,
  loading = "lazy",
  width = 40,
  height = 40,
  ...props
}) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      loading={loading}
      width={width}
      height={height}
      style={{ aspectRatio: "1/1", borderRadius: "50%", objectFit: "contain" }}
      alt={alt}
      onError={setError}
      src={error ? fallbackImage : src}
      {...props}
    />
  );
};

export default ImageWithFallback;
