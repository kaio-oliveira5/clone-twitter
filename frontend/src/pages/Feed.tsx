import { useEffect, useState } from "react";
import { createPost, getFeed, type FeedPost } from "../services/feed";

function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await getFeed();
        setPosts(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Não foi possível carregar o feed.");
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      setPosting(true);
      setErrorMessage("");

      const newPost = await createPost(content);

      setPosts((currentPosts) => [newPost, ...currentPosts]);
      setContent("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível criar o post.");
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return <main>Carregando feed...</main>;
  }

  return (
    <main>
      <h1>Feed</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="O que está acontecendo?"
          maxLength={280}
          rows={4}
        />

        <div>
          <span>{content.length}/280</span>

          <button type="submit" disabled={posting || !content.trim()}>
            {posting ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>

      {errorMessage && <p>{errorMessage}</p>}

      {posts.length === 0 ? (
        <p>Nenhum post encontrado.</p>
      ) : (
        posts.map((post) => (
          <article key={post.id}>
            <h2>{post.author}</h2>
            <p>{post.content}</p>
            <small>{post.created_at}</small>
          </article>
        ))
      )}
    </main>
  );
}

export default Feed;
