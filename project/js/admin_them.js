import { urlserver } from "./common.js";
export const lay_nguoi_dung = async () => {
    try {
        const response = await fetch(urlserver + '/nguoi_dung', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        let kq = '';
        data.forEach(sp => {
            kq += ` <tr>
                        <td>${sp.id}</td>
                        <td>${sp.name}</td>
                        <td>${sp.email}</td>
                        <td>${sp.phone}</td>

                    </tr>`;
        });
        document.getElementById('showuser').innerHTML = kq;
    }
    catch (error) {
        console.error('Error:', error);
    }
};
export const lay_san_pham_admin = async (sosp = 9) => {
    try {
        const response = await fetch(urlserver + `/san_pham?_limit=${sosp}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let data = await response.json();
        data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        let kq = '';
        data.forEach(sp => {
            kq += ` 
        <tr>
            <td>${sp.id}</td>   
            <td>${sp.ten}</td>
            <td>${sp.gia_km.toLocaleString("vi-VN")} VNĐ</td>
            <td><img src="${sp.hinh}" alt="${sp.ten}" width="100"></td>
            <td>${sp.soluongtonkho}</td>
            <td>${sp.hot ? 'Đang hot' : 'Không hot'}</td>
        </tr>`;
        });
        document.getElementById('showsp').innerHTML = kq;
    }
    catch (error) {
        console.error('Error:', error);
    }
};
export const danh_sach_nguoi_dung = async () => {
    try {
        const response = await fetch(urlserver + '/nguoi_dung', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        console.log(data);
        let users = data;
        let currentPage = 1;
        const usersPerPage = 9;
        const paginateUsers = (users) => {
            const startIndex = (currentPage - 1) * usersPerPage;
            const endIndex = startIndex + usersPerPage;
            return users.slice(startIndex, endIndex);
        };
        const displayPagination = (totalUsers) => {
            const totalPages = Math.ceil(totalUsers / usersPerPage);
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = String(i);
                pageButton.classList.add('page-button');
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    updateTableDisplay(users);
                });
                paginationContainer.appendChild(pageButton);
            }
        };
        const updateTableDisplay = (users) => {
            const userTableBody = document.getElementById('userTableBody');
            const paginatedUsers = paginateUsers(users);
            userTableBody.innerHTML = '';
            paginatedUsers.forEach(user => {
                const diachiName = user.diachi && user.diachi.length > 0 ? user.diachi[0].address : 'Chưa có địa chỉ';
                userTableBody.innerHTML += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td>${diachiName}</td>
                    </tr>
                `;
            });
            displayPagination(users.length);
        };
        updateTableDisplay(users);
        document.getElementById('searchUser').addEventListener('input', (e) => {
            const searchQuery = e.target.value.toLowerCase();
            const filteredUsers = users.filter(user => {
                const name = user.name ? user.name.toLowerCase() : '';
                const email = user.email ? user.email.toLowerCase() : '';
                const phone = user.phone ? String(user.phone) : '';
                return name.includes(searchQuery) || email.includes(searchQuery) || phone.includes(searchQuery);
            });
            currentPage = 1;
            updateTableDisplay(filteredUsers);
        });
    }
    catch (error) {
        console.error('Error:', error);
    }
};
export const them_nguoi_dung = async (data) => {
    try {
        const response = await fetch(urlserver + '/nguoi_dung', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Không thể thêm người dùng');
        }
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
};
export const danh_sach_thuong_hieu = async () => {
    try {
        const response = await fetch(urlserver + '/thuong_hieu', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        let arr = data;
        console.log(data);
        let brand = arr;
        let currentPage = 1;
        const brandPerPage = 9;
        const paginateUsers = (brand) => {
            const startIndex = (currentPage - 1) * brandPerPage;
            const endIndex = startIndex + brandPerPage;
            return brand.slice(startIndex, endIndex);
        };
        const displayPagination = (totalUsers) => {
            const totalPages = Math.ceil(totalUsers / brandPerPage);
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = String(i);
                pageButton.classList.add('page-button');
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    updateTableDisplay(brand);
                });
                paginationContainer.appendChild(pageButton);
            }
        };
        const updateTableDisplay = (brand) => {
            const brandTableBody = document.getElementById('brandTableBody');
            const paginatedUsers = paginateUsers(brand);
            brandTableBody.innerHTML = '';
            paginatedUsers.forEach(user => {
                brandTableBody.innerHTML += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.ten}</td>
                        <td>${user.quocgia}</td>
                        <td style="text-align:center;">
                           <button class="btn-sua" data-id="${user.id}">Sửa</button>
                            <button style="background-color:green;" data-id="${user.id}" class="btn-xoa">Xóa</button>                                            
                        </td>                     
     
                    </tr>
                `;
            });
            displayPagination(brand.length);
        };
        updateTableDisplay(brand);
        document.getElementById('searchUser').addEventListener('input', (e) => {
            const searchQuery = e.target.value.toLowerCase();
            const filteredUsers = brand.filter(user => {
                const name = user.ten ? user.ten.toLowerCase() : '';
                const email = user.quocgia ? user.quocgia.toLowerCase() : '';
                return name.includes(searchQuery) || email.includes(searchQuery);
            });
            currentPage = 1;
            updateTableDisplay(filteredUsers);
        });
    }
    catch (error) {
        console.error('Error:', error);
    }
};
export const them_thuong_hieu = async (data) => {
    try {
        const response = await fetch(urlserver + '/thuong_hieu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Không thể thêm thương hiệu');
        }
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
};
export const form_sua_thuong_hieu = async (id) => {
    let url = `${urlserver}/thuong_hieu/?id=${id}`;
    let th = await fetch(url)
        .then(res => res.json())
        .then(data => data[0]);
    let container = document.getElementById('editBrandContainer');
    if (!container) {
        console.error("Lỗi: Không tìm thấy #editBrandContainer trong DOM");
        return;
    }
    container.innerHTML = `
        <form id="editBrandForm">
            <div class="form-group">
                <label for="name">Tên thương hiệu:</label>
                <input type="text" id="name" name="name" value="${th.ten}" required>
            </div>

            <div class="form-group">
                <label for="quocgia">Quốc gia:</label>
                <input type="text" id="quocgia" name="quocgia" value="${th.quocgia}" required>
            </div>

            <input type="hidden" id='id' value="${id}">
            <button type="submit" id="sua">Sửa thương hiệu</button>
           

        </form>
         <button id="return">Quay lại</button>
    `;
    document.getElementById('return').addEventListener('click', () => {
        window.location.href = '../admin_thuong_hieu.html';
    });
    document.getElementById('sua')?.addEventListener('click', async (event) => {
        event.preventDefault();
        const id = document.getElementById('id').value;
        const ten = document.getElementById('name').value;
        const quocgia = document.getElementById('quocgia').value;
        await sua_thuong_hieu({ id: Number(id), ten, quocgia });
        window.location.href = "../admin_thuong_hieu.html";
    });
};
export const sua_thuong_hieu = async (data) => {
    try {
        const response = await fetch(`${urlserver}/thuong_hieu/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`❌ Lỗi: ${response.status} - ${response.statusText}`);
        }
        const result = await response.json();
        console.log("✅ Cập nhật thương hiệu thành công:", result);
        return result;
    }
    catch (error) {
        console.error("🚨 Lỗi khi cập nhật thương hiệu:", error);
        return null;
    }
};
export const xoa_thuong_hieu = async (btn) => {
    let id = btn.getAttribute('data-id');
    let hot = window.confirm('Muốn xóa à chắc chưa?');
    if (!hot) {
        return;
    }
    let otp = { method: 'DELETE' };
    let kq = await fetch(urlserver + `/thuong_hieu/${id}`, otp)
        .then(res => res.json())
        .then(data => data);
    document.location = 'admin_thuong_hieu.html';
};
export const danh_sach_san_pham = async () => {
    try {
        const response = await fetch(urlserver + '/san_pham', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        console.log(data);
        let products = data;
        let currentPage = 1;
        const productPerPage = 9;
        const paginateUsers = (products) => {
            const startIndex = (currentPage - 1) * productPerPage;
            const endIndex = startIndex + productPerPage;
            return products.slice(startIndex, endIndex);
        };
        const displayPagination = (totalUsers) => {
            const totalPages = Math.ceil(totalUsers / productPerPage);
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = String(i);
                pageButton.classList.add('page-button');
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    updateTableDisplay(products);
                });
                paginationContainer.appendChild(pageButton);
            }
        };
        const updateTableDisplay = (products) => {
            const showsp = document.getElementById('showsp');
            const paginatedUsers = paginateUsers(products);
            showsp.innerHTML = '';
            paginatedUsers.forEach(sp => {
                showsp.innerHTML += `
                    <tr>
                        <td>${sp.id}</td>
                        <td>${sp.ten}</td>
                        <td>${sp.gia_km.toLocaleString("vi") + " VNĐ"}</td>
                        <td><img src="${sp.hinh}" alt="${sp.ten}" width="100"></td>
                        <td>${sp.soluongtonkho}</td>
                        <td style="text-align:center;">
                           <button class="btn-sua" data-id="${sp.id}">Sửa</button>
                            <button style="background-color:green;" data-id="${sp.id}" class="btn-xoa">Xóa</button>                                            
                        </td>     

                    </tr>
                `;
            });
            displayPagination(products.length);
        };
        updateTableDisplay(products);
        document.getElementById('searchUser').addEventListener('input', (e) => {
            const searchQuery = e.target.value.toLowerCase();
            const filteredUsers = products.filter(user => {
                const name = user.name ? user.name.toLowerCase() : '';
                const email = user.email ? user.email.toLowerCase() : '';
                const phone = user.phone ? String(user.phone) : '';
                return name.includes(searchQuery) || email.includes(searchQuery) || phone.includes(searchQuery);
            });
            currentPage = 1;
            updateTableDisplay(filteredUsers);
        });
    }
    catch (error) {
        console.error('Error:', error);
    }
};
export const them_san_pham = async (data) => {
    try {
        const response = await fetch(urlserver + '/san_pham', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Lỗi khi thêm sản phẩm');
        }
        return response.json();
    }
    catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
};
export const lay_thuong_hieu = async () => {
    try {
        const response = await fetch(urlserver + '/thuong_hieu', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Lỗi khi lấy danh sách thương hiệu');
        }
        const data = await response.json();
        let kq = '';
        data.forEach(item => {
            kq += `<option value='${item.id}'>${item.ten}</option>`;
        });
        document.getElementById('thuonghieu').innerHTML = kq;
    }
    catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
};
export const xoa_san_pham = async (btn) => {
    let id = btn.getAttribute('data-id');
    let hot = window.confirm('Muốn xóa à chắc chưa?');
    if (!hot) {
        return;
    }
    let otp = { method: 'DELETE' };
    let kq = await fetch(urlserver + `/san_pham/${id}`, otp)
        .then(res => res.json())
        .then(data => data);
    document.location = 'admin_san_pham.html';
};
export const form_sua_san_pham = async (id) => {
    let url = `${urlserver}/san_pham/?id=${id}`;
    try {
        let response = await fetch(url);
        if (!response.ok)
            throw new Error(`Lỗi khi lấy dữ liệu: ${response.statusText}`);
        let th = await response.json();
        th = th[0];
        let container = document.getElementById('editProductContainer');
        if (!container) {
            console.error("Lỗi: Không tìm thấy #editProductContainer trong DOM");
            return;
        }
        container.innerHTML = `
            <form id="editProductForm">
                <div class="form-group">
                    <label for="name">Tên sản phẩm:</label>
                    <input type="text" id="name" name="name" value="${th.ten}" required>
                </div>

                <div class="form-group">
                    <label for="old-price">Giá trước khuyến mãi:</label>
                    <input type="number" id="old-price" name="old-price" value="${th.gia}" required>
                </div>
                <div class="form-group">
                    <label for="new-price">Giá sau khuyến mãi:</label>
                    <input type="number" id="new-price" name="new-price" value="${th.gia_km}" required>
                </div>
                <div class="form-group">
                    <label for="image">Hình ảnh:</label>
                    <input type="text" id="image" name="image" value="${th.hinh}" required>
                </div>
                <div class="form-group">
                    <label for="stock">Số lượng tồn kho:</label>
                    <input type="number" id="stock" name="stock" value="${th.soluongtonkho}" required>
                </div>
                <div class="form-group">
                    <label for="hot">Độ hot:</label>
                    <select id="hot" name="hot">
                        <option value="true" ${th.hot ? "selected" : ""}>Đang hot</option>
                        <option value="false" ${!th.hot ? "selected" : ""}>Không hot</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="an_hien">Ẩn/Hiện:</label>
                    <select id="an_hien" name="an_hien">
                        <option value="true" ${th.an_hien ? "selected" : ""}>Hiện</option>
                        <option value="false" ${!th.an_hien ? "selected" : ""}>Ẩn</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="thuonghieu">Thương hiệu:</label>
                    <select id="thuonghieu" name="thuonghieu">
                        <option value="${th.thuonghieu_id}" selected>Thương hiệu ID: ${th.thuonghieu_id}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="thumbnails">Thumbnails:</label>
                    <input type="text" class="form-control" id="thumbnails" value="${th.thumbnails.join(', ')}" placeholder="https://link1.com, https://link2.com, https://link3.com">
                </div>
                <div class="form-group">
                    <label for="mota">Mô tả:</label>
                    <textarea class="form-control" id="mota" style="width: 100%;height: 200px;" placeholder="Nhập mô tả sản phẩm">${th.mota}</textarea>
                </div>
                <div class="form-group">
                    <label for="status">Trạng thái:</label>
                    <select id="status" name="status">
                        <option value="Còn hàng" ${th.trangthai === "Còn hàng" ? "selected" : ""}>Còn hàng</option>
                        <option value="Hết hàng" ${th.trangthai === "Hết hàng" ? "selected" : ""}>Hết hàng</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="tinhchat">Tính chất:</label>
                    <select id="tinhchat" name="tinhchat">
                        <option value="1" ${th.tinhchat === 1 ? "selected" : ""}>Mới</option>
                        <option value="2" ${th.tinhchat === 2 ? "selected" : ""}>Giảm giá</option>
                        <option value="3" ${th.tinhchat === 3 ? "selected" : ""}>Bán chạy</option>
                    </select>
                </div>
                <input type="hidden" id='id' value="${id}">
                <button type="submit" id="sua">Sửa sản phẩm</button>
            </form>
            <button id="return">Quay lại</button>
        `;
        await lay_thuong_hieu();
        document.getElementById('return').addEventListener('click', () => {
            window.location.href = '../admin_san_pham.html';
        });
        document.getElementById('editProductForm')?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id = Number(document.getElementById('id').value);
            const ten = document.getElementById('name').value;
            const gia = Number(document.getElementById('old-price').value);
            const gia_km = Number(document.getElementById('new-price').value);
            const hinh = document.getElementById('image').value;
            const soluongtonkho = Number(document.getElementById('stock').value);
            const hot = document.getElementById('hot').value === "true";
            const an_hien = document.getElementById('an_hien').value === "true";
            const thuonghieu_id = Number(document.getElementById('thuonghieu').value);
            const thumbnails = document.getElementById('thumbnails').value.split(',').map(link => link.trim());
            const mota = document.getElementById('mota').value;
            const trangthai = document.getElementById('status').value;
            const tinhchat = Number(document.getElementById('tinhchat').value);
            await sua_san_pham({ id, ten, gia, gia_km, hinh, soluongtonkho, hot, an_hien, thuonghieu_id, thumbnails, mota, trangthai, tinhchat });
            window.location.href = "../admin_san_pham.html";
        });
    }
    catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
    }
};
export const sua_san_pham = async (data) => {
    try {
        const response = await fetch(`${urlserver}/san_pham/${data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
        const result = await response.json();
        console.log("✅ Cập nhật sản phẩm thành công:", result);
        return result;
    }
    catch (error) {
        console.error("🚨 Lỗi khi cập nhật sản phẩm:", error);
        return null;
    }
};
