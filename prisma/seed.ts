import { PrismaClient, SettingType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // General Settings
  const generalSettings = [
    {
      group: 'general',
      key: 'site_name',
      value: 'Video Sharing Platform',
      type: SettingType.TEXT,
      label: 'Site Name',
      description: 'The name of your website',
      sortOrder: 1,
    },
    {
      group: 'general',
      key: 'site_logo',
      value: '/images/logo.png',
      type: SettingType.FILE,
      label: 'Site Logo',
      description: 'Upload your site logo',
      sortOrder: 2,
    },
    {
      group: 'general',
      key: 'site_favicon',
      value: '/favicon.ico',
      type: SettingType.FILE,
      label: 'Site Favicon',
      description: 'Upload your site favicon',
      sortOrder: 3,
    },
    {
      group: 'general',
      key: 'site_email',
      value: 'contact@example.com',
      type: SettingType.TEXT,
      label: 'Site Email',
      description: 'Contact email address',
      sortOrder: 4,
    },
    {
      group: 'general',
      key: 'site_phone',
      value: '+1234567890',
      type: SettingType.TEXT,
      label: 'Site Phone',
      description: 'Contact phone number',
      sortOrder: 5,
    },
    {
      group: 'general',
      key: 'site_address',
      value: '123 Main Street, City, Country',
      type: SettingType.TEXTAREA,
      label: 'Site Address',
      description: 'Physical address',
      sortOrder: 6,
    },
    {
      group: 'general',
      key: 'footer_text',
      value: '© 2024 Video Platform. All rights reserved.',
      type: SettingType.TEXTAREA,
      label: 'Footer Text',
      description: 'Text displayed in footer',
      sortOrder: 7,
    },
    {
      group: 'general',
      key: 'timezone',
      value: 'UTC',
      type: SettingType.SELECT,
      options: JSON.stringify(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']),
      label: 'Timezone',
      description: 'Site timezone',
      sortOrder: 8,
    },
  ];

  // SEO Settings
  const seoSettings = [
    {
      group: 'seo',
      key: 'meta_title',
      value: 'Video Sharing Platform - Watch and Share Videos',
      type: SettingType.TEXT,
      label: 'Meta Title',
      description: 'Default meta title for pages',
      sortOrder: 1,
    },
    {
      group: 'seo',
      key: 'meta_description',
      value: 'Discover and share amazing videos on our platform',
      type: SettingType.TEXTAREA,
      label: 'Meta Description',
      description: 'Default meta description for pages',
      sortOrder: 2,
    },
    {
      group: 'seo',
      key: 'meta_keywords',
      value: 'video, sharing, platform, watch, online',
      type: SettingType.TEXT,
      label: 'Meta Keywords',
      description: 'Default meta keywords',
      sortOrder: 3,
    },
    {
      group: 'seo',
      key: 'og_image',
      value: '/images/og-image.jpg',
      type: SettingType.FILE,
      label: 'Open Graph Image',
      description: 'Default OG image for social sharing',
      sortOrder: 4,
    },
    {
      group: 'seo',
      key: 'google_site_verification',
      value: '',
      type: SettingType.TEXT,
      label: 'Google Site Verification',
      description: 'Google Search Console verification code',
      sortOrder: 5,
    },
    {
      group: 'seo',
      key: 'google_analytics_id',
      value: '',
      type: SettingType.TEXT,
      label: 'Google Analytics ID',
      description: 'GA4 Measurement ID (e.g., G-XXXXXXXXXX)',
      sortOrder: 6,
    },
    {
      group: 'seo',
      key: 'google_tag_manager_id',
      value: '',
      type: SettingType.TEXT,
      label: 'Google Tag Manager ID',
      description: 'GTM Container ID (e.g., GTM-XXXXXXX)',
      sortOrder: 7,
    },
    {
      group: 'seo',
      key: 'robots_txt',
      value: 'User-agent: *\nAllow: /',
      type: SettingType.TEXTAREA,
      label: 'Robots.txt Content',
      description: 'Content for robots.txt file',
      sortOrder: 8,
    },
    {
      group: 'seo',
      key: 'sitemap_enabled',
      value: 'true',
      type: SettingType.BOOLEAN,
      label: 'Enable Sitemap',
      description: 'Generate sitemap.xml automatically',
      sortOrder: 9,
    },
    {
      group: 'seo',
      key: 'canonical_url',
      value: 'https://example.com',
      type: SettingType.TEXT,
      label: 'Canonical URL',
      description: 'Base URL for canonical links',
      sortOrder: 10,
    },
  ];

  // Social Settings
  const socialSettings = [
    {
      group: 'social',
      key: 'facebook_url',
      value: '',
      type: SettingType.TEXT,
      label: 'Facebook URL',
      description: 'Facebook page URL',
      sortOrder: 1,
    },
    {
      group: 'social',
      key: 'youtube_url',
      value: '',
      type: SettingType.TEXT,
      label: 'YouTube URL',
      description: 'YouTube channel URL',
      sortOrder: 2,
    },
    {
      group: 'social',
      key: 'twitter_url',
      value: '',
      type: SettingType.TEXT,
      label: 'Twitter URL',
      description: 'Twitter profile URL',
      sortOrder: 3,
    },
    {
      group: 'social',
      key: 'instagram_url',
      value: '',
      type: SettingType.TEXT,
      label: 'Instagram URL',
      description: 'Instagram profile URL',
      sortOrder: 4,
    },
    {
      group: 'social',
      key: 'tiktok_url',
      value: '',
      type: SettingType.TEXT,
      label: 'TikTok URL',
      description: 'TikTok profile URL',
      sortOrder: 5,
    },
    {
      group: 'social',
      key: 'telegram_url',
      value: '',
      type: SettingType.TEXT,
      label: 'Telegram URL',
      description: 'Telegram channel URL',
      sortOrder: 6,
    },
  ];

  // Performance Settings
  const performanceSettings = [
    {
      group: 'performance',
      key: 'cache_enabled',
      value: 'true',
      type: SettingType.BOOLEAN,
      label: 'Enable Cache',
      description: 'Enable API response caching',
      sortOrder: 1,
    },
    {
      group: 'performance',
      key: 'cache_ttl',
      value: '3600',
      type: SettingType.NUMBER,
      label: 'Cache TTL (seconds)',
      description: 'Cache time-to-live in seconds',
      sortOrder: 2,
    },
    {
      group: 'performance',
      key: 'lazy_load_enabled',
      value: 'true',
      type: SettingType.BOOLEAN,
      label: 'Enable Lazy Loading',
      description: 'Enable lazy loading for images',
      sortOrder: 3,
    },
    {
      group: 'performance',
      key: 'image_webp_enabled',
      value: 'true',
      type: SettingType.BOOLEAN,
      label: 'Enable WebP',
      description: 'Convert images to WebP format',
      sortOrder: 4,
    },
    {
      group: 'performance',
      key: 'minify_html',
      value: 'false',
      type: SettingType.BOOLEAN,
      label: 'Minify HTML',
      description: 'Minify HTML output',
      sortOrder: 5,
    },
    {
      group: 'performance',
      key: 'cdn_url',
      value: '',
      type: SettingType.TEXT,
      label: 'CDN URL',
      description: 'CDN URL for static assets',
      sortOrder: 6,
    },
    {
      group: 'performance',
      key: 'videos_per_page',
      value: '12',
      type: SettingType.NUMBER,
      label: 'Videos Per Page',
      description: 'Number of videos per page',
      sortOrder: 7,
    },
  ];

  // Video Settings
  const videoSettings = [
    {
      group: 'video',
      key: 'thumbnail_quality',
      value: '85',
      type: SettingType.NUMBER,
      label: 'Thumbnail Quality',
      description: 'JPEG quality for thumbnails (1-100)',
      sortOrder: 1,
    },
    {
      group: 'video',
      key: 'thumbnail_sizes',
      value: JSON.stringify({
        large: { width: 800, height: 600 },
        medium: { width: 400, height: 300 },
        small: { width: 200, height: 150 },
        lazy: { width: 20, height: 15 },
      }),
      type: SettingType.JSON,
      label: 'Thumbnail Sizes',
      description: 'Thumbnail sizes configuration',
      sortOrder: 2,
    },
    {
      group: 'video',
      key: 'allowed_iframe_domains',
      value: 'youtube.com,vimeo.com,dailymotion.com',
      type: SettingType.TEXT,
      label: 'Allowed Iframe Domains',
      description: 'Comma-separated list of allowed embed domains',
      sortOrder: 3,
    },
    {
      group: 'video',
      key: 'auto_generate_slug',
      value: 'true',
      type: SettingType.BOOLEAN,
      label: 'Auto Generate Slug',
      description: 'Automatically generate slug from title',
      sortOrder: 4,
    },
    {
      group: 'video',
      key: 'related_videos_count',
      value: '6',
      type: SettingType.NUMBER,
      label: 'Related Videos Count',
      description: 'Number of related videos to show',
      sortOrder: 5,
    },
  ];

  // Appearance Settings
  const appearanceSettings = [
    {
      group: 'appearance',
      key: 'theme_color',
      value: '#3b82f6',
      type: SettingType.COLOR,
      label: 'Theme Color',
      description: 'Primary theme color',
      sortOrder: 1,
    },
    {
      group: 'appearance',
      key: 'dark_mode_enabled',
      value: 'true',
      type: SettingType.BOOLEAN,
      label: 'Enable Dark Mode',
      description: 'Enable dark mode support',
      sortOrder: 2,
    },
    {
      group: 'appearance',
      key: 'layout_style',
      value: 'grid',
      type: SettingType.SELECT,
      options: JSON.stringify(['grid', 'list', 'masonry']),
      label: 'Layout Style',
      description: 'Video list layout style',
      sortOrder: 3,
    },
    {
      group: 'appearance',
      key: 'header_script',
      value: '',
      type: SettingType.TEXTAREA,
      label: 'Header Script',
      description: 'Custom script in <head> tag',
      sortOrder: 4,
    },
    {
      group: 'appearance',
      key: 'footer_script',
      value: '',
      type: SettingType.TEXTAREA,
      label: 'Footer Script',
      description: 'Custom script before </body> tag',
      sortOrder: 5,
    },
  ];

  // Combine all settings
  const allSettings = [
    ...generalSettings,
    ...seoSettings,
    ...socialSettings,
    ...performanceSettings,
    ...videoSettings,
    ...appearanceSettings,
  ];

  // Create settings
  for (const setting of allSettings) {
    await prisma.setting.upsert({
      where: {
        group_key: {
          group: setting.group,
          key: setting.key,
        },
      },
      update: setting,
      create: setting,
    });
  }

  console.log('✅ Settings seeded successfully');

  // Create sample categories
  const webDevCategory = await prisma.category.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: {
      name: 'Web Development',
      slug: 'web-development',
      content: 'Videos about web development and programming',
      seoTitle: 'Web Development Videos',
      seoDescription: 'Learn web development through our video tutorials',
      sortOrder: 1,
    },
  });

  const jsCategory = await prisma.category.upsert({
    where: { slug: 'javascript' },
    update: {},
    create: {
      name: 'JavaScript',
      slug: 'javascript',
      content: 'JavaScript tutorials and guides',
      seoTitle: 'JavaScript Video Tutorials',
      seoDescription: 'Master JavaScript with our video tutorials',
      parentId: webDevCategory.id,
      sortOrder: 1,
    },
  });

  console.log('✅ Sample categories created');

  // Create sample tags
  const tags = ['tutorial', 'beginner', 'advanced', 'tips'];
  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { slug: tagName },
      update: {},
      create: {
        name: tagName.charAt(0).toUpperCase() + tagName.slice(1),
        slug: tagName,
        content: `Videos tagged with ${tagName}`,
        seoTitle: `${tagName} Videos`,
        seoDescription: `Browse all ${tagName} videos`,
      },
    });
  }

  console.log('✅ Sample tags created');

  // Create sample menus
  const headerMenu = await prisma.menu.upsert({
    where: { location: 'HEADER' },
    update: {},
    create: {
      name: 'Header Menu',
      location: 'HEADER',
    },
  });

  await prisma.menuItem.create({
    data: {
      menuId: headerMenu.id,
      title: 'Home',
      url: '/',
      sortOrder: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuId: headerMenu.id,
      title: 'Categories',
      url: '/categories',
      sortOrder: 2,
    },
  });

  console.log('✅ Sample menus created');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
