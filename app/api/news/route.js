import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

// RSS Feeds to try (ordered by reliability)
const FEEDS = [
  'https://www.nasdaq.com/feed/rssoutbound?category=Markets',
  'https://www.investing.com/rss/news.rss',
  'https://www.cnbc.com/id/100003114/device/rss/rss.html'
];

export async function GET() {
  try {
    // Try to fetch from Nasdaq first
    let feed;
    let error;

    for (const url of FEEDS) {
      try {
        feed = await parser.parseURL(url);
        if (feed && feed.items && feed.items.length > 0) break;
      } catch (e) {
        console.error(`Failed to fetch news from ${url}:`, e.message);
        error = e;
      }
    }

    if (!feed || !feed.items) {
      throw new Error(error?.message || 'Could not fetch any news feeds');
    }

    // Map the feed items to our existing format
    const news = feed.items.map((item, index) => {
      // Extract image from content or enclosure if available
      let image = null;
      
      // Try to find an image in the content
      const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) {
        image = imgMatch[1];
      } else if (item.enclosure && item.enclosure.url) {
        image = item.enclosure.url;
      }

      return {
        id: index + 1,
        title: item.title,
        summary: item.contentSnippet || item.content?.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
        source: feed.title || 'Financial News',
        time: getTimeAgo(new Date(item.pubDate)),
        category: getCategory(item.title + ' ' + (item.categories?.join(' ') || '')),
        image: image,
        url: item.link
      };
    }).slice(0, 12); // Send top 12 news items

    return NextResponse.json(news);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Error fetching news' }, { status: 500 });
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

function getCategory(text) {
  const t = text.toLowerCase();
  if (t.includes('market') || t.includes('stock') || t.includes('wall street')) return 'Markets';
  if (t.includes('crypto') || t.includes('bitcoin') || t.includes('ethereum')) return 'Crypto';
  if (t.includes('economy') || t.includes('fed') || t.includes('inflation')) return 'Economy';
  if (t.includes('tech') || t.includes('ai') || t.includes('apple') || t.includes('nvidia')) return 'Tech';
  if (t.includes('invest') || t.includes('fund') || t.includes('portfolio')) return 'Investing';
  return 'General';
}
