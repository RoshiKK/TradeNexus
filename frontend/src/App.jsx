import { Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Tracking from "./pages/Tracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const auth = useAuth();
  const cart = useCart();

  const addToCartWithAuth = (product) => {
    if (!auth.token) {
      alert("🔐 Authorization Required\nPlease sign in to your account to add products to your cart.");
      return;
    }
    cart.add(product);
  };

  return (
    <Layout auth={auth} cartItemsCount={cart.items.length}>
      <Routes>
        <Route path="/" element={<Home addToCart={addToCartWithAuth} />} />
        <Route 
          path="/products/:id" 
          element={<ProductDetails addToCart={addToCartWithAuth} token={auth.token} />} 
        />
        <Route 
          path="/cart" 
          element={<Cart items={cart.items} remove={cart.remove} token={auth.token} />} 
        />
        <Route 
          path="/checkout" 
          element={<Checkout items={cart.items} clear={cart.clear} />} 
        />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/login" element={<Login setAuth={auth.setAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
}
