import React, { useEffect, useState } from 'react';

const SalesList = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem("token");

        // جلب الطلبات العادية
        const normalOrdersResponse = await fetch("https://bakeryproject-1onw.onrender.com/api/orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const customOrdersResponse = await fetch("https://bakeryproject-1onw.onrender.com/api/custom-orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!normalOrdersResponse.ok || !customOrdersResponse.ok)
          throw new Error("Failed to fetch orders");

        const normalOrders = await normalOrdersResponse.json();
        const customOrders = await customOrdersResponse.json();

        // تصفية الطلبات العادية التي حالتها Delivered
        const deliveredNormal = normalOrders
          .filter(order => order.status === "Delivered")
          .flatMap(order =>
            order.products.map(product => ({
              orderId: order._id,
              customer: order.user?.name || "N/A",
              product: product.name,
              quantity: product.quantity,
              price: product.price * product.quantity,
              date: new Date(order.createdAt).toLocaleDateString(),
            }))
          );

        // تصفية الطلبات المخصصة التي حالتها Delivered مع إضافة السعر الصحيح
        const deliveredCustom = customOrders
          .filter(order => order.status === "Delivered")
          .map(order => ({
            orderId: order._id,
            customer: order.user?.name || "N/A",
            product: "🎂 Custom Order",
            quantity: 1,
            price: order.price || 0, // هنا يتم استخدام السعر الصحيح من البيانات المرسلة
            date: new Date(order.createdAt).toLocaleDateString(),
          }));

        // دمج النوعين
        const allDelivered = [...deliveredNormal, ...deliveredCustom];

        setSalesData(allDelivered);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-pink-700">Delivered Sales</h2>

      <div className="overflow-x-auto rounded shadow-md border border-gray-200">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-pink-100 text-pink-800">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Customer Name</th>
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Quantity</th>
              <th className="py-3 px-6 text-left">Total Price</th>
              <th className="py-3 px-6 text-left">Purchase Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {salesData.length > 0 ? (
              salesData.map((sale, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">{sale.orderId}</td>
                  <td className="py-3 px-6">{sale.customer}</td>
                  <td className="py-3 px-6">{sale.product}</td>
                  <td className="py-3 px-6">{sale.quantity}</td>
                  <td className="py-3 px-6">{sale.price} EGP</td>
                  <td className="py-3 px-6">{sale.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">No delivered orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesList;

// ------------------ كود كامل--------------
// import React, { useEffect, useState } from 'react';

// const SalesList = () => {
//   const [salesData, setSalesData] = useState([]);

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         // جلب الطلبات العادية
//         const normalOrdersResponse = await fetch("https://bakeryproject-1onw.onrender.com/api/orders", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const customOrdersResponse = await fetch("https://bakeryproject-1onw.onrender.com/api/custom-orders", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!normalOrdersResponse.ok || !customOrdersResponse.ok)
//           throw new Error("Failed to fetch orders");

//         const normalOrders = await normalOrdersResponse.json();
//         const customOrders = await customOrdersResponse.json();

//         // تصفية الطلبات العادية التي حالتها Delivered
//         const deliveredNormal = normalOrders
//           .filter(order => order.status === "Delivered")
//           .flatMap(order =>
//             order.products.map(product => ({
//               orderId: order._id,
//               customer: order.user?.name || "N/A",
//               product: product.name,
//               quantity: product.quantity,
//               price: product.price * product.quantity,
//               date: new Date(order.createdAt).toLocaleDateString(),
//             }))
//           );

//         // تصفية الطلبات المخصصة التي حالتها Delivered
//         const deliveredCustom = customOrders
//           .filter(order => order.status === "Delivered")
//           .map(order => ({
//             orderId: order._id,
//             customer: order.user?.name || "N/A",
//             product: "🎂 Custom Order",
//             quantity: 1,
//             price: 0, // ضع السعر المناسب إذا كان موجودًا
//             date: new Date(order.createdAt).toLocaleDateString(),
//           }));

//         // دمج النوعين
//         const allDelivered = [...deliveredNormal, ...deliveredCustom];

//         setSalesData(allDelivered);
//       } catch (error) {
//         console.error("Error fetching sales:", error);
//       }
//     };

//     fetchSalesData();
//   }, []);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">✅ Delivered Sales</h2>

//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="min-w-full bg-white rounded shadow">
//           <thead>
//             <tr className="bg-pink-100 text-pink-800">
//               <th className="py-3 px-6 text-left">Order ID</th>
//               <th className="py-3 px-6 text-left">Customer Name</th>
//               <th className="py-3 px-6 text-left">Product</th>
//               <th className="py-3 px-6 text-left">Quantity</th>
//               <th className="py-3 px-6 text-left">Total Price</th>
//               <th className="py-3 px-6 text-left">Purchase Date</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             {salesData.length > 0 ? (
//               salesData.map((sale, index) => (
//                 <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
//                   <td className="py-3 px-6">{sale.orderId}</td>
//                   <td className="py-3 px-6">{sale.customer}</td>
//                   <td className="py-3 px-6">{sale.product}</td>
//                   <td className="py-3 px-6">{sale.quantity}</td>
//                   <td className="py-3 px-6">{sale.price} EGP</td>
//                   <td className="py-3 px-6">{sale.date}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-500">No delivered orders found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SalesList;


