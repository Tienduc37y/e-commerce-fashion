import { Avatar, Box, Grid, Rating, Dialog, IconButton, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import React, { useState, useMemo } from 'react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const DIALOG_BUTTON_STYLES = {
  position: 'absolute',
  color: 'white',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}

const ProductReviewCard = ({ review }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const MAX_VISIBLE_IMAGES = 2

  const handleImageClick = (index) => {
    setSelectedImageIndex(index)
    setOpenDialog(true)
  }

  const handleNavigateImage = (direction) => {
    setSelectedImageIndex(prev => {
      if (direction === 'next') {
        return prev === review.imgUrl.length - 1 ? 0 : prev + 1
      }
      return prev === 0 ? review.imgUrl.length - 1 : prev - 1
    })
  }

  const userInfo = useMemo(() => ({
    avatar: review?.user?.email?.charAt(0).toUpperCase() || '#',
    name: review?.user?.email?.split('@')[0] || "Người dùng ẩn danh",
    date: review?.createdAt 
      ? new Date(review.createdAt).toLocaleDateString('vi-VN')
      : 'Không có ngày'
  }), [review])

  const renderImageThumbnails = () => {
    if (!review?.imgUrl?.length) return null

    return (
      <div className="flex gap-2 mt-4">
        {review.imgUrl.slice(0, MAX_VISIBLE_IMAGES).map((img, index) => (
          <div 
            key={index} 
            className="w-24 h-24 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={img}
              alt={`Review ${index + 1}`}
              className="w-full h-full object-cover object-top rounded-lg"
            />
          </div>
        ))}
        {review.imgUrl.length > MAX_VISIBLE_IMAGES && (
          <div 
            className="w-24 h-24 relative cursor-pointer"
            onClick={() => handleImageClick(MAX_VISIBLE_IMAGES)}
          >
            <img
              src={review.imgUrl[MAX_VISIBLE_IMAGES]}
              alt={`Review ${MAX_VISIBLE_IMAGES + 1}`}
              className="w-full h-full object-cover rounded-lg brightness-50"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
              +{review.imgUrl.length - MAX_VISIBLE_IMAGES}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderReply = () => {
    if (!review?.reply) return null;

    return (
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: "#9155fd"
            }}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">GIN STORE</p>
              <span className="text-xs text-gray-500">• ADMIN</span>
            </div>
            <p className="text-gray-700 mt-2 whitespace-pre-wrap">
              {review.reply}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6 border-b border-gray-200 pb-6 last:border-b-0">
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <Box>
            <Avatar 
              className="text-white" 
              sx={{width:40, height:40, bgcolor:"#9155fd"}}
            >
              {userInfo.avatar}
            </Avatar>
          </Box>
        </Grid>
        <Grid item xs={11}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-lg">{userInfo.name}</p>
              <span className="text-sm text-gray-500">•</span>
              <p className="text-sm text-gray-500">{userInfo.date}</p>
            </div>
          </div>

          <Rating 
            value={review?.rating || 0} 
            readOnly 
            precision={0.5}
            sx={{
              "& .MuiRating-icon": {
                color: "#faaf00"
              }
            }}
          />
          
          <p className="mt-2 text-gray-700 whitespace-pre-wrap">
            {review?.review || 'Không có nội dung đánh giá'}
          </p>
          
          {renderImageThumbnails()}

          {review?.reply && (
            <div className="mt-4">
              {renderReply()}
            </div>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <div className="relative bg-black">
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{...DIALOG_BUTTON_STYLES, right: 8, top: 8, zIndex: 1}}
          >
            <CloseIcon />
          </IconButton>

          <IconButton
            onClick={() => handleNavigateImage('prev')}
            sx={{...DIALOG_BUTTON_STYLES, left: 8, top: '50%', transform: 'translateY(-50%)'}}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <img
            src={review.imgUrl[selectedImageIndex]}
            alt={`Full size review ${selectedImageIndex + 1}`}
            className="w-full max-h-[80vh] object-contain"
          />

          <IconButton
            onClick={() => handleNavigateImage('next')}
            sx={{...DIALOG_BUTTON_STYLES, right: 8, top: '50%', transform: 'translateY(-50%)'}}
          >
            <NavigateNextIcon />
          </IconButton>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
            {selectedImageIndex + 1} / {review.imgUrl.length}
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ProductReviewCard