document.addEventListener('DOMContentLoaded', () => {
    // FOLLOW BUTTONS
    const followButtons = document.querySelectorAll('.follow-btn');

    followButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const username = button.getAttribute('data-username');

            try {
                const response = await fetch(`/follow/${username}`, { method: 'POST' });
                const data = await response.json();

                if (data.success) {
                    button.textContent = data.isFollowing ? 'Unfollow' : 'Follow';
                    const followersCountElem = document.getElementById('followersCount');
                    const followingCountElem = document.getElementById('followingCount');
                    if (followersCountElem) {
                        followersCountElem.textContent = data.followersCount;
                    }
                    if (followingCountElem) {
                        followingCountElem.textContent = data.followingCount;
                    }
                } else {
                    console.error('Failed to toggle follow status');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
});