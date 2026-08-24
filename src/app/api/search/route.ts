import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, searchKey, searchEngineId } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const apiKey = searchKey || process.env.SEARCH_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    const cx = searchEngineId || process.env.SEARCH_ENGINE_ID || '017576662512468239146:omuauf_lfve';

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search API key is not configured.',
        },
        { status: 400 }
      );
    }

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(query)}&num=8`;
    const res = await fetch(searchUrl);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        {
          success: false,
          error: `Google Search API returned status ${res.status}: ${errText.slice(0, 150)}`,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    const items = (data.items || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    }));

    return NextResponse.json({
      success: true,
      query,
      results: items,
      totalResults: data.searchInformation?.totalResults || items.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Search execution failed',
      },
      { status: 500 }
    );
  }
}
