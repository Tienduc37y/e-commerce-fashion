export const convertCurrency = (x) => {
    // Kiểm tra xem x có phải là số hợp lệ không
    if (typeof x !== 'number' || isNaN(x)) {
        return 'Không hợp lệ';
    }
    
    // Chuyển đổi số thành chuỗi tiền tệ Việt Nam
    return x.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
}

export const convertDate = (date) => {
    // Kiểm tra nếu date không hợp lệ
    if (!date) return 'Không hợp lệ';

    // Chỉ format lại chuỗi ngày giờ
    const dateStr = date.replace('T', ' ').split('.')[0];
    const [ymd, time] = dateStr.split(' ');
    const [year, month, day] = ymd.split('-');
    
    return `${time} - ${day}/${month}/${year}`;
}

