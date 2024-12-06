import { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../axios/api';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/feedback', formData);
      if (response.data.success) {
        toast.success('Cảm ơn bạn đã gửi góp ý!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau!');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 rounded-xl shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Góp Ý - Phản Hồi
          </h2>
          <div className="w-20 h-1 bg-red-500 mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn lắng nghe ý kiến của bạn để cải thiện dịch vụ tốt hơn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg text-gray-700"
                placeholder="Nhập họ tên của bạn"
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg text-gray-700"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-lg text-gray-700"
              placeholder="Nhập số điện thoại của bạn"
            />
          </div>

          <div className="relative">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung góp ý <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-lg text-gray-700 resize-none"
              placeholder="Nhập nội dung góp ý của bạn"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </>
              ) : 'Gửi góp ý'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm; 