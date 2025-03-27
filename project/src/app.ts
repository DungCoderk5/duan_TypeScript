import { urlserver, ISanPham, IThuoc_Tinh, ICartItem, CSan_Pham, SanPhamService, NguoiDung, Cart } from './common.js'

// thêm dữ liệu
export const them_gio_hang = async (sanPham: any) => {
    try {
        const response = await fetch(`${urlserver}/gio_hang`);
        const gioHangHienTai = await response.json();

        const soLuong = parseInt((document.querySelector('.shop-quantity input[name="quantity"]') as HTMLInputElement).value) || 1;

        // Lấy userID từ localStorage
        const nguoiDung = JSON.parse(localStorage.getItem('nguoi_dung') || '{}');
        const userID = nguoiDung?.id || null; 

        if (!userID) {
            console.error('Không tìm thấy userID, vui lòng đăng nhập');
            return;
        }

        // Kiểm tra sản phẩm có trong giỏ hàng không
        const sanPhamTonTai = gioHangHienTai.find(
            (item: any) => item.id === sanPham.id && item.userID === userID
        );

        if (sanPhamTonTai) {
            sanPhamTonTai.soluong += soLuong;
            await fetch(`${urlserver}/gio_hang/${sanPhamTonTai.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sanPhamTonTai)
            });
        } else {
            const sanPhamMoi = {
                id: sanPham.id,
                ten: sanPham.ten,
                gia: sanPham.gia,
                gia_km: sanPham.gia_km,
                hinh: sanPham.hinh,
                soluong: soLuong,
                size: sanPham.size,
                userID: userID
            };
            await fetch(`${urlserver}/gio_hang`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sanPhamMoi)
            });
        }

        window.location.href = "cart.html";
        console.log('Thêm sản phẩm vào giỏ hàng thành công');
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    }
};

export const them_gio_hang_home = async (id: string) => {
    try {

        const res = await fetch(`${urlserver}/san_pham/${id}`);
        if (!res.ok) {
            throw new Error('Không tìm thấy thông tin sản phẩm');
        }
        const sanPham = await res.json();
        const soLuong = 1;
        const size = 36;
        const nguoiDung = JSON.parse(localStorage.getItem('nguoi_dung') || '{}');
        const userID = nguoiDung?.id || null; 

        if (!userID) {
            console.error('Không tìm thấy userID, vui lòng đăng nhập');
            return;
        }

        const sanPhamMoi = {
            id: sanPham.id,
            ten: sanPham.ten,
            gia: sanPham.gia,
            gia_km: sanPham.gia_km,
            hinh: sanPham.hinh,
            soluong: soLuong,
            size: size,
            userID: userID

        };

        const response = await fetch(`${urlserver}/gio_hang`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanPhamMoi),
        });

        if (!response.ok) {
            throw new Error('Lỗi khi thêm sản phẩm vào giỏ hàng');
        }

        const result = await response.json();
        alert(`Sản phẩm đã được thêm vào giỏ hàng: ${result.ten}`);
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
    }
};

// xóa dữ liệu

export const xoa_gio_hang = async (productId: string) => {
    try {
        // Gửi yêu cầu xóa sản phẩm từ giỏ hàng lên server
        const response = await fetch(`${urlserver}/gio_hang/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
        }

        // Xóa phần tử giỏ hàng dựa vào data-id
        const cartItem = document.querySelector(`.main-cart-data-full-item[data-id="${productId}"]`);
        if (cartItem) {
            cartItem.remove();
        }

        // Cập nhật lại giỏ hàng sau khi xóa
        const updatedCart = await lay_gio_hang();
        document.querySelector('.show').innerHTML = updatedCart;

    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
    }
}
export const xoa_gio_hang_menu = async (productId: string) => {
    try {
        // Gửi yêu cầu xóa sản phẩm từ giỏ hàng lên server
        const response = await fetch(`${urlserver}/gio_hang/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
        }

        // Xóa phần tử giỏ hàng dựa vào data-id
        const cartItem = document.querySelector(`.shop-cart-item[data-id="${productId}"]`);
        console.log(cartItem);

        if (cartItem) {
            cartItem.remove();
        }

        // Cập nhật lại giỏ hàng sau khi xóa
        const updatedCart = await lay_gio_hang_menu();
        document.querySelector('.showmenu').innerHTML = updatedCart;

    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
    }
}
// dang nhap
export const dang_nhap = async <T extends NguoiDung>(
    data: { email: string; password: string }
): Promise<T | null> => {
    try {
        const response = await fetch(`${urlserver}/nguoi_dung`);
        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu người dùng');
        }

        const users: T[] = await response.json();

        const user = users.find(
            (user) => user.email === data.email && user.password === data.password
        );

        if (!user) {
            alert('Email hoặc mật khẩu không đúng!');
            return null;
        }

        const userInfo = {
            ...user,
            phone: user.phone ?? 'Không có số điện thoại',
            diachi: user.diachi ?? 'Chưa cập nhật',
        } as T;

        localStorage.setItem('nguoi_dung', JSON.stringify(userInfo));
        console.log('Thông tin người dùng:', userInfo);
        alert('Đăng nhập thành công!');

        // **Kiểm tra role và điều hướng**
        if (user.role === 'admin') {
            window.location.href = "/admin/adminthuancss.html"; // Chuyển đến trang admin
        } else {
            window.location.href = "index.html"; // Chuyển đến trang người dùng thường
        }

        return userInfo;
    } catch (error) {
        alert('Lỗi khi đăng nhập: ' + (error as Error).message);
        console.error('Lỗi khi đăng nhập:', error);
        return null;
    }
};



export const dang_nhap_menu = async <T extends NguoiDung>(
    data: { email: string; password: string }
): Promise<T | null> => {
    try {
        const response = await fetch(`${urlserver}/nguoi_dung`);
        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu người dùng');
        }

        const users: T[] = await response.json();

        const user = users.find(
            (user) => user.email === data.email && user.password === data.password
        );

        if (!user) {
            alert('Email hoặc mật khẩu không đúng!');
            return null;
        }

        const userInfo = {
            ...user,
            phone: user.phone ?? 'Không có số điện thoại',
            diachi: user.diachi ?? 'Chưa cập nhật',
        } as T;

        localStorage.setItem('nguoi_dung', JSON.stringify(userInfo));
        console.log('Thông tin người dùng:', userInfo);
        alert('Đăng nhập thành công!');

        // **Kiểm tra role và điều hướng**
        if (user.role === 'admin') {
            window.location.href = "/admin/adminthuancss.html"; // Chuyển đến trang admin
        } else {
            window.location.href = "index.html"; // Chuyển đến trang người dùng thường
        }

        return userInfo;
    } catch (error) {
        alert('Lỗi khi đăng nhập: ' + (error as Error).message);
        console.error('Lỗi khi đăng nhập:', error);
        return null;
    }
};


export const dang_ky = async <T>(data: T): Promise<T> => {
    try {
        const response = await fetch(`${urlserver}/nguoi_dung`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Đăng ký thất bại: ${response.statusText}`);
        }

        const result: T = await response.json();
        console.log('Đăng ký thành công:', result);
        return result;
    } catch (error) {
        console.error('Lỗi trong quá trình đăng ký:', error);
        throw error;
    }
};

