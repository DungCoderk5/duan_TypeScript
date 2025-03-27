


// Lấy phần tử span
// Lấy tất cả các phần tử span trong .home-about-top và .home-about-bottom
const spanElements = document.querySelectorAll('.home-about .home-about-top > span, .home-about .home-about-bottom > span, .home-banner .home-banner-wrap .home-banner-wrap-right>span');

// Lặp qua từng phần tử và gán sự kiện
spanElements.forEach((spanElement) => {
    // Lắng nghe sự kiện hover vào
    spanElement.addEventListener('mouseenter', () => {
        spanElement.classList.remove('slide-up');
        spanElement.classList.add('slide-down');
    });

    // Lắng nghe sự kiện hover ra
    spanElement.addEventListener('mouseleave', () => {
        spanElement.classList.remove('slide-down');
        spanElement.classList.add('slide-up');
    });
});



// placholder
document.addEventListener("DOMContentLoaded", () => {
    const inputs = [
        document.getElementById("animated-placeholder"),
        document.getElementById("animated-placeholder1")
    ];

    const placeholders = ["Bạn cần tìm gì...", "Tên sản phẩm...", "Tên sản phẩm cần tìm"];

    inputs.forEach((input, index) => {
        if (!input) {
            console.error(`Không tìm thấy phần tử với id '${inputs[index].id}'.`);
            return;
        }

        let placeholderIndex = 0;

        function animatePlaceholder() {
            input.placeholder = ""; // Xóa placeholder cũ
            const text = placeholders[placeholderIndex];
            let i = 0;

            // Từng chữ cái hiện lên
            const interval = setInterval(() => {
                if (i < text.length) {
                    input.placeholder += text[i];
                    i++;
                } else {
                    clearInterval(interval);
                    // Sau vài giây, chuẩn bị xóa
                    setTimeout(() => {
                        let j = text.length;
                        const reverseInterval = setInterval(() => {
                            if (j > 0) {
                                input.placeholder = input.placeholder.slice(0, --j);
                            } else {
                                clearInterval(reverseInterval);
                                // Chuyển sang từ tiếp theo
                                placeholderIndex = (placeholderIndex + 1) % placeholders.length;
                                animatePlaceholder();
                            }
                        }, 50);
                    }, 1500); // Chờ 1.5 giây trước khi xóa
                }
            }, 100);
        }

        // Khởi động hiệu ứng
        animatePlaceholder();
    });
});

//banner


let currentIndex = 0;
const slides = document.querySelector(".slider");
const totalSlides = document.querySelectorAll(".slider img").length;
const dots = document.querySelectorAll(".dot");
const sliderContents = [
    document.querySelector(".slider-content"),
    document.querySelector(".slider-content1"),
    document.querySelector(".slider-content2"),
];

// Function to move the slider and update content
function moveSlider(index) {
    currentIndex = index;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateActiveContent();
    updateActiveDot();
}

// Function to update active content
function updateActiveContent() {
    sliderContents.forEach((content, index) => {
        content.classList.toggle("active", index === currentIndex);
    });
}

// Function to update active dot
function updateActiveDot() {
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
}

// Add event listener to dots
dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        moveSlider(index);
    });
});

// Auto slide every 3 seconds
setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    moveSlider(currentIndex);
}, 3000);


//hover
const menuItems = document.querySelectorAll('.menu > li');

menuItems.forEach((menuItem) => {
    const subnav = menuItem.querySelector('.subnav');

    if (subnav) {
        // Khi hover vào
        menuItem.addEventListener('mouseenter', () => {
            clearTimeout(subnav.hideTimeout); // Hủy ẩn subnav nếu có
            subnav.style.display = 'block'; // Hiển thị subnav
            subnav.classList.remove('hover'); // Xóa hiệu ứng fade-out
            subnav.classList.add('fadein'); // Thêm hiệu ứng fade-in
        });

        // Khi rời khỏi
        menuItem.addEventListener('mouseleave', () => {
            subnav.classList.remove('fadein'); // Xóa hiệu ứng fade-in
            subnav.classList.add('hover'); // Thêm hiệu ứng fade-out

            // Đặt thời gian để ẩn subnav
            subnav.hideTimeout = setTimeout(() => {
                subnav.style.display = 'none'; // Ẩn subnav sau khi animation kết thúc
            }, 500); // Thời gian trùng với thời gian của animation
        });
    }
});



