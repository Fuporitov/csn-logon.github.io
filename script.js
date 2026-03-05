// ========== НАСТРОЙКИ JSONBIN ==========
const BIN_ID = 'твой_bin_id';           // сюда вставь ID
const MASTER_KEY = 'твой_master_key';   // сюда вставь мастер-ключ

const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Элементы страницы
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}
window.hideToast = () => toast.classList.remove('show');

registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));

// ========== РАБОТА С JSONBIN ==========
async function getUsers() {
    const response = await fetch(`${BIN_URL}/latest`, {
        headers: { 'X-Master-Key': MASTER_KEY }
    });
    if (!response.ok) throw new Error('Ошибка загрузки');
    const data = await response.json();
    return data.record;
}

async function saveUsers(users) {
    const response = await fetch(BIN_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': MASTER_KEY
        },
        body: JSON.stringify(users)
    });
    if (!response.ok) throw new Error('Ошибка сохранения');
}

// ========== РЕГИСТРАЦИЯ ==========
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = signupForm.name.value.trim();
    const nickname = signupForm.nickname.value.trim();
    const rank = parseInt(signupForm.rank.value, 10);
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();

    try {
        const users = await getUsers();
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
        console.error(err);
    }
});

// ========== ВХОД ==========
signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = signinForm.email.value.trim();
    const password = signinForm.password.value.trim();

    try {
        const users = await getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            // Сохраняем данные пользователя (без пароля) в localStorage
            const { password: p, ...safeUser } = user;
            localStorage.setItem('currentUser', JSON.stringify(safeUser));
            // Перенаправляем на основной сайт
            window.location.href = 'https://fuporitov.github.io/csn.github.io/';
        } else {
            showToast('Неверный email или пароль', 'error');
        }
    } catch (err) {
        showToast('Ошибка сервера', 'error');
        console.error(err);
    }
});
