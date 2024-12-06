import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMenCategories, getWomenCategories } from '../../../redux/Category/Action';

export const useNavigationData = () => {
    const dispatch = useDispatch();
    const { menCategories, womenCategories } = useSelector(state => state.categories);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                await Promise.all([
                    dispatch(getMenCategories()),
                    dispatch(getWomenCategories())
                ]);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [dispatch]);

    const navigationData = {
        categories: [
            {
                id: 'nu',
                name: 'Nữ',
                featured: [
                    {
                        name: 'Nữ thần 1',
                        href: '/top-level-category/nu',
                        imageSrc: 'https://i.pinimg.com/736x/09/71/c0/0971c0964b8a5a0daa1a984eced9bf24.jpg',
                        imageAlt: 'Nữ thần 1',
                        id: 'nu-than-1'
                    },
                    {
                        name: 'Nữ thần 2',
                        href: '/top-level-category/nu',
                        imageSrc: 'https://i.pinimg.com/736x/e7/33/7a/e7337ab5b7489c218c4910c20067139a.jpg',
                        imageAlt: 'Nữ thần 2',
                        id: 'nu-than-2'
                    }
                ],
                sections: [
                    {
                        id: 'ao',
                        name: 'Áo',
                        items: womenCategories.shirts?.map(cat => ({
                            name: cat.name,
                            id: cat.slugCategory
                        })) || []
                    },
                    {
                        id: 'quan',
                        name: 'Quần',
                        items: womenCategories.pants?.map(cat => ({
                            name: cat.name,
                            id: cat.slugCategory
                        })) || []
                    }
                ]
            },
            {
                id: 'nam',
                name: 'Nam',
                featured: [
                    {
                        name: 'Nam thần 1',
                        href: '/top-level-category/nam',
                        imageSrc: 'https://i.pinimg.com/736x/69/82/0a/69820ada163f923f3e3b009b56867ec0.jpg',
                        imageAlt: 'Nam thần 1',
                        id: 'nam-than-1'
                    },
                    {
                        name: 'Nam thần 2',
                        href: '/top-level-category/nam',
                        imageSrc: 'https://i.pinimg.com/736x/f6/af/82/f6af82c40d0b630bd0a927b486f205db.jpg',
                        imageAlt: 'Nam thần 2',
                        id: 'nam-than-2'
                    }
                ],
                sections: [
                    {
                        id: 'ao',
                        name: 'Áo',
                        items: menCategories.shirts?.map(cat => ({
                            name: cat.name,
                            id: cat.slugCategory
                        })) || []
                    },
                    {
                        id: 'quan',
                        name: 'Quần',
                        items: menCategories.pants?.map(cat => ({
                            name: cat.name,
                            id: cat.slugCategory
                        })) || []
                    }
                ]
            }
        ],
        pages: [
            { name: 'Thông tin', id: '/' },
            { name: 'Liên hệ', id: '/' },
        ]
    };

    return navigationData;
};
