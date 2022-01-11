import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Header from "../components/header"
import PageInfo from "../components/pageInfo"
import PostList from "../components/postList"
import Pagination from "../components/pagination"
import MobilePagination from "../components/mobilePagination"

import type { PageContext } from "../../type"

interface Tag {
  tag: string
}
interface Props {
  data: GatsbyTypes.TagQuery,
  pageContext: PageContext & Tag,
  location: {
    pathname: string
  }
}

const Tag: React.VFC<Props> = ({ data, location, pageContext }) => {
	const postData = data.allMarkdownRemark

	return (
		<Layout>
      <Seo
        title={`${pageContext.tag}タグの記事`}
        pagepath={location.pathname}
      />

			<Header
				pageTitle={`${pageContext.tag} タグの記事`}
			/>

			<PageInfo
				currentPage={pageContext.currentPage}
				postCount={pageContext.postCount}
				pageCount={pageContext.pageCount}
			/>

			<PostList
				postData={postData}
			/>

      <Pagination
        currentPage={pageContext.currentPage}
        pageCount={pageContext.pageCount}
        isFirst={pageContext.isFirst}
        isLast={pageContext.isLast}
        tag={pageContext.tag}
      />

      <MobilePagination
        isFirst={pageContext.isFirst}
        isLast={pageContext.isLast}
        currentPage={pageContext.currentPage}
        pageCount={pageContext.pageCount}
        tag={pageContext.tag}
      />
		</Layout>
	)
}

export default Tag

export const pageQuery = graphql`
  query Tag(
    $tag: String!,
    $limit: Int!,
    $skip: Int!
  ) {
    allMarkdownRemark(
      sort: {
        fields: [frontmatter___postdate],
        order: DESC
      }
      limit: $limit,
      skip: $skip
      filter: {
        frontmatter: {
          tags: {
            in: [$tag]
          }
        }
      }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          postdate(formatString: "YYYY年MM月DD日")
          update(formatString: "YYYY年MM月DD日")
          seriesName
          seriesSlug
          title
          tags
          description
        }
      }
    }
  }
`