export const dang_xuat = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem('nguoi_dung');

        alert('Đăng xuất thành công!');

        // Cập nhật giao diện giỏ hàng
        const showan = document.querySelector('.showan') as HTMLElement;
        const show = document.querySelector('.show') as HTMLElement;
        const cartHeader: HTMLElement[] = [
            document.querySelector('.main-cart-data-head p strong') as HTMLElement,
            document.querySelector('.icon-badge1') as HTMLElement
        ];

        if (show && showan) {
            show.style.display = "none";
            showan.innerHTML = `<div class="main-cart-data-none ">
                <div class="section-title-all">
                    <h2>Bạn chưa lựa chọn được sản phẩm nào.?</h2>
                    <p>Tìm kiếm ngay sản phẩm mà bạn mong muốn với bộ sưu tập rộng lớn của chúng tôi!</p>
                    <form action="/search">
                        <input type="hidden" name="type" value="product">
                        <input type="text" placeholder="Tìm kiếm sản phẩm ..." id="animated-placeholder1">
                        <button type="submit" title="Tìm kiếm">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
                                viewBox="0 0 612.01 612.01" style="enable-background: new 0 0 512 512" xml:space="preserve">
                                <path d="M606.209,578.714L448.198,423.228C489.576,378.272,515,318.817,515,253.393C514.98,113.439,399.704,0,257.493,0 
                                        C115.282,0,0.006,113.439,0.006,253.393s115.276,253.393,257.487,253.393c61.445,0,117.801-21.253,162.068-56.586 
                                        l158.624,156.099c7.729,7.614,20.277,7.614,28.006,0C613.938,598.686,613.938,586.328,606.209,578.714z M257.493,467.8 
                                        c-120.326,0-217.869-95.993-217.869-214.407S137.167,38.986,257.493,38.986c120.327,0,217.869,95.993,217.869,214.407 
                                        S377.82,467.8,257.493,467.8z" fill="#000000" data-original="#000000"></path>
                            </svg>
                        </button>
                    </form>
                </div>
                <span>
                    <img width="1666" height="1000" title="Tìm kiếm" class="w-100 ls-is-cached lazyloaded"
                        src="https://file.hstatic.net/200000584705/file/37578_dae02aa6e03e4230b958e97100__1___1__db746ec851754034b04b27f8690072c7.jpg"
                        data-src="https://file.hstatic.net/200000584705/file/37578_dae02aa6e03e4230b958e97100__1___1__db746ec851754034b04b27f8690072c7.jpg"
                        alt="Cart none">
                </span>
            </div>`;
        }

        // Cập nhật giao diện tài khoản
        const accLink = document.querySelector('.header-icons a');
        if (accLink) {
            accLink.setAttribute('onclick', 'opennguuu()');
            accLink.setAttribute('href', '#');
        }

        // Chuyển hướng về trang đăng nhập
        window.location.href = 'dangnhap.html';
    }
};


