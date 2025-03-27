const urlserver = `http://localhost:3000`;
const tygia = 25000;
interface ISanPham {
    id: number;
    ten: string;
    gia: number;
    gia_km: number;
    hinh: string;
    soluongtonkho: number;
    hot: Boolean;
    an_hien: Boolean;
    mota: string;
    trangthai: string;
    tinh_chat: number;
    thumbnails: string[];
    thuonghieu_id: number
}
interface IThuoc_Tinh {
    size: number;
    soluong: number;
    theloai: string
}
interface ICartItem {
    id: number;
    ten: string;
    gia: number;
    gia_km: number;
    size: number;
    hinh: string;
    thuonghieu_id:number
    soluong: number;
}

class CSan_Pham implements ISanPham {
    id: number;
    ten: string;
    gia: number;
    gia_km: number;
    hinh: string;
    soluongtonkho: number;
    hot: Boolean;
    an_hien: Boolean;
    mota: string;
    trangthai: string;
    tinh_chat: number;
    thumbnails: string[];
    thuonghieu_id: number
    constructor(
        id: number,
        ten: string,
        gia: number,
        gia_km: number,
        hinh: string,
        soluongtonkho: number,
        hot: Boolean,
        an_hien: Boolean,
        
        mota: string,
        trangthai: string,
        tinh_chat: number,
        thumbnails: string[],
        thuonghieu_id: number
    ) {
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
class SanPhamService extends CSan_Pham implements IThuoc_Tinh {
    size: number;
    soluong: number;
    theloai: string;

    constructor(
        id: number,
        ten: string,
        gia: number,
        gia_km: number,
        hinh: string,
        soluongtonkho: number,
        hot: boolean,
        an_hien: boolean,
        mota: string,
        trangthai: string,
        tinh_chat: number,
        thumbnails: string[],
        thuonghieu_id: number,
        size: number,
        soluong: number,
        theloai: string
    ) {
        super(id, ten, gia, gia_km, hinh, soluongtonkho, hot, an_hien, mota, trangthai, tinh_chat, thumbnails, thuonghieu_id);
        this.size = size;
        this.soluong = soluong;
        this.theloai = theloai;
    }
}
interface NguoiDung {
    name: string;
    email: string;
    password: string;
    phone: number;
    role: string;
    diachi: { id: number; address: string }[];

}
class Cart implements ICartItem {
    id: number;
    ten: string;
    gia: number;
    gia_km: number;
    size: number;
    hinh: string;
    soluong: number;
    thuonghieu_id: number;

    constructor(
        id: number,
        ten: string,
        gia: number,
        gia_km: number,
        size: number,
        hinh: string,
        soluong: number,
        thuonghieu_id: number

    ) {
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
type TthuongHieu={
    id:number,
    ten:string,
    quocgia:string
    }


export{urlserver,ISanPham,IThuoc_Tinh,ICartItem,CSan_Pham,SanPhamService,NguoiDung,Cart,TthuongHieu}