import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});


export async function getPostBySlug(slug: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BLOG_DB_ID!,
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: { equals: slug },
        },
        {
          property: "Status",
          select: { equals: "Published" },
        },
      ],
    },
  });

  return response.results[0];
}

export async function getPublishedPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BLOG_DB_ID!,
    filter: {
      property: "Status",
      select: {
        equals: "Published",
      },
    },
    sorts: [
      {
        property: "Published",
        direction: "descending",
      },
    ],
  });

  return response.results;
}
