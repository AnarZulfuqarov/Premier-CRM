import React, {useState, useRef, useEffect} from 'react';
import './index.scss';
import OrderSuccessModal from "../../../components/UserComponents/OrderSuccessModal/index.jsx";
import OrderConfirmationModal from "../../../components/UserComponents/OrderConfirmationModal/index.jsx";
import {useCreateOrdersMutation, useGetAllCategoriesQuery} from "../../../services/adminApi.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";
const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="custom-datepicker-wrapper" onClick={onClick} ref={ref}>
        <span className="label">Sifariş çatdırılma tarixi</span>
        <span className="value">{value || 'dd/mm/yyyy'}</span>
        <span className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 17.3505C19.5 18.54 18.54 19.5 17.3505 19.5H6.6495C5.46 19.5 4.5 18.54 4.5 17.3505V6.6495C4.5 5.46 5.46 4.5 6.6495 4.5H9V3.7575C9.00121 3.58102 9.0634 3.41039 9.17603 3.27452C9.28866 3.13866 9.44481 3.04591 9.618 3.012L9.75 3C10.164 3 10.5 3.321 10.5 3.7575V4.5H13.5V3.7575C13.5012 3.58102 13.5634 3.41039 13.676 3.27452C13.7887 3.13866 13.9448 3.04591 14.118 3.012L14.25 3C14.664 3 15 3.321 15 3.7575V4.5H17.3505C18.54 4.5 19.5 5.46 19.5 6.6495V17.3505ZM6 9V16.995C6 17.55 6.45 18 7.005 18H16.995C17.55 18 18 17.55 18 16.995V9H6ZM8.25 15C8.6175 15 8.925 15.2745 8.988 15.618L9 15.75C9 16.1175 8.7255 16.425 8.382 16.488L8.25 16.5C8.05169 16.498 7.86206 16.4184 7.72183 16.2782C7.5816 16.1379 7.50195 15.9483 7.5 15.75C7.5 15.3825 7.7745 15.075 8.118 15.012L8.25 15ZM12 15C12.3675 15 12.675 15.2745 12.738 15.618L12.75 15.75C12.75 16.1175 12.4755 16.425 12.132 16.488L12 16.5C11.8017 16.498 11.6121 16.4184 11.4718 16.2782C11.3316 16.1379 11.252 15.9483 11.25 15.75C11.25 15.3825 11.5245 15.075 11.868 15.012L12 15ZM15.75 15C16.1175 15 16.425 15.2745 16.488 15.618L16.5 15.75C16.5 16.1175 16.2255 16.425 15.882 16.488L15.75 16.5C15.5517 16.498 15.3621 16.4184 15.2218 16.2782C15.0816 16.1379 15.002 15.9483 15 15.75C15 15.3825 15.2745 15.075 15.618 15.012L15.75 15ZM8.25 12.75C8.6175 12.75 8.925 13.0245 8.988 13.368L9 13.5C9 13.8675 8.7255 14.175 8.382 14.238L8.25 14.25C8.05169 14.248 7.86206 14.1684 7.72183 14.0282C7.5816 13.8879 7.50195 13.6983 7.5 13.5C7.5 13.1325 7.7745 12.825 8.118 12.762L8.25 12.75ZM12 12.75C12.3675 12.75 12.675 13.0245 12.738 13.368L12.75 13.5C12.75 13.8675 12.4755 14.175 12.132 14.238L12 14.25C11.8017 14.248 11.6121 14.1684 11.4718 14.0282C11.3316 13.8879 11.252 13.6983 11.25 13.5C11.25 13.1325 11.5245 12.825 11.868 12.762L12 12.75ZM15.75 12.75C16.1175 12.75 16.425 13.0245 16.488 13.368L16.5 13.5C16.5 13.8675 16.2255 14.175 15.882 14.238L15.75 14.25C15.5517 14.248 15.3621 14.1684 15.2218 14.0282C15.0816 13.8879 15.002 13.6983 15 13.5C15 13.1325 15.2745 12.825 15.618 12.762L15.75 12.75ZM8.25 10.5C8.6175 10.5 8.925 10.7745 8.988 11.118L9 11.25C9 11.6175 8.7255 11.925 8.382 11.988L8.25 12C8.05169 11.998 7.86206 11.9184 7.72183 11.7782C7.5816 11.6379 7.50195 11.4483 7.5 11.25C7.5 10.8825 7.7745 10.575 8.118 10.512L8.25 10.5ZM12 10.5C12.3675 10.5 12.675 10.7745 12.738 11.118L12.75 11.25C12.75 11.6175 12.4755 11.925 12.132 11.988L12 12C11.8017 11.998 11.6121 11.9184 11.4718 11.7782C11.3316 11.6379 11.252 11.4483 11.25 11.25C11.25 10.8825 11.5245 10.575 11.868 10.512L12 10.5ZM15.75 10.5C16.1175 10.5 16.425 10.7745 16.488 11.118L16.5 11.25C16.5 11.6175 16.2255 11.925 15.882 11.988L15.75 12C15.5517 11.998 15.3621 11.9184 15.2218 11.7782C15.0816 11.6379 15.002 11.4483 15 11.25C15 10.8825 15.2745 10.575 15.618 10.512L15.75 10.5ZM6 7.5H18V7.005C18 6.45 17.55 6 16.995 6H7.005C6.45 6 6 6.45 6 7.005V7.5Z" fill="#474747"/>
