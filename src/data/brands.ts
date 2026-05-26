import maqtob1 from '@/assets/brands/maqtob-1.png';
import maqtob2 from '@/assets/brands/maqtob-2.png';
import maqtob3 from '@/assets/brands/maqtob-3.png';
import maqtob4 from '@/assets/brands/maqtob-4.png';
import cookwarriorsLogo from '@/assets/brands/cookwarriors.svg';
import maqtobLogo from '@/assets/brands/maqtob-logo.png';
import warungMarrakechLogo from '@/assets/brands/warung-marrakech.png';
import xvoyagerLogo from '@/assets/brands/xvoyager.png';

export type BrandMetrics = {
  status: string;      // e.g. 'Profitable', 'Scaling', 'Launch phase'
  since: string;       // e.g. '2024'
  channel?: string;    // e.g. 'DTC + Amazon'
};

export type BrandData = {
  logo: string | null;
  url: string | null;
  presentationUrl: string | null;
  status: 'active' | 'dev' | 'validation' | 'exited';
  tags: string[];                // legacy — kept for v1 compatibility
  images: string[];
  // v2 additions
  sectorTags: string[];
  geoTags: string[];
  metrics?: BrandMetrics;        // active brands only
  devTimeline?: string;          // dev brands only — e.g. 'Q3 2026'
  exitYear?: string;             // exited brands only — e.g. '2024'
};

export const BRANDS_DATA: BrandData[] = [
  {
    logo: cookwarriorsLogo,
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
    logo: null,
    url: 'https://storiesofbible.com',
    presentationUrl: null,
    status: 'exited',
    tags: ['Christian Publishing', 'Books', 'US Market'],
    sectorTags: ['Publishing', 'Christian Books'],
    geoTags: ['USA'],
    exitYear: '2024',
    images: [],
  },
  {
    logo: maqtobLogo,
    url: 'https://maqtob.id',
    presentationUrl: null,
    status: 'validation',
    tags: ['Modest Fashion', 'Moroccan-Inspired', 'Indonesian Craft', 'France'],
    sectorTags: ['Modest Fashion', 'Moroccan-Inspired', 'Indonesian Craft'],
    geoTags: ['Indonesia', 'France', 'EU'],
    devTimeline: 'Q3 2026',
    images: [maqtob1, maqtob2, maqtob3, maqtob4],
  },
  {
    logo: xvoyagerLogo,
    url: null,
    presentationUrl: null,
    status: 'dev',
    tags: ['Exploration', 'Lifestyle', 'Global'],
    sectorTags: ['Exploration', 'Lifestyle'],
    geoTags: ['Global'],
    devTimeline: 'Q1 2027',
    images: [],
  },
  {
    logo: warungMarrakechLogo,
    url: null,
    presentationUrl: null,
    status: 'dev',
    tags: ['Food & Beverage', 'Hospitality', 'Moroccan'],
    sectorTags: ['Food & Beverage', 'Hospitality'],
    geoTags: ['Morocco', 'Indonesia'],
    devTimeline: 'Q4 2026',
    images: [],
  },
];
