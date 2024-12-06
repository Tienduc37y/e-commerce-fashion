import { useParams } from 'react-router-dom';

const SizeGuideDetails = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bảng size nữ */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">BẢNG SIZE CHUNG CHO NỮ</h2>
        <p className="text-sm italic text-gray-600 mb-4">*Đơn vị tính: cm, kg</p>
        
        {/* Bảng thông số cơ bản */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-center">Size</th>
                <th className="border p-3 text-center">S</th>
                <th className="border p-3 text-center">M</th>
                <th className="border p-3 text-center">L</th>
                <th className="border p-3 text-center">XL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Chiều cao</td>
                <td className="border p-3 text-center">150-155</td>
                <td className="border p-3 text-center">155-163</td>
                <td className="border p-3 text-center">160-165</td>
                <td className="border p-3 text-center">162-166</td>
              </tr>
              <tr>
                <td className="border p-3">Cân nặng</td>
                <td className="border p-3 text-center">41-46 kg</td>
                <td className="border p-3 text-center">47-52 kg</td>
                <td className="border p-3 text-center">53-58 kg</td>
                <td className="border p-3 text-center">59-64 kg</td>
              </tr>
              <tr>
                <td className="border p-3">Vòng ngực</td>
                <td className="border p-3 text-center">79-82</td>
                <td className="border p-3 text-center">82-87</td>
                <td className="border p-3 text-center">88-94</td>
                <td className="border p-3 text-center">94-99</td>
              </tr>
              <tr>
                <td className="border p-3">Vòng mông</td>
                <td className="border p-3 text-center">88-90</td>
                <td className="border p-3 text-center">90-94</td>
                <td className="border p-3 text-center">94-98</td>
                <td className="border p-3 text-center">98-102</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bảng thông số chi tiết */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-center">Size</th>
                <th className="border p-3 text-center">27 (S)</th>
                <th className="border p-3 text-center">28 (M)</th>
                <th className="border p-3 text-center">29 (L)</th>
                <th className="border p-3 text-center">30 (XL)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Vòng eo</td>
                <td className="border p-3 text-center">67.5</td>
                <td className="border p-3 text-center">70</td>
                <td className="border p-3 text-center">72.5</td>
                <td className="border p-3 text-center">75</td>
              </tr>
              <tr>
                <td className="border p-3">Vòng mông (dáng slim)</td>
                <td className="border p-3 text-center">81.5</td>
                <td className="border p-3 text-center">84</td>
                <td className="border p-3 text-center">86.5</td>
                <td className="border p-3 text-center">89</td>
              </tr>
              <tr>
                <td className="border p-3">Vòng mông (dáng regular)</td>
                <td className="border p-3 text-center">89.46</td>
                <td className="border p-3 text-center">92</td>
                <td className="border p-3 text-center">94.5</td>
                <td className="border p-3 text-center">97.1</td>
              </tr>
              <tr>
                <td className="border p-3">Chiều dài quần</td>
                <td className="border p-3 text-center">94</td>
                <td className="border p-3 text-center">95</td>
                <td className="border p-3 text-center">96</td>
                <td className="border p-3 text-center">97</td>
              </tr>
              <tr>
                <td className="border p-3">Rộng gấu (dáng slim)</td>
                <td className="border p-3 text-center">13</td>
                <td className="border p-3 text-center">13.5</td>
                <td className="border p-3 text-center">14</td>
                <td className="border p-3 text-center">14.5</td>
              </tr>
              <tr>
                <td className="border p-3">Rộng gấu (dáng regular)</td>
                <td className="border p-3 text-center" colSpan="5">Tùy mẫu kích thước khác nhau</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bảng size nam */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">BẢNG SIZE CHUNG CHO NAM</h2>
        <p className="text-sm italic text-gray-600 mb-4">*Đơn vị tính: cm, kg</p>
        
        {/* Bảng thông số nam */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-center">Size</th>
                <th className="border p-3 text-center">S</th>
                <th className="border p-3 text-center">M</th>
                <th className="border p-3 text-center">L</th>
                <th className="border p-3 text-center">XL</th>
                <th className="border p-3 text-center">XXL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Chiều cao</td>
                <td className="border p-3 text-center">162-168</td>
                <td className="border p-3 text-center">169-173</td>
                <td className="border p-3 text-center">171-175</td>
                <td className="border p-3 text-center">173-177</td>
                <td className="border p-3 text-center">175-179</td>
              </tr>
              <tr>
                <td className="border p-3">Cân nặng</td>
                <td className="border p-3 text-center">57-62 kg</td>
                <td className="border p-3 text-center">63-67 kg</td>
                <td className="border p-3 text-center">68-72 kg</td>
                <td className="border p-3 text-center">73-77 kg</td>
                <td className="border p-3 text-center">78-82 kg</td>
              </tr>
              <tr>
                <td className="border p-3">Vòng ngực</td>
                <td className="border p-3 text-center">84-88</td>
                <td className="border p-3 text-center">88-94</td>
                <td className="border p-3 text-center">94-98</td>
                <td className="border p-3 text-center">98-104</td>
                <td className="border p-3 text-center">104-107</td>
              </tr>
              <tr>
                <td className="border p-3">Vòng mông</td>
                <td className="border p-3 text-center">85-89</td>
                <td className="border p-3 text-center">90-94</td>
                <td className="border p-3 text-center">95-99</td>
                <td className="border p-3 text-center">100-104</td>
                <td className="border p-3 text-center">104-108</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Hướng dẫn đo */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">CÁCH ĐO SIZE:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Vòng ngực:</h3>
            <p className="text-gray-600">Đo vòng quanh phần đầy đặn nhất của ngực</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Vòng eo:</h3>
            <p className="text-gray-600">Đo vòng quanh phần nhỏ nhất của eo</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Vòng mông:</h3>
            <p className="text-gray-600">Đo vòng quanh phần đầy đặn nhất của mông</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideDetails; 