import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { dummyOrders } from '../assets/assets';

const MyOrders = () => {
  const [myOrders, setMyOrders] = React.useState([]);
  const { currency ,axios,user} = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const {data}=await axios.get('/api/order/user')
      if(data.success){
        setMyOrders(data.orders)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(user) fetchMyOrders();
  }, [user]);

  return (
    <div className="mt-16 pb-16 max-w-5xl mx-auto px-4">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="h-0.5 w-16 bg-primary mt-2 rounded-full"></div>
      </div>

      {myOrders.map((order, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-xl mb-10 p-5 bg-white shadow-sm"
        >
          {/* Order summary (slightly toned down) */}
          <div className="flex justify-between md:items-center text-sm text-gray-400 font-medium max-md:flex-col gap-2 mb-5">
            <span>Order ID: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>
              Total Amount: {currency}
              {order.amount}
            </span>
          </div>

          <div className="space-y-5">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-t pt-5"
              >
                {/* Product info (visually stronger) */}
                <div className="flex items-center gap-5">
                  <img
                    src={item.product.image[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-contain border rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.product.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Category: {item.product.category}
                    </p>
                  </div>
                </div>

                {/* Order details */}
                <div className="text-sm text-gray-600">
                  <p>Quantity: {item.quantity || '1'}</p>
                  <p>Status: {order.status}</p>
                  <p>
                    Date:{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Amount */}
                <div className="font-semibold text-gray-800">
                  Amount: {currency}
                  {item.product.offerPrice * (item.quantity || 1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
