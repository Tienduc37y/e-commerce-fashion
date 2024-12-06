import { Grid, CircularProgress, Pagination } from '@mui/material'
import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderHistory } from '../../../redux/Order/Action'
import { useLocation } from 'react-router-dom'

const orderStatus = [
    { label:"Đang giao hàng", value:"Đang giao hàng" },
    { label:"Đã giao hàng", value:"Đã giao hàng" },
    { label:"Đã hủy đơn hàng", value:"Đã hủy" },
    { label:"Trả hàng", value:"Hoàn trả hàng" },
    { label:"Đặt hàng thành công", value:"Đặt hàng thành công" },
    { label:"Đang chờ xử lý", value:"Đang chờ xử lý" },
    { label:"Xác nhận đơn hàng", value:"Xác nhận đơn hàng" },
    { label:"Đã thanh toán", value:"Đã thanh toán" },
    { label:"Đã hoàn thành", value:"Đã hoàn thành" },
]

const Order = () => {
    const dispatch = useDispatch();
    const order = useSelector(state => state.order);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const loading = order.loading;
    const location = useLocation();
    const [page, setPage] = useState(1);
    const totalPages = order?.orders?.totalPages || 1;
    const totalOrders = order?.orders?.totalOrders || 0;
    const limit = order?.orders?.limit || 8;

    useEffect(() => {
        const statusQuery = selectedStatuses.join(',');
        dispatch(getOrderHistory(page, limit, statusQuery));
    }, [dispatch, page, limit, selectedStatuses]);

    const handleStatusChange = (value) => {
        setSelectedStatuses(prev => {
            if (prev.includes(value)) {
                return prev.filter(status => status !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const filteredOrders = order?.orders?.orders?.filter(order => 
        selectedStatuses.length === 0 || selectedStatuses.includes(order.orderStatus)
    );
    return (
        <div className='px-5 py-5 lg:py-10 lg:px-10'>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <div className='h-auto shadow-lg bg-white p-5 sticky top-5'>
                        <h1 className='font-bold text-lg'>Lọc</h1>
                        <div className='space-y-4 mt-10'>
                            <h1 className='font-semibold'>Trạng thái đơn hàng</h1>
                            {orderStatus.map((option) => (
                                <div key={option.value} className='flex items-center'>
                                    <input 
                                        value={option.value} 
                                        type="checkbox"
                                        checked={selectedStatuses.includes(option.value)}
                                        onChange={() => handleStatusChange(option.value)}
                                        className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500' 
                                    />
                                    <label className='ml-3 text-sm text-gray-600'>
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={9}>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <CircularProgress />
                        </div>
                    ) : (
                        <div className='space-y-5'>
                            {filteredOrders?.length > 0 ? (
                                <>
                                    {filteredOrders.map((order) => (
                                        <OrderCard key={order._id} order={order} />
                                    ))}
                                    <div className="flex flex-col md:flex-row justify-between items-center mt-8 bg-white py-4 px-4">
                                        <div className="mb-4 md:mb-0">
                                            Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, totalOrders)} trong tổng số {totalOrders} đơn hàng
                                        </div>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={handlePageChange}
                                            color="primary"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500 py-10">
                                    Không có đơn hàng nào
                                </div>
                            )}
                        </div>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}

export default Order
