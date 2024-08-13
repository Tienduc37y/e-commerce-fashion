export const convertCurrency = (x) => {
    x = x.toLocaleString('vi', {style : 'currency', currency : 'VND'});
    return x
}