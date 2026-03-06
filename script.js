// Элементы страницы
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

// Ключ для хранения пользователей
const STORAGE_KEY = 'users';
let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Сохранение пользователей
function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Уведомления
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}
window.hideToast = () => toast.classList.remove('show');

// Переключение панелей
registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));

// ===== РЕГИСТРАЦИЯ =====
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = signupForm.name.value.trim();
    const nickname = signupForm.nickname.value.trim();
    const rank = parseInt(signupForm.rank.value, 10);
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();

    if (users.some(u => u.email === email)) {
        showToast('Пользователь уже существует', 'error');
        return;
    }

    users.push({ name, nickname, rank, email, password });
    saveUsers();
    showToast('Регистрация успешна!');
    container.classList.remove('active');
    signupForm.reset();
});

// ===== ВХОД =====
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signinForm.email.value.trim();
    const password = signinForm.password.value.trim();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Сохраняем текущего пользователя без пароля
        const { password: p, ...safeUser } = user;
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        // Перенаправляем на основной сайт (замени ссылку)
        window.location.href = 'https://fuporitov.github.io/csn.github.io/';
    } else {
        showToast('Неверный email или пароль', 'error');

        // Если пользователей нет, добавить лидера
if (users.length === 0) {
    users.push({
        name: 'Лидер',
        nickname: 'Leader',
        rank: 10,
        email: 'leader@csn.ru',
        password: 'securepassword' // замени на свой пароль
    });
    saveUsers();
}
    }
});
