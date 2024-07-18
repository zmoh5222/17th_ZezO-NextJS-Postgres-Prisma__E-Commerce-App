import prisma from "@/db/prismaClient";
import { currencyFormat, dateFormat, numberFormat, timeFormat } from "@/lib/formaters";
import AdminDashboardCard from "./_components/AdminDashboardCard";
import OrdersByDayChart from "./_components/charts/OrdersByDayChart";
import ChartCard from "./_components/charts/ChartCard";
import { Prisma } from "@prisma/client";
import { eachDayOfInterval, interval, startOfDay } from "date-fns";
import UsersByDayChart from "./_components/charts/UsersByDayChart";
import RevenueByProductChart from "./_components/charts/RevenueByProductChart";
import OrdersByProductChart from "./_components/charts/OrdersByProductChart";
import { CHART_RANGES, getChartRangeData, getChartRangeDate } from "@/lib/chartRanges";

type AdminDashboardPageProps = {
  searchParams: {
    ordersChartQueryKey: string
    usersChartQueryKey: string
    productsRevenueChartQueryKey: string
    mostOrderedProductsQueryKey: string
    ordersChartCustomRangFromQueryKey: string
    ordersChartCustomRangToQueryKey: string
    usersChartCustomRangFromQueryKey: string
    usersChartCustomRangToQueryKey: string
    productsRevenueChartCustomRangeFromQueryKey: string
    productsRevenueChartCustomRangeToQueryKey: string
    mostOrderedProductsCustomRangeFromQueryKey: string
    mostOrderedProductsCustomRangeToQueryKey: string
  }
}