// Đặt ngày kết thúc
const endDate = new Date("May 11, 2025 00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = endDate - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours;
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;
    } else {
        document.querySelector(".countdown-container").innerHTML = "<h2>Sự kiện đã kết thúc!</h2>";
    }
}

// Cập nhật mỗi giây
setInterval(updateCountdown, 1000);
updateCountdown();

//cart 
function openCart() {
    const cartSidebar = document.querySelector('.shop-cart-sidebar');
    const overlay = document.querySelector('.overlay1');
    cartSidebar.classList.add('open'); // Mở giỏ hàng
    overlay.classList.add('active');  // Hiển thị overlay
}

function closeCart() {
    const cartSidebar = document.querySelector('.shop-cart-sidebar');
    const overlay = document.querySelector('.overlay1');
    cartSidebar.classList.remove('open'); // Đóng giỏ hàng
    overlay.classList.remove('active');  // Ẩn overlay
}

document.querySelectorAll('[data-type="shop-quantity-plus"]').forEach(button => {
    button.addEventListener('click', (e) => {
        const input = e.target.closest('.shop-quantity').querySelector('input');
        let quantity = parseInt(input.value) || 1;
        input.value = quantity + 1;
        updateCartTotal(); // Hàm cập nhật tổng giá
    });
});
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.shop-cart-item');
    let total = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('p').textContent.replace(/[^\d]/g, '')) || 0;
        const quantity = parseInt(item.querySelector('input').value) || 1;
        total += price * quantity;
    });

    document.querySelector('.toCheckout span:last-child').textContent = total.toLocaleString('vi-VN') + '₫';
}

document.querySelectorAll('[data-type="shop-quantity-minus"]').forEach(button => {
    button.addEventListener('click', (e) => {
        const input = e.target.closest('.shop-quantity').querySelector('input');
        let quantity = parseInt(input.value) || 1;
        if (quantity > 1) {
            input.value = quantity - 1;
            updateCartTotal(); // Hàm cập nhật tổng giá
        }
    });
});

document.getElementById("animated-placeholder").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchProduct();
    }
});

function searchProduct() {
    const input = document.getElementById("animated-placeholder");
    const filter = input.value.trim().toLowerCase();

    if (filter.length > 0) {
        // Chuyển hướng khi có từ khóa
        const url = "product.html?q=" + encodeURIComponent(filter);
        window.location.href = url;
    } else {
        alert("Vui lòng nhập từ khóa tìm kiếm!");
    }
}

// dang nhap menu
const sideLinks = document.querySelectorAll('.side-link');
const forms = document.querySelectorAll('.login-form');

sideLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Xóa class active cho tất cả form và link
        sideLinks.forEach(item => item.classList.remove('active'));
        forms.forEach(form => form.classList.remove('active'));

        // Kích hoạt form và link được chọn
        link.classList.add('active');
        const hienIndex = link.dataset.hien;
        document.querySelector(`.login-form[data-hien="${hienIndex}"]`).classList.add('active');
    });
});
function opennguuu() {
    const modal = document.querySelector('.modal-content');
    const overlay = document.querySelector('.overlay2');

    // Hiển thị modal và overlay
    modal.classList.add('active');
    overlay.classList.add('active');
}
function closenguuuu() {
    const cartSidebar = document.querySelector('.modal-content');
    const overlay = document.querySelector('.overlay2');
    cartSidebar.classList.remove('active'); // Đóng giỏ hàng
    overlay.classList.remove('active');  // Ẩn overlay
}

document.addEventListener("DOMContentLoaded", function () {
    let toTopBtn = document.getElementById("toTopBtn");

    // Hiện nút khi cuộn xuống 300px
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            toTopBtn.classList.remove("hidden");
            toTopBtn.style.display = "block";
        } else {
            toTopBtn.classList.add("hidden");
            setTimeout(() => {
                if (toTopBtn.classList.contains("hidden")) {
                    toTopBtn.style.display = "none";
                }
            }, 300);
        }
    });

    // Cuộn lên đầu khi click
    toTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});