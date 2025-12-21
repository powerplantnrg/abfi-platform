/**
 * Debug script to investigate connector issues
 */

// Debug CEFC
async function debugCEFC() {
  console.log("=".repeat(60));
  console.log("DEBUGGING CEFC CONNECTOR");
  console.log("=".repeat(60));

  const mediaUrl = "https://www.cefc.com.au/media/";

  try {
    const response = await fetch(mediaUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ABFI-Platform/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    console.log(`\nStatus: ${response.status}`);
    const html = await response.text();
    console.log(`\nHTML length: ${html.length} chars`);

    // Look for media release links
    const linkPattern = /<a[^>]*href="([^"]*media[^"]*)"[^>]*>([^<]+)<\/a>/gi;
    const links: string[] = [];
    let match;
    while ((match = linkPattern.exec(html)) !== null) {
      links.push(`${match[2].trim()} -> ${match[1]}`);
    }

    console.log(`\nFound ${links.length} media links:`);
    links.slice(0, 15).forEach((l, i) => console.log(`  ${i + 1}. ${l}`));

    // Look for article patterns
    const articlePattern = /<article[^>]*>([\s\S]*?)<\/article>/gi;
    const articles: string[] = [];
    while ((match = articlePattern.exec(html)) !== null) {
      articles.push(match[1].substring(0, 200));
    }
    console.log(`\nFound ${articles.length} article tags`);

    // Look for any h2/h3 headings
    const headingPattern = /<h[23][^>]*>([^<]+)<\/h[23]>/gi;
    const headings: string[] = [];
    while ((match = headingPattern.exec(html)) !== null) {
      headings.push(match[1].trim());
    }
    console.log(`\nFound ${headings.length} headings:`);
    headings.slice(0, 10).forEach((h, i) => console.log(`  ${i + 1}. ${h}`));

    // Look for dates
    const datePattern = /<time[^>]*datetime="([^"]*)"[^>]*>/gi;
    const dates: string[] = [];
    while ((match = datePattern.exec(html)) !== null) {
      dates.push(match[1]);
    }
    console.log(`\nFound ${dates.length} time elements`);

    // Look for div with class containing 'card' or 'post' or 'item'
    const cardPattern = /<div[^>]*class="[^"]*(?:card|post|item|article|news)[^"]*"[^>]*>/gi;
    const cards: string[] = [];
    while ((match = cardPattern.exec(html)) !== null) {
      cards.push(match[0]);
    }
    console.log(`\nFound ${cards.length} card-like divs`);

  } catch (error) {
    console.error("Error:", error);
  }
}

// Debug QLD EPA CKAN
async function debugQldEpa() {
  console.log("\n" + "=".repeat(60));
  console.log("DEBUGGING QLD EPA CKAN API");
  console.log("=".repeat(60));

  const ckanApiUrl = "https://www.data.qld.gov.au/api/3";

  // Try to find the correct dataset
  const searchUrls = [
    `${ckanApiUrl}/action/package_search?q=environmental+authority`,
    `${ckanApiUrl}/action/package_search?q=ERA+register`,
    `${ckanApiUrl}/action/package_show?id=environmental-authority-register`,
    `${ckanApiUrl}/action/package_show?id=ea-register`,
  ];

  for (const url of searchUrls) {
    console.log(`\nTrying: ${url}`);
    try {
      const response = await fetch(url, {
        headers: { "Accept": "application/json" },
      });
      console.log(`  Status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          if (data.result?.results) {
            // Search results
            console.log(`  Found ${data.result.count} datasets:`);
            data.result.results.slice(0, 5).forEach((ds: any, i: number) => {
              console.log(`    ${i + 1}. ${ds.name}: ${ds.title}`);
            });
          } else if (data.result?.resources) {
            // Package show
            console.log(`  Dataset: ${data.result.title}`);
            console.log(`  Resources:`);
            data.result.resources.forEach((r: any, i: number) => {
              console.log(`    ${i + 1}. ${r.name} (${r.format}) - ${r.id}`);
            });
          }
        }
      }
    } catch (error) {
      console.log(`  Error: ${error instanceof Error ? error.message : error}`);
    }
  }
}

async function main() {
  await debugCEFC();
  await debugQldEpa();
}

main().catch(console.error);
