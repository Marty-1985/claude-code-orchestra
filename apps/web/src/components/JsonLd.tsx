interface BlogPostingProps {
  type: "BlogPosting";
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
  image?: string;
}

interface PersonProps {
  type: "Person";
  name: string;
  url: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
  image?: string;
}

type JsonLdProps = BlogPostingProps | PersonProps;

function buildBlogPostingSchema(props: BlogPostingProps) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: props.title,
    description: props.description,
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    author: {
      "@type": "Person",
      name: props.authorName,
    },
    url: props.url,
    ...(props.image && { image: props.image }),
  };
}

function buildPersonSchema(props: PersonProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: props.name,
    url: props.url,
    ...(props.jobTitle && { jobTitle: props.jobTitle }),
    ...(props.description && { description: props.description }),
    ...(props.sameAs && { sameAs: props.sameAs }),
    ...(props.image && { image: props.image }),
  };
}

export default function JsonLd(props: JsonLdProps) {
  const schema =
    props.type === "BlogPosting"
      ? buildBlogPostingSchema(props)
      : buildPersonSchema(props);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
