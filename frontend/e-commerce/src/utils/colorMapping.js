export const colorMapping = {
  'trang': '#FFFFFF',
  'den': '#000000',
  'xam': '#808080',
};

export const getColorCode = (colorName) => {
  const normalizedColorName = colorName.toLowerCase().trim();
  return colorMapping[normalizedColorName] || colorName; // Trả về mã màu hoặc tên màu gốc nếu không tìm thấy
};
