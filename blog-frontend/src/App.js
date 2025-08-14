import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null); // Track which post is being edited

  const fetchPosts = () => {
    axios
      .get("http://localhost:8000/api/posts/")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create or Update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing post
      axios
        .put(`http://localhost:8000/api/posts/${editingId}/`, {
          title: title,
          content: content,
        })
        .then(() => {
          setTitle("");
          setContent("");
          setEditingId(null);
          fetchPosts();
        })
        .catch((error) => console.error("Error updating post:", error));
    } else {
      // Create new post
      axios
        .post("http://localhost:8000/api/posts/", {
          title: title,
          content: content,
        })
        .then(() => {
          setTitle("");
          setContent("");
          fetchPosts();
        })
        .catch((error) => console.error("Error creating post:", error));
    }
  };

  // Delete Post
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/api/posts/${id}/`)
      .then(() => fetchPosts())
      .catch((error) => console.error("Error deleting post:", error));
  };

  // Start Editing
  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingId(post.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Blog Posts</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <br />
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <br />
        <br />
        <button type="submit">
          {editingId ? "Update Post" : "Create Post"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setContent("");
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Posts */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}
          >
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}

export default App;
