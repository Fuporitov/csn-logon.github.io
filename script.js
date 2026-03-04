// ========== ЭЛЕМЕНТЫ ==========
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

// ========== НАСТРОЙКИ ==========
const STORAGE_KEY = 'users';
// ✨ ТВОЯ ССЫЛКА ✨ - теперь ведёт на основной сайт
const REDIRECT_URL = 'https://fuporitov.github.io/csn.github.io/';

// ========== ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ ==========
let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

window.hideToast = function() {
    toast.classList.remove('show');
};

// ========== ПЕРЕКЛЮЧЕНИЕ ПАНЕЛЕЙ ==========
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// ========== РЕГИСТРАЦИЯ ==========
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = signupForm.name.value.trim();
    const nickname = signupForm.nickname.value.trim();
    const rank = parseInt(signupForm.rank.value, 10);
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();

    if (users.some(user => user.email === email)) {
        showToast('Пользователь с такой почтой уже существует!', 'error');
        return;
    }

    users.push({ name, nickname, rank, email, password });
    saveUsers();

    showToast('Регистрация прошла успешно! Теперь можно войти.', 'success');
    container.classList.remove("active");
    signupForm.reset();
});

// ========== ВХОД ==========
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signinForm.email.value.trim();
    const password = signinForm.password.value.trim();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Сохраняем данные пользователя (без пароля для безопасности)
        const { password: p, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        // ✨ ПЕРЕХОД НА ТВОЙ ОСНОВНОЙ САЙТ ✨
        window.location.href = REDIRECT_URL;
    } else {
        showToast('Неверная почта или пароль!', 'error');
    }
});

// ========== ЭКСПОРТ/ИМПОРТ ПОЛЬЗОВАТЕЛЕЙ ==========
document.getElementById('export-users')?.addEventListener('click', () => {
    const dataStr = JSON.stringify(users, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('import-users')?.addEventListener('click', () => {
    document.getElementById('import-file').click();
});

document.getElementById('import-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedUsers = JSON.parse(event.target.result);
            if (Array.isArray(importedUsers)) {
                if (confirm('Заменить текущих пользователей импортированными? (OK — заменить, Отмена — добавить)')) {
                    users = importedUsers;
                } else {
                    importedUsers.forEach(newUser => {
                        if (!users.some(u => u.email === newUser.email)) {
                            users.push(newUser);
                        }
                    });
                }
                saveUsers();
                showToast('Пользователи импортированы!', 'success');
            } else {
                showToast('Неверный формат файла', 'error');
            }
        } catch {
            showToast('Ошибка чтения файла', 'error');
        }
        e.target.value = '';
    };
    reader.readAsText(file);
});
