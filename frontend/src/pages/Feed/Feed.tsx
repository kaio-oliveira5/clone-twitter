import { useEffect, useState } from "react";
import {
  createComment,
  createPost,
  getComments,
  getFeed,
  likePost,
  unlikePost,
  type Comment as FeedComment,
  type FeedPost,
} from "../../services/feed";

function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [comments, setComments] = useState<Record<number, FeedComment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>(
    {},
  );
  const [loadingComments, setLoadingComments] = useState<number[]>([]);
  const [postingComments, setPostingComments] = useState<number[]>([]);

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

  async function handleLike(postId: number) {
    const isLiked = likedPosts.includes(postId);

    try {
      if (isLiked) {
        await unlikePost(postId);

        setLikedPosts((currentLikedPosts) =>
          currentLikedPosts.filter((id) => id !== postId),
        );
      } else {
        await likePost(postId);

        setLikedPosts((currentLikedPosts) => [...currentLikedPosts, postId]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível atualizar a curtida.");
    }
  }

  async function handleLoadComments(postId: number) {
    if (comments[postId]) {
      return;
    }

    try {
      setLoadingComments((current) => [...current, postId]);

      const data = await getComments(postId);

      setComments((current) => ({
        ...current,
        [postId]: data,
      }));
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível carregar os comentários.");
    } finally {
      setLoadingComments((current) => current.filter((id) => id !== postId));
    }
  }

  async function handleCommentSubmit(
    event: React.FormEvent<HTMLFormElement>,
    postId: number,
  ) {
    event.preventDefault();

    const commentContent = commentInputs[postId]?.trim();

    if (!commentContent) {
      return;
    }

    try {
      setPostingComments((current) => [...current, postId]);

      const newComment = await createComment(postId, commentContent);

      setComments((current) => ({
        ...current,
        [postId]: [...(current[postId] || []), newComment],
      }));

      setCommentInputs((current) => ({
        ...current,
        [postId]: "",
      }));
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível criar o comentário.");
    } finally {
      setPostingComments((current) => current.filter((id) => id !== postId));
    }
  }

  function handleCommentChange(postId: number, value: string) {
    setCommentInputs((current) => ({
      ...current,
      [postId]: value,
    }));
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
        posts.map((post) => {
          const isLiked = likedPosts.includes(post.id);
          const postComments = comments[post.id] || [];
          const isLoadingComments = loadingComments.includes(post.id);
          const isPostingComment = postingComments.includes(post.id);

          return (
            <article key={post.id}>
              <h2>{post.author}</h2>

              <p>{post.content}</p>

              <small>{post.created_at}</small>

              <div>
                <button type="button" onClick={() => handleLike(post.id)}>
                  {isLiked ? "❤️ Curtido" : "♡ Curtir"}
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadComments(post.id)}
                >
                  💬 Comentários
                </button>
              </div>

              {isLoadingComments && <p>Carregando comentários...</p>}

              {comments[post.id] && (
                <div>
                  {postComments.length === 0 ? (
                    <p>Nenhum comentário ainda.</p>
                  ) : (
                    postComments.map((comment) => (
                      <div key={comment.id}>
                        <strong>{comment.author}</strong>
                        <p>{comment.content}</p>
                      </div>
                    ))
                  )}

                  <form
                    onSubmit={(event) => handleCommentSubmit(event, post.id)}
                  >
                    <input
                      type="text"
                      value={commentInputs[post.id] || ""}
                      onChange={(event) =>
                        handleCommentChange(post.id, event.target.value)
                      }
                      placeholder="Escreva um comentário..."
                      maxLength={280}
                    />

                    <button
                      type="submit"
                      disabled={
                        isPostingComment || !commentInputs[post.id]?.trim()
                      }
                    >
                      {isPostingComment ? "Enviando..." : "Comentar"}
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })
      )}
    </main>
  );
}

export default Feed;
