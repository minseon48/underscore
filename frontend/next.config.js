/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compiler: {
    styledComponents: {
      ssr: true,
      pure: true,
    },
  },
  async rewrites() {
    return [
      {
        source: "/map/search-location",
        has: [
          { type: "query", key: "query", value: "(?<query>.*)" },
          { type: "query", key: "page", value: "(?<page>.*)" },
        ],
        destination: `${process.env.NEXT_PUBLIC_API_KAKAO_URL || "https://dapi.kakao.com"}/v2/local/search/address.json?analyze_type=exact&query=:query&page=:page`,
      },
      {
        source: "/map/search-category",
        has: [
          { type: "query", key: "category_group_code", value: "(?<category_group_code>.*)" },
          { type: "query", key: "rect", value: "(?<rect>.*)" },
          { type: "query", key: "page", value: "(?<page>.*)" },
          { type: "query", key: "size", value: "(?<size>.*)" },
        ],
        destination: `${process.env.NEXT_PUBLIC_API_KAKAO_URL || "https://dapi.kakao.com"}/v2/local/search/category.json?category_group_code=:category_group_code&rect=:rect&page=:page&size=:size`,
      },
    ]
  },
}

module.exports = nextConfig