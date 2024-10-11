export const convertCurrency = (x) => {
    // Kiểm tra xem x có phải là số hợp lệ không
    if (typeof x !== 'number' || isNaN(x)) {
        return 'Không hợp lệ';
    }
    
    // Chuyển đổi số thành chuỗi tiền tệ Việt Nam
    return x.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
}