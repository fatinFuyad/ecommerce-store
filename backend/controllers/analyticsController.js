import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

function getDatesInRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const isoDate = currentDate.toISOString().split("T")[0];
    dates.push(isoDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

async function getAnalyticsData() {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: null, // it would group all docs alltogether
        totalSales: {
          $sum: 1 // considering each completed or paid order as a sale
        },
        totalRevenues: {
          $sum: "$totalAmount"
        }
      }
    }
  ]);

  // when there is no order then orderStats will be an empty arr[];
  const { totalSales, totalRevenues } = orderStats[0] || {
    totalSales: 0,
    totalRevenues: 0
  };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue: totalRevenues
  };
}

async function getDailySalesData(startDate, endDate) {
  const dailySalesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        sales: { $sum: 1 },
        revenue: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } } // is soring relevant as orders are created sequencially 💭
  ]);

  const dateArray = getDatesInRange(startDate, endDate);

  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date);
    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0
    };
  });
}

export const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.status(200).json({
      status: "success",
      analyticsData,
      dailySalesData
    });
  } catch (error) {
    res.status(500).json({
      status: "server error",
      message: error.message
    });
  }
};
