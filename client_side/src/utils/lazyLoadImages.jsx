import { useEffect } from 'react';

const LazyLoadImages = () => {
  useEffect(() => {
    const images = document.querySelectorAll('img[data-src]');
    console.log('Images found:', images.length);

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          const img = entry.target;
          if (entry.isIntersecting && !img.dataset.loaded) {
            console.log('Loading image:', img.getAttribute('data-src'));
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            img.style.transition = 'opacity 1s, transform 1s ease-out';
            img.style.opacity = 1;
            img.style.transform = 'translateX(0)';
            img.dataset.loaded = 'true';
            observer.unobserve(img); // Stop observing the image after it is loaded
          }
        });
      },
      { threshold: 0.1 }
    );

    images.forEach(img => {
      if (!img.dataset.loaded) {
        console.log('Observing image:', img);
        observer.observe(img);
        img.style.opacity = 0;
        img.style.transform = 'translateX(-100%)';
      }
    });

    return () => {
      images.forEach(img => {
        observer.unobserve(img);
      });
      observer.disconnect();
    };
  }, []);

  return null;
};

export default LazyLoadImages;
