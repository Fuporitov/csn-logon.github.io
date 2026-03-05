// ===== НАСТРОЙКИ =====
const STORAGE_ID = 'твой_id_с_jsonstorage'; // например '123e4567-e89b-12d3-a456-426614174000'
const STORAGE_URL = `https://jsonstorage.net/api/items/${STORAGE_ID}`;

// Элементы страницы
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

// Вспомогательные функции
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}
window.hideToast = () => toast.classList.remove('show');

// Переключение панелей
registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));

// ===== РАБОТА С ДАННЫМИ =====
async function fetchUsers() {
    const response = await fetch(STORAGE_URL);
    if (!response.ok) throw new Error('Ошибка загрузки');
    return await response.json();
}

async function saveUsers(users) {
    await fetch(STORAGE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
    });
}

// ===== РЕГИСТРАЦИЯ =====
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = signupForm.name.value.trim();
    const nickname = signupForm.nickname.value.trim();
    const rank = parseInt(signupForm.rank.value, 10);
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();

    try {
        const users = await fetchUsers();
        if (users.some(u => u.email === email)) {
            showToast('Пользователь уже существует', 'error');
            return;
        }
        users.push({ name, nickname, rank, email, password });
        await saveUsers(users);
        showToast('Регистрация успешна!');
        container.classList.remove('active');
        signupForm.reset();
    } catch (err) {
        showToast('Ошибка сервера', 'error');
    }
});

// ===== ВХОД =====
signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signinForm.email.value.trim();
    const password = signinForm.password.value.trim();

    try {
        const users = await fetchUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            // Сохраняем текущего пользователя (без пароля)
            const { password: p, ...safeUser } = user;
            localStorage.setItem('currentUser', JSON.stringify(safeUser));
            window.location.href = 'https://fuporitov.github.io/csn.github.io/'; // Твой основной сайт
        } else {
            showToast('Неверный email или пароль', 'error');
        }
    } catch (err) {
        showToast('Ошибка сервера', 'error');
    }
});
