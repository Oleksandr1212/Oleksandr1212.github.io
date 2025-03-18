document.addEventListener("DOMContentLoaded", () => {
    const cartList = document.getElementById("cart-list");
    const totalPriceElement = document.getElementById("total-price");
    const cart = [];

    // Завдання 1: Стилізація та ефекти для списку книг
    const bookCards = document.querySelectorAll(".book-card");

    bookCards.forEach((card, index) => {
        card.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff";
        card.addEventListener("mouseover", () => {
            card.style.backgroundColor = "#e0f7fa";
        });
        card.addEventListener("mouseout", () => {
            card.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff";
        });
    });

    // Завдання 2: Перемикання розділу кошика
    const cartSection = document.getElementById("cart");
    const cartToggleBtn = document.createElement("button");
    cartToggleBtn.textContent = "Показати/Приховати кошик";
    cartToggleBtn.style.margin = "20px";
    cartSection.parentNode.insertBefore(cartToggleBtn, cartSection);

    // Додавання контейнера для кнопок
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.justifyContent = "space-between";
    buttonsContainer.style.margin = "20px 0";

    // Перемикання видимості кошика та кнопок
    cartToggleBtn.addEventListener("click", () => {
        cartSection.classList.toggle("hidden"); 
        buttonsContainer.classList.toggle("hidden");
    });

    // Завдання 3: Додавання коментарів
    const commentForm = document.createElement("form");
    commentForm.id = "comment-form";

    commentForm.innerHTML =  
        `<h3>Залишити відгук</h3>
        <input type="text" id="name-input" placeholder="Ваше ім'я" required />
        <textarea id="comment-input" placeholder="Ваш відгук" required></textarea>
        <button type="submit">Додати відгук</button>
        <ul id="comments-list"></ul>`;

    const mainSection = document.querySelector("main");
    mainSection.appendChild(commentForm);

    commentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const nameInput = document.getElementById("name-input").value.trim();
        const commentInput = document.getElementById("comment-input").value.trim();

        if (!nameInput || !commentInput) {
            alert("Будь ласка, заповніть усі поля!");
            return;
        }

        const newComment = document.createElement("li");
        newComment.textContent = `${nameInput}: ${commentInput}`;
        document.getElementById("comments-list").appendChild(newComment);

        // Очищення полів після додавання відгуку
        document.getElementById("name-input").value = "";
        document.getElementById("comment-input").value = "";
    });

    // Додавання товару до кошика
    document.body.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const bookCard = event.target.closest(".book-card");
            const title = bookCard.querySelector("h3").textContent;
            const priceText = bookCard.querySelector(".price").textContent;
            const price = parseInt(priceText.replace("Ціна: ", "").replace(" грн", ""));

            addToCart(title, price, event.target);
        }
    });

    function addToCart(title, price, button) {
        const existingItem = cart.find(item => item.title === title);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ title, price, quantity: 1 });
        }

        button.style.backgroundColor = "#4CAF50";
        button.textContent = "Додано!";
        updateCart();
    }

    function updateCart() {
        cartList.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;

            const cartItem = document.createElement("li");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = 
                `<span>${item.title} x${item.quantity}</span>
                <span>${item.price * item.quantity} грн</span>
                <button class="remove-from-cart-btn" data-title="${item.title}">Видалити</button>
                <input type="number" class="quantity-input" data-title="${item.title}" value="${item.quantity}" min="1">`;

            cartList.appendChild(cartItem);

            const removeBtn = cartItem.querySelector(".remove-from-cart-btn");
            removeBtn.addEventListener("click", () => removeFromCart(item.title));

            const quantityInput = cartItem.querySelector(".quantity-input");
            quantityInput.addEventListener("input", (event) => {
                const newQuantity = parseInt(event.target.value);
                if (newQuantity > 0) {
                    updateQuantity(item.title, newQuantity);
                }
            });
        });

        totalPriceElement.textContent = `${total} грн`;
    }

    function removeFromCart(title) {
        const index = cart.findIndex(item => item.title === title);
        if (index !== -1) {
            cart.splice(index, 1);
            updateCart();
        }
    }

    function updateQuantity(title, newQuantity) {
        const item = cart.find(item => item.title === title);
        if (item) {
            item.quantity = newQuantity;
            updateCart();
        }
    }

    // Генерація рекомендованих книг
    const allBooks = [
        { title: "1984", author: "Джордж Орвелл", price: 250, image: "./image/book1.jpg" },
        { title: "Мистецтво війни", author: "Сунь-цзи", price: 300, image: "./image/book2.jpg" },
        { title: "Хоббіт", author: "Дж. Р. Р. Толкін", price: 400, image: "./image/book3.jpg" },
        { title: "Маленький принц", author: "Антуан де Сент-Екзюпері", price: 220, image: "./image/book4.jpg" },
        { title: "Тарас Бульба", author: "Микола Гоголь", price: 150, image: "./image/book5.jpg" },
        { title: "Гра престолів", author: "Джордж Мартін", price: 500, image: "./image/book6.jpg" },
        { title: "Дюна", author: "Френк Герберт", price: 450, image: "./image/book7.jpg" },
        { title: "451 градус за Фаренгейтом", author: "Рей Бредбері", price: 290, image: "./image/book8.jpg" },
        { title: "Володар Перснів", author: "Дж. Р. Р. Толкін", price: 600, image: "./image/book9.jpg" },
        { title: "Шерлок Холмс: Зібрання творів", author: "Артур Конан Дойл", price: 350, image: "./image/book10.jpg" }
    ];

    const recommendedBooksList = document.getElementById("recommended-books-list");
    const recommendedBooks = [];

    // Вибір 5 випадкових книг з масиву
    for (let i = 0; recommendedBooks.length < 5; i++) {
        const randomIndex = Math.floor(Math.random() * allBooks.length);
        const randomBook = allBooks[randomIndex];

        // Перевірка на повторення
        if (!recommendedBooks.includes(randomBook)) {
            recommendedBooks.push(randomBook);
        }
    }

    // Генерація карток для рекомендованих книг
    recommendedBooks.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <img src="${book.image}" alt="${book.title}" class="book-image">
            <h3 class="book-title">${book.title}</h3>
            <p class="author">Автор: ${book.author}</p>
            <p class="price">Ціна: ${book.price} грн</p>
            <button class="add-to-cart">
                <span class="icon">🛒</span> Додати до кошика
            </button>
        `;
        recommendedBooksList.appendChild(bookCard);
    });

    // Кнопки очищення кошика та оформлення замовлення
    const clearCartButton = document.getElementById("clear-cart");
    const checkoutButton = document.getElementById("checkout");

    clearCartButton.addEventListener("click", () => {
        cart.length = 0;  
        updateCart();
    });

    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Ваш кошик порожній. Додайте книги до кошика!");
        } else {
            const totalAmount = totalPriceElement.textContent;
            const confirmMessage = `Ви готові оформити замовлення на суму ${totalAmount}?`;
            const isConfirmed = confirm(confirmMessage);

            if (isConfirmed) {
                alert("Замовлення оформлено! Дякуємо за покупку.");
                cart.length = 0; 
                updateCart();
            }
        }
    });

    // Додатковий код для виділення елементів списку
    const bookItems = document.querySelectorAll("#book-list li");

    for (let i = 0; i < bookItems.length; i++) {
        bookItems[i].style.backgroundColor = (i % 2 === 0) ? "#f0f0f0" : "#ffffff";

        if (i === 0) {
            bookItems[i].textContent = "Перша книга: 1984";
        } else {
            bookItems[i].textContent = `Книга ${i + 1}: ${bookItems[i].textContent}`;
        }
    }
});

// Генерація карток для рекомендованих книг
recommendedBooks.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-image">
        <h3 class="book-title">${book.title}</h3>
        <p class="author">Автор: ${book.author}</p>
        <p class="price">Ціна: ${book.price} грн</p>
        <button class="add-to-cart">
            <span class="icon">🛒</span> Додати до кошика
        </button>
    `;

    bookCard.addEventListener("mouseover", () => {
        bookCard.style.backgroundColor = "#e0f7fa";
    });

    bookCard.addEventListener("mouseout", () => {
        bookCard.style.backgroundColor = "#fff"; 
    });

    recommendedBooksList.appendChild(bookCard);
});