export default async function AdminDashboardPage({searchParams: {ordersChartQueryKey, usersChartQueryKey, productsRevenueChartQueryKey, mostOrderedProductsQueryKey, ordersChartCustomRangFromQueryKey, ordersChartCustomRangToQueryKey, usersChartCustomRangFromQueryKey, usersChartCustomRangToQueryKey, productsRevenueChartCustomRangeFromQueryKey, productsRevenueChartCustomRangeToQueryKey, mostOrderedProductsCustomRangeFromQueryKey, mostOrderedProductsCustomRangeToQueryKey}}: AdminDashboardPageProps) {
  async function getSalesData(ordersCreatedAfter?: Date| null, ordersCreatedBefore?: Date | null) {
    const ORDERS_CHART_DATA_WHERE_CREATED_AT: Prisma.OrderWhereInput['createdAt'] = {}
    if (ordersCreatedAfter) ORDERS_CHART_DATA_WHERE_CREATED_AT.gte = ordersCreatedAfter
    if (ordersCreatedBefore) ORDERS_CHART_DATA_WHERE_CREATED_AT.lte = ordersCreatedBefore

    const [data, ordersChartData] = await Promise.all([
      prisma.order.aggregate({
        _sum: {
          paidPrice: true,
        },
        _count: true,
      }),
      prisma.order.findMany({
        where: {
          createdAt: ORDERS_CHART_DATA_WHERE_CREATED_AT
        },
        select: {
          createdAt: true,
          paidPrice: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    ])

    const {dateArray, format} = getChartRangeDate(
      ordersCreatedAfter || startOfDay(ordersChartData[0].createdAt),
      ordersCreatedBefore || new Date())
      
      const dayArray = dateArray.map(day => {
      return {
        day: format(day),
        sumOfOrders: 0,
        totalOrders: 0
      }
    })

    const reducedOrdersChartData = ordersChartData.reduce((data, order) => {
      const formattedDay = format(order.createdAt)
      const entry = dayArray.find(item => item.day === formattedDay)
      if(!entry) return data
      entry.sumOfOrders += order.paidPrice / 100
      entry.totalOrders += 1
      return data
    }, dayArray)

    return {
      totalOrdersAmount: (data._sum.paidPrice || 0) / 100,
      totalOrdersNumber: data._count,
      ordersChartData: reducedOrdersChartData
    };
  }

  async function getCustomersData(usersCreatedAfter?: Date| null, usersCreatedBefore?: Date | null) {
    const USERS_CHART_DATA_WHERE_CREATED_AT: Prisma.UserWhereInput['createdAt'] = {}
    if (usersCreatedAfter) USERS_CHART_DATA_WHERE_CREATED_AT.gte = usersCreatedAfter
    if (usersCreatedBefore) USERS_CHART_DATA_WHERE_CREATED_AT.lte = usersCreatedBefore
    const [userCount, ordersPriceSum, usersChartData] = await Promise.all([
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: {
          paidPrice: true,
        },
      }),
      prisma.user.findMany({
        where: {
          createdAt: USERS_CHART_DATA_WHERE_CREATED_AT
        },
        select: {
          createdAt: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    ]);

    const {dateArray, format} = getChartRangeDate(
      usersCreatedAfter || startOfDay(usersChartData[0].createdAt),
      usersCreatedBefore || new Date()
    )

    const dayArray = dateArray.map(day => {
      return {
        day: format(day),
        totalUsers: 0
      }
    })

    const reducedUsersChartData = usersChartData.reduce((data, user) => {
      const formattedDay = format(user.createdAt)
      const entry = dayArray.find(item => item.day === formattedDay)
      if(!entry) return data
      entry.totalUsers += 1
      return data
    }, dayArray)

    return {
      userCount,
      AveragePricePerUser:
        userCount === 0 ? 0 : (ordersPriceSum._sum.paidPrice || 0) / userCount / 100,
      usersChartData: reducedUsersChartData
    };
  }

  async function getProductsData(revenueCreatedAfter?: Date| null, revenueCreatedBefore?: Date | null) {
    const PRODUCT_ORDERS_CHART_DATA_WHERE_CREATED_AT: Prisma.OrderWhereInput['createdAt'] = {}
    if (revenueCreatedAfter) PRODUCT_ORDERS_CHART_DATA_WHERE_CREATED_AT.gte = revenueCreatedAfter
    if (revenueCreatedBefore) PRODUCT_ORDERS_CHART_DATA_WHERE_CREATED_AT.lte = revenueCreatedBefore

    const [activeProductsCount, inActiveProductsCount, productsRevenueChartData] = await Promise.all([
      prisma.product.count({ where: { isAvailableForPurchase: true } }),
      prisma.product.count({ where: { isAvailableForPurchase: false } }),
      prisma.product.findMany({
        select: {
          name: true,
          orders: {
            select: {
              id: true,
              paidPrice: true
            },
            where: {
              createdAt: PRODUCT_ORDERS_CHART_DATA_WHERE_CREATED_AT
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    ]);

    const reducedProductsRevenueChartData = productsRevenueChartData.map(product => {
      return {
        productName: product.name,
        revenue: product.orders.reduce((sum, order) => {
          sum += order.paidPrice / 100
          return sum
        }, 0)
      }
    }).filter(item => item.revenue > 0)

    const reducedMostOrderedProductsData = productsRevenueChartData.map(product => {
      return { 
        productName: product.name,
        totalOrders: product.orders.length
      }
    }).filter(item => item.totalOrders > 0)

    return {
      activeProductsCount,
      inActiveProductsCount,
      productsRevenueChartData: reducedProductsRevenueChartData,
      mostOrderedProductsData: reducedMostOrderedProductsData
    };
  }

  const salesDataChartRange = getChartRangeData({
    staticRange: ordersChartQueryKey, 
    CalendarRangeFrom: ordersChartCustomRangFromQueryKey, 
    CalendarRangeTo: ordersChartCustomRangToQueryKey
  }) || CHART_RANGES.last_7_days
  const customersDataChartRange = getChartRangeData({
    staticRange: usersChartQueryKey,
    CalendarRangeFrom: usersChartCustomRangFromQueryKey,
    CalendarRangeTo: usersChartCustomRangToQueryKey
  }) || CHART_RANGES.last_7_days
  const productsDataChartRange = getChartRangeData({
    staticRange: productsRevenueChartQueryKey,
    CalendarRangeFrom: productsRevenueChartCustomRangeFromQueryKey,
    CalendarRangeTo: productsRevenueChartCustomRangeToQueryKey
  }) || CHART_RANGES.last_7_days

  const [salesData, customersData, productsData,
  ] = await Promise.all([
    getSalesData(salesDataChartRange.startDate, salesDataChartRange.endDate),
    getCustomersData(customersDataChartRange.startDate, customersDataChartRange.endDate),
    getProductsData(productsDataChartRange.startDate, productsDataChartRange.endDate),
  ]);

  return (
    <>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <AdminDashboardCard
        title="Sales"
        description={`${numberFormat(salesData.totalOrdersNumber)} Orders`}
        content={currencyFormat(salesData.totalOrdersAmount)}
      />
      <AdminDashboardCard
        title="Customers"
        description={`${currencyFormat(
          customersData.AveragePricePerUser
        )} Average Value`}
        content={numberFormat(customersData.userCount)}
      />
      <AdminDashboardCard
        title="Active Products"
        description={`${numberFormat(
          productsData.inActiveProductsCount
        )} Inactive Products`}
        content={numberFormat(productsData.activeProductsCount)}
      />
    </section>
    <section className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
      <ChartCard 
        title="Total Sales and Orders" 
        selectedChartRangeQueryKey="ordersChartQueryKey" 
        selectedChartRangeDropdownMenuItem={salesDataChartRange.label}
        selectedCustomChartRangeFromQueryKey="ordersChartCustomRangFromQueryKey"
        selectedCustomChartRangeToQueryKey="ordersChartCustomRangToQueryKey"
        >
        <OrdersByDayChart data={salesData.ordersChartData} />
      </ChartCard>
      <ChartCard 
        title="Total Customers" 
        selectedChartRangeQueryKey="usersChartQueryKey" 
        selectedChartRangeDropdownMenuItem={customersDataChartRange.label}
        selectedCustomChartRangeFromQueryKey="usersChartCustomRangFromQueryKey"
        selectedCustomChartRangeToQueryKey="usersChartCustomRangToQueryKey"
        >
        <UsersByDayChart data={customersData.usersChartData} />
      </ChartCard>
      <ChartCard 
        title="Most Purchased and Ordered Products" 
        className="lg:col-span-2" 
        selectedChartRangeQueryKey="productsRevenueChartQueryKey" 
        selectedChartRangeDropdownMenuItem={productsDataChartRange.label}
        selectedCustomChartRangeFromQueryKey="productsRevenueChartCustomRangeFromQueryKey"
        selectedCustomChartRangeToQueryKey="productsRevenueChartCustomRangeToQueryKey"
        >
        <RevenueByProductChart mostPurchasedData={productsData.productsRevenueChartData} mostOrderedData={productsData.mostOrderedProductsData} />
      </ChartCard>
    </section>
    </>
  );
}
