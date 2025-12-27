// src/config/slideshowImages.js

export const SLIDESHOW_IMAGES = {
  // ===== LANDING PAGE HERO IMAGES =====
  landing: [
    {
      url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200',
      alt: 'Modern dry cleaning facility with professional equipment',
      caption: 'Professional Dry Cleaning Services'
    },
    {
      url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200',
      alt: 'Dry cleaning worker organizing clean clothes',
      caption: 'Expert Garment Care'
    },
    {
      url: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=1200',
      alt: 'Customer receiving clean clothes at dry cleaning counter',
      caption: 'Quality Customer Service'
    },
    {
      url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200',
      alt: 'Industrial washing machines in laundry facility',
      caption: 'State-of-the-Art Equipment'
    },
    {
      url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=1200',
      alt: 'Fresh clean laundry hanging on rack',
      caption: 'Pristine Results Every Time'
    }
  ],

  // ===== LOGIN PAGE IMAGES =====
  login: [
    {
      url: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800',
      alt: 'Professional dry cleaning staff at work',
      caption: 'Welcome Back'
    },
    {
      url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
      alt: 'Organized dry cleaning facility',
      caption: 'Access Your Dashboard'
    },
    {
      url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800',
      alt: 'Modern laundry equipment',
      caption: 'Manage Your Business'
    },
    {
      url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800',
      alt: 'Clean and organized workspace',
      caption: 'Streamline Operations'
    }
  ],

  // ===== REGISTER PAGE IMAGES =====
  register: [
    {
      url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800',
      alt: 'Fresh laundry on hangers',
      caption: 'Start Your Journey'
    },
    {
      url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800',
      alt: 'Professional dry cleaning setup',
      caption: 'Join CleanPro Today'
    },
    {
      url: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800',
      alt: 'Happy customer at dry cleaning service',
      caption: 'Grow Your Business'
    },
    {
      url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
      alt: 'Organized laundry workspace',
      caption: 'Simplify Management'
    }
  ]
};

// Preload all images for smooth transitions
export const preloadSlideshowImages = () => {
  const allImages = [
    ...SLIDESHOW_IMAGES.landing,
    ...SLIDESHOW_IMAGES.login,
    ...SLIDESHOW_IMAGES.register
  ];

  allImages.forEach((image) => {
    const img = new Image();
    img.src = image.url;
  });
};