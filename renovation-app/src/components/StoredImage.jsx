import { useEffect, useState } from 'react';
import { getImageBlob } from '../utils/imageStorage';

export default function StoredImage({ image, alt, className = '' }) {
  const inlineSource = typeof image === 'string' ? image : image?.dataUrl;
  const [source, setSource] = useState(inlineSource || '');

  useEffect(() => {
    if (inlineSource || !image?.id) return undefined;

    let active = true;
    let objectUrl = '';
    getImageBlob(image.id)
      .then((blob) => {
        if (!active || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setSource(objectUrl);
      })
      .catch(() => {
        if (active) setSource('');
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [image?.id, inlineSource]);

  if (!source) {
    return <div className={`bg-gray-100 ${className}`} role="img" aria-label={`${alt}加载失败`} />;
  }

  return <img src={source} alt={alt} className={className} />;
}