</svg>
    </span>
    </div>
));


const OrderForm = () => {
    const navigate = useNavigate();
    const {data: getAllCategories} = useGetAllCategoriesQuery()
    const categories = getAllCategories?.data;
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [postOrder] = useCreateOrdersMutation()
    const sectionId = Cookies.get('sectionId');
    const datepickerRef = useRef(null);
    const searchRef = useRef(null);
    const showPopup = usePopup()

    useEffect(() => {
        if (!categories || !selectedCategoryId) return;

        const category = categories.find(cat => cat.id === selectedCategoryId);
        if (category) {
            const updatedProducts = category.products?.map(p => ({
                ...p,
                quantity: 1 // her ürün başlangıçta 1 adet
            })) || [];
            setFilteredProducts(updatedProducts);
        }

    }, [selectedCategoryId, categories]);
    useEffect(() => {
        if (categories?.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories]);

    const [cartItems, setCartItems] = useState(() => {
        const savedData = localStorage.getItem('cartData');
        return savedData ? JSON.parse(savedData).cartItems || [] : [];
    });
    const [selectedDate, setSelectedDate] = useState(() => {
        const savedData = localStorage.getItem('cartData');
        const dateStr = savedData ? JSON.parse(savedData).selectedDate : null;
        return dateStr ? new Date(dateStr) : null;
    });
    const [description, setDescription] = useState(() => {
        const savedData = localStorage.getItem('cartData');
        return savedData ? JSON.parse(savedData).description || '' : '';
    });

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const categoriesRef = useRef(null);

    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        if (isSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleQuantityChange = (index, delta) => {
        setCartItems((prevItems) =>
            prevItems.map((item, i) =>
                i === index
                    ? {...item, quantity: Math.max(1, item.quantity + delta)}
                    : item
            )
        );
    };

    const handleDeleteItem = (index) => {
        setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };

    const handleOpenConfirmationModal = () => {
        setIsConfirmationModalOpen(true);
    };

    const handleCloseConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
    };

    const handleConfirmOrder = async () => {
        const sectionId = Cookies.get('sectionId');

        const payload = {
            sectionId,
            description,
            orderLimitTime: selectedDate
                ? `${selectedDate.getDate().toString().padStart(2, '0')}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getFullYear()}`
                : null,


            items: cartItems.map(item => ({
                productId: item.productId,
                requiredQuantity: item.quantity
            }))
        };

        try {
            await postOrder(payload).unwrap(); // <- ✅ unwrap vacibdir

            setIsConfirmationModalOpen(false);
            setIsSuccessModalOpen(true);
            setCartItems([]);
        } catch (error) {
            showPopup(
                'Xəta',
                error?.data?.message || 'Sifariş göndərilə bilmədi',
                'error'
            );
        }

    };


    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        setCartItems([]);
        setSelectedDate(null);
        setDescription('');
        localStorage.removeItem('cartData');
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            // Əgər boşdursa, filtrsiz göstər
            const category = categories.find(cat => cat.id === selectedCategoryId);
            if (category) {
                const updatedProducts = category.products?.map(p => ({
                    ...p,
                    quantity: 1
                })) || [];
                setFilteredProducts(updatedProducts);
            }
        } else {
            // Axtarışa görə filtr
            const category = categories.find(cat => cat.id === selectedCategoryId);
            if (category) {
                const filtered = category.products?.filter(product =>
                    product.name.toLowerCase().includes(value.toLowerCase())
                ).map(p => ({
                    ...p,
                    quantity: 1
                })) || [];
                setFilteredProducts(filtered);
            }
        }
    };


    useEffect(() => {
        const handleWheel = (e) => {
            if (categoriesRef.current) {
                e.preventDefault();
                categoriesRef.current.scrollLeft += e.deltaY;
            }
        };

        const categoriesElement = categoriesRef.current;
        if (categoriesElement) {
            categoriesElement.addEventListener('wheel', handleWheel);
        }

        return () => {
            if (categoriesElement) {
                categoriesElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);
    const handleProductQuantityChange = (index, delta) => {
        setFilteredProducts(prev =>
            prev.map((item, i) =>
                i === index ? {...item, quantity: Math.max(1, item.quantity + delta)} : item
            )
        );
    };

    const handleAddToCart = (product) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(item => item.productId === product.id);
            let updated;

            const category = categories.find(c => c.products?.some(p => p.id === product.id));
            const categoryName = category?.name || "Bilinməyən";
            const categoryId = category?.id || "unknown";

            if (existingIndex > -1) {
                updated = [...prev];
                updated[existingIndex].quantity += product.quantity;
            } else {
                updated = [...prev, {
                    name: product.name,
                    quantity: product.quantity,
                    productId: product.id,
                    measure: product.measure,
                    categoryName,
                    categoryId
                }];
            }

            const cartData = {
                cartItems: updated,
                selectedDate,
                description
            };
            localStorage.setItem('cartData', JSON.stringify(cartData));

            return updated;
        });
    };


    useEffect(() => {
        if (!cartItems || cartItems.length === 0) return;

        const cartData = {
            cartItems,
            selectedDate,
            description
        };
        localStorage.setItem('cartData', JSON.stringify(cartData));
    }, [cartItems, selectedDate, description]);

    const groupedCartItems = cartItems.reduce((groups, item) => {
        if (!groups[item.categoryId]) {
            groups[item.categoryId] = {
                categoryName: item.categoryName,
                items: []
            };
        }
        groups[item.categoryId].items.push(item);
        return groups;
    }, {});



    return (
        <div className="container1">
            <div className="order-form">
                <div className="order-form__main">
                    <h2 className="order-form__title">Yeni sifariş</h2>
                    <p className="order-form__subtitle">
                        Aşağıdakı məhsulları seçərək yeni sifarişinizi təsdiqləyə bilərsiniz
                    </p>
                    <div className="order-form__categories" ref={categoriesRef}>
                        {categories?.map((category) => (
                            <button
                                key={category.id}
                                className={`order-form__category-btn ${selectedCategoryId === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategoryId(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="row">
                        <div className="col-6 col-md-12 col-sm-12 col-xs-12">
                            <div className="order-form__table-container">
                                <table className="order-form__table">
                                    <thead>
                                    <tr>
                                        <th>
                                            Məhsul adı
                                            <span
                                                className="order-form__table-search-icon"
                                                onClick={handleSearchClick}
                                            >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                         viewBox="0 0 24 24" fill="none">
  <path
      d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
      fill="#7A7A7A"/>
</svg>
                                                </span>
                                            {isSearchOpen && (
                                                <div className="order-form__table-search-box" ref={searchRef}>
                                                    <input
                                                        type="text"
                                                        placeholder="Məhsul axtar..."
                                                        value={searchTerm}
                                                        onChange={handleSearchChange}
                                                    />
                                                </div>
                                            )}

                                        </th>
                                        <th>Miqdar</th>
                                        <th>Ölçü vahidi</th>
                                        <th>Səbət</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredProducts.map((product, index) => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>
                                                <button
                                                    className="order-form__quantity-btn"
                                                    onClick={() => handleProductQuantityChange(index, -1)}
                                                >
                                                    -
                                                </button>
                                                {product.quantity}
                                                <button
                                                    className="order-form__quantity-btn"
                                                    onClick={() => handleProductQuantityChange(index, 1)}
                                                >
                                                    +
                                                </button>
                                            </td>
                                            <td>{product.measure}</td>
                                            <td>
                                                {
                                                    isMobile ? ( <button
                                                        className="order-form__add-btnn"
                                                        onClick={() => {
                                                            handleAddToCart(product);
                                                            showPopup('Ugurlu','Sebete elave olundu','success')
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M10.464 3.28193C10.6429 3.06723 10.8649 2.89243 11.1156 2.7688C11.3663 2.64516 11.6401 2.57544 11.9193 2.56414C12.1986 2.55283 12.4772 2.60019 12.737 2.70315C12.9969 2.80612 13.2322 2.9624 13.428 3.16193L13.536 3.28193L17.469 7.99993H20.454C20.6638 7.99948 20.8714 8.04337 21.0631 8.12872C21.2549 8.21408 21.4264 8.33896 21.5665 8.49521C21.7066 8.65145 21.8121 8.83553 21.8761 9.03538C21.9401 9.23524 21.9612 9.44636 21.938 9.65493L21.846 10.4209L21.746 11.1609L21.664 11.7149L21.569 12.3099L21.461 12.9349L21.339 13.5829L21.203 14.2439C21.131 14.5773 21.0536 14.9103 20.971 15.2429C20.7496 16.121 20.4717 16.9838 20.139 17.8259L19.918 18.3659L19.704 18.8539L19.502 19.2879L19.408 19.4819L19.159 19.9719C18.839 20.5819 18.235 20.9419 17.596 20.9939L17.436 20.9999H6.55497C6.20537 21.0025 5.86163 20.9102 5.56045 20.7326C5.25928 20.5551 5.01198 20.2991 4.84497 19.9919L4.61297 19.5419L4.43297 19.1719L4.33797 18.9669L4.13797 18.5179C3.68127 17.4575 3.31074 16.3619 3.02997 15.2419C2.97568 15.0245 2.92368 14.8065 2.87397 14.5879L2.73197 13.9399L2.60497 13.3059L2.49297 12.6929L2.39297 12.1059L2.30597 11.5519L2.23197 11.0389L2.14197 10.3559L2.07597 9.79993L2.05897 9.64693C2.03829 9.45047 2.05688 9.25185 2.11366 9.06264C2.17044 8.87343 2.26428 8.6974 2.38971 8.54479C2.51515 8.39218 2.66969 8.26603 2.84433 8.1737C3.01897 8.08136 3.21022 8.02467 3.40697 8.00693L3.54297 7.99993H6.53197L10.464 3.28193ZM19.883 9.99993H4.11297L4.17497 10.4839L4.25097 11.0319L4.34297 11.6359L4.45097 12.2839C4.49097 12.5059 4.53297 12.7333 4.57697 12.9659L4.71997 13.6729C4.79597 14.0309 4.87997 14.3949 4.96997 14.7569C5.22375 15.7677 5.55816 16.7566 5.96997 17.7139L6.16597 18.1549L6.34797 18.5389L6.51097 18.8619L6.58297 18.9999H17.41L17.564 18.6969L17.741 18.3319L17.935 17.9089C18.302 17.0839 18.722 15.9909 19.03 14.7569C19.155 14.2569 19.266 13.7489 19.365 13.2499L19.505 12.5119L19.625 11.8029L19.678 11.4639L19.773 10.8269L19.85 10.2569L19.883 9.99993ZM9.98597 12.8359L10.486 15.8359C10.5209 16.0936 10.4541 16.3547 10.2997 16.5639C10.1454 16.7731 9.91558 16.914 9.6591 16.9567C9.40263 16.9993 9.13962 16.9404 8.92585 16.7924C8.71207 16.6444 8.56434 16.419 8.51397 16.1639L8.01397 13.1639C7.98804 13.0326 7.98874 12.8974 8.01602 12.7664C8.04331 12.6353 8.09663 12.5111 8.17282 12.401C8.24901 12.291 8.34652 12.1973 8.45957 12.1256C8.57262 12.054 8.69891 12.0057 8.83095 11.9838C8.963 11.9618 9.09811 11.9666 9.22827 11.9978C9.35844 12.029 9.48101 12.086 9.58873 12.1655C9.69644 12.245 9.7871 12.3453 9.85534 12.4604C9.92358 12.5756 9.968 12.7033 9.98597 12.8359ZM15.048 11.9999L15.164 12.0129C15.406 12.0529 15.6249 12.1804 15.7791 12.3712C15.9332 12.5621 16.0118 12.8029 16 13.0479L15.987 13.1639L15.487 16.1639C15.4446 16.415 15.3079 16.6405 15.105 16.7944C14.902 16.9482 14.648 17.0188 14.3947 16.9917C14.1415 16.9647 13.9081 16.842 13.7422 16.6488C13.5763 16.4556 13.4904 16.2063 13.502 15.9519L13.515 15.8359L14.015 12.8359C14.0549 12.5942 14.1821 12.3756 14.3725 12.2215C14.5629 12.0674 14.8033 11.9886 15.048 11.9999ZM12 4.56193L9.13497 7.99993H14.865L12 4.56193Z"
                                                                fill="#384871"/>
                                                        </svg>
                                                    </button>) : ( <button
                                                        className="order-form__add-btn"
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        Əlavə et
                                                    </button>)
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>

                                </table>
                            </div>
                            {window.innerWidth <= 768 && (
                                <button className={'mobileBasket'} onClick={() => {
                                    const savedData = JSON.parse(localStorage.getItem('cartData'));
                                    navigate('/customer/basket', {
                                        state: {
                                            cartItems: savedData?.cartItems || [],
                                            selectedDate: savedData?.selectedDate ? new Date(savedData.selectedDate) : null,
                                            description: savedData?.description || ''
                                        }
                                    });

                                }}>
                                    Səbətə keç ({JSON.parse(localStorage.getItem('cartData'))?.cartItems?.length || 0})
                                </button>
                            )}

                        </div>
                        <div className="col-6 onlydesktop">
                            <div className="order-form__cart-panel">
                                <h3>Səbətə əlavə edilmiş məhsulları</h3>
                                <div className="order-form__cart-panel_main">
                                    <div className="order-form__cart-search">
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                            customInput={<CustomDateInput />}
                                            minDate={new Date()}
                                        />



                                    </div>

                                    <div className="table_cont">
                                        <table className="order-form__cart-table">
                                            <thead>
                                            <tr>
                                                <th>Product name</th>
                                                <th>Miqdar</th>
                                                <th>Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {Object.entries(groupedCartItems).map(([categoryId, group]) => (
                                                <React.Fragment key={categoryId}>
                                                    <tr className="category-row">
                                                        <td colSpan={3} style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
                                                            {group.categoryName}
                                                        </td>
                                                    </tr>
                                                    {group.items.map((item, index) => (
                                                        <tr key={item.productId}>
                                                            <td>{item.name}</td>
                                                            <td>
                                                                <div className="quantity-Cart">
                                                                    <button
                                                                        className="order-form__quantity-btn"
                                                                        onClick={() => handleQuantityChange(cartItems.findIndex(ci => ci.productId === item.productId), -1)}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <p>{item.quantity}</p>
                                                                    <button
                                                                        className="order-form__quantity-btn"
                                                                        onClick={() => handleQuantityChange(cartItems.findIndex(ci => ci.productId === item.productId), 1)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="order-form__delete-btn"
                                                                    onClick={() => handleDeleteItem(cartItems.findIndex(ci => ci.productId === item.productId))}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            clipRule="evenodd"
                                                                            d="M10.31 2.25H13.69C13.907 2.25 14.096 2.25 14.274 2.278C14.6207 2.33354 14.9496 2.46946 15.2344 2.67488C15.5192 2.8803 15.7519 3.14952 15.914 3.461C15.998 3.621 16.057 3.8 16.126 4.005L16.237 4.34L16.267 4.425C16.3575 4.67615 16.526 4.89174 16.7479 5.04019C16.9697 5.18865 17.2333 5.26217 17.5 5.25H20.5C20.6989 5.25 20.8897 5.32902 21.0303 5.46967C21.171 5.61032 21.25 5.80109 21.25 6C21.25 6.19891 21.171 6.38968 21.0303 6.53033C20.8897 6.67098 20.6989 6.75 20.5 6.75H3.5C3.30109 6.75 3.11032 6.67098 2.96967 6.53033C2.82902 6.38968 2.75 6.19891 2.75 6C2.75 5.80109 2.82902 5.61032 2.96967 5.46967C3.11032 5.32902 3.30109 5.25 3.5 5.25H6.59C6.8571 5.24359 7.11513 5.15177 7.32623 4.988C7.53733 4.82423 7.6904 4.59713 7.763 4.34L7.875 4.005C7.943 3.8 8.002 3.621 8.085 3.461C8.24719 3.1494 8.48009 2.8801 8.76505 2.67468C9.05001 2.46925 9.37911 2.3334 9.726 2.278C9.904 2.25 10.093 2.25 10.309 2.25M9.007 5.25C9.07626 5.11205 9.13476 4.96896 9.182 4.822L9.282 4.522C9.373 4.249 9.394 4.194 9.415 4.154C9.46898 4.05001 9.54658 3.96011 9.64157 3.89152C9.73657 3.82292 9.84631 3.77754 9.962 3.759C10.0923 3.74746 10.2233 3.74445 10.354 3.75H13.644C13.932 3.75 13.992 3.752 14.036 3.76C14.1516 3.77843 14.2613 3.82366 14.3563 3.89208C14.4512 3.9605 14.5289 4.05019 14.583 4.154C14.604 4.194 14.625 4.249 14.716 4.523L14.816 4.823L14.855 4.935C14.8943 5.04433 14.9397 5.14933 14.991 5.25H9.007Z"
                                                                            fill="black"
                                                                        />
                                                                        <path
                                                                            d="M5.91501 8.44993C5.90174 8.25141 5.81017 8.06629 5.66042 7.9353C5.51067 7.80431 5.31502 7.73816 5.11651 7.75143C4.91799 7.76469 4.73287 7.85626 4.60188 8.00601C4.47089 8.15576 4.40474 8.35141 4.41801 8.54993L4.88201 15.5019C4.96701 16.7839 5.03601 17.8199 5.19801 18.6339C5.36701 19.4789 5.65301 20.1849 6.24501 20.7379C6.83701 21.2909 7.56001 21.5309 8.41501 21.6419C9.23701 21.7499 10.275 21.7499 11.561 21.7499H12.44C13.725 21.7499 14.764 21.7499 15.586 21.6419C16.44 21.5309 17.164 21.2919 17.756 20.7379C18.347 20.1849 18.633 19.4779 18.802 18.6339C18.964 17.8209 19.032 16.7839 19.118 15.5019L19.582 8.54993C19.5953 8.35141 19.5291 8.15576 19.3981 8.00601C19.2671 7.85626 19.082 7.76469 18.8835 7.75143C18.685 7.73816 18.4893 7.80431 18.3396 7.9353C18.1898 8.06629 18.0983 8.25141 18.085 8.44993L17.625 15.3499C17.535 16.6969 17.471 17.6349 17.331 18.3399C17.194 19.0249 17.004 19.3869 16.731 19.6429C16.457 19.8989 16.083 20.0649 15.391 20.1549C14.678 20.2479 13.738 20.2499 12.387 20.2499H11.613C10.263 20.2499 9.32301 20.2479 8.60901 20.1549C7.91701 20.0649 7.54301 19.8989 7.26901 19.6429C6.99601 19.3869 6.80601 19.0249 6.66901 18.3409C6.52901 17.6349 6.46501 16.6969 6.37501 15.3489L5.91501 8.44993Z"
                                                                            fill="black"
                                                                        />
                                                                        <path
                                                                            d="M9.425 10.254C9.62284 10.2342 9.82045 10.2937 9.97441 10.4195C10.1284 10.5454 10.226 10.7272 10.246 10.925L10.746 15.925C10.7606 16.1201 10.6985 16.3132 10.5728 16.4631C10.4471 16.613 10.2678 16.7078 10.0731 16.7274C9.87848 16.7469 9.68389 16.6897 9.53086 16.5678C9.37783 16.4459 9.27848 16.2691 9.254 16.075L8.754 11.075C8.73417 10.8771 8.79372 10.6795 8.91954 10.5256C9.04537 10.3716 9.22717 10.2739 9.425 10.254ZM14.575 10.254C14.7726 10.2739 14.9543 10.3715 15.0801 10.5252C15.2059 10.679 15.2655 10.8763 15.246 11.074L14.746 16.074C14.7212 16.2677 14.6218 16.4441 14.469 16.5657C14.3161 16.6873 14.1219 16.7445 13.9275 16.725C13.7332 16.7056 13.5541 16.6112 13.4283 16.4618C13.3025 16.3124 13.24 16.1198 13.254 15.925L13.754 10.925C13.774 10.7274 13.8715 10.5457 14.0252 10.4199C14.179 10.2941 14.3773 10.2344 14.575 10.254Z"
                                                                            fill="black"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                            </tbody>

                                        </table>
                                    </div>
                                    <textarea
                                        placeholder="Qeyd..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>

                                    <button
                                        className="order-form__submit-btn"
                                        onClick={handleOpenConfirmationModal}
                                        disabled={!selectedDate}
                                    >
                                        Sifariş təsdiqlə
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <OrderConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={handleCloseConfirmationModal}
                onConfirm={handleConfirmOrder}
                cartItems={cartItems}
                description={description}
            />


            <OrderSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
            />
        </div>
    );
};

export default OrderForm;