import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Rating, Button, TextField } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { toast, ToastContainer } from 'react-toastify';
import { findProductsById } from '../../../redux/Product/Action';
import { createReview } from '../../../redux/Review/Action';

const MAX_IMAGES = 5;

const ReviewProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(state => state.product);
  const { loading, error } = useSelector(state => state.review);
  
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    dispatch(findProductsById(productId));
  }, [dispatch, productId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > MAX_IMAGES) {
      toast.warning(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh`);
      return;
    }
    setImages([...images, ...files]);
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.warning('Vui lòng nhập nhận xét của bạn');
      return;
    }

    try {
      await dispatch(createReview({
        productId,
        description,
        rating,
        images
      }));
      
      toast.success('Đánh giá của bạn đã được gửi thành công!',
        {
          onClose: () => {
            navigate(`/product/${product?.product?.slugProduct}/${productId}`);
          },
          autoClose:1000
        }
      );
      
    } catch (error) {
      toast.error('Lỗi khi gửi đánh giá: ' + error.message);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviewImages = [...previewImages];
    newImages.splice(index, 1);
    newPreviewImages.splice(index, 1);
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  return (
    <div className='px-4 lg:px-20 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Phần thông tin sản phẩm - Bên trái */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <div className='flex flex-col gap-6'>
            {/* Thông tin sản phẩm */}
            <div className='space-y-4'>
              <h2 className='font-semibold text-lg'>
                {product?.product?.title}
              </h2>
            </div>
            {/* Container ảnh sản phẩm */}
            <div className='w-full bg-gray-50 rounded-lg p-4'>
              <div className='relative w-full' style={{ height: '500px' }}>
                <img 
                  src={product?.product?.variants[0]?.imageUrl} 
                  alt={product?.product?.title}
                  className='w-full h-full object-contain'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form đánh giá - Bên phải */}
        <div className='bg-white p-6 rounded-lg shadow-md space-y-6'>
          <div>
            <p className='font-semibold mb-2'>Đánh giá của bạn</p>
            <Rating 
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
              sx={{
                color: '#9155FD',
                '& .MuiRating-iconFilled': {
                  color: '#9155FD',
                },
              }}
            />
          </div>

          <div>
            <p className='font-semibold mb-2'>Nhận xét chi tiết</p>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#9155FD',
                  },
                },
              }}
            />
          </div>

          <div>
            <p className='font-semibold mb-2'>Thêm hình ảnh</p>
            <div className='flex flex-wrap gap-2'>
              {previewImages.map((url, index) => (
                <div key={index} className='relative w-20 h-20'>
                  <img 
                    src={url} 
                    alt={`preview ${index}`}
                    className='w-full h-full object-cover rounded-md'
                  />
                </div>
              ))}
              <label className='w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#9155FD] transition-colors'>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className='hidden'
                />
                <AddPhotoAlternateIcon sx={{ color: '#9155FD' }} />
              </label>
            </div>
          </div>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: '#9155FD',
              '&:hover': {
                backgroundColor: '#804BDF',
              },
            }}
          >
            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ReviewProduct; 