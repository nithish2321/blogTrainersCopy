// Exact same optimized logic from previous version
const $ = id => document.getElementById(id);
const PAGE_SIZE = 24;
let blogs = [], visible = PAGE_SIZE;
const state = { search: '', author: '', category: '', topic: '', sort: 'newest' };

const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const getUniques = key => [...new Set(blogs.map(b => key === 'author' ? b.author.name : b[key]))].filter(Boolean).sort();
const populateSelect = (id, key) => getUniques(key).forEach(val => $(id).innerHTML += `<option value="${val}">${val}</option>`);

async function fetchBlogs() {
    try {
        const res = await fetch('https://nithish2321.github.io/API/api.json');
        const data = await res.json();

        blogs = (data.blogs || []).map(b => ({
            ...b,
            author: typeof b.author === 'string' ? { name: b.author, role: 'Contributor' } : { name: b.author?.name || 'Unknown', role: b.author?.role || 'Contributor' },
            category: b.category || 'General',
            topic: b.topic || b.tags?.[0] || 'General',
            tags: b.tags || [],
            stats: { views: +b.stats?.views || 0, likes: +b.stats?.likes || 0, read_time: +b.stats?.read_time || 1 },
            published_at: b.published_at || new Date().toISOString()
        }));

        ['author', 'category', 'topic'].forEach(k => populateSelect(k, k));
        $('total-count').textContent = blogs.length;
        render();
    } catch (err) {
        $('blog-container').innerHTML = '<p class="empty-state">Error loading blogs.</p>';
    }
}

function render() {
    const filtered = blogs.filter(b => {
        const text = [b.title, b.summary, b.category, b.topic, b.author.name, ...b.tags].join(' ').toLowerCase();
        return (!state.search || text.includes(state.search.toLowerCase())) &&
            (!state.author || b.author.name === state.author) &&
            (!state.category || b.category === state.category) &&
            (!state.topic || b.topic === state.topic);
    });

    filtered.sort((a, b) => {
        if (state.sort === 'popular') return b.stats.views - a.stats.views;
        if (state.sort === 'liked') return b.stats.likes - a.stats.likes;
        if (state.sort === 'quick') return a.stats.read_time - b.stats.read_time;
        return new Date(b.published_at) - new Date(a.published_at);
    });

    $('result-count').textContent = `${filtered.length} results`;
    $('results-title').textContent = state.author ? `${state.author}'s posts` : 'All posts';
    $('active-summary').textContent = state.search || state.author || state.category || state.topic ? `Showing filtered posts` : 'Showing all posts';

    if (!filtered.length) {
        $('blog-container').innerHTML = '<p class="empty-state">No posts match.</p>';
        $('load-more').classList.add('hidden');
        return;
    }

    $('blog-container').innerHTML = filtered.slice(0, visible).map(b => `
                <article class="blog-card">
                    <div class="card-meta"><span class="pill">${b.category}</span><span class="pill">${b.topic}</span></div>
                    <h3>${b.title}</h3>
                    <p class="byline">By <button class="author-btn" onclick="setAuthor('${b.author.name}')">${b.author.name}</button> &middot; ${fmtDate(b.published_at)}</p>
                    <p class="content-preview">${b.summary}</p>
                    <div class="tag-list">${b.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                    <div class="stats">
                        <span><strong>${b.stats.views.toLocaleString()}</strong> views</span>
                        <span><strong>${b.stats.likes.toLocaleString()}</strong> likes</span>
                        <span><strong>${b.stats.read_time}</strong> min read</span>
                    </div>
                </article>
            `).join('');

    $('load-more').classList.toggle('hidden', visible >= filtered.length);
    $('load-more').textContent = `Load more (${filtered.length - Math.min(visible, filtered.length)} left)`;
}

['search', 'author', 'category', 'topic', 'sort'].forEach(id => {
    $(id).addEventListener('input', e => { state[id] = e.target.value; visible = PAGE_SIZE; render(); });
});

$('clear').onclick = () => {
    ['search', 'author', 'category', 'topic'].forEach(id => $(id).value = state[id] = '');
    $('sort').value = state.sort = 'newest';
    visible = PAGE_SIZE; render();
};

$('load-more').onclick = () => { visible += PAGE_SIZE; render(); };
window.setAuthor = name => { $('author').value = state.author = name; visible = PAGE_SIZE; render(); window.scrollTo(0, 0); };

fetchBlogs();