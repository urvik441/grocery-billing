import React, { useState, useMemo } from "react";
import {
    ShoppingCart,
    Package,
    Plus,
    Trash2,
    Search,
    Save,
    Receipt,
    Home,
    Edit2,
    X,
    PlusCircle,
} from "lucide-react";

const GroceryBillingApp = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [products, setProducts] = useState([
        { id: 1, name: "Basmati Rice", category: "Grains", price: 120, unit: "kg", stock: 50, image: "🌾" },
        { id: 2, name: "Whole Wheat Flour", category: "Grains", price: 45, unit: "kg", stock: 80, image: "🌾" },
        { id: 3, name: "Toor Dal", category: "Pulses", price: 140, unit: "kg", stock: 40, image: "🫘" },
        { id: 4, name: "Moong Dal", category: "Pulses", price: 130, unit: "kg", stock: 35, image: "🫘" },
        { id: 5, name: "Fresh Milk", category: "Dairy", price: 60, unit: "liter", stock: 25, image: "🥛" },
        { id: 6, name: "Paneer", category: "Dairy", price: 350, unit: "kg", stock: 15, image: "🧈" },
        { id: 7, name: "Tomatoes", category: "Vegetables", price: 40, unit: "kg", stock: 60, image: "🍅" },
        { id: 8, name: "Onions", category: "Vegetables", price: 35, unit: "kg", stock: 70, image: "🧅" },
        { id: 9, name: "Potatoes", category: "Vegetables", price: 30, unit: "kg", stock: 90, image: "🥔" },
        { id: 10, name: "Bananas", category: "Fruits", price: 50, unit: "dozen", stock: 40, image: "🍌" },
        { id: 11, name: "Apples", category: "Fruits", price: 180, unit: "kg", stock: 30, image: "🍎" },
        { id: 12, name: "Cooking Oil", category: "Oils", price: 180, unit: "liter", stock: 45, image: "🫗" },
        { id: 13, name: "Sugar", category: "Essentials", price: 45, unit: "kg", stock: 55, image: "🧂" },
        { id: 14, name: "Salt", category: "Essentials", price: 25, unit: "kg", stock: 100, image: "🧂" },
        { id: 15, name: "Tea Powder", category: "Beverages", price: 280, unit: "kg", stock: 20, image: "☕" },
    ]);

    const [cart, setCart] = useState([]);
    const [searchDashboard, setSearchDashboard] = useState("");
    const [searchBilling, setSearchBilling] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "",
        price: "",
        unit: "kg",
        stock: "",
        image: "📦",
    });

    const emojiOptions = ["🌾", "🫘", "🥛", "🧈", "🍅", "🧅", "🥔", "🍌", "🍎", "🫗", "🧂", "☕", "📦", "🥫", "🍞"];

    const addNewProduct = () => {
        if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
            alert("Please fill all fields");
            return;
        }

        const product = {
            id: Date.now(),
            name: newProduct.name,
            category: newProduct.category,
            price: parseFloat(newProduct.price),
            unit: newProduct.unit,
            stock: parseInt(newProduct.stock),
            image: newProduct.image,
        };

        setProducts([...products, product]);
        setNewProduct({ name: "", category: "", price: "", unit: "kg", stock: "", image: "📦" });
        setShowAddModal(false);
    };

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((p) => p.id !== id));
            setCart(cart.filter((item) => item.id !== id));
        }
    };

    const updateProductPrice = (id, newPrice) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, price: parseFloat(newPrice) || 0 } : p)));
    };

    const updateProductStock = (id, newStock) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, stock: parseInt(newStock) || 0 } : p)));
    };

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateCartQuantity = (id, change) => {
        setCart(
            cart
                .map((item) => {
                    if (item.id === id) {
                        const newQty = item.quantity + change;
                        return newQty > 0 ? { ...item, quantity: newQty } : item;
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const completePurchase = () => {
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        const updatedProducts = products.map((product) => {
            const cartItem = cart.find((item) => item.id === product.id);
            if (cartItem) {
                return { ...product, stock: product.stock - cartItem.quantity };
            }
            return product;
        });

        setProducts(updatedProducts);
        alert(
            `Bill generated successfully!\nCustomer: ${customerName || "Walk-in Customer"}\nTotal: ₹${(calculateTotal() * 1.05).toFixed(2)}`
        );
        setCart([]);
        setCustomerName("");
        setCustomerPhone("");
        setShowCartModal(false);
    };

    const filteredProducts = useMemo(() => {
        return activeTab === "dashboard"
            ? products.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchDashboard.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchDashboard.toLowerCase())
            )
            : products.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchBilling.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchBilling.toLowerCase())
            );
    }, [activeTab, products, searchDashboard, searchBilling]);

    return (
        <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            {/* Sidebar */}
            <aside style={{
                width: "280px",
                background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                height: "100vh",
                left: 0,
                top: 0,
                zIndex: 1000,
                boxShadow: "4px 0 20px rgba(0,0,0,0.3)"
            }}>
                <div style={{
                    padding: "24px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px"
                }}>
                    <div style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        padding: "12px",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 15px rgba(102,126,234,0.4)"
                    }}>
                        <Package color="white" size={32} />
                    </div>
                    <div>
                        <h2 style={{ fontWeight: "800", margin: 0, fontSize: "20px", letterSpacing: "-0.5px" }}>FreshMart POS</h2>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Smart Grocery Store</p>
                    </div>
                </div>

                <nav style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "14px 18px",
                            background: activeTab === "dashboard" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                            boxShadow: activeTab === "dashboard" ? "0 4px 15px rgba(102,126,234,0.4)" : "none"
                        }}
                        onClick={() => setActiveTab("dashboard")}
                        onMouseEnter={(e) => {
                            if (activeTab !== "dashboard") {
                                e.target.style.background = "rgba(255,255,255,0.1)";
                                e.target.style.transform = "translateX(4px)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== "dashboard") {
                                e.target.style.background = "transparent";
                                e.target.style.transform = "translateX(0)";
                            }
                        }}
                    >
                        <Home size={20} /> Dashboard
                    </button>
                    <button
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "14px 18px",
                            background: activeTab === "billing" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                            boxShadow: activeTab === "billing" ? "0 4px 15px rgba(102,126,234,0.4)" : "none"
                        }}
                        onClick={() => setActiveTab("billing")}
                        onMouseEnter={(e) => {
                            if (activeTab !== "billing") {
                                e.target.style.background = "rgba(255,255,255,0.1)";
                                e.target.style.transform = "translateX(4px)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== "billing") {
                                e.target.style.background = "transparent";
                                e.target.style.transform = "translateX(0)";
                            }
                        }}
                    >
                        <ShoppingCart size={20} /> New Bill
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div style={{ marginLeft: "280px", flex: 1, minHeight: "100vh" }}>
                {/* Cart Header (Only on Billing Page) */}
                {activeTab === "billing" && (
                    <div style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 100,
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                        padding: "16px 24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        borderBottom: "2px solid #667eea"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto" }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>
                                    Current Bill
                                </h3>
                                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                                    {customerName || "Walk-in Customer"} {customerPhone && `• ${customerPhone}`}
                                </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Cart Items</p>
                                    <p style={{ margin: "2px 0 0 0", fontSize: "22px", fontWeight: "700", color: "#667eea" }}>
                                        {cart.length}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Total Amount</p>
                                    <p style={{ margin: "2px 0 0 0", fontSize: "22px", fontWeight: "700", color: "#10b981" }}>
                                        ₹{(calculateTotal() * 1.05).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    style={{
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        color: "white",
                                        padding: "12px 24px",
                                        borderRadius: "12px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                                        transition: "all 0.3s ease"
                                    }}
                                    onClick={() => setShowCartModal(true)}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = "translateY(-2px)";
                                        e.target.style.boxShadow = "0 6px 20px rgba(102,126,234,0.5)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = "translateY(0)";
                                        e.target.style.boxShadow = "0 4px 15px rgba(102,126,234,0.4)";
                                    }}
                                >
                                    <ShoppingCart size={18} /> View Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "dashboard" ? (
                    <DashboardView
                        products={filteredProducts}
                        searchValue={searchDashboard}
                        setSearchValue={setSearchDashboard}
                        editingProduct={editingProduct}
                        setEditingProduct={setEditingProduct}
                        updateProductPrice={updateProductPrice}
                        updateProductStock={updateProductStock}
                        deleteProduct={deleteProduct}
                        setShowAddModal={setShowAddModal}
                    />
                ) : (
                    <BillingView
                        products={filteredProducts}
                        searchValue={searchBilling}
                        setSearchValue={setSearchBilling}
                        customerName={customerName}
                        setCustomerName={setCustomerName}
                        customerPhone={customerPhone}
                        setCustomerPhone={setCustomerPhone}
                        addToCart={addToCart}
                    />
                )}
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2000
                }}>
                    <div style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "32px",
                        width: "90%",
                        maxWidth: "500px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Add New Product</h2>
                            <button
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "8px",
                                    borderRadius: "8px"
                                }}
                                onClick={() => setShowAddModal(false)}
                            >
                                <X size={24} color="#64748b" />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                                    Product Icon
                                </label>
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    {emojiOptions.map((emoji) => (
                                        <button
                                            key={emoji}
                                            style={{
                                                fontSize: "24px",
                                                padding: "8px 12px",
                                                borderRadius: "10px",
                                                border: newProduct.image === emoji ? "3px solid #667eea" : "2px solid #e2e8f0",
                                                background: newProduct.image === emoji ? "#f1f5f9" : "white",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => setNewProduct({ ...newProduct, image: emoji })}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    border: "2px solid #e2e8f0",
                                    fontSize: "15px",
                                    outline: "none"
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Category (e.g., Grains, Dairy)"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    border: "2px solid #e2e8f0",
                                    fontSize: "15px",
                                    outline: "none"
                                }}
                            />

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: "12px",
                                        border: "2px solid #e2e8f0",
                                        fontSize: "15px",
                                        outline: "none"
                                    }}
                                />

                                <select
                                    value={newProduct.unit}
                                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: "12px",
                                        border: "2px solid #e2e8f0",
                                        fontSize: "15px",
                                        outline: "none"
                                    }}
                                >
                                    <option value="kg">kg</option>
                                    <option value="liter">liter</option>
                                    <option value="dozen">dozen</option>
                                    <option value="piece">piece</option>
                                    <option value="packet">packet</option>
                                </select>
                            </div>

                            <input
                                type="number"
                                placeholder="Stock Quantity"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    border: "2px solid #e2e8f0",
                                    fontSize: "15px",
                                    outline: "none"
                                }}
                            />

                            <button
                                style={{
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    marginTop: "8px"
                                }}
                                onClick={addNewProduct}
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Modal */}
            {showCartModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2000
                }}>
                    <div style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "32px",
                        width: "90%",
                        maxWidth: "600px",
                        maxHeight: "80vh",
                        overflow: "auto",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
                                <ShoppingCart color="#667eea" /> Cart Items ({cart.length})
                            </h2>
                            <button
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "8px",
                                    borderRadius: "8px"
                                }}
                                onClick={() => setShowCartModal(false)}
                            >
                                <X size={24} color="#64748b" />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <p style={{ textAlign: "center", color: "#64748b", padding: "40px 0" }}>
                                Cart is empty. Add products to create a bill.
                            </p>
                        ) : (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                                    {cart.map((item) => (
                                        <div key={item.id} style={{
                                            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                                            borderRadius: "12px",
                                            padding: "16px",
                                            border: "2px solid #e2e8f0"
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                    <div style={{ fontSize: "28px" }}>{item.image}</div>
                                                    <div>
                                                        <strong style={{ fontSize: "16px" }}>{item.name}</strong>
                                                        <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
                                                            ₹{item.price}/{item.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        padding: "4px"
                                                    }}
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 size={18} color="#ef4444" />
                                                </button>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                    <button
                                                        style={{
                                                            background: "#667eea",
                                                            color: "white",
                                                            border: "none",
                                                            borderRadius: "8px",
                                                            width: "32px",
                                                            height: "32px",
                                                            cursor: "pointer",
                                                            fontSize: "18px",
                                                            fontWeight: "700"
                                                        }}
                                                        onClick={() => updateCartQuantity(item.id, -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: "18px", fontWeight: "700", minWidth: "30px", textAlign: "center" }}>
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        style={{
                                                            background: "#667eea",
                                                            color: "white",
                                                            border: "none",
                                                            borderRadius: "8px",
                                                            width: "32px",
                                                            height: "32px",
                                                            cursor: "pointer",
                                                            fontSize: "18px",
                                                            fontWeight: "700"
                                                        }}
                                                        onClick={() => updateCartQuantity(item.id, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span style={{ color: "#10b981", fontWeight: "700", fontSize: "18px" }}>
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    marginBottom: "20px"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <span style={{ color: "#475569" }}>Subtotal:</span>
                                        <span style={{ fontWeight: "600" }}>₹{calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                        <span style={{ color: "#475569" }}>Tax (5%):</span>
                                        <span style={{ fontWeight: "600" }}>₹{(calculateTotal() * 0.05).toFixed(2)}</span>
                                    </div>
                                    <div style={{
                                        borderTop: "2px solid #bae6fd",
                                        paddingTop: "12px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <span style={{ fontSize: "18px", fontWeight: "700" }}>Total:</span>
                                        <span style={{ fontSize: "24px", fontWeight: "700", color: "#10b981" }}>
                                            ₹{(calculateTotal() * 1.05).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    style={{
                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        color: "white",
                                        padding: "16px",
                                        borderRadius: "12px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: "700",
                                        fontSize: "16px",
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        boxShadow: "0 4px 15px rgba(16,185,129,0.4)"
                                    }}
                                    onClick={completePurchase}
                                >
                                    <Receipt size={20} /> Generate Bill & Complete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const DashboardView = React.memo(
    ({ products, searchValue, setSearchValue, editingProduct, setEditingProduct, updateProductPrice, updateProductStock, deleteProduct, setShowAddModal }) => (
        <div style={{ padding: "32px" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                    <div>
                        <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0", color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                            Inventory Dashboard
                        </h1>
                        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", margin: 0 }}>
                            Manage your products and stock levels
                        </p>
                    </div>
                    <button
                        style={{
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "white",
                            padding: "14px 24px",
                            borderRadius: "12px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "15px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: "0 4px 15px rgba(16,185,129,0.4)",
                            transition: "all 0.3s ease"
                        }}
                        onClick={() => setShowAddModal(true)}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 20px rgba(16,185,129,0.5)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(16,185,129,0.4)";
                        }}
                    >
                        <PlusCircle size={20} /> Add Product
                    </button>
                </div>

                <div style={{ position: "relative", marginBottom: "28px" }}>
                    <Search size={20} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "16px 16px 16px 48px",
                            border: "2px solid rgba(255,255,255,0.2)",
                            borderRadius: "16px",
                            fontSize: "15px",
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(10px)",
                            outline: "none",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#667eea";
                            e.target.style.boxShadow = "0 4px 20px rgba(102,126,234,0.3)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "rgba(255,255,255,0.2)";
                            e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                        }}
                    />
                </div>

                <div style={{
                    display: "grid",
                    gap: "20px",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))"
                }}>
                    {products.map((product) => (
                        <div key={product.id} style={{
                            background: "white",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            border: "2px solid transparent"
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
                                e.currentTarget.style.borderColor = "#667eea";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                                e.currentTarget.style.borderColor = "transparent";
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                    <div style={{
                                        fontSize: "40px",
                                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                                        padding: "12px",
                                        borderRadius: "12px"
                                    }}>
                                        {product.image}
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: "700", margin: "0 0 4px 0", fontSize: "18px" }}>{product.name}</h3>
                                        <span style={{
                                            fontSize: "13px",
                                            color: "white",
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            fontWeight: "600"
                                        }}>
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "8px",
                                        borderRadius: "8px",
                                        transition: "all 0.2s ease"
                                    }}
                                    onClick={() => deleteProduct(product.id)}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "#fee2e2";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = "transparent";
                                    }}
                                >
                                    <Trash2 size={18} color="#ef4444" />
                                </button>
                            </div>

                            {editingProduct === product.id ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>
                                            Price (₹/{product.unit})
                                        </label>
                                        <input
                                            type="number"
                                            value={product.price}
                                            onChange={(e) => updateProductPrice(product.id, e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                borderRadius: "10px",
                                                border: "2px solid #e2e8f0",
                                                fontSize: "15px",
                                                outline: "none"
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>
                                            Stock ({product.unit})
                                        </label>
                                        <input
                                            type="number"
                                            value={product.stock}
                                            onChange={(e) => updateProductStock(product.id, e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                borderRadius: "10px",
                                                border: "2px solid #e2e8f0",
                                                fontSize: "15px",
                                                outline: "none"
                                            }}
                                        />
                                    </div>
                                    <button
                                        style={{
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            color: "white",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px"
                                        }}
                                        onClick={() => setEditingProduct(null)}
                                    >
                                        <Save size={16} /> Save Changes
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{
                                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                                        borderRadius: "10px",
                                        padding: "14px",
                                        marginBottom: "12px"
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "14px", color: "#64748b" }}>Price:</span>
                                            <span style={{ fontWeight: "700", fontSize: "16px", color: "#10b981" }}>
                                                ₹{product.price}/{product.unit}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: "14px", color: "#64748b" }}>Stock:</span>
                                            <span style={{
                                                fontWeight: "700",
                                                fontSize: "16px",
                                                color: product.stock < 20 ? "#ef4444" : "#10b981"
                                            }}>
                                                {product.stock} {product.unit}
                                                {product.stock < 20 && " ⚠️"}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        style={{
                                            background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                                            color: "#475569",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            transition: "all 0.3s ease"
                                        }}
                                        onClick={() => setEditingProduct(product.id)}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                                            e.target.style.color = "white";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)";
                                            e.target.style.color = "#475569";
                                        }}
                                    >
                                        <Edit2 size={16} /> Edit Product
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
);

const BillingView = React.memo(
    ({
        products,
        searchValue,
        setSearchValue,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        addToCart,
    }) => (
        <div style={{ padding: "32px" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0", color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                    Create New Bill
                </h1>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", margin: "0 0 28px 0" }}>
                    Add products to cart and generate bill
                </p>

                <div style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700" }}>Customer Information</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <input
                            type="text"
                            placeholder="Customer Name (Optional)"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            style={{
                                padding: "14px 16px",
                                borderRadius: "12px",
                                border: "2px solid #e2e8f0",
                                fontSize: "15px",
                                outline: "none",
                                transition: "all 0.3s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#667eea";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e2e8f0";
                            }}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number (Optional)"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            style={{
                                padding: "14px 16px",
                                borderRadius: "12px",
                                border: "2px solid #e2e8f0",
                                fontSize: "15px",
                                outline: "none",
                                transition: "all 0.3s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#667eea";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e2e8f0";
                            }}
                        />
                    </div>
                </div>

                <div style={{ position: "relative", marginBottom: "28px" }}>
                    <Search size={20} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                        type="text"
                        placeholder="Search products to add to cart..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "16px 16px 16px 48px",
                            border: "2px solid rgba(255,255,255,0.2)",
                            borderRadius: "16px",
                            fontSize: "15px",
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(10px)",
                            outline: "none",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#667eea";
                            e.target.style.boxShadow = "0 4px 20px rgba(102,126,234,0.3)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "rgba(255,255,255,0.2)";
                            e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                        }}
                    />
                </div>

                <div style={{
                    display: "grid",
                    gap: "16px",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))"
                }}>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => addToCart(product)}
                            style={{
                                background: "white",
                                borderRadius: "16px",
                                padding: "18px",
                                cursor: "pointer",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                                transition: "all 0.3s ease",
                                border: "2px solid transparent"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(102,126,234,0.3)";
                                e.currentTarget.style.borderColor = "#667eea";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0) scale(1)";
                                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                                e.currentTarget.style.borderColor = "transparent";
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{
                                    fontSize: "36px",
                                    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                                    padding: "10px",
                                    borderRadius: "12px"
                                }}>
                                    {product.image}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: "700", margin: "0 0 4px 0", fontSize: "16px" }}>{product.name}</h3>
                                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#10b981" }}>
                                        ₹{product.price}/{product.unit}
                                    </p>
                                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                                        Stock: {product.stock} {product.unit}
                                    </p>
                                </div>
                                <Plus size={24} color="#667eea" style={{ flexShrink: 0 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
);

export default GroceryBillingApp;