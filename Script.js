const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Переключение между панелями
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// ========== Логика регистрации / входа ==========
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

// Ключ для хранения пользователей в localStorage
const STORAGE_KEY = 'users';
// Ссылка для перенаправления после успешного входа (замени на свою)
const REDIRECT_URL = 'profile.html'; // ← Укажи здесь свою ссылку

// Загружаем список пользователей или создаём пустой массив
let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Сохранение пользователей в localStorage
function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Регистрация
signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Останавливаем перезагрузку страницы

    const name = signupForm.name.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();

    // Проверка на существование пользователя с таким email
    if (users.some(user => user.email === email)) {
        alert('Пользователь с такой почтой уже существует!');
        return;
    }

    // Добавляем нового пользователя
    users.push({ name, email, password });
    saveUsers();

    alert('Регистрация прошла успешно! Теперь можно войти.');
    // Переключаем панель на вход
    container.classList.remove("active");
    // Очищаем форму
    signupForm.reset();
});

// Вход
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signinForm.email.value.trim();
    const password = signinForm.password.value.trim();

    // Ищем пользователя с введёнными данными
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Можно сохранить информацию о текущем пользователе (по желанию)
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Перенаправление
        window.location.href = REDIRECT_URL;
    } else {
        alert('Неверная почта или пароль!');
    }
});


// Элементы тоста
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

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

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = signupForm.name.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();

    if (users.some(user => user.email === email)) {
        showToast('Пользователь с такой почтой уже существует!', 'error');
        return;
    }

    users.push({ name, email, password });
    saveUsers();

    showToast('Регистрация прошла успешно! Теперь можно войти.', 'success');
    container.classList.remove("active");
    signupForm.reset();
});

signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signinForm.email.value.trim();
    const password = signinForm.password.value.trim();

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Перенаправление на:', REDIRECT_URL); // Отладка
        window.location.href = REDIRECT_URL;
    } else {
        showToast('Неверная почта или пароль!', 'error');
    }
});

// Экспорт в файл
document.getElementById('export-users').addEventListener('click', () => {
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

// Импорт из файла
document.getElementById('import-users').addEventListener('click', () => {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedUsers = JSON.parse(event.target.result);
            if (Array.isArray(importedUsers)) {
                // Здесь можно выбрать: заменить или объединить
                if (confirm('Заменить текущих пользователей импортированными? (OK — заменить, Отмена — добавить)')) {
                    users = importedUsers;
                } else {
                    // Добавляем новых, избегая дубликатов по email
                    importedUsers.forEach(newUser => {
                        if (!users.some(u => u.email === newUser.email)) {
                            users.push(newUser);
                        }
                    });
                }
                saveUsers();
                showToast('Пользователи успешно импортированы!', 'success');
            } else {
                showToast('Неверный формат файла', 'error');
            }
        } catch (error) {
            showToast('Ошибка чтения файла', 'error');
        }
        // Очищаем input, чтобы можно было загрузить тот же файл повторно
        e.target.value = '';
    };
    reader.readAsText(file);
});

users.push({ 
    name, 
    nickname,   // новое поле
    rank: parseInt(rank, 10), // сохраняем как число
    email, 
    password 
});