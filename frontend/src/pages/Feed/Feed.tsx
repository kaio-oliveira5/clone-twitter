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
import styles from "./Feed.module.css";

function formatPostDate(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
    return <main className={styles.loading}>Carregando feed...</main>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Feed</h1>
          <p>Veja as publicações das pessoas que você segue.</p>
        </header>

        <form className={styles.postForm} onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="O que está acontecendo?"
            maxLength={280}
            rows={4}
          />

          <div className={styles.postFormFooter}>
            <span className={styles.counter}>{content.length}/280</span>

            <button
              className={styles.publishButton}
              type="submit"
              disabled={posting || !content.trim()}
            >
              {posting ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <section className={styles.posts}>
          {posts.length === 0 ? (
            <div className={styles.empty}>
              <p>Nenhum post encontrado.</p>
            </div>
          ) : (
            posts.map((post) => {
              const isLiked = likedPosts.includes(post.id);
              const postComments = comments[post.id] || [];
              const isLoadingComments = loadingComments.includes(post.id);
              const isPostingComment = postingComments.includes(post.id);

              return (
                <article className={styles.post} key={post.id}>
                  <div className={styles.postHeader}>
                    <h2>{post.author}</h2>

                    <small>{formatPostDate(post.created_at)}</small>
                  </div>

                  <p className={styles.postContent}>{post.content}</p>

                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionButton} ${
                        isLiked ? styles.liked : ""
                      }`}
                      type="button"
                      onClick={() => handleLike(post.id)}
                    >
                      {isLiked ? "❤️ Curtido" : "♡ Curtir"}
                    </button>

                    <button
                      className={styles.actionButton}
                      type="button"
                      onClick={() => handleLoadComments(post.id)}
                    >
                      💬 Comentários
                    </button>
                  </div>

                  {isLoadingComments && (
                    <p className={styles.loadingComments}>
                      Carregando comentários...
                    </p>
                  )}

                  {comments[post.id] && (
                    <div className={styles.comments}>
                      {postComments.length === 0 ? (
                        <p className={styles.noComments}>
                          Nenhum comentário ainda.
                        </p>
                      ) : (
                        postComments.map((comment) => (
                          <div className={styles.comment} key={comment.id}>
                            <strong>{comment.author}</strong>
                            <p>{comment.content}</p>
                          </div>
                        ))
                      )}

                      <form
                        className={styles.commentForm}
                        onSubmit={(event) =>
                          handleCommentSubmit(event, post.id)
                        }
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
                          className={styles.commentButton}
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
        </section>
      </div>
    </main>
  );
}

export default Feed;
