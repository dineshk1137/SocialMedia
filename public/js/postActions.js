document.addEventListener('DOMContentLoaded', () => {
    // LIKE BUTTONS
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const postId = button.getAttribute('data-post-id');

            try {
                const response = await fetch(`/posts/like/${postId}`, { method: 'POST' });
                const data = await response.json();

                if (data.success) {
                    const likeCountSpan = button.querySelector('.like-count');
                    likeCountSpan.textContent = `(${data.likesCount})`;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // SHOW/HIDE COMMENTS
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const postId = button.getAttribute('data-post-id');
            const commentBox = document.getElementById(`comments-box-${postId}`);
            commentBox.style.display = commentBox.style.display === 'none' ? 'block' : 'none';
        });
    });

    // COMMENT FORM SUBMIT
    const commentForms = document.querySelectorAll('.comment-form');
    commentForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const postId = form.getAttribute('data-post-id');
            const commentInput = form.querySelector('input[name="comment"]');

            if (!commentInput) {
                console.error("Comment input not found in form:", form);
                return;
            }

            const commentText = commentInput.value;

            const response = await fetch(`/posts/comment/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: commentText })
            });

            const data = await response.json();

            if (data.success) {
                const commentsBox = document.getElementById(`comments-box-${postId}`);
                const newComment = document.createElement('p');

                newComment.id = `comment-${data.commentId}`;
                newComment.innerHTML = `
                    <strong>${data.comment.author}:</strong> ${data.comment.text}
                `;

                form.parentNode.insertBefore(newComment, form);

                commentInput.value = '';

                const commentCountSpan = document.getElementById(`comment-count-${postId}`);
                commentCountSpan.textContent = `(${data.commentsCount})`;
            }
        });
    });
    
    // DELETE COMMENT BUTTONS
    const deleteButtons = document.querySelectorAll('.delete-comment-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const postId = btn.getAttribute('data-post-id');
            const commentId = btn.getAttribute('data-comment-id');

            if (!confirm("Delete this comment?")) return;

            const res = await fetch(`/posts/comment/${postId}/${commentId}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success) {
                const commentElement = document.getElementById(`comment-${commentId}`);
                commentElement.remove();

                const commentCountSpan = document.getElementById(`comment-count-${postId}`);
                commentCountSpan.textContent = `(${data.commentsCount})`;
            } else {
                alert("Error deleting comment");
            }
        });
    });
});