//doi mat khau
export const doi_mat_khau = async (
    oldPassword: string,
    newPassword: string
): Promise<boolean> => {
    try {
        // Lấy thông tin người dùng từ localStorage
        const userString = localStorage.getItem("nguoi_dung");
        if (!userString) {
            alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return false;
        }

        const user = JSON.parse(userString);

        if (!user.id) {
            alert("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
            return false;
        }

        // Kiểm tra mật khẩu cũ có đúng không
        if (user.password !== oldPassword) {
            alert("Mật khẩu cũ không chính xác!");
            return false;
        }

        // Cập nhật mật khẩu mới trong object user
        const updatedUser = { ...user, password: newPassword };
        
        // Gửi yêu cầu cập nhật mật khẩu lên server
        const response = await fetch(`${urlserver}/nguoi_dung/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
            alert("Đổi mật khẩu thành công!");

            // Cập nhật lại user trong localStorage
            localStorage.setItem("nguoi_dung", JSON.stringify(updatedUser));

            return true;
        } else {
            const data = await response.json();
            alert("Lỗi: " + data.message);
            return false;
        }
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
        return false;
    }
};



window.addEventListener('DOMContentLoaded', () => {
    const nguoiDung = JSON.parse(localStorage.getItem('nguoi_dung') || '{}');

    if (nguoiDung && Object.keys(nguoiDung).length > 0) {
        const accLink = document.querySelector('.header-icons a');
        if (accLink) {
            accLink.removeAttribute('onclick');
            accLink.setAttribute('href', 'account.html');
        }

        // Thêm cập nhật thông tin vào giao diện nếu cần
        const accSidebarSpan = document.querySelector('.acc-sidebar span');
        if (accSidebarSpan) {
            accSidebarSpan.innerHTML =
                `<img width="64" height="64" src="https://ui-avatars.com/api/?name=${nguoiDung.name}&amp;font-size=.5" alt="${nguoiDung.name}" title="${nguoiDung.name}">`;
        }

        const accSidebarHeading = document.querySelector('.acc-sidebar h3') as HTMLElement;
        if (accSidebarHeading) {
            accSidebarHeading.innerHTML = `Xin chào, <b>${nguoiDung.name}</b>`;
        }

        const accDataName = document.querySelector('.acc-data[data-show="1"] p:nth-of-type(1)') as HTMLElement;
        if (accDataName) {
            accDataName.innerHTML = `<strong>Họ tên:</strong> ${nguoiDung.name}`;
        }

        const accDataEmail = document.querySelector('.acc-data[data-show="1"] p:nth-of-type(2)') as HTMLElement;
        if (accDataEmail) {
            accDataEmail.innerHTML = `<strong>Email:</strong> ${nguoiDung.email}`;
        }

        const accDataPhone = document.querySelector('.acc-data[data-show="1"] p:nth-of-type(3)') as HTMLElement;
        if (accDataPhone) {
            accDataPhone.innerHTML = `<strong>Điện thoại:</strong> ${nguoiDung.phone}`;
        }
        const accDataAddress = document.querySelector('.acc-data[data-show="1"] p:nth-of-type(4)') as HTMLElement;
        if (accDataAddress && nguoiDung.diachi.length > 0) {
            accDataAddress.innerHTML = `<strong>Địa chỉ:</strong> ${nguoiDung.diachi[0].address}`;
        }
        const accDataRole = document.querySelector('.acc-data[data-show="1"] p:nth-of-type(5)') as HTMLElement;

        if (accDataRole) {
            if (nguoiDung.role === 'admin') {
                accDataRole.innerHTML = `<strong>Tới website của bạn:</strong> <a href="/admin/adminthuancss.html">Nhấp vào đây</a>`;
            } else {
                accDataRole.style.display = "none";
            }
        }





    }
});







// lay dữ liệu
export const lay_thuong_hieu = async () => {
    let data = await fetch(urlserver + "/thuong_hieu").then(res => res.json()).then(data => data);
    let str = '';

    data.forEach(th => {
        str += `
            <li><a href="sptheothuonghiue.html?id=${th.id}">${th.ten}</a></li>
        `;
    });

    // Chèn subnav vào menu Thương hiệu
    return str;
}
lay_thuong_hieu();
export const laysptheothuonghieu = async (thuonghieu_id: number, sosp: number = 19) => {
    let str = ``;

    try {
        const response = await fetch(`${urlserver}/san_pham/?thuonghieu_id=${thuonghieu_id}&_sort=-ngay&_limit=${sosp}`);
        if (!response.ok) throw new Error('Lỗi khi tải sản phẩm');

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(sp => {
                str += `
                    <div class="product-card" data-price="${sp.gia}" data-name="${sp.ten}" data-date="2024-09-10">
        <div class="product-image">
            <a href="product-detail.html?id=${sp.id}"><img src="${sp.hinh}"
                alt="${sp.ten}"></a>
            <span class="discount">${(100 * (sp.gia - sp.gia_km) / sp.gia).toFixed(0) + " %"}</span>
            <button class="wishlist-btn">❤️</button>
        </div>
        <h3>${sp.ten}</h3>
        <div class="price">
            <span class="new-price">${sp.gia_km.toLocaleString("vi") + " VNĐ"}</span>
            <span class="old-price">${sp.gia.toLocaleString("vi") + " VNĐ"}</span>
        </div>
        <div class="tags">
            <span class="new">new</span>
            <span class="freeship">freeship</span>
        </div>
    </div>
                `;
            });
        } else {
            str += '<p>Không có sản phẩm nào được tìm thấy.</p>';
        }
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        str += '<p>Đã xảy ra lỗi khi tải sản phẩm.</p>';
    }


    return str;
};

export const lay_gio_hang = async () => {
    try {
        const response = await fetch(`${urlserver}/gio_hang`);
        const data = await response.json();
        const showan = document.querySelector('.showan') as HTMLElement;
        const show = document.querySelector('.show') as HTMLElement;
        const cartHeader: HTMLElement[] = [
            document.querySelector('.main-cart-data-head p strong') as HTMLElement,
            document.querySelector('.icon-badge1') as HTMLElement
        ];
        if (data.length === 0) {
            show.style.display = "none";
            showan.innerHTML = `<div class="main-cart-data-none ">
            <div class="section-title-all">
                <h2>Bạn chưa lựa chọn được sản phẩm nào.?</h2>
                <p>Tìm kiếm ngay sản phẩm mà bạn mong muốn với bộ sưu tập rộng lớn của chúng tôi!</p>
                <form action="/search">
                    <input type="hidden" name="type" value="product">
                    <input type="text" placeholder="Tìm kiếm sản phẩm ..." id="animated-placeholder1">
                    <button type="submit" title="Tìm kiếm" fdprocessedid="qt8rdh">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
                            viewBox="0 0 612.01 612.01" style="enable-background: new 0 0 512 512" xml:space="preserve">
                            <path d="M606.209,578.714L448.198,423.228C489.576,378.272,515,318.817,515,253.393C514.98,113.439,399.704,0,257.493,0 
                                    C115.282,0,0.006,113.439,0.006,253.393s115.276,253.393,257.487,253.393c61.445,0,117.801-21.253,162.068-56.586 
                                    l158.624,156.099c7.729,7.614,20.277,7.614,28.006,0C613.938,598.686,613.938,586.328,606.209,578.714z M257.493,467.8 
                                    c-120.326,0-217.869-95.993-217.869-214.407S137.167,38.986,257.493,38.986c120.327,0,217.869,95.993,217.869,214.407 
                                    S377.82,467.8,257.493,467.8z" fill="#000000" data-original="#000000"></path>
                        </svg>
                    </button>
                </form>
            </div>
            <span>
                <img width="1666" height="1000" title="Tìm kiếm" class="w-100 ls-is-cached lazyloaded"
                    src="https://file.hstatic.net/200000584705/file/37578_dae02aa6e03e4230b958e97100__1___1__db746ec851754034b04b27f8690072c7.jpg"
                    data-src="https://file.hstatic.net/200000584705/file/37578_dae02aa6e03e4230b958e97100__1___1__db746ec851754034b04b27f8690072c7.jpg"
                    alt="Cart none">
            </span>
        </div>`;
        } else {
            // Cập nhật số lượng sản phẩm vào thông báo giỏ hàng
            const productCount = data.length; // Số lượng sản phẩm trong giỏ hàng
            cartHeader.forEach((element) => {
                if (element) {
                    element.textContent = productCount.toString(); // Thay đổi số lượng sản phẩm
                }
            });

            let str = '';
            data.forEach(allgiohang => {
                str += tatcagiohang(allgiohang);
            });
            showan.style.display = "none";
            return str;
        }
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        return '<div class="error">Không thể tải giỏ hàng</div>';
    }
}
export const lay_gio_hang_menu = async () => {
    try {
        const response = await fetch(`${urlserver}/gio_hang`);
        const data = await response.json();
        const showan = document.querySelector('.showanmenu') as HTMLElement;
        const show = document.querySelector('.showmenu') as HTMLElement;
        const cartHeader = document.querySelector('.icon-badge1') as HTMLElement; // Phần tử chứa số lượng sản phẩm

        if (data.length === 0) {
            show.style.display = "none";
            showan.innerHTML = ` <div class="shop-cart-sidebar-no">Giỏ hàng của bạn còn trống</div>`;
        } else {
            // Cập nhật số lượng sản phẩm vào thông báo giỏ hàng
            const productCount = data.length; // Số lượng sản phẩm trong giỏ hàng
            if (cartHeader) {
                cartHeader.textContent = productCount.toString(); // Thay đổi số lượng sản phẩm
            }

            let str = '';
            data.forEach(giohangmenu => {
                str += gohangmenu(giohangmenu);
            });
            showan.style.display = "none";
            return str;
        }
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        return '<div class="error">Không thể tải giỏ hàng</div>';
    }
}
export const lay_san_pham = async (sosp: number = 3) => {
    try {
        const response = await fetch(`${urlserver}/san_pham?_limit=${sosp}&_sort=desc`);
        const data = await response.json();

        let str = '';
        data.forEach(sp => {
            str += motsp(sp);

        });

        return str;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        return '<div class="error">Không thể tải sản phẩm</div>';
    }
};
export const lay_sp_sale = async () => {

    let data = await fetch(urlserver + "/san_pham").then(res => res.json()).then(data => data);
    let str = '';
    data.forEach(sp => {
        str += `<div class="swiper-slide">
                        <div class="icon-heart">
                            <a href="#"><i class="fa fa-heart"></i></a>

                        </div>
                        <div class="price-sale">
                            <p>${((100 * (sp.gia - sp.gia_km)) / sp.gia).toFixed(0)} %</p>
                        </div>
                       <a href="product-detail.html?id=${sp.id}"> <img src="${sp.hinh}"
                            alt=""></a>
                        <div class="content-hotsale">
                            <img src="https://file.hstatic.net/200000306687/file/imager_8176_d244203aa9cf4dfbb410e1377abdac72_compact.jpg"
                                alt="">
                            <p>Còn lại ${sp.soluongtonkho} sản phẩm</p>
                        </div>
                        <span class="project-sale"></span>
                        <p>${sp.ten}</p>
                        <span class="price-hot">${sp.gia.toLocaleString("vi") + " VNĐ"}</span>
                        <div class="info-hot">
                            <span>Freeship</span>
                            <span>new</span>
                            <div class="rate-staring">
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                            </div>
                        </div>
                    </div>`;
    });
    return str;

}
export const lay_all_san_pham = async () => {
    try {
        const response = await fetch(`${urlserver}/san_pham`);
        const data = await response.json();
        let str = '';
        data.forEach(allsp => {
            str += tatcasp(allsp);
        });
        return str;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        return '<div class="error">Không thể tải sản phẩm</div>';
    }


}
//lấy sản phẩm liên quan
export const lay_san_pham_lien_quan = async (id) => {
    try {
        // Lấy toàn bộ dữ liệu từ API JSON
        const response = await fetch(`${urlserver}/san_pham`);

        // Lấy dữ liệu dạng text để kiểm tra
        const textData = await response.text();
        console.log("Dữ liệu thô từ API:", textData);

        let data;
        try {
            data = JSON.parse(textData);
        } catch (jsonError) {
            console.error("Lỗi: API không trả về JSON hợp lệ!", jsonError);
            return '<div class="error">Dữ liệu từ server không hợp lệ</div>';
        }

        console.log("Dữ liệu JSON đã parse:", data);

        // Kiểm tra nếu API trả về mảng, thì dùng luôn
        if (!Array.isArray(data)) {
            console.error("Lỗi: Dữ liệu không phải là mảng!", data);
            return '<div class="error">Không thể tải sản phẩm liên quan</div>';
        }

        // Tìm sản phẩm chính theo ID
        const sanPhamChinh = data.find(sp => sp.id == id);

        if (!sanPhamChinh) {
            console.error("Lỗi: Không tìm thấy sản phẩm có ID:", id);
            return '<div class="error">Không thể xác định sản phẩm</div>';
        }

        console.log("Dữ liệu sản phẩm chính:", sanPhamChinh);

        // Lọc sản phẩm có cùng `thuonghieu_id` nhưng khác sản phẩm chính
        const sanPhamLienQuan = data.filter(sp => sp.thuonghieu_id == sanPhamChinh.thuonghieu_id && sp.id != id);

        console.log("Dữ liệu sản phẩm liên quan:", sanPhamLienQuan);

        if (sanPhamLienQuan.length === 0) {
            return '<div class="error">Không có sản phẩm liên quan</div>';
        }

        // Tạo HTML hiển thị sản phẩm liên quan
        let str = '';
        sanPhamLienQuan.forEach(sp => {
            str += tatcasp(sp); // Hàm này bạn đã có để render sản phẩm
        });

        return str;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', error);
        return '<div class="error">Không thể tải sản phẩm liên quan</div>';
    }
};







const tatcasp = (allsp) => {
    const {
        id,
        ten,
        gia,
        gia_km,
        hinh,
        soluongtonkho,
        hot,
        an_hien,
        mota,
        trangthai,
        tinh_chat,
        thumbnails,
        thuonghieu_id,
    } = allsp;

    let obj: CSan_Pham;
    obj = new CSan_Pham(id, ten, gia, gia_km, hinh, soluongtonkho, hot, an_hien, mota, trangthai, tinh_chat, thumbnails, thuonghieu_id);

    return `
     <div class="product-card" data-price="${obj.gia}" data-name="${obj.ten}" data-date="2024-09-10">
        <div class="product-image">
            <a href="product-detail.html?id=${obj.id}"><img src="${obj.hinh}"
                alt="${obj.ten}"></a>
            <span class="discount">${obj.phantramgiam()}</span>
            <button class="wishlist-btn">❤️</button>
        </div>
        <h3>${obj.ten}</h3>
        <div class="price">
            <span class="new-price">${obj.giakm()}</span>
            <span class="old-price">${obj.gia.toLocaleString("vi") + " VNĐ"}</span>
        </div>
        <div class="tags">
            <span class="new">new</span>
            <span class="freeship">freeship</span>
        </div>
    </div>
       `;
};
export const lay1sp = async (id: number = 0) => {
    try {
        const response = await fetch(`${urlserver}/san_pham/${id}`);
        if (!response.ok) {
            throw new Error('Không tìm thấy sản phẩm.');
        }
        const product = await response.json();

        renderProductDetail(product);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        document.querySelector("#product-detail")!.innerHTML = '<div class="error">Không thể tải chi tiết sản phẩm.</div>';
    }
};

const renderProductDetail = (product) => {
    const {
        id,
        ten,
        gia,
        gia_km,
        hinh,
        soluongtonkho,
        hot,
        an_hien,
        mota,
        trangthai,
        tinh_chat,
        thumbnails,
        thuonghieu_id,
    } = product;
    let obj: CSan_Pham;
    obj = new CSan_Pham(id, ten, gia, gia_km, hinh, soluongtonkho, hot, an_hien, mota, trangthai, tinh_chat, thumbnails, thuonghieu_id);
    const detailContainer = document.querySelector("#product-detail");
    if (!detailContainer) return;

    detailContainer.innerHTML = `
     <div class="main-product-wrap">
                <div class="main-product-left main-product-feature" data-style="style1">
                    <div class="zoom-container">
                        <img src="${obj.hinh}"
                            alt="Product Image" class="main-product-image" id="mainImage" onclick="openModal()">
                    </div>
                    <div class="main-product-thumbnails">
                        <img src="${obj.hinh}"
                            alt="Thumbnail 1" class="thumbnail"
                            onclick="changeImage('${obj.hinh}')">
                         <img src="${obj.thumbnails[0]}"
                            alt="Thumbnail 2" class="thumbnail"
                            onclick="changeImage('${obj.thumbnails[0]}')">
                        <img src="${obj.thumbnails[1]}"
                            alt="Thumbnail 3" class="thumbnail"
                            onclick="changeImage('${obj.thumbnails[1]}')">
                        <img src="${obj.thumbnails[2]}"
                            alt="Thumbnail 4" class="thumbnail"
                            onclick="changeImage('${obj.thumbnails[2]}')">
                    </div>

                </div>
                <div class="main-product-right">
                    <div class="main-product-share">
                        <button type="button" data-type="main-product-share-overplay"
                            class="main-product-share-overplay"></button>
                        <button type="button" data-type="main-product-share-open-popup" class="main-product-share-cta"
                            title="Chia sẻ" fdprocessedid="lwdq7o">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                viewBox="0 0 24 24">
                                <path fill="#595959"
                                    d="M19 3c-1.652 0-3 1.348-3 3 0 .46.113.895.3 1.285L12.587 11h-4.77A2.999 2.999 0 005 9c-1.652 0-3 1.348-3 3s1.348 3 3 3c1.3 0 2.402-.84 2.816-2h4.77l3.715 3.715c-.188.39-.301.824-.301 1.285 0 1.652 1.348 3 3 3s3-1.348 3-3-1.348-3-3-3c-.46 0-.895.113-1.285.3l-3.3-3.3 3.3-3.3c.39.187.824.3 1.285.3 1.652 0 3-1.348 3-3s-1.348-3-3-3z">
                                </path>
                            </svg>
                        </button>
                        <div class="main-product-share-popup">
                            <div class="main-product-share-popup-head">
                                <label>Chia sẻ</label>
                                <a target="_blank" aria-label="Chia sẻ Facebook" title="Chia sẻ Facebook"
                                    href="https://www.facebook.com/sharer.php?u=https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"><svg
                                        width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M27 0H5a5 5 0 00-5 5v22a5 5 0 005 5h22a5 5 0 005-5V5a5 5 0 00-5-5z"
                                            fill="#1778F2"></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M20.314 32V19.499h3.255L24 15.19h-3.686l.006-2.156c0-1.123.1-1.725 1.623-1.725h2.034V7h-3.255c-3.91 0-5.285 2.09-5.285 5.604v2.587H13v4.308h2.437V32h4.877z"
                                            fill="#fff"></path>
                                    </svg></a>
                                <a target="_blank" aria-label="Chia sẻ Facebook" title="Chia sẻ Twitter"
                                    href="https://twitter.com/intent/tweet?url=https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"><svg
                                        width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="32" height="32" rx="4" fill="#1FA1F3"></rect>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M15.73 13.235l.04.634-.674-.077c-2.455-.298-4.6-1.308-6.42-3.004l-.89-.841-.23.621c-.485 1.385-.175 2.848.836 3.832.54.544.419.622-.512.298-.324-.104-.607-.181-.634-.143-.094.091.23 1.27.486 1.735.35.648 1.065 1.282 1.847 1.657l.661.298-.782.013c-.755 0-.782.013-.701.285.27.841 1.335 1.735 2.522 2.123l.836.272-.728.414a7.894 7.894 0 01-3.615.958c-.607.013-1.106.065-1.106.104 0 .13 1.646.854 2.603 1.14 2.873.84 6.285.478 8.848-.959 1.82-1.023 3.642-3.055 4.491-5.023.459-1.049.918-2.965.918-3.884 0-.596.04-.673.795-1.385.445-.415.864-.868.945-.997.134-.246.12-.246-.567-.026-1.146.388-1.308.337-.742-.246.418-.414.917-1.165.917-1.385 0-.04-.202.026-.431.142-.243.13-.783.324-1.187.44l-.729.22-.66-.427c-.364-.233-.877-.492-1.147-.57-.688-.18-1.74-.155-2.36.052-1.686.583-2.752 2.085-2.63 3.729z"
                                            fill="#fff"></path>
                                    </svg></a>
                                <a target="_blank" aria-label="Chia sẻ Facebook" title="Chia sẻ WhatsApp"
                                    href="https://wa.me/?text=https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"><svg
                                        viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                                        clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2">
                                        <path
                                            d="M116.225-.001c-11.264.512-26.112 1.536-32.768 3.072-10.24 2.048-19.968 5.12-27.648 9.216-9.728 4.608-17.92 10.752-25.088 17.92-7.68 7.68-13.824 15.872-18.432 25.6-4.096 7.68-7.168 17.408-9.216 27.648-1.536 6.656-2.56 21.504-2.56 32.768-.512 4.608-.512 10.752-.512 13.824v265.729c.512 11.264 1.536 26.112 3.072 32.768 2.048 10.24 5.12 19.968 9.216 27.648 4.608 9.728 10.752 17.92 17.92 25.088 7.68 7.68 15.872 13.824 25.6 18.432 7.68 4.096 17.408 7.168 27.648 9.216 6.656 1.536 21.504 2.56 32.768 2.56 4.608.512 10.752.512 13.824.512h265.728c11.264-.512 26.112-1.536 32.768-3.072 10.24-2.048 19.968-5.12 27.648-9.216 9.728-4.608 17.92-10.752 25.088-17.92 7.68-7.68 13.824-15.872 18.432-25.6 4.096-7.68 7.168-17.408 9.216-27.648 1.536-6.656 2.56-21.504 2.56-32.768.512-4.608.512-10.752.512-13.824V116.223c-.512-11.264-1.536-26.112-3.072-32.768-2.048-10.24-5.12-19.968-9.216-27.648-4.608-9.728-10.752-17.92-17.92-25.088-7.68-7.68-15.872-13.824-25.6-18.432-7.68-4.096-17.408-7.168-27.648-9.216-6.656-1.536-21.504-2.56-32.768-2.56-4.608-.512-10.752-.512-13.824-.512H116.225z"
                                            fill="url(#whatsApp_svg___Linear1)" fill-rule="nonzero"></path>
                                        <path
                                            d="M344.754 289.698c-4.56-2.282-26.98-13.311-31.161-14.832-4.18-1.521-7.219-2.282-10.259 2.282-3.041 4.564-11.78 14.832-14.44 17.875-2.66 3.042-5.32 3.423-9.88 1.14-4.561-2.281-19.254-7.095-36.672-22.627-13.556-12.087-22.709-27.017-25.369-31.581s-.283-7.031 2-9.304c2.051-2.041 4.56-5.324 6.84-7.986 2.28-2.662 3.04-4.564 4.56-7.606 1.52-3.042.76-5.705-.38-7.987-1.14-2.282-10.26-24.72-14.06-33.848-3.701-8.889-7.461-7.686-10.26-7.826-2.657-.132-5.7-.16-8.74-.16-3.041 0-7.98 1.141-12.161 5.704-4.18 4.564-15.96 15.594-15.96 38.032 0 22.438 16.34 44.116 18.62 47.159 2.281 3.043 32.157 49.089 77.902 68.836 10.88 4.697 19.374 7.501 25.997 9.603 10.924 3.469 20.866 2.98 28.723 1.806 8.761-1.309 26.98-11.029 30.781-21.677 3.799-10.649 3.799-19.777 2.659-21.678-1.139-1.902-4.179-3.043-8.74-5.325m-83.207 113.573h-.061c-27.22-.011-53.917-7.32-77.207-21.137l-5.539-3.287-57.413 15.056 15.325-55.959-3.608-5.736c-15.184-24.145-23.203-52.051-23.192-80.704.033-83.611 68.083-151.635 151.756-151.635 40.517.016 78.603 15.811 107.243 44.474 28.64 28.663 44.404 66.764 44.389 107.283-.035 83.617-68.083 151.645-151.693 151.645m129.102-280.709c-34.457-34.486-80.281-53.487-129.103-53.507-100.595 0-182.468 81.841-182.508 182.437-.013 32.156 8.39 63.546 24.361 91.212l-25.892 94.545 96.75-25.37c26.657 14.535 56.67 22.194 87.216 22.207h.075c100.586 0 182.465-81.852 182.506-182.448.019-48.751-18.946-94.59-53.405-129.076"
                                            fill="#fff"></path>
                                        <defs>
                                            <linearGradient gradientTransform="matrix(0 -512 -512 0 256.001 512)"
                                                gradientUnits="userSpaceOnUse" id="whatsApp_svg___Linear1" x1="0" x2="1"
                                                y1="0" y2="0">
                                                <stop offset="0" stop-color="#25cf43"></stop>
                                                <stop offset="1" stop-color="#61fd7d"></stop>
                                            </linearGradient>
                                        </defs>
                                    </svg></a>
                                <a target="_blank" aria-label="Chia sẻ Facebook" title="Chia sẻ Linkedin"
                                    href="https://www.linkedin.com/sharing/share-offsite/?url=https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"><svg
                                        width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="32" height="32" rx="4" fill="#0077B5"></rect>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M10.857 9.07c-.022-1.094-.744-1.927-1.917-1.927S7 7.976 7 9.07C7 10.142 7.744 11 8.895 11h.022c1.196 0 1.94-.858 1.94-1.93zm0 3.216H7v11.571h3.857V12.286zm9.294 0c2.771 0 4.849 1.616 4.849 5.089v6.482h-4.212V17.81c0-1.52-.609-2.556-2.134-2.556-1.163 0-1.856.698-2.16 1.373-.112.242-.14.58-.14.917v6.314h-4.211s.055-10.244 0-11.305h4.212v1.601c.559-.77 1.56-1.867 3.796-1.867z"
                                            fill="#fff"></path>
                                    </svg></a>
                            </div>
                            <hr>
                            <div class="main-product-share-popup-body">
                                <label>Sao chép đường dẫn</label>
                                <form>
                                    <input
                                        value="https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"
                                        readonly="" id="main-product-share-copy">
                                    <button type="button" title="Sao chép" data-type="main-product-share-copy">Sao
                                        chép</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <h1 class="main-product-title ">${obj.ten}</h1>
                    <div class="main-product-info">
                        <div class="main-product-info-sku">
                            <strong>Mã sản phẩm: </strong>
                            <span>Đang cập nhật</span>
                        </div>
                        <div class="main-product-info-barcode">
                            <strong>Barcode: </strong>
                            <span>Đang cập nhật</span>
                        </div>
                        <div class="main-product-info-vendor">
                            <strong>Thương hiệu: </strong>
                            <span>Converse</span>
                        </div>
                        <div class="main-product-info-type">
                            <strong>Dòng sản phẩm: </strong>
                            <span>Giày cổ cao</span>
                        </div>
                    </div>
                    <div class="main-product-price">
                        <div class="main-product-price-wrap">
                            <del class="main-product-price-compare">${obj.gia.toLocaleString("vi") + " VNĐ"}</del>

                            <span class="main-product-price-this">${obj.giakm()}</span>

                            <span class="main-product-price-discount">Tiết kiệm ${obj.phantramgiam()}</span>
                        </div>
                        <div class="sapo-product-reviews-badge" data-id="33445614">
                            <div class="sapo-product-reviews-star" data-score="0" data-number="5" style="color: #ffbe00"
                                title="Not rated yet!"><i data-alt="1" class="star-off-png fa-regular fa-star"
                                    title="Not rated yet!"></i>&nbsp;<i data-alt="2"
                                    class="star-off-png fa-regular fa-star" title="Not rated yet!"></i>&nbsp;<i
                                    data-alt="3" class="star-off-png fa-regular fa-star"
                                    title="Not rated yet!"></i>&nbsp;<i data-alt="4"
                                    class="star-off-png fa-regular fa-star" title="Not rated yet!"></i>&nbsp;<i
                                    data-alt="5" class="star-off-png fa-regular fa-star"
                                    title="Not rated yet!"></i><input name="score" type="hidden" readonly=""></div>
                        </div>
                    </div>
                    <!-- Flash Sale -->
                    <div class="productFSale">
                        <img src="https://file.hstatic.net/200000306687/file/ezgif.com-gif-maker_40e5c36d115b4904babbebc78c90c34e.gif"
                            alt="productFSale">
                        <div data-time="1/4/2025 24:00:00" class="countdownLoop">
                            <span id="days"><b>70 </b></span><span> Ngày</span>
                            <span id="hours"><b>07</b></span><span> Giờ</span>
                            <span id="minutes"><b>41</b> </span><span> Phút</span>
                            <span id="seconds"><b>53</b></span> <span> Giây</span>
                        </div>
                    </div>
                    <!-- End Flash Sale -->
                    <div class="d-none">
                        <div class="selector-wrapper"><select class="single-option-selector" data-option="option1"
                                id="main-product-select-option-0">
                                <option value="35">35</option>
                                <option value="36">36</option>
                                <option value="37">37</option>
                                <option value="38">38</option>
                            </select></div><select id="main-product-select" name="id" style="display: none;">
                            <option value="102679924">35</option>
                            <option value="102679925">36</option>
                            <option value="102679926">37</option>
                            <option value="102679927">38</option>
                        </select>
                    </div>
                    <div class="main-product-swatch">




                        <div class="product-sw-line">
                            <div class="product-sw-select">
                                <div class="product-sw-title">Size</div>
                                <span class="product-sw-select-item">
    <input type="radio" data-value="35" name="product-choose-size" data-name="option1"
        value="35" class="trigger-option-sw" id="product-choose-size-2">
    <label for="product-choose-size-2" class="product-sw-select-item-span">35</label>
</span>
<span class="product-sw-select-item">
    <input type="radio" data-value="36" name="product-choose-size" data-name="option1"
        value="36" class="trigger-option-sw" id="product-choose-size-3">
    <label for="product-choose-size-3" class="product-sw-select-item-span">36</label>
</span>
<span class="product-sw-select-item">
    <input type="radio" data-value="37" name="product-choose-size" data-name="option1"
        value="37" class="trigger-option-sw" id="product-choose-size-4">
    <label for="product-choose-size-4" class="product-sw-select-item-span">37</label>
</span>
<span class="product-sw-select-item">
    <input type="radio" data-value="38" name="product-choose-size" data-name="option1"
        value="38" class="trigger-option-sw" id="product-choose-size-5">
    <label for="product-choose-size-5" class="product-sw-select-item-span">38</label>
</span>


                            </div>
                        </div>

                    </div>
                    <div class="main-product-quantity shop-quantity-wrap">
                        <label>Số lượng</label>
                        <div class="shop-quantity">
                            <button type="button" data-type="shop-quantity-minus" title="Giảm"
                                fdprocessedid="s4ysna">-</button>
                            <input type="number" name="quantity" value="1" min="1" readonly="" fdprocessedid="rnzroa">
                            <button type="button" data-type="shop-quantity-plus" title="Tăng"
                                fdprocessedid="mvmsg9">+</button>
                        </div>
                    </div>
                    <div class="main-product-freeship">
                        <div class="shop-freeship" data-freeship-price="50000000">
                            <div class="shop-freeship-bar">
                                <div class="shop-freeship-bar-main"><span style="width: 0%;"></span></div>
                            </div>
                            <div class="shop-freeship-note">Mua thêm <span>50.000.000₫</span> để được miễn phí giao
                                hàng
                                trên toàn quốc</div>
                        </div>
                    </div>
                    <div class="main-product-cta">
                        <button type="button" data-type="main-product-add" title="Thêm vào giỏ" fdprocessedid="61fv2g">
                            <strong>Thêm vào giỏ</strong>
                            <span>Chọn ngay sản phẩm bạn yêu thích</span>
                        </button>
                        <button type="button" data-type="main-product-send-help" title="Tư vấn" fdprocessedid="6mh1p">
                            <strong>Tư vấn</strong>
                            <span>Tư vấn thiết kế nội thất tùy chọn</span>
                        </button>
                        <button type="button" data-type="main-product-send-info" onclick="window.open('/pages/lien-he')"
                            title="Liên hệ" fdprocessedid="zhjj0m">
                            <strong>Liên hệ</strong>
                            <span>Chúng tôi luôn bên bạn 24/7</span>
                        </button>
                    </div>
                </div>
            </div>
             
    `;

};


const motsp = (sp) => {
    const {
        id,
        ten,
        gia,
        gia_km,
        hinh,
        soluongtonkho,
        hot,
        an_hien,

        mota,
        trangthai,
        tinh_chat,
        thumbnails,
        thuonghieu_id,
    } = sp;

    let obj: CSan_Pham;
    obj = new CSan_Pham(id, ten, gia, gia_km, hinh, soluongtonkho, hot, an_hien, mota, trangthai, tinh_chat, thumbnails, thuonghieu_id);

    return `
      <div class="swiper-slider1"  >
                            <div class="icon-heart">
                                <a href="#"><i class="fa fa-heart"></i></a>
                                <a href="#" class="hidden show them123" data-id="${obj.id}">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                </a>

                                <a href="" class="hidden show"><i class="fa-solid fa-magnifying-glass"></i></a>
                            </div>
                            <a href="product-detail.html?id=${obj.id}"><img class="hinh11" src="${obj.hinh}" alt=""></a>
                            <div class="content-hotsale">
                                <img src="https://file.hstatic.net/200000306687/file/imager_8176_d244203aa9cf4dfbb410e1377abdac72_compact.jpg" alt="">
                                <p>Còn lại ${obj.soluongtonkho} sản phẩm</p>
                            </div>
                            <p class="ten">${obj.ten}</p>
                            <span class="price-hot tiengoc">${obj.gia_km.toLocaleString("vi") + " VNĐ"}</span>
                            <span class="price-sale tiengiam"><del>${obj.gia.toLocaleString("vi") + " VNĐ"}</del></span>
                            <div class="info-hot">
                                <span>Freeship</span>
                                <span>new</span>
                                <div class="rate-staring">
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                </div>
                            </div>
                        </div>
       `;
};
const gohangmenu = (giohangmenu) => {
    const {
        id,
        ten,
        gia,
        gia_km = 0,
        hinh = "default.jpg", // Đặt hình mặc định nếu không có
        thuonghieu_id = "Không rõ",
        size,
        soluong = 1
    } = giohangmenu;

    let obj: ICartItem = {
        id,
        ten,
        gia,
        gia_km,
        hinh,
        thuonghieu_id,
        size,
        soluong
    };
    return `
    <div class="shop-cart-sidebar-yes">
                <div class="shop-cart-item" data-id="${obj.id}">
                    <div class="shop-cart-item-left">
                        <a href="product-detail.html&id=${obj.id}">
                            <img title="Chuck Taylor All Star Classic"
                                src="${obj.hinh}"
                                alt="${obj.ten}">
                        </a>
                    </div>
                    <div class="shop-cart-item-right">
                        <h4><a href="/chuck-taylor-all-star-classic" title="Chuck Taylor All Star Classic">${obj.ten}</a></h4>
                        <span>${obj.size}</span>
                        <p>${obj.gia_km.toLocaleString("vi") + " VNĐ"}</p>
                        <div class="shop-cart-item-right-action">

                            <div class="shop-cart-item-right-action-quantity shop-quantity-wrap">
                                <label>Số lượng</label>
                                <div class="shop-quantity">
                                    <button type="button" data-type="shop-quantity-minus" title="Giảm"
                                        fdprocessedid="mv3nzj">-</button>
                                    <input type="number" name="quantity_102679983" value="${obj.soluong}" min="1" readonly=""
                                        fdprocessedid="146nxe">
                                    <button type="button" data-type="shop-quantity-plus" title="Tăng"
                                        fdprocessedid="lg1764d">+</button>
                                </div>

                            </div>

                            <div class="shop-cart-item-right-action-remove">
                                <button type="button" title="Xóa" data-id=${obj.id} data-type="shop-cart-item-remove"
                                    data-href="/cart/change?line=1&amp;quantity=0" data-id="102679983"
                                    fdprocessedid="noq3lj">Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
}
const tatcagiohang = (allgiohang) => {
    const {
        id,
        ten,
        gia,
        gia_km = 0,
        hinh = "default.jpg", // Đặt hình mặc định nếu không có
        thuonghieu_id = "Không rõ",
        size,
        soluong = 1
    } = allgiohang;

    let obj: ICartItem = {
        id,
        ten,
        gia,
        gia_km,
        hinh,
        thuonghieu_id,
        size,
        soluong
    };
    return `
     <div class="main-cart-data-full-item" data-id="${obj.id}">

                            
    <div class="main-cart-data-full-item-image">
                                    <a href="product.html">
                                        <img title="Chuck Taylor All Star Classic"
                                            src="${obj.hinh}"
                                            alt="Chuck Taylor All Star Classic">
                                    </a>
                                </div>
                                <div class="main-cart-data-full-item-info">
                                    <h3 class="main-cart-data-full-item-info-title"><a
                                            href="Lỗi liquid: Exception has been thrown by the target of an invocation."
                                            title="Chuck Taylor All Star Classic">${obj.ten}</a>
                                    </h3>
                                    <div class="main-cart-data-full-item-info-price">
                                        <label>Giá: </label>

                                        <p id="priceT">${obj.gia_km.toLocaleString('vi') + 'VNĐ'}</p>
                                        <del>(${obj.gia.toLocaleString('vi') + 'VNĐ'})</del>
                                    </div>

                                    <div class="main-cart-data-full-item-info-variant">
                                        <label>Phiên bản: </label>
                                        <span>${obj.size}</span>
                                    </div>

                                    <div class="main-cart-data-full-item-info-quantity shop-quantity-wrap">
                                        <label>Số lượng</label>
                                        <div class="shop-quantity">
                                            <button type="button" data-type="shop-quantity-minus" title="Giảm"
                                                fdprocessedid="mv3nzj">-</button>
                                            <input type="number" name="quantity_102679983" value="${obj.soluong}" min="1" readonly=""
                                                fdprocessedid="146nxe" id="quantityInput" class="quantity-input">
                                            <button type="button" data-type="shop-quantity-plus" title="Tăng"
                                                fdprocessedid="lg1764d">+</button>
                                        </div>
                                    </div>


                                    <div class="main-cart-data-full-item-info-total hidden d-none" hidden="">

                                        <label>Thành tiền: </label>
                                        <span>1.309.000₫</span>

                                    </div>
                                    <div class="main-cart-data-full-item-info-remove">
                                        <a href="/cart/change?line=1&amp;quantity=0" title="Xóa sản phẩm">Xoá sản
                                            phẩm</a>
                                    </div>
                                </div>
                                <div class="main-cart-data-full-item-action">
                                    <a href="" title="Xóa sản phẩm" class="xoa" data-id="${obj.id}"><svg version="1.1"
                                            x="0px" y="0px" viewBox="0 0 325.284 325.284"
                                            style="enable-background:new 0 0 325.284 325.284;" xml:space="preserve">
                                            <g>
                                                <path
                                                    d="M289.782,63.456H35.502c-7.04,0-12.768,5.732-12.768,12.768s5.732,12.768,12.768,12.768h2.828l25.856,206.644 c0,16.348,13.3,29.648,29.648,29.648h137.62c16.348,0,29.648-13.3,29.616-29.192l25.888-207.1h2.824 c7.04,0,12.768-5.732,12.768-12.768S296.822,63.456,289.782,63.456z M253.738,295.64c0,12.288-9.996,22.284-22.284,22.284H93.834 c-12.288,0-22.284-9.996-22.316-22.74L45.742,88.996h233.796L253.738,295.64z M289.782,81.632H35.502 c-2.98,0-5.404-2.424-5.404-5.404c0-2.98,2.424-5.404,5.404-5.404h254.28c2.98,0,5.404,2.424,5.404,5.404 C295.186,79.208,292.762,81.632,289.782,81.632z">
                                                </path>
                                                <path
                                                    d="M91.67,110.828c5.976,0,10.836,4.512,10.848,10.312l15.568,162.288c0,5.556-4.864,10.068-10.836,10.068 c-2.4,0-4.716-0.772-6.688-2.232c-1.148-0.86-2.76-0.616-3.6,0.536c-0.848,1.14-0.608,2.756,0.536,3.6 c2.864,2.128,6.236,3.244,9.752,3.244c8.82,0,15.992-6.824,15.98-15.46l-15.568-162.288c0-8.392-7.172-15.22-15.992-15.22 c-1.424,0-2.576,1.152-2.576,2.58C89.094,109.676,90.246,110.828,91.67,110.828z">
                                                </path>
                                                <path
                                                    d="M95.254,259.668c0.072,0,0.14-0.004,0.216-0.012c1.42-0.112,2.476-1.352,2.356-2.776l-7.976-98.652 c-0.112-1.42-1.4-2.448-2.776-2.356c-1.42,0.112-2.476,1.352-2.36,2.772l7.98,98.652 C92.798,258.648,93.926,259.668,95.254,259.668z">
                                                </path>
                                                <path
                                                    d="M176.058,177.516c-1.424,0-2.576,1.152-2.576,2.576v103.336c0,5.556-4.864,10.068-10.84,10.068 c-2.4,0-4.72-0.772-6.692-2.232c-1.14-0.856-2.76-0.612-3.6,0.54c-0.848,1.14-0.608,2.752,0.54,3.6 c2.864,2.124,6.24,3.24,9.752,3.24c8.82,0,15.992-6.824,15.992-15.22V180.088C178.634,178.664,177.482,177.516,176.058,177.516z">
                                                </path>
                                                <path
                                                    d="M154.418,254.94c1.424,0,2.576-1.152,2.576-2.576V112.368c1.724-1.008,3.656-1.54,5.652-1.54 c5.976,0,10.836,4.512,10.836,10.064v25.44c0,1.428,1.152,2.576,2.58,2.576c1.424,0,2.576-1.148,2.576-2.576v-25.44 c0-8.392-7.172-15.22-15.992-15.22c-3.516,0-6.892,1.12-9.76,3.248c-0.656,0.48-1.044,1.252-1.044,2.068v141.376 C151.842,253.788,152.994,254.94,154.418,254.94z">
                                                </path>
                                                <path
                                                    d="M219.05,132.444c1.432,0.156,2.636-1.012,2.708-2.436l0.948-17.592c1.744-1.044,3.704-1.588,5.72-1.588 c5.972,0,10.836,4.512,10.844,9.908l-10.392,162.692c0,5.552-4.864,10.064-10.836,10.064c-1.428,0-2.58,1.152-2.58,2.58 c0,1.424,1.152,2.576,2.58,2.576c8.82,0,15.988-6.828,15.984-15.06l10.392-162.692c0-8.392-7.172-15.22-15.992-15.22 c-3.516,0-6.892,1.12-9.76,3.248c-0.616,0.456-1,1.168-1.04,1.932l-1.016,18.88C216.538,131.156,217.63,132.368,219.05,132.444z">
                                                </path>
                                                <path
                                                    d="M210.754,275.728c0.052,0.004,0.1,0.004,0.152,0.004c1.356,0,2.488-1.056,2.572-2.424l6.436-109.056 c0.084-1.42-0.996-2.64-2.42-2.724c-1.36-0.092-2.636,1-2.72,2.42l-6.44,109.056 C208.246,274.428,209.334,275.648,210.754,275.728z">
                                                </path>
                                                <path
                                                    d="M43.614,56.54c2.032,0,3.684-1.648,3.684-3.684c0-12.288,9.996-22.288,22.284-22.288H255.71 c12.288,0,22.284,9.996,22.284,22.288c0,2.032,1.648,3.684,3.684,3.684c2.036,0,3.684-1.648,3.684-3.684 c0-16.348-13.3-29.648-29.648-29.648h-61.692C194.018,10.408,183.61,0,170.81,0h-16.336c-12.796,0-23.208,10.408-23.212,23.208 H69.578c-16.348,0-29.648,13.3-29.648,29.648C39.93,54.892,41.578,56.54,43.614,56.54z M154.474,7.364h16.336 c8.736,0,15.844,7.108,15.848,15.844h-48.032C138.63,14.472,145.738,7.364,154.474,7.364z">
                                                </path>
                                                <path
                                                    d="M258.734,41.384c-1.284-0.608-2.824-0.064-3.432,1.224c-0.608,1.284-0.06,2.82,1.224,3.432 c3.032,1.44,5.016,3.536,6.068,6.4c0.384,1.044,1.372,1.688,2.42,1.688c0.296,0,0.596-0.052,0.888-0.156 c1.34-0.492,2.024-1.972,1.532-3.308C265.91,46.528,262.982,43.404,258.734,41.384z">
                                                </path>
                                                <path
                                                    d="M220.206,38.056c-3.748,0.056-7.324,0.112-10.616,0.112c-1.424,0-2.576,1.152-2.576,2.58 c0,1.424,1.152,2.576,2.576,2.576c3.312,0,6.92-0.056,10.692-0.112c8.472-0.124,18.056-0.264,27.016,0.18 c0.044,0.004,0.092,0.004,0.132,0.004c1.364,0,2.504-1.072,2.572-2.444c0.08-1.42-1.02-2.632-2.44-2.704 C238.422,37.784,228.746,37.932,220.206,38.056z">
                                                </path>
                                            </g>
                                        </svg></a>
                                </div>
                                </div>
    `;
}