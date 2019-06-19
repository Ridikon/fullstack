const moment =require('moment');
const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports.overview = async function (req, res) {
    try {
        const allOrders = await Order.find({}).sort({date: 1});
        const ordersMap = getOrdersMap(allOrders);
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];

        // Orders quantity orders
        const yesterdayOrdersNumber = yesterdayOrders.length;
        // Orders quantity
        const totalOrdersNumbers = allOrders.length;
        // Quantity days
        const daysNumber = Object.keys(ordersMap).length;
        // Orders per day
        const ordersPerDay = (totalOrdersNumbers / daysNumber).toFixed(0);
        // Orders quantity percent
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
        // Total profit
        const totalGain = calculatePrice(allOrders);
        // Day profit
        const gainPerDay = totalGain / daysNumber;
        // Yesterday profit
        const yesterdayGain = calculatePrice(yesterdayOrders);
        // Percent profit
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);
        // Profit compare
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2);
        // Orders quantity compare
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        });
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.analytics = async function (req, res) {
    try {
        const allOrders = await Order.find({}).sort({date: 1});
        const ordersMap = getOrdersMap(allOrders);

        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

        const chart = Object.keys(ordersMap).map(label => {
            // label == 05.05.2019
            const gain = calculatePrice(ordersMap[label]);
            const order = ordersMap[label].length;

            return {
                label,
                gain,
                order
            }
        });

        res.status(200).json({
            average,
            chart
        });

    } catch (e) {
        errorHandler(res, e);
    }
};

function getOrdersMap(orders = []) {
    const daysOrders = {};

    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY');

        if (date === moment().format('DD.MM.YYYY')) {
            return;
        }

        if (!daysOrders[date]) {
            daysOrders[date] = [];
        }

        daysOrders[date].push(order);
    });

    return daysOrders;
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderCost = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0);
        return total += orderCost;
    }, 0)
}
