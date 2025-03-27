const urlserver = `http://localhost:3000`;
const tygia = 25000;
class CSan_Pham {
    id;
    ten;
    gia;
    gia_km;
    hinh;
    soluongtonkho;
    hot;
    an_hien;
    mota;
    trangthai;
    tinh_chat;
    thumbnails;
    thuonghieu_id;
    constructor(id, ten, gia, gia_km, hinh, soluongtonkho, hot, an_hien, mota, trangthai, tinh_chat, thumbnails, thuonghieu_id) {
        this.id = id;
        this.ten = ten;
        this.gia = gia;
        this.gia_km = gia_km;
        this.hinh = hinh;
        this.soluongtonkho = soluongtonkho;
        this.hot = hot;
        this.an_hien = an_hien;
        this.mota = mota;
        this.trangthai = trangthai;
        this.tinh_chat = tinh_chat;
        this.thumbnails = thumbnails;
        this.thuonghieu_id = thuonghieu_id;
    }
    phantramgiam() {
        return (100 * (this.gia - this.gia_km) / this.gia).toFixed(0) + " %";
    }
    giavnd() {
        return Number(this.gia).toLocaleString("vi") + " VNĐ";
    }
    giakm() {
        return Number(this.gia_km).toLocaleString("vi") + " VNĐ";
    }
    giaUSD() {
        return Number(this.gia / tygia).toFixed(0) + " USD";
    }
}
class SanPhamService extends CSan_Pham {
    size;
    soluong;
    theloai;
    constructor(id, ten, gia, gia_km, hinh, soluongtonkho, hot, an_hien, mota, trangthai, tinh_chat, thumbnails, thuonghieu_id, size, soluong, theloai) {
        super(id, ten, gia, gia_km, hinh, soluongtonkho, hot, an_hien, mota, trangthai, tinh_chat, thumbnails, thuonghieu_id);
        this.size = size;
        this.soluong = soluong;
        this.theloai = theloai;
    }
}
class Cart {
    id;
    ten;
    gia;
    gia_km;
    size;
    hinh;
    soluong;
    thuonghieu_id;
    constructor(id, ten, gia, gia_km, size, hinh, soluong, thuonghieu_id) {
        this.id = id;
        this.ten = ten;
        this.gia = gia;
        this.gia_km = gia_km;
        this.size = size;
        this.hinh = hinh;
        this.soluong = soluong;
        this.thuonghieu_id = thuonghieu_id;
    }
    phantramgiam() {
        return (100 * (this.gia - this.gia_km) / this.gia).toFixed(0) + " %";
    }
    giavnd() {
        return Number(this.gia).toLocaleString("vi") + " VNĐ";
    }
    giakm() {
        return Number(this.gia_km).toLocaleString("vi") + " VNĐ";
    }
}
export { urlserver, CSan_Pham, SanPhamService, Cart };
