
export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'archive';
  description: string;
  downloadCount: number;
  date: string;
}

export const fileData: FileItem[] = [
  {
    id: "file-001",
    name: "Project Documentation.pdf",
    size: "5.2 MB",
    type: "document",
    description: "Complete documentation for the project, including requirements and specifications.",
    downloadCount: 3472,
    date: "2023-12-15"
  },
  {
    id: "file-002",
    name: "Design Assets.zip",
    size: "23.7 MB",
    type: "archive",
    description: "Collection of design assets, including icons, logos, and UI elements.",
    downloadCount: 1856,
    date: "2023-11-28"
  },
  {
    id: "file-003",
    name: "Tutorial Video.mp4",
    size: "128.5 MB",
    type: "video",
    description: "Step-by-step tutorial video showing how to implement the new features.",
    downloadCount: 958,
    date: "2024-01-05"
  },
  {
    id: "file-004",
    name: "Product Showcase.jpg",
    size: "3.1 MB",
    type: "image",
    description: "High-resolution product showcase image for marketing materials.",
    downloadCount: 2145,
    date: "2024-02-10"
  },
  {
    id: "file-005",
    name: "Audio Transcript.mp3",
    size: "18.9 MB",
    type: "audio",
    description: "Audio recording of the conference keynote presentation.",
    downloadCount: 756,
    date: "2024-01-22"
  },
  {
    id: "file-006",
    name: "Research Data.xlsx",
    size: "4.5 MB",
    type: "document",
    description: "Comprehensive research data with analysis and charts.",
    downloadCount: 1203,
    date: "2024-02-18"
  }
];

export interface AdContent {
  id: string;
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
}

export const adData: AdContent[] = [
  {
    id: "ad-001",
    title: "Premium Subscription",
    description: "Upgrade now for unlimited downloads and no popup ads. Enjoy faster speeds!",
    cta: "Upgrade Now",
    ctaLink: "#premium"
  },
  {
    id: "ad-002",
    title: "VPN Protection",
    description: "Secure your downloads with our top-rated VPN service. Browse anonymously.",
    cta: "Get Protected",
    ctaLink: "#vpn"
  },
  {
    id: "ad-003",
    title: "Cloud Storage",
    description: "Never lose your files again. Back up your downloads with our cloud service.",
    cta: "Try Free",
    ctaLink: "#cloud"
  },
  {
    id: "ad-004",
    title: "File Converter Pro",
    description: "Convert your files to any format with our easy-to-use tool.",
    cta: "Convert Now",
    ctaLink: "#converter"
  },
  {
    id: "ad-005",
    title: "Antivirus Protection",
    description: "Scan your downloads for viruses with our premium antivirus software.",
    cta: "Scan Files",
    ctaLink: "#antivirus"
  }
];
