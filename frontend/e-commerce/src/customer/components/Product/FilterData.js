export const color = [
    "white",
    "black",
    "red",
    "dark blue",
    "blue",
    "pink",
    "yellow",
    "green",
]
import { convertCurrency } from "../../../common/convertCurrency"
export const filters = [
    {
        id:"color",
        name:"Màu sắc",
        options: [
            {value: "white",label: "Trắng" },
            {value: "black",label: "Đen" },
            {value: "red",label: "Đỏ" },
            {value: "dark blue",label: "Xanh Đậm" },
            {value: "blue",label: "Xanh lam" },
            {value: "yellow",label: "Vàng" },
            {value: "green",label: "Xanh lá" },
        ]
    },
    {
        id: "size",
        name: "Size",
        options: [
            {value: "S", label: "S"},
            {value: "M", label: "M"},
            {value: "L", label: "L"},
            {value: "XL", label: "XL"},
            {value: "XXL", label: "XXL"},
        ]
    }
]

export const singleFilter = [
    {
        id: "price",
        name: "Mức Giá",
        options: [
            {value: "0-200000", label: `0 - ${convertCurrency(200000)}`},
            {value: "200000-500000", label: `${convertCurrency(200000)} - ${convertCurrency(500000)}`},
            {value: "500000-1000000", label: `${convertCurrency(500000)} - ${convertCurrency(1000000)}`},
            {value: "1000000-1500000", label: `${convertCurrency(1000000)} - ${convertCurrency(1500000)}`},
            {value: "1500000-2000000", label: `${convertCurrency(1500000)} - ${convertCurrency(2000000)}`},
        ]
    },
    {
        id: "discount",
        name: "Giảm giá",
        options: [
            { value:"10", label: "10% and above" },
            { value:"20", label: "20% and above" },
            { value:"30", label: "30% and above" },
            { value:"40", label: "40% and above" },
            { value:"50", label: "50% and above" },
            { value:"60", label: "60% and above" },
            { value:"70", label: "70% and above" },
            { value:"80", label: "80% and above" },
        ]
    },
    {
        id: "stock",
        name: "Còn hàng",
        options: [
            { value: "in_stock", label: "Còn hàng" },
            { value: "out_of_stock", label: "Hết hàng"}
        ]
    }
]

export const sortOptions = [
    { name:"Mức giá : Thấp đến Cao", query: "price_low", current:false },
    { name:"Mức giá : Cao đến Thấp", query: "price_high", current:false },
]