export type BrandMetrics = {
  status: string;      // e.g. 'Profitable', 'Scaling', 'Launch phase'
  since: string;       // e.g. '2024'
  channel?: string;    // e.g. 'DTC + Amazon'
};

export type BrandData = {
  logo: string | null;
  url: string | null;
  presentationUrl: string | null;
  status: 'active' | 'dev';
  tags: string[];                // legacy — kept for v1 compatibility
  images: string[];
  // v2 additions
  sectorTags: string[];
  geoTags: string[];
  metrics?: BrandMetrics;        // active brands only
  devTimeline?: string;          // dev brands only — e.g. 'Q3 2026'
};

export const BRANDS_DATA: BrandData[] = [
  {
    logo: 'https://vorvn.com/wp-content/uploads/2024/08/cookwarriors.png',
    url: 'https://cookwarriors.com',
    presentationUrl: 'https://vorvn.com/presentations/cookwarriors.pdf',
    status: 'active',
    tags: ['E-Commerce', 'Kitchenware', 'DTC'],
    sectorTags: ['Consumer Goods', 'Kitchenware', 'DTC'],
    geoTags: ['USA', 'UAE'],
    metrics: {
      status: 'Profitable',
      since: '2024',
      channel: 'DTC + Amazon',
    },
    images: [
      'https://cookwarriors.com/cdn/shop/files/6-eggscalibur-pan-sword-pan-sword-handle-frying-pan-cookwarriors-buy.webp?v=1775534988',
      'https://cookwarriors.com/cdn/shop/files/5-eggscalibur-pan-sword-pan-sword-handle-frying-pan-cookwarriors-buy.webp?v=1759968518',
      'https://cookwarriors.com/cdn/shop/files/7-eggscalibur-pan-sword-pan-sword-handle-frying-pan-cookwarriors-buy.webp?v=1751243279',
      'https://cookwarriors.com/cdn/shop/files/2-eggscalibur-pan-sword-pan-sword-handle-frying-pan-cookwarriors-buy.webp?v=1759968518',
    ],
  },
  {
    logo: 'https://vorvn.com/wp-content/uploads/2024/08/maqtob.png',
    url: null,
    presentationUrl: null,
    status: 'dev',
    tags: ['Modest Fashion', 'EU Market', 'Craftsmanship'],
    sectorTags: ['Modest Fashion', 'Craftsmanship'],
    geoTags: ['France', 'EU'],
    devTimeline: 'Q3 2026',
    images: [
      'https://picsum.photos/seed/mq-1/800/800',
      'https://picsum.photos/seed/mq-2/800/800',
      'https://picsum.photos/seed/mq-3/800/800',
      'https://picsum.photos/seed/mq-4/800/800',
      'https://picsum.photos/seed/mq-5/800/800',
      'https://picsum.photos/seed/mq-6/800/800',
    ],
  },
  {
    logo: 'https://vorvn.com/wp-content/uploads/2024/08/xvoyager.png',
    url: null,
    presentationUrl: null,
    status: 'dev',
    tags: ['Exploration', 'Lifestyle', 'Global'],
    sectorTags: ['Exploration', 'Lifestyle'],
    geoTags: ['Global'],
    devTimeline: 'Q1 2027',
    images: [
      'https://picsum.photos/seed/xv-1/800/800',
      'https://picsum.photos/seed/xv-2/800/800',
      'https://picsum.photos/seed/xv-3/800/800',
      'https://picsum.photos/seed/xv-4/800/800',
      'https://picsum.photos/seed/xv-5/800/800',
      'https://picsum.photos/seed/xv-6/800/800',
    ],
  },
  {
    logo: 'https://vorvn.com/wp-content/uploads/2024/08/warung-marrakech-300x216.png',
    url: null,
    presentationUrl: null,
    status: 'dev',
    tags: ['Food & Beverage', 'Hospitality', 'Moroccan'],
    sectorTags: ['Food & Beverage', 'Hospitality'],
    geoTags: ['Morocco', 'Indonesia'],
    devTimeline: 'Q4 2026',
    images: [
      'https://picsum.photos/seed/wm-1/800/800',
      'https://picsum.photos/seed/wm-2/800/800',
      'https://picsum.photos/seed/wm-3/800/800',
      'https://picsum.photos/seed/wm-4/800/800',
      'https://picsum.photos/seed/wm-5/800/800',
      'https://picsum.photos/seed/wm-6/800/800',
    ],
  },
];
