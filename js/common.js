/* common.js - 悦翔电竞公共脚本 (ES5, 兼容安卓6) | 纯静态版：不含任何后端请求 */

// HTML escape function to prevent XSS
function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ==================== Toast ====================
function showToast(msg, type) {
    var existing = document.getElementById('yx-toast');
    if (existing) {
        existing.parentNode.removeChild(existing);
    }
    var toast = document.createElement('div');
    toast.id = 'yx-toast';
    toast.className = 'toast show';
    if (type === 'success') {
        toast.className = 'toast show toast-success';
    } else if (type === 'error') {
        toast.className = 'toast show toast-error';
    }
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () {
        toast.className = 'toast';
        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 2500);
}

// ==================== Modal ====================
function showModal(title, contentHtml) {
    closeModal();
    var overlay = document.createElement('div');
    overlay.id = 'yx-modal';
    overlay.className = 'modal-overlay show';
    var box = document.createElement('div');
    box.className = 'modal-box';
    box.innerHTML = '<span class="modal-close" onclick="closeModal()">&times;</span>' +
        '<div class="modal-title">' + title + '</div>' + contentHtml;
    overlay.appendChild(box);
    overlay.onclick = function (e) {
        if (e.target === overlay) closeModal();
    };
    document.body.appendChild(overlay);
}

function closeModal() {
    var m = document.getElementById('yx-modal');
    if (m) m.parentNode.removeChild(m);
}

// ==================== Navigation Bar ====================
function renderNavbar() {
    var navHtml = '';
    navHtml += '<div class="navbar">';
    navHtml += '<div class="nav-logo">悦翔电竞</div>';
    navHtml += '<div class="nav-links">';
    navHtml += '<a href="index.html">首页</a>';
    navHtml += '<a href="products.html">商品</a>';
    navHtml += '<a href="booster-info.html">打手</a>';
    navHtml += '</div>';
    navHtml += '<div class="nav-menu-btn" onclick="toggleMenu()">&#8801;</div>';
    navHtml += '</div>';

    // Dropdown
    navHtml += '<div class="nav-dropdown" id="navDropdown">';
    navHtml += '<div class="nav-dropdown-section" style="display:flex;justify-content:space-between;">';
    navHtml += '<span>首页</span><a href="index.html">前往</a>';
    navHtml += '</div>';
    navHtml += '<div class="nav-dropdown-section" style="display:flex;justify-content:space-between;">';
    navHtml += '<span>商品</span><a href="products.html">前往</a>';
    navHtml += '</div>';
    navHtml += '<div class="nav-dropdown-section" style="display:flex;justify-content:space-between;">';
    navHtml += '<span>打手</span><a href="booster-info.html">前往</a>';
    navHtml += '</div>';
    navHtml += '<div class="nav-dropdown-divider"></div>';

    navHtml += '<a href="contact.html">联系我们</a>';
    navHtml += '<a href="about.html">关于我们</a>';
    navHtml += '<a href="join.html">加入我们</a>';
    navHtml += '<a href="missing.html">助力走失儿童</a>';

    navHtml += '</div>';

    return navHtml;
}

function toggleMenu() {
    var dd = document.getElementById('navDropdown');
    var btn = document.querySelector('.nav-menu-btn');
    if (!dd) return;
    if (dd.className.indexOf('show') >= 0) {
        dd.className = 'nav-dropdown';
        if (btn) btn.innerHTML = '&#8801;';
    } else {
        dd.className = 'nav-dropdown show';
        if (btn) btn.innerHTML = '&#10005;';
    }
}

// Close dropdown when clicking outside
document.onclick = function (e) {
    var dd = document.getElementById('navDropdown');
    var btn = document.querySelector('.nav-menu-btn');
    if (dd && dd.className.indexOf('show') >= 0) {
        if (e.target !== dd && !dd.contains(e.target) && e.target !== btn) {
            dd.className = 'nav-dropdown';
            if (btn) btn.innerHTML = '&#8801;';
        }
    }
};

// ==================== Page Init ====================
function initPage(callback) {
    // Write navbar
    var navContainer = document.getElementById('nav-container');
    if (navContainer) {
        navContainer.innerHTML = renderNavbar();
    }
    // Call page-specific init
    if (callback) callback();
}

// ==================== Format date ====================
function formatDate(s) {
    if (!s) return '';
    return s.replace('T', ' ').replace('Z', '');
}