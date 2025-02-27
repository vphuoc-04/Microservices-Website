import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const Home: React.FC = () => {
    const products: Product[] = [
      { id: 1, name: "Sản phẩm 1", price: "₫100,000", image: "https://i.pinimg.com/736x/d5/d4/bb/d5d4bb7e8a83e3cc20f3383e4ca3e5c7.jpg" },
      { id: 2, name: "Sản phẩm 2", price: "₫200,000", image: "https://i.pinimg.com/736x/3d/0c/a8/3d0ca8bad65d9c74d19b6a2aa794ae9d.jpg" },
      { id: 3, name: "Sản phẩm 3", price: "₫150,000", image: "https://i.pinimg.com/736x/a9/6e/45/a96e45fe30bd90bb75f724082e7a5654.jpg" },
      { id: 4, name: "Sản phẩm 4", price: "₫150,000", image: "https://i.pinimg.com/736x/66/4d/7a/664d7a1f9891c8246578ddad6ec7cf49.jpg" },
      { id: 5, name: "Sản phẩm 5", price: "₫150,000", image: "https://i.pinimg.com/736x/9e/8f/74/9e8f7475ac214d7f1e1863c99eeeb307.jpg" },
      { id: 6, name: "Sản phẩm 6", price: "₫150,000", image: "https://i.pinimg.com/736x/69/04/76/6904765c3c75723eb584da79516327c3.jpg" },
      { id: 7, name: "Sản phẩm 7", price: "₫150,000", image: "https://i.pinimg.com/736x/b1/fa/20/b1fa200bc4c18e098d72d7187f1eb857.jpg" },
      { id: 8, name: "Sản phẩm 8", price: "₫150,000", image: "https://i.pinimg.com/736x/1b/40/53/1b40530cc6c6de474bab5b0dabeed17e.jpg" },
      { id: 9, name: "Sản phẩm 9", price: "₫150,000", image: "https://i.pinimg.com/736x/09/a5/fb/09a5fb7ecdc8bb8cb57c130a061e193d.jpg" },
    ];

    const [cart, setCart] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
      setCart([...cart, product]);
      console.log(product)
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Sản phẩm nổi bật</h1>
            <div className="flex flex-wrap gap-4">
              {products.map((product) => (
                  <div key={product.id} className="border border-gray-300 rounded-lg p-4 w-[calc(33.333%-1rem)] box-border text-center">
                      <img src={product.image} alt={product.name} className="w-full rounded-lg" />
                      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                      <p className="text-blue-500 font-bold">{product.price}</p>
                      <Button
                          onClick={() => addToCart(product)}
                          className="mt-2 px-4 py-2 bg-blue-500 text-black rounded-lg"
                      >
                          Thêm vào giỏ hàng
                      </Button>
                  </div>
              ))}
            </div>
        </div>
    );
};

export default Home;
